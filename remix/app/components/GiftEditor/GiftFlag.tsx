import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form"

import { toPng } from "html-to-image";

import "./GiftFlag.css";
import { useRef } from "react";

interface GiftFlagProps extends React.HTMLAttributes<HTMLDivElement> {
    options: {
        sender?: string;
        receiver?: string;
        text?: string;
    }
}

export function  GiftFlag({options}: GiftFlagProps) {

    const canvas = useRef<HTMLDivElement>();

    const handleGenImage = () => {
        toPng(canvas.current).then((dataUrl) => {
            const img = new Image();
            img.src = dataUrl;
            document.body.appendChild(img);
        })
    }

    return (
        <div className="flex flex-col">
            <form 
                // onChange={(e) => {
                //     console.log(e.target.value);
                // }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleGenImage();
                }}
                >
                <div className="grid grid-cols-2 gap-4">
                    {
                        ["sender", "receiver", "text1", "text2"].map((label) => (
                            <div key={label} className="flex flex-col">
                                <label>
                                    <h4 className="text-sm">{label}</h4>
                                    <Input name={label} />
                                </label>
                            </div>
                        ))
                    }

                    <Button type="submit">Submit</Button>
                </div>
            </form>

            <div ref={canvas} className="relative" style={{
                width: "375px",
                paddingBottom:"133.136%"
            }}>
                <img className="absolute inset-0 w-full h-full" src="./images/GiftFlag/bg.jpg" alt="" />
                <div className="absolute inset-0 flex flex-col justify-between items-stretch" style={{
                        writingMode: "vertical-rl",
                        fontFamily: "LinhaiLishu", 
                        fontWeight: 600,
                        color: "#eaab0c",
                        padding: "15% 15% 27%"
                    }}>
                    <span className="text-[1.75rem] ">送给某某人</span>
                    <span className="text-[3.5rem] self-center">神医啊</span>
                    <span className="text-[1.75rem] self-end">2020</span>
                </div>
            </div>

            
            <span>{options?.sender ?? ""}</span>
            <span>{options?.receiver ?? ""}</span>
            <span>{options?.text ?? ""}</span>
        </div>
    )
}