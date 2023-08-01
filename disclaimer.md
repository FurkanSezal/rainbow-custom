<!--
  async function signToLogin() {
    const signature = await walletClient.data.signTypedData({
      account: walletAddress,
      domain: dynamicDomain(chain.id),
      types: types,
      primaryType: 'Disclaimer',
      message: {
        Disclaimer:
          ' By signing this message, you agree to the https://docs.bit5.com/legal/privacy-policy Terms of Service and acknowledge you have read and understand the protocol https://docs.bit5.com/legal/terms-of-service ',
      },
    });
  }

  useEffect(() => {
    if (walletClient.isSuccess) {
      signToLogin();
    }
  }, [walletClient.isSuccess]); -->
