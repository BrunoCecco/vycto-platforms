"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";

import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DocumentPage() {
  const query = useRouter() as { url?: string };
  const url = "as";

  useEffect(() => {
    console.log(query, "URLLL");
  }, [url]);

  return url && typeof url === "string" ? (
    <div className="h-full w-full">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl={url} />
      </Worker>
    </div>
  ) : (
    <div>Document not found</div>
  );
}
