import { ReactNode } from "react";
import { Workspace } from "../components/Workspace";
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Workspace>{children}</Workspace>;
}
