import { Star, BadgeCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Section } from "./section";

export interface ReviewRow {
  id: string;
  rating: number;
  text: string;
  authorName: string;
  authorInitials: string;
  verified: boolean;
  authorCountry: string;
  programStudied: string;
}

export function ReviewsSection({
  title,
  emptyLabel,
  rating,
  reviews,
}: {
  title: string;
  emptyLabel: string;
  rating: { rating: number; count: number };
  reviews: ReviewRow[];
}) {
  return (
    <Section
      title={title}
      action={
        rating.count > 0 ? (
          <span className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-cta text-cta" />
            <span className="font-semibold">{rating.rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({rating.count})</span>
          </span>
        ) : null
      }
    >
      {reviews.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-3 p-5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < r.rating
                          ? "h-4 w-4 fill-cta text-cta"
                          : "h-4 w-4 text-border"
                      }
                    />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  “{r.text}”
                </p>
                <div className="flex items-center gap-3 border-t border-border pt-3">
                  <Avatar>
                    <AvatarFallback>{r.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      {r.authorName}
                      {r.verified && (
                        <BadgeCheck className="h-4 w-4 text-verified" />
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.authorCountry} · {r.programStudied}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      )}
    </Section>
  );
}
