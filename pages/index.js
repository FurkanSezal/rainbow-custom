import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  getFunctionSelector,
  parseEther,
  recoverMessageAddress,
  verifyMessage,
  verifyTypedData,
  formatEther,
  formatGwei,
} from "viem";
import { getContract, waitForTransaction } from "wagmi/actions";
import { abi } from "../comp/abi";
import { Web3Button } from "@web3modal/react";
import { useWeb3Modal } from "@web3modal/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { usePublicClient, useWalletClient, useAccount, useNetwork, useSignTypedData } from "wagmi";
import { Header } from "../comp/Header";
import { useEffect, useState } from "react";
import zkErc20Abi from "../comp/zkErc20Abi";
import { abiWbnb } from "../comp/abi_wbnb";

export default function Home() {
  const { data: walletClient, isSuccess } = useWalletClient();

  const publicClient = usePublicClient();
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();
  const { chain } = useNetwork();

  const {
    data: signatureData,
    isError: signatureError,
    isLoading,
    isSuccess: signatureSuccess,
    signTypedData,
  } = useSignTypedData({
    account: address,
    domain: {
      name: "Ether Mail",
      version: "1",
      chainId: chain,
      verifyingContract: "0x0000000000000000000000000000000000000000",
    },
    types: {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Message: [{ name: "Message", type: "string" }],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    },
    primaryType: "Message",
    message: {
      Message: {
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

  const [sig, setSig] = useState();

  const [val, setVal] = useState();
  const [addresss, setAddress] = useState(false);

  const { open, close } = useWeb3Modal();

  const treasuryContract = getContract({
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    abi: abiWbnb,
    walletClient,
  });

  const selector = getFunctionSelector({
    type: "function",
    name: "approve",
    inputs: [
      {
        type: "address",
        name: "spender",
        internalType: "address",
      },
      {
        type: "uint256",
        name: "amount",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        type: "bool",
        name: "",
        internalType: "bool",
      },
    ],
    stateMutability: "nonpayable",
  });
  /* 
  console.log(selector);
  console.log(getFunctionSelector("approve(address,uint256)")); */

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
    const signature = await walletClient.signMessage({
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

  async function signToLogin() {}

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
    const gas = await publicClient.estimateContractGas({
      address: "0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F",
      abi: abiWbnb,
      functionName: "deposit",
      args: [], // [69420],
      account: address,
    });
    console.log(formatEther(gas));
    const gasPrice = await publicClient.getGasPrice();
    console.log("estimated gas cost: ", formatEther((gasPrice * gas * 11n) / 10n));
    /*     const tx = await treasuryContract.write.deposit({
      value: "1000",
      gas: formatGwei(gasPrice * gas),
    });
    await waitForTransaction({ hash: tx });
    console.log(tx); */
  }

  useEffect(() => {
    if (isSuccess) {
      /*     signTypedData();
      setSig(signatureData); */
      if (signatureError) {
        console.log("hello");
      }
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
      <div>Sig: {signatureData}</div>
      <div>Valid: {val ? "true" : "false"}</div>
      <button onClick={handleVerify}>verify</button>
      <button onClick={handleGetData}>GetData</button>
    </>
  );
}
