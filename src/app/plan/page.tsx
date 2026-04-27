import { MainNav } from "@/components/nav/MainNav";
import { PreferenceWizard } from "@/components/plan/PreferenceWizard";

export const metadata = {
  title: "Plan a trip — Trip Planner",
};

export default function PlanPage() {
  return (
    <>
      <MainNav />
      <main className="flex-1">
        <PreferenceWizard />
      </main>
    </>
  );
}
