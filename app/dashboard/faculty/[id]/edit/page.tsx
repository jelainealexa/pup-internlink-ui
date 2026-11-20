import { PortalPage } from "../../../../features/PortalPage";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PortalPage section="faculty" id={id} action="edit" />;
}
