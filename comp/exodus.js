import { getWalletConnectConnector } from "@rainbow-me/rainbowkit";
import { InjectedConnector } from "wagmi/connectors/injected";

function getExodusWalletInjectedProvider() {
  const isExodusWallet = (ethereum) => {
    const exodusWallet = !!ethereum.isExodus;
    console.log(ethereum);
    console.log(ethereum.isExodus);
    return exodusWallet;
  };

  const injectedProviderExist =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  if (!injectedProviderExist) {
    return;
  }

  if (window["isExodus"]) {
    return window["isExodus"];
  }

  if (isExodusWallet(window.ethereum)) {
    return window.ethereum;
  }

  if (window.ethereum?.providers) {
    return window.ethereum.providers.find(isExodusWallet);
  }
}
export const exodusWallet = ({
  chains,
  projectId,
  walletConnectVersion = "2",
}) => {
  /* typeof window !== "undefined" && console.log("window", window);
  typeof window !== "undefined" && console.log("eth: ", window.ethereum); */
  const isExodusWalletInjected = Boolean(getExodusWalletInjectedProvider());
  const shouldUseWalletConnect = !isExodusWalletInjected;
  return {
    id: "Exodus",
    name: "Exodus",
    iconUrl: "https://i.imgur.com/E5ywghE.png",
    iconBackground: "#ffffff",
    installed: shouldUseWalletConnect ? isExodusWalletInjected : undefined,

    downloadUrls: {
      chrome:
        "https://www.exodus.com/download/?utm_source=bit5&utm_campaign=bit5",
    },

    createConnector: () => {
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
            return uri;
          },
        },

        qrCode: {
          getUri: async () => {
            const provider = await connector.getProvider();
            const uri = await new Promise((resolve) =>
              provider.once("display_uri", resolve)
            );
            return "https://www.exodus.com/download/";
          },
          instructions: {
            learnMoreUrl:
              "https://www.exodus.com/?utm_source=bit5&utm_campaign=bit5",
            steps: [
              {
                description: "We recommend use Exodus browser extension.",
                step: "install",
                title: "Open the Exodus app",
              },
            ],
          },
        },

        extension: {
          instructions: {
            learnMoreUrl:
              "https://www.exodus.com/?utm_source=bit5&utm_campaign=bit5",
            steps: [
              {
                description:
                  "We recommend pinning Exodus to your taskbar for quicker access to your wallet.",
                step: "install",
                title: "Install the Exodus extension",
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
