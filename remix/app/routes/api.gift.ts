import type { LoaderFunction, ActionFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ context, request, params }) => {
};

export const action = async ({
    context, request, params
}: ActionFunction) => {

    switch (request.method) { 
        case "POST": {
            break;
        }
    }
};