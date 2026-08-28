import Image from "next/image";
import { Section } from "./section";

export function GallerySection({
  title,
  name,
  images,
}: {
  title: string;
  name: string;
  images: string[];
}) {
  if (images.length === 0) return null;
  return (
    <Section title={title}>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={src}
              alt={`${name} ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
