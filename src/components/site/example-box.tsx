"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Copy } from "lucide-react";

type ExampleBoxProps = {
  children: ReactNode;
};

function getTextFromNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return getTextFromNode(props.children);
  }

  return "";
}

export function ExampleBox({ children }: ExampleBoxProps) {
  const [copied, setCopied] = useState(false);
  const copyText = useMemo(() => getTextFromNode(children).trim(), [children]);

  async function copyExample() {
    if (!copyText) return;

    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="tipbox">
      <button className="tipbox-copy" type="button" onClick={copyExample}>
        <Copy className="h-4 w-4" />
        {copied ? "복사됨" : "복사"}
      </button>
      <div className="tipbox-content">{children}</div>
    </div>
  );
}
