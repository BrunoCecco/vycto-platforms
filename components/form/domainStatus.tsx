"use client";

import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import LoadingSpinner from "./loadingSpinner";
import { useDomainStatus } from "./useDomainStatus";

export default function DomainStatus({ domain }: { domain: string }) {
  const { status, loading } = useDomainStatus({ domain });

  return loading ? (
    <LoadingSpinner />
  ) : status === "Valid Configuration" ? (
    <CheckCircle2
      fill="#2563EB"
      stroke="currentColor"
      className="dark:text-background text-foreground"
    />
  ) : status === "Pending Verification" ? (
    <AlertCircle
      fill="#FBBF24"
      stroke="currentColor"
      className="dark:text-background text-foreground"
    />
  ) : (
    <XCircle
      fill="#DC2626"
      stroke="currentColor"
      className="text-foreground dark:text-background"
    />
  );
}
