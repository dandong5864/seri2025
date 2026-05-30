"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

function extractText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (node && typeof node === "object" && "props" in node) {
    const element = node as React.ReactElement<{ children?: React.ReactNode }>;
    return extractText(element.props.children);
  }
  return "";
}

export function CopyCode({ children, flush = false }: { children: React.ReactNode; flush?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const text = extractText(children).trim();

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className={flush ? "relative overflow-hidden bg-[#1e1e1e] text-[#dcdcdc]" : "relative my-10 mx-auto max-w-[860px] overflow-hidden rounded-[14px] border border-[#ddd] bg-[#1e1e1e] text-[#dcdcdc] shadow-[0_8px_25px_rgba(0,0,0,0.15)]"}>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[linear-gradient(135deg,#667eea,#764ba2)] px-5 py-3.5 text-white">
        <span className="text-sm font-semibold">📌 무료 코드 보기</span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-md bg-[#facc15] px-3 text-[13px] font-semibold text-black hover:bg-[#eab308] hover:text-black"
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "접기" : "펼치기"}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-8 rounded-md bg-[#22c55e] px-3 text-[13px] font-semibold text-white hover:bg-[#16a34a] hover:text-white"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "복사됨!" : "복사"}
          </Button>
        </div>
      </div>
      <pre className={expanded ? "max-h-[1000px] overflow-auto p-5 text-sm leading-[1.6]" : "max-h-[120px] overflow-hidden p-5 text-sm leading-[1.6]"}>
        {children}
      </pre>
    </div>
  );
}
