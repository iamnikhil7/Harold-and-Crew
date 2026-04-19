import Image from "next/image";

export default function AttuneLogo({ size = 24, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/brand/logo-white.png"
      alt="Attune"
      width={size}
      height={size}
      className={className}
    />
  );
}
