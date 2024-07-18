import { optimismSepolia } from 'wagmi/chains';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Config, http } from 'wagmi';

export const wagmiConfig: Config = getDefaultConfig({
    appName: 'Gift Charity Market',
    projectId: 'gift-charity-market',
    chains: [optimismSepolia],
    transports: {
        [optimismSepolia.id]: http("https://sepolia.optimism.io")
    }
});