"use client";

import {
  useState,
  useCallback,
  useMemo,
  ChangeEvent,
  useRef,
  useEffect,
} from "react";
import { toast } from "sonner";
import LoadingDots from "@/components/icons/loadingDots";
import Image from "next/image";
import { capitalize } from "@/lib/utils";
import { Button } from "@nextui-org/react";
import { PencilIcon, X } from "lucide-react";
import { Input, Spinner } from "@nextui-org/react";

export default function Uploader({
  id,
  defaultValue,
  name,
  upload,
  title,
  description,
  children,
  bucketId,
  bucketName,
  maxFileSize = 50,
  circular = false,
}: {
  id: string;
  defaultValue: string | null;
  name: string;
  upload: (name: string, value: string) => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  bucketId?: string;
  bucketName?: string;
  maxFileSize?: number;
  circular?: boolean;
}) {
  const [data, setData] = useState({
    [name]: defaultValue == "" ? null : defaultValue,
  });
  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);
  const [removing, setRemoving] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && file) {
      // submit the form
      handleSubmit();
    }
  }, [file]);

  const handleSubmit = async (file_?: File) => {
    setSaving(true);
    const url = bucketId
      ? `/api/bucket/${bucketId}/${bucketName}/upload`
      : "/api/upload";
    fetch(url, {
      method: "POST",
      headers: {
        "content-type": file?.type || file_?.type || "application/json",
      },
      body: file_ || file || data[name],
    }).then(async (res) => {
      if (res.status === 200) {
        const { url } = await res.json();
        toast(
          <div className="relative">
            <div className="p-2">
              <p className="font-semibold ">File uploaded!</p>
              <p className="mt-1 text-sm ">
                Your file has been uploaded to{" "}
                <a
                  className="font-medium  underline"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {url}
                </a>
              </p>
            </div>
          </div>,
        );
        upload(name, url);
      } else {
        const error = await res.text();
        toast.error(error);
      }
      setSaving(false);
    });
  };

  const onChangePicture = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      setSaving(true);
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > maxFileSize) {
          toast.error(`File size too big (max ${maxFileSize}MB)`);
        } else {
          // remove current file
          if (data[name] != null) {
            await replaceFile(data[name], file);
          } else {
            setFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
              setData((prev) => ({
                ...prev,
                [name]: e.target?.result as string,
              }));
            };
            reader.readAsDataURL(file);
          }
        }
      }
      setSaving(false);
    },
    [setData],
  );

  const [saving, setSaving] = useState(false);

  const replaceFile = async (url: string | null, file: File) => {
    try {
      setRemoving(true);
      const res = await fetch("/api/delete/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url,
          bucketid: bucketId || process.env.BACKBLAZE_BUCKET_ID,
        }),
      });
      console.log(res);
      toast.success("File deleted successfully");
      handleSubmit(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setData((prev) => ({
          ...prev,
          [name]: e.target?.result as string,
        }));
        setRemoving(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to delete");
      upload(name, "");
      setData((prev) => ({
        ...prev,
        [name]: null,
      }));
      setRemoving(false);
    }
  };

  const removeFile = async (url: string | null) => {
    try {
      setRemoving(true);
      const res = await fetch("/api/delete/", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          url: url || data[name],
          bucketid: bucketId || process.env.BACKBLAZE_BUCKET_ID,
        }),
      });
      console.log(res);
      toast.success("File deleted successfully");
      upload(name, "");
      setData((prev) => ({
        ...prev,
        [name]: null,
      }));
      setRemoving(false);
      return res;
    } catch (error) {
      toast.error("Failed to delete");
      upload(name, "");
      setData((prev) => ({
        ...prev,
        [name]: null,
      }));
      setRemoving(false);
    }
  };

  return (
    <div className="relative grid w-full gap-6 rounded-lg border p-5">
      <form
        className=""
        key={`${id}-upload-${name}-form`}
        ref={formRef}
        onSubmit={() => handleSubmit()}
      >
        <div>
          {title && (
            <div className="mb-4 space-y-1  ">
              <h2 className="text-xl font-semibold">{capitalize(title)}</h2>
              <p className="text-sm  ">{description}</p>
            </div>
          )}
          {children ? (
            <label htmlFor={`${id}-upload-${name}`}>
              {saving || removing ? <Spinner /> : children ? children : null}
            </label>
          ) : (
            <label
              htmlFor={`${id}-upload-${name}`}
              className={`group relative mt-2 flex cursor-pointer flex-col items-center justify-center border shadow-sm transition-all 
                ${circular ? "mx-auto h-[150px] w-[150px] rounded-full" : "h-64  rounded-md lg:h-80"}`}
            >
              {/* <div className="relative mx-auto h-[150px] w-[150px] cursor-pointer ">
        {image && image != null && image != "" ? (
          <Image
            className="h-full w-full rounded-full object-contain"
            fill
            alt={"Image"}
            src={image}
          />
        ) : (
          <Image
            className="h-full w-full rounded-full object-contain"
            fill
            alt="Profile Image"
            src={`https://avatar.vercel.sh/image`}
          />
        )}

      </div> */}

              <div
                className="absolute z-[5] h-full w-full rounded-md"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragEnter={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDragActive(false);

                  const file = e.dataTransfer.files && e.dataTransfer.files[0];
                  if (file) {
                    if (file.size / 1024 / 1024 > maxFileSize) {
                      toast.error(`File size too big (max ${maxFileSize}MB)`);
                    } else {
                      setFile(file);
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setData((prev) => ({
                          ...prev,
                          [name]: e.target?.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }
                }}
              />
              <div
                className={`${
                  dragActive ? "border-2 border-background" : ""
                } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
                  data[name]
                    ? "opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                    : "opacity-100 "
                }`}
              >
                <svg
                  className={`${
                    dragActive ? "scale-110" : "scale-100"
                  } h-7 w-7  transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                  <path d="M12 12v9"></path>
                  <path d="m16 16-4-4-4 4"></path>
                </svg>
                <p className="mt-2 text-center text-sm ">
                  Drag and drop or click to upload.
                </p>
                <p className="mt-2 text-center text-sm ">
                  Max file size: {maxFileSize}MB
                </p>
                <span className="sr-only">Photo upload</span>
              </div>
              {saving && (
                <div className="mx-auto flex h-20 w-20 items-center justify-center bg-transparent">
                  <Spinner />
                </div>
              )}
              {data[name] && !saving && (
                <div
                  className={`relative h-full w-full ${circular ? "rounded-full" : "rounded-md"}`}
                >
                  <Image
                    src={data[name] as string}
                    alt="Preview"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`h-full w-full object-contain ${circular ? "rounded-full" : "rounded-md"}`}
                  />
                </div>
              )}
              <div className="absolute -bottom-0 -right-0 h-10 w-10 rounded-full border-2 bg-background p-2">
                <PencilIcon className="h-full w-full " />
              </div>
            </label>
          )}

          {/* <div className="mt-1 flex rounded-md shadow-sm"> */}
          <Input
            id={`${id}-upload-${name}`}
            key={`${id}-upload-${name}`}
            name={name}
            type="file"
            accept="image/*, video/*"
            className="sr-only hidden"
            onChange={onChangePicture}
          />
          {/* </div> */}
        </div>
      </form>
      {data[name] && data[name] != "" && (
        <Button
          onClick={(e: any) => removeFile(null)}
          className="absolute right-0 top-0 min-w-0 border-none !p-2 font-bold"
          variant="bordered"
        >
          {removing ? null : (
            <X size={18} absoluteStrokeWidth={true} color="red" />
          )}
        </Button>
      )}
    </div>
  );
}
