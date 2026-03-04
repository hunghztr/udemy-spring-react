import HomeCategoryHeader from "@/components/user/home/home.category.header";
import HomeBanner from "@/components/user/home/home.banner";
import ScrollProgress from "@/components/user/layout/scoll.progress";
import BecomeInstructor from "@/components/user/home/become.instructor";
import TopInstructors from "@/components/user/home/top.instructors";
import LearningPaths from "@/components/user/home/learning.path";
import TopCoursesByField from "@/components/user/home/top.courses.by.field";
import PopularCategories from "@/components/user/home/popular.categories";
import FeaturedCourses from "@/components/user/course/featured.courses";

export default function HomePage() {

  return (
    <div>
      <HomeCategoryHeader  />
      <HomeBanner />
      <ScrollProgress />
      <FeaturedCourses />
      {/* <RecommendedNext /> */}
      <PopularCategories />
      <TopCoursesByField />
      <LearningPaths />
      <TopInstructors />
      <BecomeInstructor />
    </div>
  );
}
