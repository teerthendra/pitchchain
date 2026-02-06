import {
  getDefaultConfig,
  sepolia
} from '@rainbow-me/rainbowkit'
import { wagmiConfig } from './wagmiConfig.js'

export const rainbowConfig = getDefaultConfig({
  appName: 'Web3 Ads Platform',
  projectId: 'YOUR_PROJECT_ID', // walletconnect.org से free मिलेगा
  chains: [sepolia],
  ssr: false,
})
