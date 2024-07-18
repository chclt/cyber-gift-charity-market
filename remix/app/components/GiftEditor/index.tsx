
import { forwardRef, MutableRefObject, useImperativeHandle, useRef } from "react";
import { GiftFlag } from "./GiftFlag";

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs"


export function GiftEditor () {

    return (
        <Tabs defaultValue="flag" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flag">锦旗</TabsTrigger>
                <TabsTrigger value="card">贺卡</TabsTrigger>
            </TabsList>
            <TabsContent value="flag">
                <GiftFlag />
            </TabsContent>
            <TabsContent value="card">
                Null
            </TabsContent>
        </Tabs>
    )
}