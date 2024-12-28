"use client";

import LoadingDots from "@/components/icons/loadingDots";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import {
  deleteCompetition,
  submitAnswers,
  updateUserCompetitionMetadata,
} from "@/lib/actions";
import va from "@vercel/analytics";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { Button, Checkbox, CheckboxGroup, Spinner } from "@nextui-org/react";
import {
  SelectCompetition,
  SelectSite,
  SelectUserCompetition,
} from "@/lib/schema";
import Link from "next/link";
import { Modal, ModalBody, ModalContent } from "@/components/ui/animatedModal";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function SubmitAnswersForm({
  userId,
  userComp,
  competitionData,
  siteData,
  slug,
  localAnswers,
}: {
  userId: string | null;
  userComp: SelectUserCompetition | undefined;
  competitionData: SelectCompetition;
  siteData: SelectSite;
  slug: string;
  localAnswers: { [key: string]: string };
}) {
  const { data: session } = useSession();
  const posthog = usePostHog();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState<string>("");
  const [hasChecked, setHasChecked] = useState(true);
  const [hasCheckedAdditional, setHasCheckedAdditional] = useState(true);

  const updateCompetitionConsent = async () => {
    if (userComp) {
      const formData = new FormData();
      formData.append("additionalConsent", "true");
      const updated = await updateUserCompetitionMetadata(
        userId || "",
        competitionData.id,
        formData,
        "additionalConsent",
      );
      if (updated) {
        toast.success("Updated consent");
      } else {
        toast.error("Failed to update consent");
      }
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!session && !userId) {
      // If not logged in, redirect to login page
      signIn(undefined, { callbackUrl: `/comp/${slug}` });
      return;
    }

    try {
      if (hasCheckedAdditional) {
        const updatedUserComp = await updateCompetitionConsent();
      }
      const res = await submitAnswers(
        userId!,
        competitionData.id,
        localAnswers,
      );
      console.log("res", res);
      if ("error" in res && res.error) {
        toast.error(res.error);
      } else {
        posthog?.capture("answers_submitted");
        va.track("Submitted Answers");
        toast.success(`Successfully submitted answers!`);
        // window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred while submitting answers.");
    }
  };

  const openRules = () => {
    setModalUrl(competitionData.rules || "");
    setModalOpen(true);
  };

  const openTerms = () => {
    setModalUrl(
      siteData.terms ||
        "https://f005.backblazeb2.com/file/vyctobucket/vycto-com-terms%26conditions....pdf",
    );
    setModalOpen(true);
  };

  const openPrivacy = () => {
    setModalUrl(
      siteData.privacypolicy ||
        "https://f005.backblazeb2.com/file/vyctobucket/vycto-com-privacy-policy....pdf",
    );
    setModalOpen(true);
  };

  return (
    <>
      <form action={handleSubmit} className="rounded-lg px-8 pb-8">
        <div className="flex flex-col items-center justify-center gap-4 space-y-2 rounded-lg border border-success-600 p-3 text-sm">
          <p className="text-center">
            Once submitted, you will not be able to edit your answers.
          </p>
          <p>
            <CheckboxGroup
              defaultValue={[
                "rules-consent",
                "consent-additional",
                "newsletter-consent",
              ]}
              className="text-sm"
            >
              <Checkbox
                value="rules-consent"
                defaultChecked
                classNames={{
                  label: "text-xs sm:text-sm",
                }}
                onChange={(e) => setHasChecked(e.target.checked)}
              >
                Accept to participate in the &apos;{competitionData.title}&apos;
                competition.
              </Checkbox>
              <div>
                I accept the{" "}
                {competitionData.rules ? (
                  <span
                    onClick={openRules}
                    className="cursor-pointer text-primary"
                  >
                    Rules,
                  </span>
                ) : null}{" "}
                <span
                  onClick={openTerms}
                  className="cursor-pointer text-primary"
                >
                  Terms
                </span>
                , and{" "}
                <span
                  onClick={openPrivacy}
                  className="cursor-pointer text-primary"
                >
                  Privacy Policy
                </span>
                .
              </div>
              {competitionData.consent ? (
                <Checkbox
                  value="consent-additional"
                  defaultChecked
                  classNames={{
                    label: "text-xs sm:text-sm",
                  }}
                  onChange={(e) => setHasCheckedAdditional(e.target.checked)}
                >
                  {competitionData.consent}
                </Checkbox>
              ) : null}
              <Checkbox
                value="newsletter-consent"
                defaultChecked
                classNames={{
                  label: "text-xs sm:text-sm",
                }}
              >
                {" "}
                I would like to join the {siteData.name} Newsletter and receive
                updates, news, and exclusive offers (Optional).
              </Checkbox>
            </CheckboxGroup>
          </p>
          <FormButton disabled={!hasChecked || !hasCheckedAdditional} />
        </div>
      </form>
      <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
        <ModalBody>
          <ModalContent>
            {modalUrl && modalUrl != "" && (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <Viewer fileUrl={modalUrl} />
              </Worker>
            )}
          </ModalContent>
        </ModalBody>
      </Modal>
    </>
  );
}

function FormButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  const [clicked, setClicked] = useState(false);

  return (
    <Button
      className={cn(
        "flex items-center justify-center space-x-2 rounded-full border p-4 text-sm transition-all focus:outline-none sm:h-10",
        pending
          ? "cursor-not-allowed "
          : "border-success-600 bg-success-600  bg-transparent hover:text-success-600",
      )}
      isDisabled={pending || disabled}
      type="submit"
    >
      {pending ? (
        <Spinner />
      ) : clicked ? (
        <p>Submitted</p>
      ) : (
        <p>Submit Answers</p>
      )}
    </Button>
  );
}
