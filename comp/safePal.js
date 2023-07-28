import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

const isSafePalInjected = getSafePalWalletInjectedProvider();

function getSafePalWalletInjectedProvider() {
  let _a;

  const isSafePalWallet = (ethereum) => {
    const safePal2 = !!ethereum.isSafePal;
    return safePal2;
  };
  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  if (!injectedProviderExist) {
    return;
  }
  /*   if (window["safePal"]) {
    return window["safePal"];
  } */
  if (isSafePalWallet(window.ethereum)) {
    return true;
  } else {
    return false;
  }
  if ((_a = window.ethereum) == null ? void 0 : _a.providers) {
    return window.ethereum.providers.find(isSafePalWallet);
  }
}

export const Safepal = ({ chains, projectId, walletConnectVersion = "2" }) => ({
  id: "SafePal",
  name: "SafePal",
  iconUrl: "https://img.bit5.com/wallets/safepal/color-icon.png",
  iconBackground: "#ffffff",

  downloadUrls: {
    android: "https://play.google.com/store/apps/details?id=io.safepal.wallet",
    ios: "https://apps.apple.com/tr/app/safepal-crypto-wallet-btc-nft/id1548297139",
    chrome:
      "https://www.safepal.com/en/download/?utm_source=bit5&utm_campaign=bit5",
  },

  createConnector: () => {
    // console.log("isSafePalWallet: ", getSafePalWalletInjectedProvider());

    //  const connector = getSafePalWalletInjectedProvider()

    const connector = new InjectedConnector({
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
});
