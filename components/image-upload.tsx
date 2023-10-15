"use client";

import { useState, useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: ImageUploadProps) => {
  // The isMounted is important because it ensures that the component is mounted before rendering.
  // The useEffect hook is used to set the isMounted state to true after the component is mounted.
  // This is necessary because some components may not be mounted during server-side rendering (SSR), and attempting to render them before they are mounted can cause errors.
  // By checking if the component is mounted before rendering, this code helps to prevent such errors.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // for SSR
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      <CldUploadButton
        onUpload={(result: any) => onChange(result.info.secure_url)}
        options={{
          maxFiles: 1,
        }}
        uploadPreset="hpx3wkw0"
      >
        <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center">
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="Upload"
              src={value || "/SteveJobs.png"}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
        <p className="pt-3 text-muted-foreground">
            {value ? "Change" : "Upload"} Image
        </p>
      </CldUploadButton>
    </div>
  );
};

export default ImageUpload;
