import HomeBanner from "@/components/user/home/home.banner";
import ScrollProgress from "@/components/user/layout/scoll.progress";
import BecomeInstructor from "@/components/user/home/become.instructor";
import PopularCategories from "@/components/user/home/popular.categories";
import FeaturedCourses from "@/components/user/course/featured.courses";
import RecommendedNext from "@/components/user/home/recommended.next";
import { useAppSelector } from "@/redux/hook";

export default function HomePage() {
  const user = useAppSelector(state => state.currentUser)
  return (
    <div>
      <HomeBanner />
      <ScrollProgress />
      <FeaturedCourses />
      {user.id && <RecommendedNext />}
    
      <PopularCategories />
      <BecomeInstructor />
    </div>
  );
}
