import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  getContract,
  parseEther,
  recoverMessageAddress,
  verifyMessage,
  verifyTypedData,
} from "viem";
//import { getContract } from "wagmi/actions";
import { abi } from "../comp/abi";
import { Web3Button } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import {
  usePublicClient,
  useWalletClient,
  useAccount,
  useNetwork,
} from "wagmi";
import { Header } from "../comp/Header";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: walletClient, isSuccess } = useWalletClient();
  const publicClient = usePublicClient();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const chain = useNetwork();

  const [sig, setSig] = useState();

  const [val, setVal] = useState();
  const [addresss, setAddress] = useState(false);

  const { open, close } = useWeb3Modal();

  const treasuryContract = getContract({
    address: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9",
    abi,
    walletClient,
  });

  async function handleClick() {
    const signature = await walletClient.signTypedData({
      account: address,
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 1,
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
    setSig(signature);

    /*   const blockNumber = await publicClient.getBlockNumber();
    console.log(blockNumber); */
  }

  async function handleSign() {
    const signature = await walletClient.data.signMessage({
      account: address,
      message: "hello world",
    });
    setSig(signature);

    /*     const valid = await verifyMessage({
      address: address,
      message: "hello world",
      signature,
    });

    console.log(valid);

    if (valid) {
      setVal(111);
      console.log("hello");
    }

    const addressxx = await recoverMessageAddress({
      message: "hello world",
      signature,
    });
    setAddress(addressxx); */

    /*     const signer = ethers.utils.verifyMessage(
      hashMessage("hello world"),
      signature
    );

    console.log(signer); */
  }

  async function signToLogin() {
    const signature = await walletClient.data.signTypedData({
      account: address,
      domain: {
        name: "Ether Mail",
        version: "1",
        chainId: 97,
        verifyingContract: "0x0000000000000000000000000000000000000000",
      },
      types: {
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
    setSig(signature);
  }

  async function handleVerify() {
    const domain = {
      name: "Ether Mail",
      version: "1",
      chainId: 1,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    };

    // The named list of all type definitions
    const types = {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    };

    const message = {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    };
    console.log(sig);
    const valid = await verifyTypedData({
      address: address,
      domain,
      types,
      primaryType: "Mail",
      message,
      signature: sig,
    });
    console.log(valid);
    setVal(valid);

    /*     const valid = await verifyMessage({
      address: address,
      message: "hello world",
      signature: sig,
    });

    setVal(valid); */
  }

  async function handleGetData() {
    console.log("contract:", treasuryContract);
    console.log(publicClient);
    const tx = await treasuryContract.read.name([]);
    console.log(tx);
  }

  useEffect(() => {
    if (isSuccess) {
      //signToLogin();
    }
  }, [isSuccess]);

  return (
    <>
      {/*   <div>
        <Web3Button></Web3Button>
      </div> */}
      <div>
        <ConnectButton></ConnectButton>
      </div>
      <button onClick={handleSign}>signMessage</button>
      {/*   <Header></Header> */}
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <button onClick={handleClick}>signTypedData</button>
      <div>Sig: {sig}</div>
      <div>Valid: {val ? "true" : "false"}</div>
      <button onClick={handleVerify}>verify</button>
      <button onClick={handleGetData}>GetData</button>
    </>
  );
}
