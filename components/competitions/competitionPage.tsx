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
import LoginToSubmitButton from "@/components/auth/loginToSubmitButton";
import { useRouter, useSearchParams } from "next/navigation";
import { submitAnswers, updateName, updateUsername } from "@/lib/actions";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import CompetitionWinners from "@/components/competitions/competitionWinners";
import LoginButton from "@/components/auth/loginButton";

export default function CompetitionPage({
  session,
  data,
  siteData,
  questions,
  answers,
  userComp,
  users,
  slug,
  winnerData,
}: {
  session: any;
  data: SelectCompetition;
  siteData: any;
  questions: SelectQuestion[] | undefined;
  answers: SelectAnswer[] | undefined;
  userComp: SelectUserCompetition | undefined | { error: string };
  users: SelectUserCompetition[];
  slug: string;
  winnerData: any;
}) {
  const [activeTab, setActiveTab] = useState("Challenge");
  const [localAnswers, setLocalAnswers] = useState<{ [key: string]: string }>(
    {},
  );
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const posthog = usePostHog();

  const url = process.env.NEXT_PUBLIC_VERCEL_ENV
    ? `https://${siteData?.subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/comp/${data.slug}`
    : `http://${siteData?.subdomain}.localhost:3000/comp/${data.slug}`;

  useEffect(() => {
    if (session && searchParams && !userComp) {
      posthog?.identify(session?.user?.id!, {
        email: session?.user?.email,
      });
      const extractedAnswers: { [key: string]: string } = {};
      console.log(searchParams);
      searchParams.forEach(async (value, key) => {
        if (key != "username") {
          console.log(key, value);
          extractedAnswers[key] = value;
        }
      });
      if (Object.keys(extractedAnswers).length > 0) {
        setLocalAnswers(extractedAnswers);
        submitExtractedAnswers(extractedAnswers);
      }
    }
    checkUsername();
  }, [session, searchParams]);

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
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white px-4 shadow-2xl md:rounded-xl md:px-24">
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
        <div className="mx-auto flex w-full flex-col justify-center gap-12 bg-white py-12 md:gap-20 md:rounded-3xl">
          {userComp && "submitted" in userComp && userComp.submitted ? (
            <GameStats
              competitionTitle={data.title!}
              userComp={userComp}
              users={users}
            />
          ) : null}
          {questions &&
            questions.map((question: any, index: number) => {
              const answer = answers?.find(
                (a: any) => a.questionId === question.id,
              ) || { answer: searchParams.get(question.id) };
              const disabled =
                userComp && "submitted" in userComp && userComp?.submitted;
              return (
                <div key={"compquestion" + index}>
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
          {session ? (
            userComp && "submitted" in userComp && userComp.submitted ? (
              <div className="text-md mx-auto rounded-xl border-green-600 bg-green-600 p-4 text-white">
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
            <div className="mx-5 rounded-md border border-stone-200 p-10 sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg sm:shadow-md dark:border-stone-400">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-stone-200 dark:border-stone-400"
              />
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-stone-200 dark:border-stone-400"
              />
              <LoginButton
                email={email}
                username={username}
                localAnswers={localAnswers}
                competitionSlug={slug}
              />
            </div>
          )}
        </div>
      )}
      {activeTab == "Leaderboard" && (
        <div className="flex flex-col justify-center md:px-8">
          <CompetitionWinners
            winnerData={winnerData}
            url={url}
            adminView={false}
          />
          <Leaderboard siteData={siteData} competition={data} users={users} />
        </div>
      )}
    </div>
  );
}
