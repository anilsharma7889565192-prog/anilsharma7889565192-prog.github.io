import Image from "next/image";
import fs from "node:fs";
import path from "node:path";
import { images, type ImageSlot } from "@/config/images";

const exists = (file: string) => {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", "images", file));
  } catch {
    return false;
  }
};

type Props = {
  slot: ImageSlot;
  className?: string;
  sizes?: string;
  priority?: boolean;
  shade?: "bottom" | "hero" | "none";
  decorative?: boolean;
};

/** Fills its (positioned, sized) parent. Uses the local file when present, a neutral placeholder otherwise. */
export function Photo({ slot, className = "", sizes = "100vw", priority, shade = "none", decorative }: Props) {
  const { file, alt, position } = images[slot];
  const shadeClass = shade === "bottom" ? "shade-bottom" : shade === "hero" ? "shade-hero" : "";
  const present = exists(file);
  const labelled = present && !decorative;
  return (
    <div className={`photo absolute inset-0 ${shadeClass} ${className}`} role={labelled ? "img" : undefined} aria-label={labelled ? alt : undefined} aria-hidden={labelled ? undefined : true}>
      {present ? (
        <Image src={`/images/${file}`} alt="" fill sizes={sizes} priority={priority} quality={82} style={{ objectPosition: position }} className="md:!object-center" />
      ) : (
        <div className="photo-fallback" />
      )}
    </div>
  );
}
