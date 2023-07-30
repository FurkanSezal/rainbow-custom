import { useAccount, useConnect, useWalletClient } from "wagmi";

export const Header = () => {
  const { connector: activeConnector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const walletClient = useWalletClient();
  const { address, isConnecting, isDisconnected } = useAccount();

  async function handleSign() {
    const signature = await walletClient.data.signTypedData({
      account: address,
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 97,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      types: {
        EIP712Domain: [
          {
            name: "name",
            type: "string",
          },
          {
            name: "version",
            type: "string",
          },
          {
            name: "chainId",
            type: "uint256",
          },
          {
            name: "verifyingContract",
            type: "address",
          },
        ],
        Person: [
          { name: "name", type: "string" },
          { name: "wallet", type: "address" },
        ],
        Mail: [
          { name: "from", type: "Person" },
          { name: "to", type: "Person" },
          { name: "contents", type: "string" },
        ],
      },
      primaryType: "Mail",
      message: {
        from: {
          name: "Cow",
          wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
        },
        to: {
          name: "Bob",
          wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
        },
        contents: "Hello, Bob!",
      },
    });

    console.log(signature);
  }

  return (
    <>
      {/*   {isConnected && <div>Connected to {activeConnector.name}</div>} */}

      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {isLoading &&
            pendingConnector?.id === connector.id &&
            " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
      <div>{address}</div>
      <button onClick={handleSign}>Sign</button>
    </>
  );
};
