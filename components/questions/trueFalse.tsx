import Image from "next/image";
import PointsBadge from "../pointsBadge";
import SubmitButton from "./submitButton";

const TrueFalse = ({ ...props }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative h-full rounded-lg bg-white p-6 shadow-xl">
        {/* Points Badge */}
        <PointsBadge points={props.points} />

        {/* Placeholder for Image or Graphic */}
        <div className="mb-4 h-32 w-full overflow-hidden rounded-lg bg-green-100">
          <Image
            src={"/trueFalse.jpg"}
            alt="True or False Image"
            width={500}
            height={200}
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Question */}
        <h2 className="mb-1 text-center text-xl font-semibold text-gray-800">
          {props.question}
        </h2>
        <p className="mb-6 text-center text-gray-500">
          Select correctly to score points
        </p>

        <div className="flex justify-around">
          <SubmitButton
            userId={props.userId}
            questionId={props.id}
            answer="True"
            selected={props.answer == "True"}
          />
          <SubmitButton
            userId={props.userId}
            questionId={props.id}
            answer="False"
            selected={props.answer == "False"}
          />
        </div>
      </div>
    </div>
  );
};

export default TrueFalse;
