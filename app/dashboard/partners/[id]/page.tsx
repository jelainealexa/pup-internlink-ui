import { PortalPage } from "@/app/features/PortalPage";

export default async function Page({
  params: incoming,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = await incoming;
  return <PortalPage section="partners" id={params.id} />;
}
