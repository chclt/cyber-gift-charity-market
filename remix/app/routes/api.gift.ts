import { LoaderFunction, ActionFunction, json } from "@vercel/remix";
import {
    unstable_createMemoryUploadHandler,
    unstable_parseMultipartFormData,
} from "@vercel/remix";

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

            const uploadResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${process.env.PINATA_KEY}`
                },
                body: (() => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('pinataMetadata', JSON.stringify({
                        name: file.name,
                    }));
                    formData.append('pinataOptions', JSON.stringify({
                        cidVersion: 0,
                    }));
                    return formData;
                })()
            })

            const uploadResult = await uploadResponse.json();

            const cid = uploadResult.IpfsHash

            return json({
                data: {
                    cid: `${process.env.PINATA_GATEWAY}/ipfs/${cid}`
                },
                success: true
            }, 200)
        }
    }
};