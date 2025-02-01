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
import { useEffect, useRef, useState } from "react";
import GameStats from "@/components/competitions/gameStats";
import { useRouter, useSearchParams } from "next/navigation";
import {
  editUser,
  submitAnswers,
  updateUserCompetitionMetadata,
  updateUserOnLogin,
} from "@/lib/actions";
import { toast } from "sonner";
import { usePostHog } from "posthog-js/react";
import { TracingBeam } from "../ui/tracingBeam";
import MainLeaderboard from "../leaderboard/mainLeaderboard";
import SignInSide from "../auth/signInSide";
import { Session } from "next-auth";
import Loading from "../ui/loading";
import { decodeAnswer } from "@/lib/utils";
import { useTranslations } from "next-intl";

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
  session: Session | null;
  data: SelectCompetition;
  siteData: any;
  questions: SelectQuestion[] | undefined;
  answers: SelectAnswer[] | undefined;
  userComp: SelectUserCompetition | undefined;
  users: SelectUserCompetition[];
  slug: string;
}) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState(t("challenge"));
  const [localAnswers, setLocalAnswers] = useState<{ [key: string]: string }>(
    {},
  );
  const [sliderValues, setSliderValues] = useState<{ [key: string]: number }>(
    {},
  );
  const [ended, setEnded] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hasUpdatedDetails, setHasUpdatedDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const posthog = usePostHog();

  const questionComp = useRef<HTMLDivElement>(null);

  const nonQuestionSearchParamKeys = [
    "username",
    "name",
    "birthDate",
    "submit",
    "newsletter",
  ];

  useEffect(() => {
    const hasEnded =
      data.correctAnswersSubmitted ||
      new Date(data.date.replace(/\[.*\]$/, "")).getTime() < Date.now();
    setEnded(hasEnded);

    if (hasEnded && userComp?.userId == session?.user.id) {
      setActiveTab(t("leaderboard"));
    }

    const hasSubmitted =
      (userComp && "submitted" in userComp && userComp.submitted) || false;
    setSubmitted(hasSubmitted);

    if (session && searchParams) {
      const extractedAnswers: { [key: string]: string } = {};
      searchParams.forEach(async (value, key) => {
        if (!nonQuestionSearchParamKeys.includes(key)) {
          extractedAnswers[key] = decodeAnswer(value);
        }
      });
      if (Object.keys(extractedAnswers).length > 0) {
        setLocalAnswers(extractedAnswers);
      }
    }
    if (!hasUpdatedDetails) {
      checkUserDetails();
    }
  }, [session, searchParams, userComp]);

  useEffect(() => {
    const submit = searchParams.get("submit");
    if (
      localAnswers &&
      Object.keys(localAnswers).length > 0 &&
      submit == "true"
    ) {
      submitExtractedAnswers(localAnswers);
    }
  }, [localAnswers, searchParams]);

  const checkUserDetails = async () => {
    if (!session) {
      return;
    }
    const username = searchParams.get("username");
    if (username && session.user.username != username) {
      const res = await updateUserOnLogin(
        session.user.email,
        "username",
        username,
      );
      toast.success("Username updated");
    }
    const name = searchParams.get("name");
    if (name && session.user.name != name) {
      const res = await updateUserOnLogin(session.user.email, "name", name);
      toast.success("Name updated");
    }
    const birthDate = searchParams.get("birthDate");
    if (birthDate && session.user.birthDate != birthDate) {
      const res = await updateUserOnLogin(
        session.user.email,
        "birthDate",
        birthDate,
      );
      toast.success("Birthdate updated");
    }
    const newsletter = searchParams.get("newsletter");
    if (newsletter) {
      const subRes = await subscribe();
      const res = await updateUserOnLogin(
        session.user.email,
        "newsletter",
        newsletter,
      );
      const formData = new FormData();
      formData.append("newsletter", newsletter);
      const res2 = await updateUserCompetitionMetadata(
        session.user.id || "",
        data.id,
        formData,
        "newsletter",
      );
    }
    setHasUpdatedDetails(true);
  };

  const subscribe = async () => {
    fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: session?.user?.email,
        group: siteData.senderGroup,
      }),
    })
      .then(async (res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitExtractedAnswers = async (extractedAnswers: {
    [key: string]: string;
  }) => {
    if (session?.user?.id) {
      setLoading(true);
      try {
        const res = await submitAnswers(
          session.user.id,
          data.id,
          siteData.id,
          extractedAnswers,
        );
        if ("error" in res && res.error) {
          toast.error(res.error);
        } else {
          router.refresh();
          router.push(`/comp/${slug}/${session.user.id}`);
          toast.success(`Successfully submitted answers!`);
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to submit answers.");
        setLoading(false);
      }
    }
  };

  const handleLocalAnswer = (questionId: string, answer: string) => {
    const newLocalAnswers = { ...localAnswers, [questionId]: answer };
    setLocalAnswers(newLocalAnswers);
    console.log(newLocalAnswers);
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
            hasEnded={ended}
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
            hasEnded={ended}
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
            hasEnded={ended}
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
            hasEnded={ended}
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
            hasEnded={ended}
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
            hasEnded={ended}
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
            hasEnded={ended}
          />
        );
      default:
        return null;
    }
  };

  return loading ? (
    <Loading data={siteData} />
  ) : (
    <div className="w-full pb-5 sm:pb-20">
      <div className="h-max px-2 py-8 sm:overflow-hidden sm:bg-content2 md:rounded-xl md:px-24 md:py-20 md:shadow-2xl">
        <CompetitionHeader
          session={session}
          users={users}
          data={data}
          siteData={siteData}
        />
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab == t("rewards") && (
          <Rewards siteData={siteData} competition={data} users={users} />
        )}
        {activeTab == t("challenge") && (
          <TracingBeam color1={siteData.color1} color2={siteData.color2}>
            <div
              ref={questionComp}
              className="mx-auto flex w-full flex-col justify-center gap-12 py-12 md:gap-20 md:rounded-3xl"
            >
              {submitted && userComp ? (
                <GameStats
                  competitionTitle={data.title!}
                  userComp={userComp}
                  users={users}
                  color={siteData.color1}
                  compFinished={data.correctAnswersSubmitted}
                  totalPoints={questions?.reduce(
                    (acc, q) => acc + (q.points || 0),
                    0,
                  )}
                />
              ) : null}
              {questions &&
                questions.map((question: SelectQuestion, index: number) => {
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
                <div className="mx-auto rounded-xl bg-danger-200 p-4 text-sm">
                  Competition Ended
                </div>
              ) : submitted ? (
                <div className="mx-auto rounded-xl bg-success-200 p-4 text-sm">
                  Answers Submitted
                </div>
              ) : (
                <SubmitAnswersForm
                  userId={session?.user.id!}
                  userComp={userComp}
                  competitionData={data}
                  siteData={siteData}
                  slug={slug}
                  localAnswers={localAnswers}
                  questions={questions}
                  subscribe={subscribe}
                />
              )}
            </div>
          </TracingBeam>
        )}
        {activeTab == t("leaderboard") && (
          <div className="mt-4">
            <MainLeaderboard
              siteData={siteData}
              session={session}
              compDate={new Date(data.date.replace(/\[.*\]$/, ""))}
              compData={data}
              hasEnded={ended}
            />
          </div>
          // <Leaderboard
          //   siteData={siteData}
          //   competition={data}
          //   users={users}
          //   session={session}
          // />
        )}
      </div>
    </div>
  );
}
