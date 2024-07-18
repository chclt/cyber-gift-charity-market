import type { MetaFunction } from "@remix-run/node";
import { useRef } from "react";
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
  const gift = useRef<File | null>(null);

  const handleCreateGift = async () => {
    console.log(gift.current);

    if (!gift.current) return;
     
    fetch("/api/gift", {
      method: "POST",
      body: (() => {
        const formData = new FormData();
        formData.append("file", gift.current);
        return formData;
      })()
    })
  }

  return (
    <div className="p-4">
      <GiftEditor template="flag" onFinish={(file) => { gift.current = file }} />
        <Button onClick={() => handleCreateGift()}>Upload</Button>
    </div>
  );
}
