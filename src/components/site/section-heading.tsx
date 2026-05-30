export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      {eyebrow ? <p className="text-sm font-bold text-primary">{eyebrow}</p> : null}
      <h2 className="mt-2 text-2xl font-bold tracking-normal sm:text-3xl">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p> : null}
    </div>
  );
}
