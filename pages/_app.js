import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, mainnet, goerli, bsc, zkSyncTestnet } from "wagmi/chains";
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
  [bscTestnet, mainnet, goerli, bsc, zkSyncTestnet],
  [publicProvider()]
);

const projectId = "aae3fa2b14df431fd3674300c0ee1b7e";

export default function App({ Component, pageProps }) {
  const [isSafePal, setSafePal] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < 5 && !isSafePal) {
      setTimeout(() => {
        if (
          (typeof window !== "undefined" &&
            window.ethereum &&
            window.ethereum.isRabby &&
            window.ethereum.isExodus) ||
          count == 4
        )
          setSafePal(true);
        setCount(count + 1); // Increment the count after execution
      }, 50);
    }
  }, [count]); // Add the count to the dependency array

  if (!isSafePal) {
    return null;
  }

  console.log(window.ethereum);

  const connectors = connectorsForWallets([
    {
      groupName: "Recommended",

      wallets: [
        metaMaskWallet({ chains, projectId }),
        walletConnectWallet({ chains, projectId }),
        trustWallet({ chains, projectId }),
        Safepal({ chains, projectId }),
        rabbyWallet({ chains, projectId }),
        exodusWallet({ chains, projectId }),
      ],
    },
  ]);

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    webSocketPublicClient,
  });

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <Component {...pageProps} />;
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
