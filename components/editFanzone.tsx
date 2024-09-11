import CreateCompetitionButton from "@/components/old-components/create-competition-button";
import Competitions from "@/components/old-components/competitions";
import FanZoneHeader from "./fazoneHeader";

export default function EditFanzone({
  data,
  url,
  siteId,
  latestCompetition,
}: {
  //   data: { name: string | null }; // Allow name to be null
  data: any;
  url: string;
  siteId: string;
  latestCompetition: any;
}) {
  return (
    <div>
      <FanZoneHeader data={data} latestCompetition={latestCompetition} />
      <div>
        <CreateCompetitionButton />
      </div>
      <Competitions siteId={siteId} />
    </div>
  );
}
