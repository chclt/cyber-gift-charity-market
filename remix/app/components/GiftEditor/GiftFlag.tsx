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

interface GiftFlagProps extends React.HTMLAttributes<HTMLDivElement> {
    options: {
        sender?: string;
        receiver?: string;
        text?: string;
    }
}

export function GiftFlag({options}: GiftFlagProps) {
    return (
        <div className="flex flex-col">
            <form 
                onChange={(e) => {
                    console.log(e.target.value);
                }}
                // onSubmit={(e) => {
                //     e.preventDefault();
                //     const data =  Object.fromEntries(new FormData(e.target).entries());
                //     handleGenImage(
                //         data.sender,
                //         data.receiver,
                //         data.text1,
                //         data.text2,
                //     )
                // }}
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
            <span>{options?.sender ?? ""}</span>
            <span>{options?.receiver ?? ""}</span>
            <span>{options?.text ?? ""}</span>
        </div>
    )
}