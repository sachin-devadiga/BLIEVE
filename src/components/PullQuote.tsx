import { Quote } from "lucide-react";

export default function PullQuote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <div className="bg-pale dark:bg-[#1A1A2E] rounded-3xl p-8 md:p-12 relative border border-orange/10">
      <Quote size={48} className="text-orange/20 absolute top-6 right-6" />
      <blockquote className="font-serif text-2xl md:text-3xl font-semibold text-navy dark:text-white leading-snug italic mb-6">
        &ldquo;{children}&rdquo;
      </blockquote>
      {attribution && (
        <p className="text-text-grey dark:text-gray-400 text-sm">
          &mdash; {attribution}
        </p>
      )}
    </div>
  );
}
