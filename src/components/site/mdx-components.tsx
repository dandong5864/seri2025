import type { MDXComponents } from "mdx/types";
import { ChatGPTButton } from "@/components/site/chatgpt-button";
import { CopyCode } from "@/components/site/copy-code";
import { ExampleBox } from "@/components/site/example-box";
import { FlowButton } from "@/components/site/flow-button";
import { PaidPrompt } from "@/components/site/paid-prompt";

export const mdxComponents: MDXComponents = {
  ChatGPTButton,
  ExampleBox,
  FlowButton,
  PaidPrompt,
  h2: (props) => (
    <h2
      className="mt-12 rounded-br-[28px] rounded-tl-[28px] rounded-tr-sm bg-[linear-gradient(90deg,#ff4fa3,#f5a8df)] px-6 py-4 text-2xl font-bold text-white shadow-sm"
      {...props}
    />
  ),
  h3: (props) => <h3 className="mt-8 text-xl font-bold" {...props} />,
  p: (props) => <p className="mb-8 break-words text-[1.3em] leading-[2]" {...props} />,
  ul: (props) => <ul className="my-6 list-disc space-y-2 pl-6" {...props} />,
  ol: (props) => <ol className="my-6 list-decimal space-y-2 pl-6" {...props} />,
  pre: (props) => <CopyCode>{props.children}</CopyCode>,
  blockquote: (props) => <blockquote className="border-l-4 border-primary bg-muted/50 px-4 py-2 italic" {...props} />
};
