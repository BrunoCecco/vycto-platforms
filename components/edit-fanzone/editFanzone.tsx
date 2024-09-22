import CreateCompetitionButton from "../edit-competition/createCompetitionButton";
// import Competitions from "../competitions/competitions";
import EditFanZoneHeader from "./editFanzoneHeader";
import EditCompetitions from "../edit-competition/editCompetitions";

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
