"use client";

import Image from "next/image";

interface TutorAvatarProps {
  src: string;
  alt?: string;
  isOnline?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "size-20",
  md: "size-32 md:size-40",
  lg: "size-40 md:size-48",
};

export function TutorAvatar({
  src,
  alt = "Tutor avatar",
  isOnline = false,
  size = "md",
}: TutorAvatarProps) {
  const sizeMap = { sm: 80, md: 160, lg: 192 };
  const imageSize = sizeMap[size];

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={imageSize}
        height={imageSize}
        className={`${sizeClasses[size]} rounded-full border-4 border-card object-cover shadow-lg`}
      />
      {isOnline && (
        <div className="absolute bottom-2 right-2 size-5 rounded-full border-2 border-card bg-success" />
      )}
    </div>
  );
}
