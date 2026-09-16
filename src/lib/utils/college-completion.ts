export function calculateProfileCompletion(college: any): number {
  if (!college) return 0;
  
  let totalScore = 0;
  const maxScore = 100;
  
  // Basic info (30%)
  if (college.name) totalScore += 5;
  if (college.short_description) totalScore += 5;
  if (college.description) totalScore += 10;
  if (college.established_year) totalScore += 5;
  if (college.ownership_type) totalScore += 5;
  
  // Contact (20%)
  if (college.email) totalScore += 5;
  if (college.phone) totalScore += 5;
  if (college.website) totalScore += 5;
  if (college.address && college.pincode) totalScore += 5;
  
  // Approvals (10%)
  if (college.accreditation || college.naac_grade || college.approved_by) totalScore += 10;
  
  // Facilities & Extras (10%)
  if (college.campus_area || college.total_students) totalScore += 5;
  if (college.facilities && college.facilities.length > 0) totalScore += 5;
  
  // Relationships (30%)
  if (college.admissions && college.admissions.length > 0) totalScore += 10;
  if (college.courses && college.courses.length > 0) totalScore += 10;
  if (college.scholarships && college.scholarships.length > 0) totalScore += 5;
  if (college.hostel_details && college.hostel_details.length > 0) totalScore += 5;

  return Math.min(totalScore, maxScore);
}
