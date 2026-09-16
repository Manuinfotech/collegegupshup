export * from './database';

export interface SearchParams {
  goal?: string;
  city?: string;
  state?: string;
  fees_min?: string;
  fees_max?: string;
  ownership?: string;
  ranking?: string;
  course_type?: string;
  accreditation?: string;
  entrance_exam?: string;
  page?: string;
  sort?: string;
  q?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  pagination?: PaginationParams;
}

export interface CollegeCardData {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  cover_image_url: string | null;
  short_description: string | null;
  city_name: string | null;
  state_name: string | null;
  ownership_type: string | null;
  established_year: number | null;
  is_featured: boolean;
  is_verified: boolean;
  average_rating: number | null;
  review_count: number;
  courses_count: number;
  fees_range: string | null;
  highest_package: number | null;
  average_package: number | null;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  badge?: string;
  children?: NavItem[];
}
