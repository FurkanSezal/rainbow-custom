import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, mainnet } from "wagmi/chains";
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
import { SafepalV2 } from "../comp/safePalV2";
import { rainbowWallet } from "../comp/custom";
import { useEffect, useState } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [bscTestnet, mainnet],
  [publicProvider()]
);

const Disclaimer = ({ Text, Link }) => (
  <Text>
    By connecting your wallet, you agree to the{" "}
    <Link href="https://docs.bit5.com/legal/privacy-policy">
      Terms of Service
    </Link>{" "}
    and acknowledge you have read and understand the protocol{" "}
    <Link href="https://docs.bit5.com/legal/terms-of-service">Disclaimer</Link>
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
      metaMaskWallet({ chains, projectId }),
      Safepal({ chains, projectId }),
      injectedWallet({ chains }),
      walletConnectWallet({ chains, projectId }),
      trustWallet({ chains, projectId }),
      SafepalV2({ chains, projectId }),
      rainbowWallet({ chains, projectId }),
    ],
  },
]);

console.log(metaMaskWallet);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }) {
  const [a, b] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      b(true);
    }, 500);
  }, []);

  if (!a) {
    return null;
  }
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider
          coolMode
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
