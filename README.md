<!-- import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { Safepal } from "../comp/safePal";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  injectedWallet,
  trustWallet,
  walletConnectWallet,
  metaMaskWallet,
} from "@rainbow-me/rainbowkit/wallets";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet],
  [publicProvider()]
);

const Disclaimer = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://termsofservice.xyz">Terms of Service</Link> and
    acknowledge you have read and understand the protocol{" "}
    <Link href="https://disclaimer.xyz">Disclaimer</Link>
  </Text>
);

/* const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "aae3fa2b14df431fd3674300c0ee1b7e",
  chains,
}); */

const projectId = "aae3fa2b14df431fd3674300c0ee1b7e";

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",

    wallets: [
      Safepal({ chains, projectId }),
      injectedWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      trustWallet({ chains, projectId }),
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          appInfo={{
            appName: "Bit5 MarketPlace",
            disclaimer: Disclaimer,
          }}
          chains={chains}
        >
          <Component {...pageProps} />;
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
 -->
