import { type LoaderFunction, type ActionFunction, unstable_parseMultipartFormData, unstable_createMemoryUploadHandler, json } from "@remix-run/node";

import * as Client from '@web3-storage/w3up-client'
import { StoreMemory } from '@web3-storage/w3up-client/stores/memory'
import * as Proof from '@web3-storage/w3up-client/proof'
import { Signer } from '@web3-storage/w3up-client/principal/ed25519'
// import * as DID from '@ipld/dag-ucan/did'
import * as DID from '@ipld/dag-ucan/did'




export const loader: LoaderFunction = async ({ context, request, params }) => {
    return null;
};

export const action = async ({
    context, request, params
}: ActionFunction) => {

    switch (request.method) { 
        case "POST": {
            const userAddress = request.headers.get("origin");
            console.log(userAddress);
            
            const formData = await unstable_parseMultipartFormData(
                request, 
                unstable_createMemoryUploadHandler({
                    maxPartSize: 1024 * 1024 * 10,
                })
            );
            const file = formData.get("file");
            console.log(file);



            console.log(process.env.WEB3STORAGE_KEY, process.env.WEB3STORAGE_PROOF);
            


            // Load client with specific private key
            const principal = Signer.parse(process.env.WEB3STORAGE_KEY)
            const store = new StoreMemory()
            const client = await Client.create({ principal, store })
            // Add proof that this agent has been delegated capabilities on the space
            const proof = await Proof.parse(process.env.WEB3STORAGE_PROOF)
            const space = await client.addSpace(proof)
            await client.setCurrentSpace(space.did())


            // Create a delegation for a specific DID
            const audience = DID.parse(process.env.WEB3STORAGE_DID)
            const abilities = ['space/blob/add', 'space/index/add', 'filecoin/offer', 'upload/add']
            const expiration = Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours from now
            const delegation = await client.createDelegation(audience, abilities, { expiration })
            const archive = await delegation.archive()
            return archive.ok








            const storageClient = await create();
            storageClient.setCurrentSpace(process.env.WEB3STORAGE);



            const cid = await storageClient.uploadFile(file);
            console.log(`https://${cid}.ipfs.w3s.link`);
            


            


            // 200
            return json({ success: true }, 200); 
            
            break;

        }
    }
};