import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Section } from "./section";

export interface FaqRow {
  id: string;
  question: string;
  answer: string;
}

export function UniversityFaqSection({
  title,
  faqs,
}: {
  title: string;
  faqs: FaqRow[];
}) {
  return (
    <Section title={title}>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={f.id}>
            <AccordionTrigger>{f.question}</AccordionTrigger>
            <AccordionContent>{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}
