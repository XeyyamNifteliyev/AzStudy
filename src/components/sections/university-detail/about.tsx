import { Section } from "./section";

export function AboutSection({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Section title={title}>
      <p className="max-w-3xl leading-relaxed text-foreground">{description}</p>
    </Section>
  );
}
