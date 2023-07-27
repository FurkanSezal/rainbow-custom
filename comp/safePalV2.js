import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

function isSafePal(ethereum) {
  const isSafePal = Boolean(ethereum.isSafePal);

  if (!isSafePal) {
    return false;
  }

  return true;
}

export const SafepalV2 = ({
  chains,
  projectId,
  walletConnectVersion = "2",
}) => {
  const isSafePalInjected =
    typeof window !== "undefined" &&
    typeof window.ethereum !== "undefined" &&
    isSafePal(window.ethereum);
  const shouldUseWalletConnect = !isSafePalInjected;

  return {
    id: "SafePalV2",
    name: "SafePalV2",
    iconUrl: "https://img.bit5.com/wallets/safepal/color-icon.png",
    iconBackground: "#ffffff",
    installed: shouldUseWalletConnect ? isSafePalInjected : undefined,

    downloadUrls: {
      android:
        "https://play.google.com/store/apps/details?id=io.safepal.wallet",
      ios: "https://apps.apple.com/tr/app/safepal-crypto-wallet-btc-nft/id1548297139",
      chrome:
        "https://www.safepal.com/en/download/?utm_source=bit5&utm_campaign=bit5",
    },

    createConnector: () => {
      console.log("shouldUseWalletConnect: ", shouldUseWalletConnect);
      console.log("_isSafePalInjected", isSafePalInjected);

      const connector = shouldUseWalletConnect
        ? getWalletConnectConnector({
            projectId,
            chains,
            version: walletConnectVersion,
          })
        : new InjectedConnector({
            chains,
          });
      return {
        connector,
        mobile: {
          getUri: async () => {
            const provider = await connector.getProvider();
            const uri = await new Promise((resolve) =>
              provider.once("display_uri", resolve)
            );
            return "https://www.safepal.com/en/download/?utm_source=bit5&utm_campaign=bit5";
          },
        },

        qrCode: {
          getUri: async () => {
            const provider = await connector.getProvider();
            const uri = await new Promise((resolve) =>
              provider.once("display_uri", resolve)
            );
            return "https://www.safepal.com/en/download/";
          },
          instructions: {
            learnMoreUrl:
              "https://www.safepal.com/?utm_source=bit5&utm_campaign=bit5",
            steps: [
              {
                description: "We recommend use SafePal browser extension.",
                step: "install",
                title: "Open the SafePal app",
              },
            ],
          },
        },

        extension: {
          instructions: {
            learnMoreUrl:
              "https://www.safepal.com/?utm_source=bit5&utm_campaign=bit5",
            steps: [
              {
                description:
                  "We recommend pinning SafePal to your taskbar for quicker access to your wallet.",
                step: "install",
                title: "Install the SafePal extension",
              },
              {
                description:
                  "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
                step: "create",
                title: "Create or Import a Wallet",
              },
              {
                description:
                  "Once you set up your wallet, click below to refresh the browser and load up the extension.",
                step: "refresh",
                title: "Refresh your browser",
              },
            ],
          },
        },
      };
    },
  };
};
