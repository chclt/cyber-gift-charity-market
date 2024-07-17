import type { MetaFunction } from "@remix-run/node";
import { GiftEditor } from "~/components/GiftEditor/index";
import { Sidebar } from "~/components/sidebar";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="p-4">
      <GiftEditor template="flag" />
    </div>
  );
}
