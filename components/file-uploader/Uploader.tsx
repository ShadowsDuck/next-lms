"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderUploadedState,
  RenderUploadingState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string; // file key from S3
  isDeleted: boolean;
  error: boolean;
  objectUrl?: string; // Local url file
  fileType: "image" | "video";
}

interface iAppProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function Uploader({ value, onChange }: iAppProps) {
  const fileUrl = useConstructUrl(value || "");

  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    isDeleted: false,
    error: false,
    fileType: "image",
    key: value,
    objectUrl: fileUrl,
  });

  // Handle upload file
  async function uploadFile(file: File) {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
    }));

    try {
      const response = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to generate presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }

      const { presignedUrl, key } = await response.json();

      // Upload file to S3 via presigned URL and track progress
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // Track upload progress
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentageCompleted = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentageCompleted),
            }));
          }
        };

        // Handle response
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));

            onChange?.(key);

            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error("Upload failed..."));
          }
        };

        // Handle network error
        xhr.onerror = () => {
          reject(new Error("Upload failed"));
        };

        // Upload file to presigned S3 URL
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch {
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
    }
  }

  // Handle rejected files
  function rejectedFiles(fileRejection: FileRejection[]) {
    if (fileRejection.length > 0) {
      const tooManyFiles = fileRejection.find(
        (rejection) => rejection.errors[0].code === "too-many-files",
      );
      const fileSizeToBig = fileRejection.find(
        (rejection) => rejection.errors[0].code === "file-too-large",
      );
      if (tooManyFiles) {
        toast.error("Too many files selected, max is 1 file");
      }
      if (fileSizeToBig) {
        toast.error("File size exceeds the limit of 5MB");
      }
    }
  }

  // Handle delete file
  async function handleDeleteFile() {
    if (fileState.isDeleted || !fileState.objectUrl) return;

    try {
      setFileState((prev) => ({
        ...prev,
        isDeleted: true,
      }));

      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: fileState.key,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to delete file from storage");

        setFileState((prev) => ({
          ...prev,
          isDeleted: true,
          error: true,
        }));
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      onChange?.("");

      setFileState(() => ({
        file: null,
        id: null,
        isDeleted: false,
        objectUrl: undefined,
        progress: 0,
        uploading: false,
        error: false,
        fileType: "image",
      }));

      toast.success("File deleted successfully");
    } catch {
      toast.error("Error deleting file. Please try again");

      setFileState((prev) => ({
        ...prev,
        isDeleted: false,
        error: true,
      }));
    }
  }

  // Handle React-Dropzone to upload file
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState({
        id: uuidv4(),
        file: file,
        uploading: false,
        progress: 0,
        isDeleted: false,
        error: false,
        objectUrl: URL.createObjectURL(file),
        fileType: "image",
      });

      uploadFile(file);
    }
  };

  // Render dropzone content based on file state
  function renderContent() {
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file as File}
        />
      );
    }

    if (fileState.error) {
      return <RenderErrorState onBrowse={open} />;
    }

    if (fileState.objectUrl) {
      return (
        <RenderUploadedState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleted}
          handleDeleteFile={handleDeleteFile}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} onBrowse={open} />;
  }

  // Fix memory leak
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  // React-Dropzone configuration
  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 1024 * 1024 * 5, // 5MB
    onDropRejected: (fileRejections) => {
      rejectedFiles(fileRejections);
    },
    noClick: true,
    noKeyboard: true,
    disabled:
      fileState.uploading || (!!fileState.objectUrl && !fileState.error),
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-72",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {renderContent()}
      </CardContent>
    </Card>
  );
}
