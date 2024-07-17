
import { GiftFlag } from "./GiftFlag";


export function GiftEditor({ 
    template, 
    onFinish 
}: {
    template: string;
    onFinish: () => void;
}) {
    switch (template) {
        case "flag": {
            return <GiftFlag />
        }
    }
}