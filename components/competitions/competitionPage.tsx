"use client";

import {
  competitions,
  SelectAnswer,
  SelectCompetition,
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
import CompetitionHeader from "@/components/competitions/competitionHeader";
import TabSelector from "@/components/competitions/tabSelector";
import SubmitAnswersForm from "@/components/form/submitAnswersForm";
import GeneralNumber from "@/components/questions/generalNumber";
import Rewards from "@/components/competitions/rewards";
import { useEffect, useState } from "react";
import Leaderboard from "@/components/leaderboard/leaderboard";
import GameStats from "@/components/competitions/gameStats";
import { useRouter, useSearchParams } from "next/navigation";
import { submitAnswers, updateName, updateUsername } from "@/lib/actions";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import CompetitionWinners from "@/components/competitions/competitionWinners";
import LoginButton from "@/components/auth/loginButton";
import UserSignUp from "../auth/userSignUp";
import { TracingBeam } from "../ui/tracingBeam";

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
  data: SelectCompetition;
  siteData: any;
  questions: SelectQuestion[] | undefined;
  answers: SelectAnswer[] | undefined;
  userComp: SelectUserCompetition | undefined;
  users: SelectUserCompetition[];
  slug: string;
}) {
  const [activeTab, setActiveTab] = useState("Challenge");
  const [localAnswers, setLocalAnswers] = useState<{ [key: string]: string }>(
    {},
  );
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [ended, setEnded] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const posthog = usePostHog();

  console.log(answers);

  useEffect(() => {
    const hasEnded =
      data.correctAnswersSubmitted ||
      new Date(data.date).getTime() < Date.now();
    setEnded(hasEnded);

    const hasSubmitted =
      (userComp && "submitted" in userComp && userComp.submitted) || false;
    setSubmitted(hasSubmitted);

    if (session?.user?.id != userComp?.userId) {
      console.log("User not in competition");
      setActiveTab("Challenge");
    } else if (hasEnded) {
      console.log("Competition has ended");
      // setActiveTab("Leaderboard");
    }

    if (session && searchParams && !userComp) {
      posthog?.identify(session?.user?.id!, {
        email: session?.user?.email,
      });
      const extractedAnswers: { [key: string]: string } = {};
      searchParams.forEach(async (value, key) => {
        if (key != "username") {
          extractedAnswers[key] = value;
        }
      });
      if (Object.keys(extractedAnswers).length > 0) {
        setLocalAnswers(extractedAnswers);
        submitExtractedAnswers(extractedAnswers);
      }
    }
    checkUsername();
  }, [session, searchParams, userComp]);

  const checkUsername = async () => {
    const username = searchParams.get("username");
    if (username) {
      const res = await updateUsername(username, session.user.email);
      toast.success("Username updated");
    }
    const name = searchParams.get("name");
    if (name) {
      const res = await updateName(name, session.user.email);
      toast.success("Name updated");
    }
  };

  const submitExtractedAnswers = async (extractedAnswers: {
    [key: string]: string;
  }) => {
    if (session?.user?.id) {
      try {
        const res = await submitAnswers(
          session.user.id,
          data.id,
          extractedAnswers,
        );
        if ("error" in res && res.error) {
          toast.error(res.error);
        } else {
          router.refresh();
          router.push(`/comp/${slug}/${session.user.id}`);
          toast.success(`Successfully submitted answers!`);
        }
      } catch (error) {
        toast.error("Failed to submit answers.");
      }
    }
  };

  const handleLocalAnswer = (questionId: string, answer: string) => {
    const newLocalAnswers = { ...localAnswers, [questionId]: answer };
    setLocalAnswers(newLocalAnswers);
  };

  const getQuestionType = (
    question: SelectQuestion,
    userId: string,
    index: number,
    answer: SelectAnswer | { answer: string | null } | undefined,
    disabled: boolean,
  ) => {
    switch (question.type) {
      case QuestionType.TrueFalse:
        return (
          <TrueFalse
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      case QuestionType.WhatMinute:
        return (
          <WhatMinute
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      case QuestionType.PlayerSelection:
        return (
          <PlayerSelection
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      case QuestionType.MatchOutcome:
        return (
          <MatchOutcome
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      case QuestionType.GuessScore:
        return (
          <GuessScore
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      case QuestionType.GeneralSelection:
        return (
          <GeneralSelection
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      case QuestionType.GeneralNumber:
        return (
          <GeneralNumber
            {...question}
            userId={userId}
            answer={answer}
            disabled={disabled}
            onLocalAnswer={handleLocalAnswer}
            color={siteData.color1}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full pb-5 sm:pb-20">
      <div className="h-max overflow-hidden bg-content1 px-8 py-8 md:rounded-xl md:px-24 md:py-20 md:shadow-2xl">
        <CompetitionHeader
          session={session}
          users={users}
          data={data}
          siteData={siteData}
        />
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab == "Rewards" && (
          <Rewards siteData={siteData} competition={data} users={users} />
        )}
        {activeTab == "Challenge" && (
          <TracingBeam color1={siteData.color1} color2={siteData.color2}>
            <div className="relative z-50 mx-auto flex w-full flex-col justify-center gap-12 py-12 md:gap-20 md:rounded-3xl">
              {submitted && userComp ? (
                <GameStats
                  competitionTitle={data.title!}
                  userComp={userComp}
                  users={users}
                  color={siteData.color1}
                  compFinished={data.correctAnswersSubmitted}
                />
              ) : null}
              {questions &&
                questions.map((question: any, index: number) => {
                  const answer = answers?.find(
                    (a: any) => a.questionId === question.id,
                  ) || { answer: searchParams.get(question.id) };
                  const disabled = submitted;
                  return (
                    <div key={"compquestion" + index}>
                      {getQuestionType(
                        question,
                        session?.user.id!,
                        index,
                        answer,
                        disabled || ended || false,
                      )}
                    </div>
                  );
                })}
              {ended ? (
                <div className="text-md mx-auto rounded-xl border-danger-600 bg-danger-400 p-4">
                  Competition Ended
                </div>
              ) : session ? (
                submitted ? (
                  <div className="text-md mx-auto rounded-xl border-success-600 bg-success-400 p-4">
                    Answers Submitted
                  </div>
                ) : (
                  <SubmitAnswersForm
                    userId={session?.user.id!}
                    competitionId={data.id}
                    slug={slug}
                    localAnswers={localAnswers}
                  />
                )
              ) : (
                <UserSignUp
                  siteData={siteData}
                  localAnswers={localAnswers}
                  competitionSlug={slug}
                />
              )}
            </div>
          </TracingBeam>
        )}
        {activeTab == "Leaderboard" && (
          <Leaderboard
            siteData={siteData}
            competition={data}
            users={users}
            session={session}
          />
        )}
      </div>
    </div>
  );
}
