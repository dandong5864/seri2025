import paidPrompts from "@/content/paid-prompts.json";

export type PaidPrompt = {
  id: string;
  title: string;
  description: string;
  price: string;
  cover?: string;
  ctaLabel: string;
  href: string;
  previewLines: string[];
  updatedAt: string;
};

export function getPaidPrompts(): PaidPrompt[] {
  return paidPrompts as PaidPrompt[];
}

export function getPaidPrompt(id: string) {
  return getPaidPrompts().find((prompt) => prompt.id === id);
}
