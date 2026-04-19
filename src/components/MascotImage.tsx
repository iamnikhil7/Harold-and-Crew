"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { mascot, type MascotName } from "@/lib/mascots";

interface Props extends Omit<ImageProps, "src" | "alt"> {
  name: MascotName;
  alt?: string;
}

/**
 * Renders a mascot from /public/mascots/. If the file 404s (e.g. a crew
 * member hasn't been uploaded yet), it silently falls back to the
 * default Harold image so the layout never breaks.
 */
export default function MascotImage({
  name,
  alt = "",
  ...rest
}: Props) {
  const [src, setSrc] = useState<string>(mascot(name));

  return (
    <Image
      {...rest}
      src={src}
      alt={alt}
      onError={() => {
        if (src !== mascot("harold")) setSrc(mascot("harold"));
      }}
    />
  );
}
