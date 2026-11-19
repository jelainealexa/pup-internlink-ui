"use client";
import { Dashboard } from "./Dashboard";
import { Students } from "./Students";
import { Partners } from "./Partners";
import { Requirements } from "./Requirements";
import { Opportunities } from "./Opportunities";
import { Applications } from "./Applications";
import { Placements } from "./Placements";
import { Progress } from "./Progress";
import { Evaluations } from "./Evaluations";
import { Reports } from "./Reports";
import { Settings } from "./Settings";
import { FeatureProps, useData } from "./shared";
import { RecordState } from "../components/ui";

export type Section =
  | "overview"
  | "students"
  | "partners"
  | "requirements"
  | "internships"
  | "applications"
  | "placements"
  | "progress"
  | "evaluations"
  | "reports"
  | "settings";
export function PortalPage({
  section,
  ...props
}: FeatureProps & { section: Section }) {
  const { account } = useData();
  if (
    account.role !== "Coordinator" &&
    (section === "reports" ||
      (section === "requirements" && account.role === "Company Supervisor") ||
      (section === "partners" && !props.id && !props.parentId) ||
      (props.action &&
        ["edit", "create", "supervisor-create", "supervisor-edit"].includes(
          props.action,
        ) &&
        !["applications", "progress"].includes(section)))
  )
    return (
      <RecordState
        title="Access denied"
        message="This action belongs to the coordinator portal. Your demonstration account can use its own or assigned workflows from the navigation."
      />
    );
  const key = `${section}:${props.parentId ?? ""}:${props.id ?? ""}:${props.action ?? ""}`;
  switch (section) {
    case "overview":
      return <Dashboard />;
    case "students":
      return <Students key={key} {...props} />;
    case "partners":
      return <Partners key={key} {...props} />;
    case "requirements":
      return <Requirements key={key} {...props} />;
    case "internships":
      return <Opportunities key={key} {...props} />;
    case "applications":
      return <Applications key={key} {...props} />;
    case "placements":
      return <Placements key={key} {...props} />;
    case "progress":
      return <Progress key={key} {...props} />;
    case "evaluations":
      return <Evaluations key={key} {...props} />;
    case "reports":
      return <Reports />;
    case "settings":
      return <Settings />;
  }
}
