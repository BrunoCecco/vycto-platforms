"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "../buttons/button";
import LoadingDots from "../icons/loadingDots";
import Input from "../input";
import { Database } from "lucide-react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { updateSite } from "@/lib/actions";
import Uploader from "../form/uploader";

export default function BucketStorage({
  siteName,
  siteId,
  bucketName,
  bucketId,
}: {
  siteName: string;
  siteId: string;
  bucketName?: string | null;
  bucketId?: string | null;
}) {
  const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState(bucketName);
  const [id, setId] = useState(bucketId);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchBucket = async () => {
      setLoading(true);
      const bucket = await fetch(`/api/bucket/${id}`);
      const data = await bucket.json();
      console.log(data);
      setFiles(data.files);
      setLoading(false);
    };
    console.log(id, name);
    if (id && name) {
      fetchBucket();
    }
  }, [bucketId, bucketName, id, name]);

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
      let updatedSite = await updateSite(formData, siteId, "bucketName");
      updatedSite = await updateSite(formData, siteId, "bucketId");
      setId(data.bucketId);
      setName(data.bucketName);
    } catch (error: any) {
      toast.error("Try another name", error);
    }
  };

  const deleteBucket = async (formData: FormData) => {
    const bucketId = formData.get("bucketId");
    if (!bucketId) {
      toast.error("Please provide a bucket ID.");
      return;
    }

    try {
      const res = await fetch("/api/bucket/delete", {
        method: "POST",
        body: JSON.stringify({ bucketId }),
      });
      const data = await res.json();
      const newFormData = new FormData();
      newFormData.append("bucketId", "");
      newFormData.append("bucketName", "");
      let updatedSite = await updateSite(newFormData, siteId, "bucketName");
      updatedSite = await updateSite(newFormData, siteId, "bucketId");
      setId(null);
      setName(null);
    } catch (error: any) {
      toast.error(error);
    }
  };

  // if bucketId and bucketName are not provided, show a button to create a new bucket, otherwise show the bucket contents
  return (
    <div className="relative mt-8 flex flex-col items-center justify-center">
      {bucketId ? (
        <div className="flex w-full flex-col gap-4">
          <h2 className="text-lg font-bold dark:text-white">Bucket Contents</h2>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <div>
              <p>Bucket ID: {bucketId}</p>
              <p>Bucket Name: {bucketName}</p>
              <form className="flex flex-col gap-4" action={deleteBucket}>
                <Input name="bucketId" type="hidden" value={bucketId} />
                <DeleteFormButton />
              </form>
              {files &&
                files?.length > 0 &&
                files.map((file, i) => (
                  // <Uploader key={i} file={file} />
                  <div key={i} className="text-wrap break-all">
                    {JSON.stringify(file)}
                  </div>
                ))}
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
          <p>Note: Bucket name must be alphanumeric or '-'" (no spaces).</p>
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
