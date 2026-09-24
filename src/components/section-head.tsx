import { Rule, SplitText } from "./reveal";

export function SectionHead({ n, label, title }: { n: string; label: string; title?: string }) {
  return (
    <div className="mb-12 md:mb-20">
      <div className="mb-4 flex justify-between font-mono text-xs uppercase text-muted">
        <span>({n})</span>
        <span>{label}</span>
      </div>
      <Rule />
      {title && (
        <SplitText
          as="h2"
          by="word"
          text={title}
          className="mt-8 text-5xl font-medium tracking-[-0.04em] md:text-8xl"
        />
      )}
    </div>
  );
}
