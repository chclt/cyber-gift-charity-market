import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import 'node_modules/@rainbow-me/rainbowkit/dist/index.css';
import { Link, useLocation } from "@remix-run/react";
import { useFetchDonateAccountBalance } from "~/hooks/useFetchDonateAccountBalance";
import { formatUnits } from "viem";
import { paymentTokenDecimal } from "~/config/payment-token-contract";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  
}

export function Sidebar({ className }: SidebarProps) {
  const { balance } = useFetchDonateAccountBalance();
  const location = useLocation();

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-4 px-4 text-[3rem] font-semibold tracking-tight">
            🚩
          </h2>
          <div className="space-y-1">
            <Link to={{
              pathname: "/",
            }} >
              <Button variant={location.pathname == "/" ? "secondary" : "ghost"} className="w-full justify-start">
                <span className="mr-2 text-lg">🚩</span>
                 送锦旗
              </Button>
            </Link>

            <Link to={{
              pathname: "/market",
            }} >
              <Button variant={location.pathname == "/market" ? "secondary" : "ghost"} className="w-full justify-start">
                <span className="mr-2 text-lg">🛒</span>
                 市场
              </Button>
            </Link>

            <Link to={{
              pathname: "/my",
            }} >
              <Button variant={location.pathname == "my" ? "secondary" : "ghost"} className="w-full justify-start">
                <span className="mr-2 text-lg">🎁</span>
                 我收到的锦旗
              </Button>
            </Link>
          </div>
          <p className="my-4 px-4"><span className="mr-2 text-lg">💖</span>公益账户: {formatUnits(balance, paymentTokenDecimal)}</p>
          <ConnectButton></ConnectButton>
        </div>
      </div>
    </div>
  )
}