export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = 'super_admin' | 'manager' | 'college_admin' | 'student';

export type OwnershipType = 'government' | 'private' | 'deemed' | 'autonomous';

export type DegreeType = 'undergraduate' | 'postgraduate' | 'diploma' | 'doctorate' | 'certificate';

export type LeadSource = 'apply_now' | 'download_brochure' | 'contact_form' | 'admission_enquiry';

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'trial';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded';

export type ContentStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'published';

export type PlanTier = 'free' | 'standard' | 'premium';

export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

interface DatabaseShape {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      colleges: {
        Row: {
          id: string;
          name: string;
          slug: string;
          logo_url: string | null;
          cover_image_url: string | null;
          description: string | null;
          short_description: string | null;
          established_year: number | null;
          ownership_type: OwnershipType | null;
          accreditation: string | null;
          affiliation: string | null;
          university: string | null;
          campus_area: string | null;
          website: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city_id: string | null;
          state_id: string | null;
          pincode: string | null;
          latitude: number | null;
          longitude: number | null;
          social_media: Json | null;
          facilities: string[] | null;
          is_featured: boolean;
          is_verified: boolean;
          is_active: boolean;
          status: ContentStatus;
          manager_id: string | null;
          subscription_id: string | null;
          parent_courses: string[] | null;
          admission_process: string | null;
          total_students: number | null;
          total_faculty: number | null;
          boys_hostel: boolean;
          girls_hostel: boolean;
          approved_by: string | null;
          college_type: string | null;
          naac_grade: string | null;
          nba_accredited: boolean;
          nirf_ranking: number | null;
          average_rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['colleges']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['colleges']['Insert']>;
      };
      college_users: {
        Row: {
          id: string;
          college_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'editor';
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['college_users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['college_users']['Insert']>;
      };
      courses: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          slug: string;
          degree_type: DegreeType;
          duration: string | null;
          duration_years: number | null;
          fees_min: number | null;
          fees_max: number | null;
          eligibility: string | null;
          intake_capacity: number | null;
          entrance_exams: string[] | null;
          curriculum_url: string | null;
          highlights: string[] | null;
          goal_id: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      course_specializations: {
        Row: {
          id: string;
          course_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['course_specializations']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['course_specializations']['Insert']>;
      };
      fees: {
        Row: {
          id: string;
          course_id: string;
          college_id: string;
          tuition_fee: number | null;
          hostel_fee: number | null;
          examination_fee: number | null;
          registration_fee: number | null;
          other_charges: number | null;
          total_fee: number | null;
          fee_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['fees']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['fees']['Insert']>;
      };
      placements: {
        Row: {
          id: string;
          college_id: string;
          year: number;
          placement_percentage: number | null;
          highest_package: number | null;
          average_package: number | null;
          median_package: number | null;
          students_placed: number | null;
          total_students: number | null;
          report_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['placements']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['placements']['Insert']>;
      };
      recruiters: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          logo_url: string | null;
          website: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['recruiters']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['recruiters']['Insert']>;
      };
      faculty: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          designation: string | null;
          department: string | null;
          qualification: string | null;
          experience_years: number | null;
          specialization: string | null;
          image_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['faculty']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['faculty']['Insert']>;
      };
      galleries: {
        Row: {
          id: string;
          college_id: string;
          title: string | null;
          image_url: string;
          category: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['galleries']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['galleries']['Insert']>;
      };
      videos: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          url: string;
          thumbnail_url: string | null;
          category: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['videos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['videos']['Insert']>;
      };
      brochures: {
        Row: {
          id: string;
          college_id: string;
          title: string;
          file_url: string;
          file_size: number | null;
          downloads: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['brochures']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['brochures']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          college_id: string;
          user_id: string;
          rating: number;
          title: string | null;
          content: string | null;
          pros: string[] | null;
          cons: string[] | null;
          is_verified: boolean;
          is_approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      leads: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          email: string;
          phone: string | null;
          city: string | null;
          course_interest: string | null;
          source: LeadSource;
          status: LeadStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['leads']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['leads']['Insert']>;
      };
      plans: {
        Row: {
          id: string;
          name: string;
          tier: PlanTier;
          description: string | null;
          price_monthly: number;
          price_quarterly: number;
          price_yearly: number;
          features: Json;
          max_photos: number;
          max_courses: number;
          max_leads_per_month: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['plans']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['plans']['Insert']>;
      };
      subscriptions: {
        Row: {
          id: string;
          college_id: string;
          plan_id: string;
          status: SubscriptionStatus;
          billing_cycle: BillingCycle;
          current_period_start: string;
          current_period_end: string;
          razorpay_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          college_id: string;
          subscription_id: string | null;
          plan_id: string | null;
          billing_cycle: BillingCycle | null;
          amount: number;
          currency: string;
          status: PaymentStatus;
          razorpay_payment_id: string | null;
          razorpay_order_id: string | null;
          invoice_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      blogs: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string | null;
          cover_image_url: string | null;
          author_id: string;
          category_id: string | null;
          tags: string[] | null;
          is_featured: boolean;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blogs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['blogs']['Insert']>;
      };
      blog_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['blog_categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['blog_categories']['Insert']>;
      };
      cities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          state_id: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cities']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['cities']['Insert']>;
      };
      states: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['states']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['states']['Insert']>;
      };
      goals: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['goals']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['goals']['Insert']>;
      };
      rankings: {
        Row: {
          id: string;
          college_id: string;
          agency: string;
          rank: number;
          year: number;
          category: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rankings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['rankings']['Insert']>;
      };
      seo_meta: {
        Row: {
          id: string;
          page_type: string;
          page_identifier: string;
          meta_title: string | null;
          meta_description: string | null;
          canonical_url: string | null;
          og_image: string | null;
          schema_markup: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['seo_meta']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['seo_meta']['Insert']>;
      };
      advertisements: {
        Row: {
          id: string;
          title: string;
          image_url: string;
          link_url: string;
          position: string;
          is_active: boolean;
          start_date: string | null;
          end_date: string | null;
          impressions: number;
          clicks: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['advertisements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['advertisements']['Insert']>;
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['audit_logs']['Insert']>;
      };
      college_goals: {
        Row: {
          college_id: string;
          goal_id: string;
        };
        Insert: Database['public']['Tables']['college_goals']['Row'];
        Update: Partial<Database['public']['Tables']['college_goals']['Row']>;
      };
      admissions: {
        Row: {
          id: string;
          college_id: string;
          process: string | null;
          eligibility: string | null;
          application_start_date: string | null;
          application_end_date: string | null;
          entrance_exams: string[] | null;
          counseling_process: string | null;
          documents_required: string[] | null;
          selection_criteria: string | null;
          year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['admissions']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['admissions']['Insert']>;
      };
      scholarships: {
        Row: {
          id: string;
          college_id: string;
          name: string;
          description: string | null;
          amount: number | null;
          eligibility: string | null;
          type: string | null;
          provider: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scholarships']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['scholarships']['Insert']>;
      };
      hostel_details: {
        Row: {
          id: string;
          college_id: string;
          type: string;
          capacity: number | null;
          room_types: string[] | null;
          fees_per_year: number | null;
          facilities: string[] | null;
          mess_menu: string | null;
          rules: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['hostel_details']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['hostel_details']['Insert']>;
      };
      cutoffs: {
        Row: {
          id: string;
          college_id: string;
          course_id: string | null;
          exam_name: string;
          category: string | null;
          opening_rank: number | null;
          closing_rank: number | null;
          cutoff_score: number | null;
          year: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['cutoffs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['cutoffs']['Insert']>;
      };
      saved_colleges: {
        Row: {
          id: string;
          user_id: string;
          college_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['saved_colleges']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['saved_colleges']['Insert']>;
      };
    };
  };
}

type RawTables = DatabaseShape['public']['Tables'];
type TableName = keyof RawTables;
type TableRow<Name extends TableName> = RawTables[Name]['Row'];

type RequiredInsertColumns = {
  users: 'id' | 'email' | 'full_name';
  colleges: 'name' | 'slug';
  college_users: 'college_id' | 'user_id';
  courses: 'college_id' | 'name' | 'slug' | 'degree_type';
  course_specializations: 'course_id' | 'name';
  fees: 'course_id' | 'college_id';
  placements: 'college_id' | 'year';
  recruiters: 'college_id' | 'name';
  faculty: 'college_id' | 'name';
  galleries: 'college_id' | 'image_url';
  videos: 'college_id' | 'title' | 'url';
  brochures: 'college_id' | 'title' | 'file_url';
  reviews: 'college_id' | 'user_id' | 'rating';
  leads: 'college_id' | 'name' | 'email' | 'source';
  plans: 'name' | 'tier';
  subscriptions: 'college_id' | 'plan_id';
  payments: 'college_id' | 'amount';
  blogs: 'title' | 'slug' | 'content' | 'author_id';
  blog_categories: 'name' | 'slug';
  cities: 'name' | 'slug' | 'state_id';
  states: 'name' | 'slug';
  goals: 'name' | 'slug';
  rankings: 'college_id' | 'agency' | 'rank' | 'year';
  seo_meta: 'page_type' | 'page_identifier';
  advertisements: 'title' | 'image_url' | 'link_url' | 'position';
  audit_logs: 'action' | 'entity_type';
  college_goals: 'college_id' | 'goal_id';
  admissions: 'college_id';
  scholarships: 'college_id' | 'name';
  hostel_details: 'college_id' | 'type';
  cutoffs: 'college_id' | 'exam_name' | 'year';
  saved_colleges: 'user_id' | 'college_id';
};

type Relation<
  ForeignKeyName extends string,
  Columns extends string,
  ReferencedRelation extends string,
  ReferencedColumns extends string = 'id',
> = {
  foreignKeyName: ForeignKeyName;
  columns: [Columns];
  isOneToOne: false;
  referencedRelation: ReferencedRelation;
  referencedColumns: [ReferencedColumns];
};

type RelationshipMap = {
  users: [];
  colleges: [
    Relation<'colleges_city_id_fkey', 'city_id', 'cities'>,
    Relation<'colleges_manager_id_fkey', 'manager_id', 'users'>,
    Relation<'colleges_state_id_fkey', 'state_id', 'states'>,
    Relation<'colleges_subscription_id_fkey', 'subscription_id', 'subscriptions'>,
  ];
  college_users: [
    Relation<'college_users_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'college_users_user_id_fkey', 'user_id', 'users'>,
  ];
  courses: [
    Relation<'courses_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'courses_goal_id_fkey', 'goal_id', 'goals'>,
  ];
  course_specializations: [Relation<'course_specializations_course_id_fkey', 'course_id', 'courses'>];
  fees: [
    Relation<'fees_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'fees_course_id_fkey', 'course_id', 'courses'>,
  ];
  placements: [Relation<'placements_college_id_fkey', 'college_id', 'colleges'>];
  recruiters: [Relation<'recruiters_college_id_fkey', 'college_id', 'colleges'>];
  faculty: [Relation<'faculty_college_id_fkey', 'college_id', 'colleges'>];
  galleries: [Relation<'galleries_college_id_fkey', 'college_id', 'colleges'>];
  videos: [Relation<'videos_college_id_fkey', 'college_id', 'colleges'>];
  brochures: [Relation<'brochures_college_id_fkey', 'college_id', 'colleges'>];
  reviews: [
    Relation<'reviews_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'reviews_user_id_fkey', 'user_id', 'users'>,
  ];
  leads: [Relation<'leads_college_id_fkey', 'college_id', 'colleges'>];
  plans: [];
  subscriptions: [
    Relation<'fk_subscriptions_college', 'college_id', 'colleges'>,
    Relation<'subscriptions_plan_id_fkey', 'plan_id', 'plans'>,
  ];
  payments: [
    Relation<'payments_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'payments_plan_id_fkey', 'plan_id', 'plans'>,
    Relation<'payments_subscription_id_fkey', 'subscription_id', 'subscriptions'>,
  ];
  blogs: [
    Relation<'blogs_author_id_fkey', 'author_id', 'users'>,
    Relation<'blogs_category_id_fkey', 'category_id', 'blog_categories'>,
  ];
  blog_categories: [];
  cities: [Relation<'cities_state_id_fkey', 'state_id', 'states'>];
  states: [];
  goals: [];
  rankings: [Relation<'rankings_college_id_fkey', 'college_id', 'colleges'>];
  seo_meta: [];
  advertisements: [];
  audit_logs: [Relation<'audit_logs_user_id_fkey', 'user_id', 'users'>];
  college_goals: [
    Relation<'college_goals_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'college_goals_goal_id_fkey', 'goal_id', 'goals'>,
  ];
  admissions: [Relation<'admissions_college_id_fkey', 'college_id', 'colleges'>];
  scholarships: [Relation<'scholarships_college_id_fkey', 'college_id', 'colleges'>];
  hostel_details: [Relation<'hostel_details_college_id_fkey', 'college_id', 'colleges'>];
  cutoffs: [
    Relation<'cutoffs_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'cutoffs_course_id_fkey', 'course_id', 'courses'>,
  ];
  saved_colleges: [
    Relation<'saved_colleges_college_id_fkey', 'college_id', 'colleges'>,
    Relation<'saved_colleges_user_id_fkey', 'user_id', 'users'>,
  ];
};

type DatabaseTable<Name extends TableName> = {
  Row: TableRow<Name>;
  Insert: Pick<TableRow<Name>, Extract<RequiredInsertColumns[Name], keyof TableRow<Name>>> &
    Partial<Omit<TableRow<Name>, RequiredInsertColumns[Name]>>;
  Update: Partial<TableRow<Name>>;
  Relationships: RelationshipMap[Name];
};

export type Database = {
  public: {
    Tables: { [Name in TableName]: DatabaseTable<Name> };
    Views: Record<never, never>;
    Functions: Record<never, never>;
  };
};

export type Tables<Name extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Name]['Row'];

export type TablesInsert<Name extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Name]['Insert'];

export type TablesUpdate<Name extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][Name]['Update'];
