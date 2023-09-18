async function estimateGasForTx(contractAddress, contractAbi, func, args, account, publicClient) {
  const gas = await publicClient.estimateContractGas({
    address: contractAddress,
    abi: contractAbi,
    functionName: func,
    args, // [69420],
    account,
  });

  return gas;
}

module.exports = estimateGasForTx;
