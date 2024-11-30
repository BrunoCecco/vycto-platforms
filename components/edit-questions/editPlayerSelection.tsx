"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import PointsBadge from "../competitions/pointsBadge";
import { X } from "lucide-react";

const PlayerComponent = ({
  questionId,
  index,
  name,
  image,
  selectedPlayer,
  setSelectedPlayer,
  handlePlayerNameChange,
  handleImageChange,
}: {
  questionId: string;
  index: number;
  name: string;
  image: string;
  selectedPlayer: string | null;
  setSelectedPlayer: (player: string) => void;
  handlePlayerNameChange: (newName: string) => void;
  handleImageChange: (key: string, value: string) => void;
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg border-2 p-2 shadow-sm transition duration-200 ${
        selectedPlayer === name ? "border-yellow-500" : "border-transparent"
      }`}
    >
      <Uploader
        id={questionId}
        defaultValue={image}
        name={"image" + index}
        upload={handleImageChange}
      />
      <div className="mt-2 text-center">
        <input
          type="text"
          defaultValue={name}
          placeholder="Player Name"
          onBlur={(e) => handlePlayerNameChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
        />
      </div>
    </div>
  );
};

const EditPlayerSelection = ({
  question,
  removeQuestion,
}: {
  question: SelectQuestion;
  removeQuestion: (id: string) => void;
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [isEditingPoints, setIsEditingPoints] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(
    question.question || "Which player will score first?",
  );
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );
  const [points, setPoints] = useState(question.points ?? 0);
  const [answer1, setAnswer1] = useState(question.answer1 ?? "");
  const [answer2, setAnswer2] = useState(question.answer2 ?? "");
  const [answer3, setAnswer3] = useState(question.answer3 ?? "");
  const [answer4, setAnswer4] = useState(question.answer4 ?? "");
  const [image1, setImage1] = useState(question.image1 ?? "");
  const [image2, setImage2] = useState(question.image2 ?? "");
  const [image3, setImage3] = useState(question.image3 ?? "");
  const [image4, setImage4] = useState(question.image4 ?? "");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateQuestion = async (key: string, value: string) => {
    if (!mounted) return;
    const formData = new FormData();
    formData.append(key, value);
    await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
  };
  const handlePointsClick = () => {
    setIsEditingPoints(true);
  };

  const handleQuestionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedQuestion(e.target.value);
  };

  const handlePointsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPoints(Number(e.target.value));
  };

  const handleCorrectAnswerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setEditedCorrectAnswer(e.target.value);
  };

  // const handlePlayerNameChange = (index: number, newName: string) => {
  //   const updatedPlayers = [...players];
  //   updatedPlayers[index].name = newName;
  //   setPlayers(updatedPlayers);
  // };

  // const handlePlayerPositionChange = (index: number, newPosition: string) => {
  //   const updatedPlayers = [...players];
  //   updatedPlayers[index].position = newPosition;
  //   setPlayers(updatedPlayers);
  // };

  const handleInputBlur = async (key: string, value: string) => {
    setIsEditingPoints(false);
    await updateQuestion(key, value);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
  };

  const handleImageChange = async (key: string, value: string) => {
    if (key === "image1") {
      setImage1(value);
    } else if (key === "image2") {
      setImage2(value);
    } else if (key === "image3") {
      setImage3(value);
    } else if (key === "image4") {
      setImage4(value);
    }
    await updateQuestion(key, value);
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg bg-white p-4 shadow-xl md:p-10">
        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="absolute left-2 top-2 rounded-full p-2 text-red-500 hover:text-red-600 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
        {/* Editable Points Badge */}
        <div className="mb-4 flex justify-center">
          {isEditingPoints ? (
            <input
              type="number"
              min={0}
              value={points}
              onChange={handlePointsInputChange}
              onBlur={() => handleInputBlur("points", points.toString())}
              className="w-20 text-center text-xl font-semibold text-gray-800"
            />
          ) : (
            <div className="cursor-pointer" onClick={handlePointsClick}>
              <PointsBadge points={points} />
            </div>
          )}
        </div>

        {/* Editable Question */}
        <div className="mb-2 text-center">
          <input
            type="text"
            value={editedQuestion}
            onChange={handleQuestionInputChange}
            onBlur={() => handleInputBlur("question", editedQuestion)}
            className="w-full text-center text-xl font-semibold text-gray-800"
          />
        </div>
        <p className="mb-6 text-center text-gray-500">
          Select the correct answer
        </p>

        {/* Editable Player Options */}
        <div className="grid grid-cols-2 gap-4">
          <PlayerComponent
            questionId={question.id}
            index={1}
            name={answer1}
            image={image1}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            handlePlayerNameChange={(newName: string) =>
              handleInputBlur("answer1", newName)
            }
            handleImageChange={handleImageChange}
          />
          <PlayerComponent
            questionId={question.id}
            index={2}
            name={answer2}
            image={image2}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            handlePlayerNameChange={(newName: string) =>
              handleInputBlur("answer2", newName)
            }
            handleImageChange={handleImageChange}
          />
          <PlayerComponent
            questionId={question.id}
            index={3}
            name={answer3}
            image={image3}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            handlePlayerNameChange={(newName: string) =>
              handleInputBlur("answer3", newName)
            }
            handleImageChange={handleImageChange}
          />
          <PlayerComponent
            questionId={question.id}
            index={4}
            name={answer4}
            image={image4}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
            handlePlayerNameChange={(newName: string) =>
              handleInputBlur("answer4", newName)
            }
            handleImageChange={handleImageChange}
          />
        </div>
        <div className="mt-4 flex flex-col items-center justify-center gap-4">
          <select
            value={editedCorrectAnswer}
            onChange={async (e) => {
              setEditedCorrectAnswer(e.target.value);
              handleInputBlur("correctAnswer", e.target.value);
            }}
            className="mt-1 block w-full rounded-md border border-stone-200 text-center dark:border-stone-700"
          >
            <option value={answer1}>{answer1}</option>
            <option value={answer2}>{answer2}</option>
            <option value={answer3}>{answer3}</option>
            <option value={answer4}>{answer4}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerSelection;
