import type { LoaderFunction, ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { App, AppNullable, AppStoreItem, CommonTools, QueryResult } from "~/lib/common";


export interface APIResponse {
    data: App | App[];
    errorMsg?: string;
    log?: any;
}

export const loader: LoaderFunction = async ({ context, request, params }) => {
    const { env }: { env: Env; } = context.cloudflare;
    const ids = new URL(request.url).searchParams.get("id")?.split(",");
    if (!ids) {
        return json((await env.DB.prepare("SELECT * FROM apps limit 10").all()).results, 200);
    } else {
        return json((await env.DB.prepare("SELECT * FROM apps WHERE rowid in (" + ids + ")").all()).results, 200);
    }
};
  
  
  
export const action = async ({
    context, request, params
}: ActionFunction) => {
    const { env }: { env: Env; } = context.cloudflare;

    const Service = new CommonTools({ env });

    switch (request.method) {
        case "POST": {
            const bodyJson = await request.json();
            debugger


            const apps:App[] = Array.isArray(bodyJson) ? bodyJson : [bodyJson];


            const resultIds = [];
            let result = [];
            const log: QueryResult[] = [];

            let index = 0
            for (const app of apps) {
                console.log("Processing:", index++);
                
                try {
                    const appResult = await Service.createApp(app)
                    log.push(appResult);



                    if (appResult.details.insertId) {
                        resultIds.push(appResult.insertId);
                    } else if (appResult.details.updateId) {
                        resultIds.push(appResult.updateId);
                    }
                    
                } catch (e) {
                    log.push({
                        errors: [JSON.stringify(e)],
                        details: { app }
                    });
                    console.error(e);
                    
                }
            }

            try {
                const q = await env.DB.prepare("SELECT rowid,* FROM apps WHERE rowid in (" + resultIds.join(",") + ")").all();
                result = q.results as unknown as App;
            } catch (e) {
                log.push({
                    errors: [e],
                });
            }

        
            return json({ data: result, log }, 200);
        }
        case "PATCH": {
            const id = new URL(request.url).searchParams.get("id");

            if (!id) {
                return json({ error: "No ID provided" }, 422);
            }

            const body: AppNullable = await request.json();

            const result = await Service.updateApp(id, body)

            if (result.success) {
                return json({
                    data: (await Service.getApp(id)).data,
                    success: true,
                }, 200);
            } else {
                return json({
                    success: false,
                }, 500);
            }
            


        }
        case "DELETE": {
            const id = new URL(request.url).searchParams.get("id");

            if (!id) {
                return json({ error: "No ID provided" }, 422);
            }

            const result = await Service.deleteApp(id)

            if (result.success) {
                return json({
                    success: true,
                }, 200);
            } else {
                return json({
                    success: false,
                }, 500);
            }
        }
        default:
            return json({ error: "Method not allowed" }, 405);
    }
};