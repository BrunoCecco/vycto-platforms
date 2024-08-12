import { FC } from "react";
import FanZoneBanner from "./fanZoneBanner";
import CurrentCompetitions from "./currentCompetitions";
import PastCompetitions from "./pastCompetitions";

interface FanZoneProps {
  bannerImages: {
    logoPlaySrc: string;
    bannerSrc: string;
  };
  currentCompetitions: {
    imageSrc: string;
    title: string;
    sponsor: string;
    statusInfo: string;
  }[];
  pastCompetitions: {
    imageSrc: string;
    title: string;
    sponsor: string;
    statusInfo: string;
  }[];
}

const FanZone: FC<FanZoneProps> = ({
  bannerImages,
  currentCompetitions,
  pastCompetitions,
}) => {
  return (
    <>
      <CurrentCompetitions competitions={currentCompetitions} />
      <PastCompetitions competitions={pastCompetitions} />
    </>
  );
};

export default FanZone;
