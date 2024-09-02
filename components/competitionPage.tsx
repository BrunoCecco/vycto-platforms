"use client";

import BlogCard from "@/components/old-components/blog-card";
import {
  competitions,
  SelectAnswer,
  SelectQuestion,
  SelectUserCompetition,
  sites,
} from "@/lib/schema";
import TrueFalse from "@/components/questions/trueFalse";
import WhatMinute from "@/components/questions/whatMinute";
import MatchOutcome from "@/components/questions/matchOutcome";
import GuessScore from "@/components/questions/guessScore";
import GeneralSelection from "@/components/questions/generalSelection";
import PlayerSelection from "@/components/questions/playerSelection";
import { QuestionType } from "@/lib/types";
import CompetitionHeader from "@/components/competitionHeader";
import TabSelector from "@/components/tabSelector";
import SubmitAnswersForm from "@/components/form/submit-answers-form";
import GeneralNumber from "@/components/questions/generalNumber";
import Rewards from "@/components/rewards";
import { useState } from "react";
import Leaderboard from "./leaderboard";
import GameStats from "./gameStats";

export default function CompetitionPage({
  session,
  data,
  siteData,
  questions,
  answers,
  userComp,
  users,
  slug,
}: {
  session: any;
  data: any;
  siteData: any;
  questions: SelectQuestion[] | undefined;
  answers: SelectAnswer[] | undefined;
  userComp: SelectUserCompetition | undefined | { error: string };
  users: any;
  slug: string;
}) {
  const [activeTab, setActiveTab] = useState("Challenge");

  const getQuestionType = (
    question: SelectQuestion,
    userId: string,
    index: number,
    answer: SelectAnswer | undefined,
    disabled: boolean,
  ) => {
    switch (question.type) {
      case QuestionType.TrueFalse:
        return (
          <TrueFalse
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.WhatMinute:
        return (
          <WhatMinute
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.PlayerSelection:
        return (
          <PlayerSelection
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.MatchOutcome:
        return (
          <MatchOutcome
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.GuessScore:
        return (
          <GuessScore
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.GeneralSelection:
        return (
          <GeneralSelection
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      case QuestionType.GeneralNumber:
        return (
          <GeneralNumber
            key={index}
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <CompetitionHeader session={session} users={users} data={data} />
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab == "Rewards" && (
        <Rewards
          rewardTitle={data.rewardTitle}
          rewardDescription={data.rewardDescription}
          rewardImage={data.rewardImage}
          reward2Title={data.reward2Title}
          reward2Description={data.reward2Description}
          reward2Image={data.reward2Image}
        />
      )}
      {activeTab == "Challenge" && (
        <div className="mx-auto flex w-full flex-col justify-center gap-8 p-8 pt-0 ">
          {userComp && "submitted" in userComp && userComp.submitted ? (
            <GameStats
              competitionTitle={data.title}
              username={
                session?.user.username ||
                session?.user.email ||
                session?.user.name ||
                "User"
              }
              submissionDate={
                new Date(userComp.submissionDate).toDateString() ||
                "09 Aug 2024"
              }
              submissionTime="15:42"
              totalPoints={parseFloat(userComp.points || "0").toFixed(2)}
              percentile="Top 4%"
              rank="33rd"
              bonusPoints={0.5}
            />
          ) : null}
          {questions &&
            questions.map((question: any, index: number) => {
              const answer = answers?.find(
                (a: any) => a.questionId === question.id,
              );
              const disabled =
                userComp && "submitted" in userComp && userComp?.submitted;
              return (
                <div key={index}>
                  {getQuestionType(
                    question,
                    session?.user.id!,
                    index,
                    answer,
                    disabled || false,
                  )}
                </div>
              );
            })}
          {userComp && "submitted" in userComp && userComp.submitted ? (
            <div className="mx-auto flex h-8 w-fit items-center justify-center space-x-2 rounded-md border border-green-600 bg-green-600 px-2 text-sm text-white sm:h-10">
              Answers Submitted
            </div>
          ) : (
            <SubmitAnswersForm
              userId={session?.user.id!}
              competitionId={data.id}
              slug={slug}
            />
          )}
        </div>
      )}
      {activeTab == "Leaderboard" && (
        <div className="px-8 sm:px-0">
          <Leaderboard siteData={siteData} competition={data} users={users} />
        </div>
      )}
    </div>
  );
}
