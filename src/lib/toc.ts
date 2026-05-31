import type { ReactNode } from "react";

export type TocItem = {
  id: string;
  title: string;
};

export function createHeadingId(text: string) {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getTextFromReactNode(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getTextFromReactNode).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode };
    return getTextFromReactNode(props.children);
  }

  return "";
}

export function getTableOfContents(content: string): TocItem[] {
  const usedIds = new Map<string, number>();

  return Array.from(content.matchAll(/^##\s+(.+)$/gm)).map((match) => {
    const rawTitle = match[1].replace(/<[^>]*>/g, "").trim();
    const baseId = createHeadingId(rawTitle) || "section";
    const count = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, count + 1);

    return {
      id: count === 0 ? baseId : `${baseId}-${count + 1}`,
      title: rawTitle
    };
  });
}
