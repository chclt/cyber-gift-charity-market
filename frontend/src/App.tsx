import { useEffect, useRef, useState } from 'react'

import './App.css'

import { Account, Client, create } from '@web3-storage/w3up-client'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Space } from '@web3-storage/w3up-client/space';



/**
* @author zhangxinxu(.com)
* @licence MIT
* @description http://www.zhangxinxu.com/wordpress/?p=7362
*/
CanvasRenderingContext2D.prototype.fillTextVertical = function (text, x, y) {
    var context = this;
    var canvas = context.canvas;
    
    var arrText = text.split('');
    var arrWidth = arrText.map(function (letter) {
        return context.measureText(letter).width;
    });
    
    var align = context.textAlign;
    var baseline = context.textBaseline;
    
    if (align == 'left') {
        x = x + Math.max.apply(null, arrWidth) / 2;
    } else if (align == 'right') {
        x = x - Math.max.apply(null, arrWidth) / 2;
    }
    if (baseline == 'bottom' || baseline == 'alphabetic' || baseline == 'ideographic') {
        y = y - arrWidth[0] / 2;
    } else if (baseline == 'top' || baseline == 'hanging') {
        y = y + arrWidth[0] / 2;
    }
    
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    // 开始逐字绘制
    arrText.forEach(function (letter, index) {
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        // 是否需要旋转判断
        var code = letter.charCodeAt(0);
        if (code <= 256) {
            context.translate(x, y);
            // 英文字符，旋转90°
            context.rotate(90 * Math.PI / 180);
            context.translate(-x, -y);
        } else if (index > 0 && text.charCodeAt(index - 1) < 256) {
            // y修正
            y = y + arrWidth[index - 1] / 2;
        }
        context.fillText(letter, x, y);
        // 旋转坐标系还原成初始态
        context.setTransform(1, 0, 0, 1, 0, 0);
        // 确定下一个字符的纵坐标位置
        var letterWidth = arrWidth[index];
        y = y + letterWidth;
    });
    // 水平垂直对齐方式还原
    context.textAlign = align;
    context.textBaseline = baseline;
};



function App() {
    const init = useRef<boolean>(false);
    const canvas = useRef<HTMLCanvasElement | null>(null);


    const storage = useRef<{
        client: Client | undefined;
        account: Account.Account | undefined;
        space: Space | undefined;
    }>({
        client: undefined,
        account: undefined,
        space: undefined,
    });
    
    
    useEffect(() => {
        if (init.current) return;
        init.current = true;

        const initIPFS = async () => {
            const myClient = await create();
            storage.current["client"] = myClient;
            console.log(myClient);

            const myAccount = await myClient.login("meakingchan@gmail.com");
            storage.current['account'] = myAccount;
            console.log(myAccount);


            await myClient.setCurrentSpace("did:key:z6MkvB2bHaNcNXQKjM3QGxniBaGancd7NHJPdFsj2d5Mg7ot");
            const mySpace = myClient.currentSpace();
            storage.current["space"] = mySpace;
            if (!mySpace) {
                throw("space did doesn't exsited")
                return;
            }
            await myAccount.provision(mySpace.did());

        }

        const initCanvas = () => {
            if (canvas.current) {
                canvas.current.width = 338;
                canvas.current.height = 450;
                
                const ctx = canvas.current.getContext("2d");
                const bgImg = new Image()
                bgImg.src = "http://www.ssbbww.com/b/t/h5.jpg";
                bgImg.onload = () => {
                    if (canvas.current) {
                        ctx?.drawImage(bgImg, 0, 0, canvas.current.width, canvas.current.height)
                    }
                }
            }
        }
        initIPFS();
        initCanvas();
    }, [])

    const handleGenImage = (sender: string, receiver: string, text1: string, text2: string) => {
        if (!canvas.current) return;

        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;

        ctx.font = "24px 'Noto Serif SC'";
        ctx.fillStyle = "#eaab0c";
        ctx?.fillTextVertical(`${sender}`, 300, 80);
        ctx?.fillTextVertical(`${receiver}`, 220, 80);

        ctx.font = "48px 'Noto Serif SC'";

        ctx?.fillTextVertical(`${text1}`, 140, 100);
        ctx?.fillTextVertical(`${text2}`, 60, 100);


    }

    const handleUploadImage = async (file: File) => {
        
        if (!storage.current.client) return;
        if (!canvas.current) return;

        console.log(file);
        
        const cid = await storage.current.client.uploadFile(file)


        console.log(`https://${cid}.ipfs.w3s.link`);

        
    }

    return (
        <>
            
            {/* <Input type="file" accept="image/*" onChange={(e) => {e.target.files?.length && handleUploadImage(e.target.files[0])}} /> */}

            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    const data =  Object.fromEntries(new FormData(e.target).entries());
                    handleGenImage(
                        data.sender,
                        data.receiver,
                        data.text1,
                        data.text2,
                    )
                }}
                >
                <div className="grid grid-cols-2 gap-4">
                    {
                        ["sender", "receiver", "text1", "text2"].map((label) => (
                            <div className="flex flex-col">
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

            <span></span>

            <canvas ref={canvas} style={{
                fontFamily: "'Noto Serif SC', serif", 
                fontWeight: 600,
            }}></canvas>

        </>
    )
}

export default App
