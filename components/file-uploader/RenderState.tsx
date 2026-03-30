"use client";

import { cn } from "@/lib/utils";
import { ImageIcon, Loader2, Upload, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export function RenderEmptyState({
  isDragActive,
  onBrowse,
}: {
  isDragActive: boolean;
  onBrowse?: () => void;
}) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-16 rounded-full bg-muted mb-4">
        <Upload
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary",
          )}
        />
      </div>

      <div className="space-y-2">
        <p className="text-lg font-semibold text-foreground">
          Upload your files
        </p>
        <p className="text-sm text-muted-foreground">
          Drag and drop files here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Support for multiple file types up to 10MB each
        </p>
      </div>
      <Button className="mt-4" type="button" onClick={onBrowse}>
        Select files
      </Button>
    </div>
  );
}

export function RenderErrorState({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mx-auto size-16 rounded-full bg-destructive/30 mb-4">
        <ImageIcon className={cn("size-6 text-destructive")} />
      </div>
      <div className="space-y-2">
        <p className="text-lg font-semibold text-foreground">Upload Failed</p>
        <p className="text-sm text-muted-foreground">Something went wrong</p>
        <p className="text-xs text-muted-foreground">
          Click or drag files to retry
        </p>
      </div>
      <Button className="mt-4" type="button" onClick={onBrowse}>
        Select files
      </Button>
    </div>
  );
}

export function RenderUploadedState({
  previewUrl,
  isDeleting,
  handleDeleteFile,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleDeleteFile: () => void;
}) {
  return (
    <div>
      <Image
        src={previewUrl}
        alt="Uploaded Files"
        className="object-contain p-2"
        fill
      />
      <Button
        variant="destructive"
        size="icon"
        className={cn("absolute top-4 right-4")}
        onClick={handleDeleteFile}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <XIcon className="size-4" />
        )}
      </Button>
    </div>
  );
}

export function RenderUploadingState({
  progress,
  file,
}: {
  progress: number;
  file: File;
}) {
  return (
    <div className="text-center flex items-center justify-center flex-col">
      <p>{progress}%</p>
      <p className="mt-2 text-sm font-medium text-foreground">Uploading</p>
      <p className="mt-1 text-xs text-muted-foreground truncate max-w-xs">
        {file.name}
      </p>
    </div>
  );
}
