import { redirect } from "@remix-run/node";

// PUBLIC_INTERFACE
export const loader = async () => {
  // Redirect root (/) to /planner for SPA entry
  return redirect("/planner");
};

export default function Index() {
  // This component is never rendered; the loader will always redirect.
  return null;
}
