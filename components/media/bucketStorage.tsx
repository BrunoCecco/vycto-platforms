"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Uploader from "../form/uploader";
import Form from "../form";
import { Spinner } from "@nextui-org/react";
import { updateCompetitionMetadata, updateSiteReward } from "@/lib/actions";
import { SelectCompetition, SelectSiteReward } from "@/lib/schema";

interface IImage {
  key: string;
  url: string | null;
}

interface BucketStorageProps {
  siteName: string;
  siteId: string;
  entity: "competition" | "siteReward";
  entityData: SelectCompetition | SelectSiteReward;
  bucketName?: string;
  bucketId?: string;
}

export default function BucketStorage({
  siteName,
  siteId,
  entity,
  entityData,
  bucketName,
  bucketId,
}: BucketStorageProps) {
  const [isLoading, setLoading] = useState(true);
  const [name, setName] = useState(bucketName);
  const [id, setId] = useState(bucketId);
  const [files, setFiles] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [compImages, setCompImages] = useState<IImage[]>([
    { key: "image1", url: entityData.image1 },
    {
      key: "image2",
      url: entityData.image2,
    },
    {
      key: "image3",
      url: entityData.image3,
    },
    {
      key: "image4",
      url: entityData.image4,
    },
  ]);

  useEffect(() => {
    const fetchBucket = async () => {
      setLoading(true);
      try {
        if (bucketId && bucketName) {
          const bucket = await fetch(`/api/bucket/${id}`);
          const data = await bucket.json();
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
      await updateEntity(formData, siteId, "bucketName");
      await updateEntity(formData, siteId, "bucketId");
      setId(data.bucketId);
      setName(data.bucketName);
    } catch (error: any) {
      toast.error("Try another name", error);
    }
  };

  const updateEntity = async (formData: FormData, id: string, key: string) => {
    if (entity === "competition") {
      await updateCompetitionMetadata(formData, id, key);
    } else if (entity === "siteReward") {
      await updateSiteReward(formData, entityData.id, key);
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
      await updateEntity(newFormData, siteId, "bucketName");
      await updateEntity(newFormData, siteId, "bucketId");
      setId(undefined);
      setName(undefined);
    } catch (error: any) {
      toast.error(error);
    }
  };

  const handleSubmit = async (formData: FormData, id: string, name: string) => {
    return await updateEntity(formData, id, name);
  };

  return (
    <div className="relative mt-8 flex flex-col items-center justify-center">
      <div className="flex w-full flex-col gap-4">
        {isLoading ? (
          <Spinner />
        ) : id && name ? (
          <div className="flex w-full flex-col gap-4">
            <div className="grid grid-cols-1 items-center justify-center gap-4 md:grid-cols-2 lg:grid-cols-3">
              {compImages &&
                compImages.map((img: IImage, i) => (
                  <Form
                    key={i}
                    title={"Image " + (i + 1)}
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
