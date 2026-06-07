export interface CourseRevenueDetail {
  courseId: string;
  courseName: string;
  revenue: number;
  sold: number;
}

export interface InstructorRevenueResponse {
  instructorId: string;
  instructorName: string;
  totalRevenue: number;
  courseDetails: CourseRevenueDetail[];
}