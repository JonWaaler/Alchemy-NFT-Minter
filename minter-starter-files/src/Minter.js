import { useEffect, useState } from "react";
import { connectWallet, mintNFT } from "./utils/interact.js";

const Minter = (props) => {
  //State variables
  const [isConnected, setConnectedStatus] = useState(false);
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");

  // This displays our metamask address on the website
  useEffect(async () => {
    if (window.ethereum) {
      //if Metamask installed
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        }); //get Metamask wallet
        if (accounts.length) {
          //if a Metamask account is connected
          setConnectedStatus(true);
          setWallet(accounts[0]);
        } else {
          setConnectedStatus(false);
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      } catch {
        setConnectedStatus(false);
        setStatus(
          "🦊 Connect to Metamask using the top right button. " + walletAddress
        );
      }
    }
  });

  // This is connected to an onClick event below.
  const connectWalletPressed = async () => {
    // connectWallet() is from interact.js which handles the metamask connection
    const walletResponse = await connectWallet();

    // if meta mask connect success then: walletResponse.connectedStatus = "";
    // If meta mask failed to connect walletResponse.connectedStatus = "some kinda of error msg"
    setConnectedStatus(walletResponse.connectedStatus);

    // Set state variable status
    setStatus(walletResponse.status);

    if (isConnected) {
      setWallet(walletAddress);
    }
  };

  const onMintPressed = async () => {
    const { status } = await mintNFT(url, name, description);
    setStatus(status);
  };

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {isConnected ? (
          "👛 Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>👛 Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Alchemy NFT Minter</h1>
      <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p>
      <form>
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />
        <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        />
        <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        />
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">{status}</p>
    </div>
  );
};

export default Minter;
