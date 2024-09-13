import { cn } from "@/lib/utils";
import React, { FC, HTMLAttributes } from "react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { MessageCodeBlock } from "./message-codeblock";
import { MessageMarkdownMemoized } from "./message-markdown-memoized";

interface MessageMarkdownProps extends HTMLAttributes<HTMLDivElement> {
  role: "user" | "assistant";
  content: string;
}

export const MessageMarkdown: FC<MessageMarkdownProps> = ({ content, role, ...props }) => {
  return (
    <MessageMarkdownMemoized
      className={cn("prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 min-w-full break-words", role === "user" ? "text-secondary" : "text-primary", props.className)}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        p({ children }) {
          return <p className="mb-2 last:mb-0">{children}</p>;
        },
        img({ ...props }) {
          return (
            <img
              className="max-w-[67%]"
              {...props}
            />
          );
        },
        code({ className, children, ...props }) {
          const childArray = React.Children.toArray(children);
          const firstChild = childArray[0] as React.ReactElement;
          const firstChildAsString = React.isValidElement(firstChild) ? (firstChild as React.ReactElement).props.children : firstChild;

          if (firstChildAsString === "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>;
          }

          if (typeof firstChildAsString === "string") {
            childArray[0] = firstChildAsString.replace("`▍`", "▍");
          }

          const match = /language-(\w+)/.exec(className || "");

          if (typeof firstChildAsString === "string" && !firstChildAsString.includes("\n")) {
            return (
              <code
                className={className}
                {...props}
              >
                {childArray}
              </code>
            );
          }

          return (
            <MessageCodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(childArray).replace(/\n$/, "")}
              {...props}
            />
          );
        }
      }}
    >
      {content}
    </MessageMarkdownMemoized>
  );
};