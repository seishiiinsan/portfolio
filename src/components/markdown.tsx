import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Prose({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`prose-swiss ${className ?? ""}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => (
            <a href={href} {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}>
              {children}
            </a>
          ),
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
