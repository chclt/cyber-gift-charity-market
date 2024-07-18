
import { GiftFlag } from "./GiftFlag";


export function GiftEditor({ 
    template, 
    onFinish 
}: {
    template: string;
    onFinish: (file: File) => void;
}) {
    switch (template) {
        case "flag": {
            return <GiftFlag onFinish={file => onFinish(file)} />
        }
    }
}