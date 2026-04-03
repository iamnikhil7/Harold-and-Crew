import Image from "next/image";

export default function AttuneLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/Attune_Logo_White_png.png"
      alt="Attune"
      width={size}
      height={size}
      className={className}
    />
  );
}
