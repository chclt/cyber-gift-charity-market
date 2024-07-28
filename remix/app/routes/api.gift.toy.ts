import { LoaderFunction, ActionFunction, json } from "@vercel/remix";

export const loader: LoaderFunction = async ({ context, request, params }) => {
    const taskId = new URL(request.url).searchParams.get("task_id");

    const result = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.TRIPO_SECRET}`
        }
    })

    const jsonRes = await result.json();

    return json({
        data: jsonRes.data,
        success: true
    }, 200)
};

export const action = async ({
    context, request, params
}: ActionFunction) => {

    switch (request.method) {
        case "POST": {
            const bodyJson = await request.json();
            const { prompt } = bodyJson;

            const result = await fetch("https://api.tripo3d.ai/v2/openapi/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.TRIPO_SECRET}`
                },
                body: JSON.stringify({
                    "type": "text_to_model",
                    "prompt": prompt
                })
            })

            const jsonRes = await result.json();

            return json({
                data: jsonRes.data,
                success: true
            }, 200)
        }
    }
};