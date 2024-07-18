import { LoaderFunction, ActionFunction, json } from "@remix-run/node";

import {
    unstable_composeUploadHandlers,
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "@remix-run/node"; 

import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import * as Proof from '@web3-storage/w3up-client/proof'
import { Signer } from '@web3-storage/w3up-client/principal/ed25519'

export const loader: LoaderFunction = async ({ context, request, params }) => {
    return null;
};

export const action = async ({
    context, request, params
}: ActionFunction) => {

    switch (request.method) { 
        case "POST": {
            const formData = await unstable_parseMultipartFormData(
                request, 
                unstable_createMemoryUploadHandler({
                    maxPartSize: 1024 * 1024 * 10,
                })
            );
            const file = formData.get("file");


            // Load client with specific private key
            const principal = Signer.parse(process.env.WEB3STORAGE_KEY)
            const store = new StoreMemory()
            const client = await Client.create({ principal, store })
            // Add proof that this agent has been delegated capabilities on the space
            const proof = await Proof.parse(process.env.WEB3STORAGE_PROOF)
            const space = await client.addSpace(proof)
            await client.setCurrentSpace(space.did())

            //   const client = await create()
            const cid = await client.uploadFile(file)

            return json({
                data: {
                    cid: `https://${cid}.ipfs.w3s.link`
                },
                success: true
            }, 200)
        }
    }
};