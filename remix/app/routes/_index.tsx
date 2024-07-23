import type { MetaFunction } from "@remix-run/cloudflare";
import { GiftEditor } from "~/components/GiftEditor/index";

export default function Index() {  

  return (
    <div className="p-4">
      <GiftEditor />
    </div>
  );
}
