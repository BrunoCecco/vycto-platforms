import AdminPage from "@/components/adminPage";
import AnalyticsPage from "@/components/analyticsPage";
import B2BSignUp from "@/components/b2BSignUp";
import Competitions from "@/components/competitions";
import PoweredBadge from "@/components/poweredBadge";
import SelectUsername from "@/components/selectUsername";
import UserSignUp from "@/components/userSignUp";
import { getAllCompetitions } from "@/lib/fetchers";
import { SelectSite } from "@/lib/schema";

export default async function HomePage() {
  const allComps = await getAllCompetitions();

  // unique sites
  const sites = [...new Set(allComps.map((comp: any) => comp.site.subdomain))];

  return (
    <div className="min-h-screen space-y-12 bg-purple-100">
      <h1 className="text-2xl font-bold">Welcome to Vycto 1!</h1>
      {sites.map((site: any) => {
        return (
          <div key={site}>
            <h1>{site}</h1>
            {allComps.map((comp: any) => {
              console.log(comp.site.subdomain, site);
              if (comp.site.subdomain === site) {
                return <div key={comp.id}>{comp.name}</div>;
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
