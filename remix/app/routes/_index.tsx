import type { MetaFunction } from "@vercel/remix";
import { GiftEditor } from "~/components/GiftEditor/index";

export default function Index() {  

  return (
    <div className="p-4">
      <GiftEditor />
    </div>
  );
}
