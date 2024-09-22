import EditCompetitions from "@/components/edit-competition/editCompetitions";
import EditFanZoneHeader from "./editFanzoneHeader";

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
      <EditFanZoneHeader
        siteId={siteId}
        data={data}
        latestCompetition={latestCompetition}
      />
      <EditCompetitions siteId={siteId} />
    </div>
  );
}
