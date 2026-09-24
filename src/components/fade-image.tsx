"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/** Image avec fondu à l'apparition sur fond neutre (placeholder léger pour les images distantes). */
export function FadeImage({ className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);
  return (
    <Image
      {...props}
      alt={props.alt}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={`transition-[opacity,filter,scale] duration-700 ease-out-expo ${loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"} ${className ?? ""}`}
    />
  );
}
