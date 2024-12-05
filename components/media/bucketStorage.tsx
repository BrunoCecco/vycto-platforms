"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateCompetitionMetadata, updateSite } from "@/lib/actions";
import Uploader from "../form/uploader";
import Form from "../form";
import { SelectCompetition } from "@/lib/schema";
import { Spinner } from "@nextui-org/react";

interface CompImage {
  key: string;
  url: string | null;
}

export default function BucketStorage({
  siteName,
  siteId,
  competition,
  bucketName,
  bucketId,
}: {
  siteName: string;
  siteId: string;
  competition: SelectCompetition;
  bucketName?: string;
  bucketId?: string;
}) {
  const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState(bucketName);
  const [id, setId] = useState(bucketId);
  const [files, setFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [compImages, setCompImages] = useState<CompImage[]>([
    {
      key: "image2",
      url: competition.image2,
    },
    {
      key: "image3",
      url: competition.image3,
    },
    {
      key: "image4",
      url: competition.image4,
    },
  ]);

  useEffect(() => {
    const fetchBucket = async () => {
      setLoading(true);
      console.log("FETCHING ");
      try {
        if (bucketId && bucketName) {
          const bucket = await fetch(`/api/bucket/${id}`);
          const data = await bucket.json();
          console.log(data);
          setDownloadUrl(data.downloadUrl);
          setFiles(data.files);
        } else {
          await createBucket();
        }
      } catch (error: any) {
        await createBucket();
      }
      setLoading(false);
    };
    fetchBucket();
  }, []);

  const getImageUrl = (
    downloadURL: string,
    fileName: string,
    uploadTimestamp: string,
  ) => {
    return `${downloadURL}/file/${name}/${fileName}?timestamp=${uploadTimestamp}`;
  };

  const createBucket = async () => {
    try {
      const res = await fetch("/api/bucket/create", {
        method: "POST",
        body: JSON.stringify({ siteName }),
      });
      const data = await res.json();
      const formData = new FormData();
      formData.append("bucketId", data.bucketId);
      formData.append("bucketName", data.bucketName);
      await updateSite(formData, siteId, "bucketName");
      await updateSite(formData, siteId, "bucketId");
      setId(data.bucketId);
      setName(data.bucketName);
    } catch (error: any) {
      toast.error("Try another name", error);
    }
  };

  const deleteBucket = async (formData: FormData) => {
    const bucketName = formData.get("bucketName");
    const bucketId = formData.get("bucketId");
    if (!bucketName) {
      toast.error("Please provide a bucket ID.");
      return;
    }

    try {
      const res = await fetch("/api/bucket/delete", {
        method: "POST",
        body: JSON.stringify({ bucketId, bucketName }),
      });
      const data = await res.json();
      let newFormData = new FormData();
      newFormData.append("bucketName", "");
      newFormData.append("bucketId", "");
      await updateSite(newFormData, siteId, "bucketName");
      await updateSite(newFormData, siteId, "bucketId");
      setId(undefined);
      setName(undefined);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSubmit = async (formData: FormData, id: string, name: string) => {
    return await updateCompetitionMetadata(formData, id, name);
    // window.location.reload();
  };

  // if bucketId and bucketName are not provided, show a button to create a new bucket, otherwise show the bucket contents
  return (
    <div className="relative mt-8 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-4">
        {isLoading ? (
          <Spinner />
        ) : id && name ? (
          <div className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Form
                title={"Image 1"}
                description=""
                inputAttrs={{
                  name: "image",
                  type: "file",
                  defaultValue: competition.image || "",
                }}
                handleSubmit={handleSubmit}
              />
              {compImages &&
                compImages.map((img: CompImage, i) => (
                  <Form
                    key={i}
                    title={"Image " + (i + 2)}
                    description=""
                    inputAttrs={{
                      name: img.key,
                      type: "file",
                      defaultValue: img.url || "",
                    }}
                    handleSubmit={handleSubmit}
                    bucketId={id}
                    bucketName={name}
                  />
                ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center">
              <p>No bucket found for this site.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
