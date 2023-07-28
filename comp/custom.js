import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

export const rainbowWallet = ({
  chains,
  projectId,
  walletConnectOptions,
  walletConnectVersion = "2",
  ...options
}) => {
  const isBitKeepInjected =
    typeof window !== "undefined" &&
    window.bitkeep !== void 0 &&
    window.bitkeep.ethereum !== void 0 &&
    window.bitkeep.ethereum.isBitKeep === true;
  const shouldUseWalletConnect = !isBitKeepInjected;

  return {
    id: "BitKeep",
    name: "BitKeep",
    iconUrl: "https://img.bit5.com/wallets/safepal/color-icon.png",
    iconBackground: "#0c2f78",
    installed: !shouldUseWalletConnect ? isBitKeepInjected : undefined,
    downloadUrls: {
      android:
        "https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Drainbowkit&utm_source=rainbowkit",
      ios: "https://apps.apple.com/app/apple-store/id1457119021?pt=119997837&ct=rainbowkit&mt=8",
      mobile: "https://rainbow.download?utm_source=rainbowkit",
      qrCode:
        "https://rainbow.download?utm_source=rainbowkit&utm_medium=qrcode",
      browserExtension: "https://rainbow.me/extension?utm_source=rainbowkit",
    },
    createConnector: () => {
      console.log("Bitt: ", shouldUseWalletConnect);
      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({
            projectId,
            chains,
            version: walletConnectVersion,
            options: walletConnectOptions,
          })
        : new InjectedConnector({
            chains,
            options,
          });

      const getUri = async () => {
        const uri = await getWalletConnectUri(connector, walletConnectVersion);
        return isAndroid()
          ? uri
          : isIOS()
          ? `rainbow://wc?uri=${encodeURIComponent(uri)}&connector=rainbowkit`
          : `https://rnbwapp.com/wc?uri=${encodeURIComponent(
              uri
            )}&connector=rainbowkit`;
      };

      return {
        connector,
        mobile: { getUri: shouldUseWalletConnect ? getUri : undefined },
        qrCode: shouldUseWalletConnect
          ? {
              getUri,
              instructions: {
                learnMoreUrl:
                  "https://learn.rainbow.me/connect-to-a-website-or-app?utm_source=rainbowkit&utm_medium=connector&utm_campaign=learnmore",
                steps: [
                  {
                    description:
                      "We recommend putting Rainbow on your home screen for faster access to your wallet.",
                    step: "install",
                    title: "Open the Rainbow app",
                  },
                  {
                    description:
                      "You can easily backup your wallet using our backup feature on your phone.",
                    step: "create",
                    title: "Create or Import a Wallet",
                  },
                  {
                    description:
                      "After you scan, a connection prompt will appear for you to connect your wallet.",
                    step: "scan",
                    title: "Tap the scan button",
                  },
                ],
              },
            }
          : undefined,
      };
    },
  };
};
