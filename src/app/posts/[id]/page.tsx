import { PostDetailView } from "@/components/PostDetailView";
import { PageShell } from "@/components/PageShell";

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageShell>
      <PostDetailView postId={id} />
    </PageShell>
  );
}
