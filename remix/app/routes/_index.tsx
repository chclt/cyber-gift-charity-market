import type { MetaFunction } from "@remix-run/node";
import { useRef } from "react";
import { GiftEditor } from "~/components/GiftEditor/index";
import { Sidebar } from "~/components/sidebar";
import { Button } from "~/components/ui/button";


import * as Delegation from '@web3-storage/w3up-client/delegation'
import * as Client from '@web3-storage/w3up-client'

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
     
    const res = await fetch("/api/gift", {
      method: "POST",
      body: (() => {
        const formData = new FormData();
        formData.append("file", gift.current);
        return formData;
      })()
    })

      const client = await Client.create()
 
    // Fetch the delegation from the backend
    const data = await res.arrayBuffer();
    
    const delegation = await Delegation.extract(new Uint8Array(data))
    if (!delegation.ok) {
      throw new Error('Failed to extract delegation', { cause: delegation.error })
    }
   
    // Add proof that this agent has been delegated capabilities on the space
    const space = await client.addSpace(delegation.ok)
    client.setCurrentSpace(space.did())

    const cid = await client.upload(gift.current)

    console.log(`${cid}`);
    

    


  }

  return (
    <div className="p-4">
      <GiftEditor template="flag" onFinish={(file) => { gift.current = file }} />
        <Button onClick={() => handleCreateGift()}>Upload</Button>
    </div>
  );
}
