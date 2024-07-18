import type { MetaFunction } from "@remix-run/node";
import { useRef, useState } from "react";
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

  return (
    <div className="p-4">
      <GiftEditor />
    </div>
  );
}
