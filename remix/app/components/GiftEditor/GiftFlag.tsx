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

import { toBlob, toPng } from "html-to-image";

import "./GiftFlag.css";
import { useRef, useState } from "react";

import { createGift } from "~/lib/common";


export function GiftFlag() {



    const canvas = useRef<HTMLDivElement>();

    const [sender, setSender] = useState("");
    const [receiver, setReceiver] = useState("");
    const [text, setText] = useState("");

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = () => {
        if (!canvas.current) return;

        setIsSubmitting(true);
        
        toBlob(canvas.current)
        .then((blob) => {
            return blob ? new File([blob], "flag.png", {type: "image/png"}) : undefined;
        })
        .then((file) => {
            if (!file) return;
            return createGift(file);
        })
        .finally(() => {
            setIsSubmitting(false);
        })

    }


    return (
        <div className="flex flex-col">
            <form 
                onChange={(e) => {
                    switch (e.target.name) {
                        case "sender":
                            setSender(e.target.value);
                            break;
                        case "receiver":
                            setReceiver(e.target.value);
                            break;
                        case "text":
                            setText(e.target.value);
                            break;
                    }
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                >
                <div className="grid grid-cols-2 gap-4">
                    {
                        ["sender", "receiver", "text"].map((label) => (
                            <div key={label} className="flex flex-col">
                                <label>
                                    <h4 className="text-sm">{label}</h4>
                                    <Input name={label} />
                                </label>
                            </div>
                        ))
                    }

                    <Button 
                        type="submit"
                        disabled={isSubmitting}
                    >Submit</Button>
                </div>
            </form>

            <div ref={canvas} className="" style={{
                width: "375px"
            }}>
                <div className="relative w-full" style={{
                    paddingBottom:"133.136%"
                }}>

                    <img className="absolute inset-0 w-full h-full" src="./images/GiftFlag/bg.jpg" alt="" />
                    <div className="absolute inset-0 flex flex-col justify-between items-stretch" style={{
                            writingMode: "vertical-rl",
                            fontFamily: "LinhaiLishu", 
                            fontWeight: 600,
                            color: "#eaab0c",
                            padding: "15% 15% 25%"
                        }}>
                        <span className="text-[1.75rem] ">{receiver}</span>
                        <span className="text-[3.5rem] self-center">{text}</span>
                        <span className="text-[1.75rem] self-end">{sender}</span>
                    </div>
                </div>
            </div>

    
        </div>
    )
}