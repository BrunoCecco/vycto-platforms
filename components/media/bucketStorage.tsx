"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../buttons/button";
import LoadingDots from "../icons/loadingDots";
import Input from "../input";
import { Database } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { updateCompetitionMetadata, updateSite } from "@/lib/actions";
import Uploader from "../form/uploader";
import Form from "../form";
import { SelectCompetition } from "@/lib/schema";

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
  bucketName?: string | null;
  bucketId?: string | null;
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
      const bucket = await fetch(`/api/bucket/${id}`);
      const data = await bucket.json();
      console.log(data);
      setDownloadUrl(data.downloadUrl);
      setFiles(data.files);
      setLoading(false);
    };
    console.log(id, name);
    if (id && name) {
      fetchBucket();
    }
  }, [bucketId, bucketName, id, name]);

  const getImageUrl = (
    downloadURL: string,
    fileName: string,
    uploadTimestamp: string,
  ) => {
    return `${downloadURL}/file/${name}/${fileName}?timestamp=${uploadTimestamp}`;
  };

  const createBucket = async (formData: FormData) => {
    const bucketname = formData.get("bucketName");
    if (!bucketname) {
      toast.error("Please provide a bucket name.");
      return;
    }
    try {
      const res = await fetch("/api/bucket/create", {
        method: "POST",
        body: JSON.stringify({ bucketName: bucketname }),
      });
      const data = await res.json();
      formData.append("bucketId", data.bucketId);
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
      setId(null);
      setName(null);
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
      {bucketId && bucketName ? (
        <div className="flex w-full flex-col gap-4">
          {isLoading ? (
            <LoadingDots />
          ) : (
            <div className="flex w-full flex-col gap-4">
              {/* <form className="flex items-center gap-4" action={deleteBucket}>
                <p>{bucketName}</p>
                <Input name="bucketName" type="hidden" value={bucketName} />
                <Input name="bucketId" type="hidden" value={bucketId} />
                <DeleteFormButton />
              </form> */}
              <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-3">
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
                      bucketId={bucketId}
                      bucketName={bucketName}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <form className="flex flex-col gap-4" action={createBucket}>
          <h2 className="flex items-center gap-2 text-lg font-bold dark:text-white">
            No Bucket Found
            <Database />
          </h2>
          <p>Create a new bucket to store media.</p>
          <p>
            Note: Bucket name must be alphanumeric or &apos;-&apos; (no spaces).
          </p>
          <Input
            name="bucketName"
            placeholder="Bucket Name"
            defaultValue={siteName.split(" ").join("-") + "-bucket-vycto"}
            onChange={(e) => setName(e.target.value)}
          />
          <FormButton />
        </form>
      )}
    </div>
  );
}

const FormButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoadingDots /> : "Create Bucket"}
    </Button>
  );
};

const DeleteFormButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <LoadingDots /> : "Delete Bucket"}
    </Button>
  );
};
