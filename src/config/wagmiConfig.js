import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Web3 Ads",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID",
  chains: [sepolia],
  ssr: false,
});
