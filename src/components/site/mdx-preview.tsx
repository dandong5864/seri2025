"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxComponents } from "@/components/site/mdx-components";

export function MDXPreview({ source }: { source: MDXRemoteSerializeResult }) {
  return <MDXRemote {...source} components={mdxComponents} />;
}
