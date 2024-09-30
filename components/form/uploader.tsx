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

export default function Uploader({
  id,
  defaultValue,
  name,
  upload,
  title,
  children,
}: {
  id: string;
  defaultValue: string | null;
  name: string;
  upload: (name: string, value: string) => void;
  title?: string;
  children?: React.ReactNode;
}) {
  const [data, setData] = useState({
    [name]: defaultValue,
  });
  const [file, setFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current && file) {
      // submit the form
      handleSubmit();
    }
  }, [file]);

  const handleSubmit = async () => {
    setSaving(true);
    fetch("/api/upload", {
      method: "POST",
      headers: { "content-type": file?.type || "application/json" },
      body: file || data[name],
    }).then(async (res) => {
      if (res.status === 200) {
        const { url } = await res.json();
        toast(
          <div className="relative">
            <div className="p-2">
              <p className="font-semibold text-gray-900">File uploaded!</p>
              <p className="mt-1 text-sm text-gray-500">
                Your file has been uploaded to{" "}
                <a
                  className="font-medium text-gray-900 underline"
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
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
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
    },
    [setData],
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    // if object data is empty, return true
    return !data[name] || saving;
  }, [data[name], saving]);

  return (
    <form className="grid w-full gap-6" ref={formRef} onSubmit={handleSubmit}>
      <div>
        {title && !children && (
          <div className="mb-4 space-y-1">
            <h2 className="text-xl font-semibold  dark:text-stone-200">
              {capitalize(title)}
            </h2>
            <p className="text-sm  dark:text-stone-200">
              Accepted formats: .png, .jpg, .gif, .mp4
            </p>
          </div>
        )}
        {children ? (
          <label htmlFor={`${id}-upload-${name}`}>
            {saving ? (
              <div className="mx-auto flex h-20 w-20 items-center justify-center bg-transparent">
                <LoadingDots color="white" />
              </div>
            ) : children ? (
              children
            ) : null}
          </label>
        ) : (
          <label
            htmlFor={`${id}-upload-${name}`}
            className="group relative mt-2 flex h-80 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
          >
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
                  if (file.size / 1024 / 1024 > 50) {
                    toast.error("File size too big (max 50MB)");
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
                dragActive ? "border-2 border-black" : ""
              } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
                data[name]
                  ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                  : "bg-white opacity-100 hover:bg-gray-50"
              }`}
            >
              <svg
                className={`${
                  dragActive ? "scale-110" : "scale-100"
                } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
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
              <p className="mt-2 text-center text-sm text-gray-500">
                Drag and drop or click to upload.
              </p>
              <p className="mt-2 text-center text-sm text-gray-500">
                Max file size: 50MB
              </p>
              <span className="sr-only">Photo upload</span>
            </div>
            {data[name] != null && (
              <div className="relative h-full w-full rounded-md">
                <img
                  src={data[name] as string}
                  alt="Preview"
                  // fill={true}
                  // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </label>
        )}

        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id={`${id}-upload-${name}`}
            name={name}
            type="file"
            accept="image/*, video/*"
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      {/* <button
        disabled={saveDisabled}
        className={`${
          saveDisabled
            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
            : "border-black bg-black text-white hover:bg-white hover:text-black"
        } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
      >
        {saving ? (
          <LoadingDots color="#808080" />
        ) : (
          <p className="text-sm">Confirm upload</p>
        )}
      </button> */}
    </form>
  );
}
