import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/lib/content";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden transition-transform duration-200 group-hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden">
          <Image src={post.cover} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(min-width: 768px) 33vw, 50vw" />
        </div>
        <CardContent className="p-3 md:p-5">
          <h3 className="line-clamp-2 text-base font-bold md:text-lg">{post.title}</h3>
          <p className="mt-2 hidden line-clamp-2 text-sm text-muted-foreground sm:block">{post.description}</p>
          <p className="mt-3 text-xs text-muted-foreground md:mt-4">{post.category}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
