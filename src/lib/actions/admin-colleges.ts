'use server';

import { createServerSupabaseClient, createServerSupabaseAdmin } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// =============================================
// HELPERS
// =============================================

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function requireSuperAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'super_admin') throw new Error('Forbidden: super_admin only');
  return user;
}

// =============================================
// CSV TEMPLATE COLUMNS
// =============================================

const CSV_TEMPLATE_COLUMNS = [
  'name',
  'short_description',
  'description',
  'established_year',
  'ownership_type',
  'college_type',
  'accreditation',
  'affiliation',
  'university',
  'approved_by',
  'naac_grade',
  'nba_accredited',
  'nirf_ranking',
  'campus_area',
  'website',
  'email',
  'phone',
  'address',
  'city_name',
  'state_name',
  'pincode',
  'latitude',
  'longitude',
  'logo_image',
  'cover_image',
  'facilities',
  'courses',
  'total_students',
  'total_faculty',
  'boys_hostel',
  'girls_hostel',
  'is_featured',
  'status',
] as const;

export type CsvCollegeRow = Record<(typeof CSV_TEMPLATE_COLUMNS)[number], string>;

// =============================================
// GENERATE CSV TEMPLATE
// =============================================

export async function generateCsvTemplate(): Promise<string> {
  const header = CSV_TEMPLATE_COLUMNS.join(',');
  const exampleRow = [
    'IIT Delhi',
    'Top engineering institute in India',
    'Indian Institute of Technology Delhi is a public technical university...',
    '1961',
    'government',
    'Engineering',
    'NAAC A++',
    'Autonomous',
    'IIT Delhi',
    'UGC',
    'A++',
    'true',
    '45',
    '325 acres',
    'https://www.iitd.ac.in',
    'info@iitd.ac.in',
    '011-26591999',
    'Hauz Khas, New Delhi',
    'New Delhi',
    'Delhi',
    '110016',
    '28.5456',
    '77.1926',
    'iit-delhi-logo.webp',
    'iit-delhi-cover.webp',
    'WiFi|Library|Sports|Cafeteria|Labs',
    'B.Tech|MBA|PGDM|MCA',
    '10000',
    '800',
    'true',
    'true',
    'false',
    'draft',
  ].map(val => val.includes(',') ? `"${val}"` : val).join(',');

  return `${header}\n${exampleRow}`;
}

// =============================================
// BULK UPLOAD COLLEGES
// =============================================

interface BulkUploadResult {
  success: boolean;
  inserted: number;
  errors: { row: number; message: string }[];
}

export async function bulkUploadColleges(rows: CsvCollegeRow[]): Promise<BulkUploadResult> {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  // Pre-fetch cities & states for name-based lookup
  const { data: allStates } = await supabaseAdmin.from('states').select('id, name');
  const { data: allCities } = await supabaseAdmin.from('cities').select('id, name, state_id');

  const stateMap = new Map((allStates || []).map(s => [s.name.toLowerCase(), s.id]));
  const cityMap = new Map(
    (allCities || []).map(c => [`${c.name.toLowerCase()}__${c.state_id}`, c.id])
  );

  const results: BulkUploadResult = { success: true, inserted: 0, errors: [] };

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const rowNum = i + 2; // +2 because 1-indexed + header row

    try {
      // Validate required
      if (!row.name || !row.name.trim()) {
        results.errors.push({ row: rowNum, message: 'College name is required' });
        continue;
      }

      // Resolve state
      let stateId: string | null = null;
      if (row.state_name?.trim()) {
        const stateName = row.state_name.trim();
        stateId = stateMap.get(stateName.toLowerCase()) || null;
        if (!stateId) {
          // Auto-create state
          const { data: newState, error: stateError } = await supabaseAdmin
            .from('states')
            .insert({ name: stateName, slug: generateSlug(stateName) })
            .select('id')
            .single();
            
          if (stateError) {
            results.errors.push({ row: rowNum, message: `Failed to create State "${stateName}": ${stateError.message}` });
            continue;
          }
          stateId = newState.id;
          stateMap.set(stateName.toLowerCase(), stateId);
        }
      }

      // Resolve city
      let cityId: string | null = null;
      if (row.city_name?.trim() && stateId) {
        const cityName = row.city_name.trim();
        cityId = cityMap.get(`${cityName.toLowerCase()}__${stateId}`) || null;
        if (!cityId) {
          // Auto-create city
          const { data: newCity, error: cityError } = await supabaseAdmin
            .from('cities')
            .insert({ name: cityName, slug: generateSlug(cityName), state_id: stateId })
            .select('id')
            .single();

          if (cityError) {
            results.errors.push({ row: rowNum, message: `Failed to create City "${cityName}": ${cityError.message}` });
            continue;
          }
          cityId = newCity.id;
          cityMap.set(`${cityName.toLowerCase()}__${stateId}`, cityId);
        }
      }

      // Generate unique slug
      const baseSlug = generateSlug(row.name.trim());
      const { data: slugCheck } = await supabaseAdmin
        .from('colleges')
        .select('id')
        .eq('slug', baseSlug)
        .maybeSingle();
      const finalSlug = slugCheck ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

      // Parse boolean fields
      const parseBool = (val: string | undefined, defaultVal = false): boolean => {
        if (!val || !val.trim()) return defaultVal;
        return ['true', '1', 'yes', 'y'].includes(val.trim().toLowerCase());
      };

      // Parse number fields
      const parseNum = (val: string | undefined): number | null => {
        if (!val || !val.trim()) return null;
        const n = Number(val.trim());
        return isNaN(n) ? null : n;
      };

      // Parse pipe-separated arrays
      const parseArray = (val: string | undefined): string[] => {
        if (!val || !val.trim()) return [];
        return val.split('|').map(s => s.trim()).filter(Boolean);
      };

      // Image paths (just the filename, system resolves from images dir)
      const logoUrl = row.logo_image?.trim() || null;
      const coverUrl = row.cover_image?.trim() || null;

      // Validate ownership_type
      const validOwnership = ['government', 'private', 'deemed', 'autonomous'];
      const ownershipType = row.ownership_type?.trim().toLowerCase() || null;
      if (ownershipType && !validOwnership.includes(ownershipType)) {
        results.errors.push({ row: rowNum, message: `Invalid ownership_type: "${row.ownership_type}". Must be one of: ${validOwnership.join(', ')}` });
        continue;
      }

      // Validate status
      const validStatuses = ['draft', 'pending_review', 'approved', 'rejected', 'published'];
      const status = row.status?.trim().toLowerCase() || 'draft';
      if (!validStatuses.includes(status)) {
        results.errors.push({ row: rowNum, message: `Invalid status: "${row.status}". Must be one of: ${validStatuses.join(', ')}` });
        continue;
      }

      const collegeData = {
        name: row.name.trim(),
        slug: finalSlug,
        short_description: row.short_description?.trim() || null,
        description: row.description?.trim() || null,
        established_year: parseNum(row.established_year),
        ownership_type: ownershipType as 'government' | 'private' | 'deemed' | 'autonomous' | null,
        college_type: row.college_type?.trim() || null,
        accreditation: row.accreditation?.trim() || null,
        affiliation: row.affiliation?.trim() || null,
        university: row.university?.trim() || null,
        approved_by: row.approved_by?.trim() || null,
        naac_grade: row.naac_grade?.trim() || null,
        nba_accredited: parseBool(row.nba_accredited),
        nirf_ranking: parseNum(row.nirf_ranking),
        campus_area: row.campus_area?.trim() || null,
        website: row.website?.trim() || null,
        email: row.email?.trim() || null,
        phone: row.phone?.trim() || null,
        address: row.address?.trim() || null,
        city_id: cityId,
        state_id: stateId,
        pincode: row.pincode?.trim() || null,
        latitude: parseNum(row.latitude),
        longitude: parseNum(row.longitude),
        logo_url: logoUrl,
        cover_image_url: coverUrl,
        facilities: parseArray(row.facilities),
        parent_courses: parseArray(row.courses || (row as any).parent_courses),
        total_students: parseNum(row.total_students),
        total_faculty: parseNum(row.total_faculty),
        boys_hostel: parseBool(row.boys_hostel),
        girls_hostel: parseBool(row.girls_hostel),
        is_featured: parseBool(row.is_featured),
        is_verified: false,
        is_active: true,
        status: status as 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published',
        average_rating: 0,
        review_count: 0,
      };

      const { error: insertError } = await supabaseAdmin
        .from('colleges')
        .insert(collegeData);

      if (insertError) {
        results.errors.push({ row: rowNum, message: insertError.message });
      } else {
        results.inserted++;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      results.errors.push({ row: rowNum, message: msg });
    }
  }

  if (results.errors.length > 0) {
    results.success = results.inserted > 0; // partial success
  }

  revalidatePath('/admin/colleges');
  return results;
}

// =============================================
// ASSIGN COLLEGE TO USER
// =============================================

interface AssignResult {
  success: boolean;
  error?: string;
  assigned?: number;
  alreadyAssigned?: number;
}

export async function assignCollegesToUser(
  userId: string,
  collegeIds: string[],
  role: 'owner' | 'admin' | 'editor' = 'admin'
): Promise<AssignResult> {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  // Verify user exists and is a college_admin
  const { data: targetUser, error: userError } = await supabaseAdmin
    .from('users')
    .select('id, email, full_name, role')
    .eq('id', userId)
    .maybeSingle();

  if (userError || !targetUser) {
    return { success: false, error: 'User not found with the given ID' };
  }

  // If user is a student, upgrade to college_admin
  if (targetUser.role === 'student') {
    await supabaseAdmin
      .from('users')
      .update({ role: 'college_admin' })
      .eq('id', userId);
  }

  // Verify all colleges exist
  const { data: existingColleges } = await supabaseAdmin
    .from('colleges')
    .select('id')
    .in('id', collegeIds);

  const existingCollegeIds = new Set((existingColleges || []).map(c => c.id));
  const invalidIds = collegeIds.filter(id => !existingCollegeIds.has(id));
  if (invalidIds.length > 0) {
    return { success: false, error: `Colleges not found: ${invalidIds.join(', ')}` };
  }

  // Check existing assignments
  const { data: existingAssignments } = await supabaseAdmin
    .from('college_users')
    .select('college_id')
    .eq('user_id', userId)
    .in('college_id', collegeIds);

  const alreadyAssignedIds = new Set((existingAssignments || []).map(a => a.college_id));
  const newAssignments = collegeIds.filter(id => !alreadyAssignedIds.has(id));

  if (newAssignments.length === 0) {
    return { success: true, assigned: 0, alreadyAssigned: alreadyAssignedIds.size };
  }

  // Insert new assignments
  const insertData = newAssignments.map(collegeId => ({
    college_id: collegeId,
    user_id: userId,
    role,
  }));

  const { error: insertError } = await supabaseAdmin
    .from('college_users')
    .insert(insertData);

  if (insertError) {
    return { success: false, error: insertError.message };
  }

  revalidatePath('/admin/colleges');
  revalidatePath('/dashboard/colleges');

  return {
    success: true,
    assigned: newAssignments.length,
    alreadyAssigned: alreadyAssignedIds.size,
  };
}

// =============================================
// UNASSIGN COLLEGE FROM USER
// =============================================

export async function unassignCollegeFromUser(
  userId: string,
  collegeId: string
): Promise<{ success: boolean; error?: string }> {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from('college_users')
    .delete()
    .eq('user_id', userId)
    .eq('college_id', collegeId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/colleges');
  revalidatePath('/dashboard/colleges');
  return { success: true };
}

// =============================================
// SEARCH USERS (for assignment dialog)
// =============================================

export async function searchCollegeUsers(query: string) {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  let dbQuery = supabaseAdmin
    .from('users')
    .select('id, email, full_name, role')
    .in('role', ['college_admin', 'student'])
    .order('full_name')
    .limit(20);

  if (query.trim()) {
    // Search by email or name
    dbQuery = dbQuery.or(`email.ilike.%${query}%,full_name.ilike.%${query}%`);
  }

  const { data } = await dbQuery;
  return data || [];
}

// =============================================
// GET COLLEGE ASSIGNMENTS
// =============================================

export async function getCollegeAssignments(collegeId: string) {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  const { data } = await supabaseAdmin
    .from('college_users')
    .select('id, user_id, role, users(id, email, full_name)')
    .eq('college_id', collegeId);

  return data || [];
}

// =============================================
// TOGGLE COLLEGE STATUS (Enable/Disable)
// =============================================

export async function toggleCollegeStatus(collegeId: string, isActive: boolean) {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from('colleges')
    .update({ is_active: isActive })
    .eq('id', collegeId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/colleges');
  return { success: true };
}

// =============================================
// TOGGLE TOP COLLEGE (Featured)
// =============================================

export async function toggleCollegeFeatured(collegeId: string, isFeatured: boolean) {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from('colleges')
    .update({ is_featured: isFeatured })
    .eq('id', collegeId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/colleges');
  revalidatePath('/'); // update the homepage immediately
  return { success: true };
}

// =============================================
// DELETE COLLEGE
// =============================================

export async function deleteCollege(collegeId: string) {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from('colleges')
    .delete()
    .eq('id', collegeId);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/colleges');
  return { success: true };
}

export async function deleteColleges(collegeIds: string[]) {
  await requireSuperAdmin();
  const supabaseAdmin = createServerSupabaseAdmin();

  const { error } = await supabaseAdmin
    .from('colleges')
    .delete()
    .in('id', collegeIds);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/colleges');
  return { success: true };
}
