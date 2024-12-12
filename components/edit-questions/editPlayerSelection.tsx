"use client";
import { updateQuestionMetadata } from "@/lib/actions";
import { SelectQuestion } from "@/lib/schema";
import { FocusEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import PointsBadge from "../competitions/pointsBadge";
import { X } from "lucide-react";
import { Select, Button, Input, SelectItem } from "@nextui-org/react";
import Form from "../form";
import { nanoid } from "nanoid";
import EditQuestionHeader from "./editQuestionHeader";
import { QuestionType } from "@/lib/types";

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
  handleImageChange: (formData: FormData, id: string, name: string) => void;
}) => {
  return (
    <div
      className={`cursor-pointer rounded-lg border-2 p-2 shadow-sm transition duration-200 ${
        selectedPlayer === name ? "border-yellow-500" : "border-transparent"
      }`}
    >
      <Form
        title=""
        description=""
        helpText=""
        inputAttrs={{
          name: "image" + index,
          type: "file",
          defaultValue: image,
          placeholder: "player selection image" + nanoid(),
        }}
        handleSubmit={handleImageChange}
        bordered={false}
      />

      <div className="mt-2 text-center">
        <Input
          type="text"
          defaultValue={name}
          placeholder="Player Name"
          // handle player name change
          onChange={(e) => handlePlayerNameChange(e.target.value)}
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
  const [editedQuestion, setEditedQuestion] = useState(
    question.question || "Which player will score first?",
  );
  const [editedCorrectAnswer, setEditedCorrectAnswer] = useState(
    question.correctAnswer || "",
  );
  const [points, setPoints] = useState(question.points || 0);
  const [answer1, setAnswer1] = useState(question.answer1 || "");
  const [answer2, setAnswer2] = useState(question.answer2 || "");
  const [answer3, setAnswer3] = useState(question.answer3 || "");
  const [answer4, setAnswer4] = useState(question.answer4 || "");
  const [image1, setImage1] = useState(question.image1 || "");
  const [image2, setImage2] = useState(question.image2 || "");
  const [image3, setImage3] = useState(question.image3 || "");
  const [image4, setImage4] = useState(question.image4 || "");

  const updateQuestion = async (key: string, value: string) => {
    const formData = new FormData();
    formData.append(key, value);
    const res = await updateQuestionMetadata(formData, question, key);
    toast.success("Question updated successfully");
    return res;
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
    await updateQuestion(key, value);
  };

  const handleRemove = async () => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    removeQuestion(question.id);
  };

  const handleImageChange = async (
    formData: FormData,
    id: string,
    name: string,
  ) => {
    const key = name;
    const value = formData.get(name) as string;
    console.log("updateQuestion", key, value);
    if (key === "image1") {
      setImage1(value);
    } else if (key === "image2") {
      setImage2(value);
    } else if (key === "image3") {
      setImage3(value);
    } else if (key === "image4") {
      setImage4(value);
    }
    const res = await updateQuestion(key, value);
    console.log("res", res);
    return res;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-full rounded-lg  p-4 shadow-xl md:p-10">
        <EditQuestionHeader
          type={question.type as QuestionType}
          question={question}
          removeQuestion={removeQuestion}
          updateQuestion={updateQuestion}
        />

        {/* Editable Question */}
        <div className="mb-2 text-center">
          <Input
            type="text"
            value={editedQuestion}
            onChange={handleQuestionInputChange}
            onBlur={() => handleInputBlur("question", editedQuestion)}
            className="w-full text-center text-xl font-semibold "
          />
        </div>
        <p className="mb-6 text-center ">Select the correct answer</p>

        {/* Editable Player Options */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <Select
            value={editedCorrectAnswer}
            aria-label="Correct Answer Selector"
            placeholder={editedCorrectAnswer}
            selectedKeys={[editedCorrectAnswer]}
            onChange={(e) => {
              setEditedCorrectAnswer(e.target.value);
              handleInputBlur("correctAnswer", e.target.value);
            }}
          >
            <SelectItem key={answer1}>{answer1}</SelectItem>
            <SelectItem key={answer2}>{answer2}</SelectItem>
            <SelectItem key={answer3}>{answer3}</SelectItem>
            <SelectItem key={answer4}>{answer4}</SelectItem>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EditPlayerSelection;
