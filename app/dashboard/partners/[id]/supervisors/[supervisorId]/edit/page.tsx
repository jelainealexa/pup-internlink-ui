import { PortalPage } from "@/app/features/PortalPage";

export default async function Page({
  params: incoming,
}: {
  params: Promise<{ id: string; supervisorId: string }>;
}) {
  const params = await incoming;
  return (
    <PortalPage
      section="partners"
      id={params.supervisorId}
      action="supervisor-edit"
      parentId={params.id}
    />
  );
}
