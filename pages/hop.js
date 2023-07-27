/* import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { bscTestnet, mainnet } from "wagmi/chains";

const chains = [bscTestnet, mainnet];
const projectId = "aae3fa2b14df431fd3674300c0ee1b7e";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});
const ethereumClient = new EthereumClient(wagmiConfig, chains);

export default function App({ Component, pageProps }) {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />;
      </WagmiConfig>
      <Web3Modal
        explorerRecommendedWalletIds={[
          "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
          "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
          "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
        ]}
        projectId={projectId}
        ethereumClient={ethereumClient}
      />
    </>
  );
}
 */
