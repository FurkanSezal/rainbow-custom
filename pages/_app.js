import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  bscTestnet,
  mainnet,
  goerli,
  bsc,
  zkSyncTestnet,
  sepolia,
} from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { EthereumClient } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  trustWallet,
  walletConnectWallet,
  metaMaskWallet,
  rabbyWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Safepal } from "../comp/safePal";
import { exodusWallet } from "../comp/exodus";
import { useEffect, useState } from "react";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, bscTestnet, mainnet, goerli, bsc, zkSyncTestnet],
  [publicProvider()]
);

const projectId = "aae3fa2b14df431fd3674300c0ee1b7e";

export default function App({ Component, pageProps }) {
  const [isSafePal, setSafePal] = useState(false);
  const [count, setCount] = useState(0);
  const [wagmiClient, setWagmiClient] = useState(null);

  useEffect(() => {
    if (count < 5 && !isSafePal) {
      setTimeout(() => {
        if (
          (typeof window !== "undefined" &&
            window.ethereum &&
            window.ethereum.isRabby) ||
          count == 4
        ) {
          const connectors = connectorsForWallets([
            {
              groupName: "Recommended",

              wallets: [
                metaMaskWallet({ chains, projectId }),
                trustWallet({ chains, projectId }),
                walletConnectWallet({ chains, projectId }),
                Safepal({ chains, projectId }),
                exodusWallet({ chains, projectId }),
              ],
            },
          ]);

          setWagmiClient(
            createConfig({
              connectors,
              autoConnect: true,
              publicClient,
              webSocketPublicClient,
            })
          );

          setSafePal(true);
        }
        setCount(count + 1);
      }, 50);
    }
  }, [count]);

  if (!isSafePal) {
    return null;
  }
  return (
    <>
      <WagmiConfig config={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />;
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
