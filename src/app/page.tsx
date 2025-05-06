
import UserLayout from "@/app/(user)/layout";
import HomePage from "@/app/(user)/homepage/components/home";

export default function Home() {
  return (
    <div>
      <UserLayout>
        <HomePage />
      </UserLayout>
    </div>
  );
}