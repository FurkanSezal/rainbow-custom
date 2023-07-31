import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

function getSafePalWalletInjectedProvider() {
  const isSafePalWallet = (ethereum) => {
    // Identify if SafePal Wallet injected provider is present.
    const SafePalWallet = !!ethereum.isSafePal;

    return SafePalWallet;
  };

  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  // No injected providers exist.
  if (!injectedProviderExist) {
    return;
  }

  // SafePal Wallet injected provider is available in the global scope.
  // There are cases that some cases injected providers can replace window.ethereum
  // without updating the ethereum.providers array. To prevent issues where
  // the TW connector does not recognize the provider when TW extension is installed,
  // we begin our checks by relying on TW's global object.
  if (window["isSafePal"]) {
    return window["isSafePal"];
  }

  // SafePal Wallet was injected into window.ethereum.
  if (isSafePalWallet(window.ethereum)) {
    return window.ethereum;
  }

  // SafePal Wallet provider might be replaced by another
  // injected provider, check the providers array.
  if (window.ethereum?.providers) {
    // ethereum.providers array is a non-standard way to
    // preserve multiple injected providers. Eventually, EIP-5749
    // will become a living standard and we will have to update this.
    return window.ethereum.providers.find(isSafePalWallet);
  }
}
export const SafepalV2 = ({
  chains,
  projectId,
  walletConnectVersion = "2",
}) => {
  /* typeof window !== "undefined" && console.log("window", window);
  typeof window !== "undefined" && console.log("eth: ", window.ethereum); */
  const isSafePalWalletInjected = Boolean(getSafePalWalletInjectedProvider());
  const shouldUseWalletConnect = !isSafePalWalletInjected;
  return {
    id: "SafePal",
    name: "SafePal",
    iconUrl: "https://img.bit5.com/wallets/safepal/color-icon.png",
    iconBackground: "#ffffff",

    downloadUrls: {
      chrome:
        "https://www.safepal.com/en/download/?utm_source=bit5&utm_campaign=bit5",
    },

    createConnector: () => {
      const connector = new InjectedConnector({ projectId, chains });
      return {
        connector,
        mobile: {
          getUri: async () => {
            const provider = await connector.getProvider();
            const uri = await new Promise((resolve) =>
              provider.once("display_uri", resolve)
            );
            return uri;
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
