import HomeBanner from "@/components/user/home/home.banner";
import ScrollProgress from "@/components/user/layout/scoll.progress";
import BecomeInstructor from "@/components/user/home/become.instructor";
import LearningPaths from "@/components/user/home/learning.path";
import PopularCategories from "@/components/user/home/popular.categories";
import FeaturedCourses from "@/components/user/course/featured.courses";
import RecommendedNext from "@/components/user/home/recommended.next";

export default function HomePage() {

  return (
    <div>
      <HomeBanner />
      <ScrollProgress />
      <FeaturedCourses />
      <RecommendedNext />
      
      <LearningPaths />
      <PopularCategories />
      <BecomeInstructor />
    </div>
  );
}
