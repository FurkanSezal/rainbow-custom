import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from "wagmi/connectors/injected";

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
  iconUrl: "https://i.imgur.com/B5XcGDg.jpeg",
  iconBackground: "#0c2f78",
  downloadUrls: {
    android:
      "https://play.google.com/store/apps/details?id=io.safepal.wallet&referrer=utm_source%3Dsafepal.com%26utm_medium%3Ddisplay%26utm_campaign%3Ddownload&pli=1",
    ios: "https://apps.apple.com/us/app/my-wallet",
    chrome:
      "https://chrome.google.com/webstore/detail/safepal-extension-wallet/lgmpcpglpngdoalbgeoldeajfclnhafa",
    qrCode: "https://my-wallet/qr",
  },
  createConnector: () => {
    // console.log("isSafePalWallet: ", getSafePalWalletInjectedProvider());

    const connector = getSafePalWalletInjectedProvider()
      ? new InjectedConnector({
          chains,
        })
      : getWalletConnectConnector({ projectId, chains });
    // console.log(connector.getProvider());
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
          return uri;
        },
      },
    };
  },
});
