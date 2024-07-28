import { GiftFlag } from "./GiftFlag";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "~/components/ui/tabs"
import { GiftToy } from "./GiftToy";

export function GiftEditor() {
    return (
        <Tabs defaultValue="flag" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="flag">
                    <span className="mr-2">🚩</span>红锦旗
                </TabsTrigger>
                <TabsTrigger value="toy">
                    <span className="mr-2">🛴</span>小玩具
                </TabsTrigger>
            </TabsList>
            <TabsContent value="flag">
                <GiftFlag />
            </TabsContent>
            <TabsContent value="toy">
                <GiftToy />
            </TabsContent>
        </Tabs>
    )
}