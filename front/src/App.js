import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/Posts.json"

const App = () => {
  /*
  * Just a state variable we use to store our user's public wallet.
  */
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userImg, setUserImg] = useState("");
  const [userDesc, setUserDesc] = useState("");
  const contractAddress = "0xe8E50Da706FC08519bea4C00B7A3aC4E3FCEF961";
  const contractABI = abi.abi;

  const getAllPosts = async () => {
    try {
      const { ethereum } = window;
        const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/918579991b7841cb8f4aab6ed8c55470')
        const signer = provider.getSigner();
        const PostsContract = new ethers.Contract(contractAddress, contractABI, provider);

        /*
         * Call the getAllPosts method from your Smart Contract
         */
        const waves = await PostsContract.getAllPosts();
        console.log(waves[1])
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.sender,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
            title: wave.title,
            img: wave.img,
            desc: wave.desc
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      
      /*
      * Check if we're authorized to access the user's wallet
      */
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }

const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const PostsContract = new ethers.Contract(contractAddress, contractABI, signer);


        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await PostsContract.post(userMessage,userTitle,userImg,userDesc);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);
        getAllPosts();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllPosts();
  }, [])
  
  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          👋 Hello
        </div>
        <div className="postsContainer">
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>By: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Title: {wave.title}</div>
              <img src={wave.img}/>
              <div>Desc: {wave.desc}</div>
              <div>Post: {wave.message}</div>
            </div>)
        })}
        </div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        <div clasName="editorCointainer">
        <div className="bio">
        Add post below, need to have enough ETH
        </div>

          Title: 
          <input value={userTitle} onChange={e =>{ setUserTitle(e.target.value)}}></input>
          <br/>Img Link: 
          <input value={userImg} onChange={e =>{ setUserImg(e.target.value)}}></input>
          <br/>Post: 
          <textarea value={userMessage} onChange={e =>{ setUserMessage(e.target.value)}}></textarea>
          <br/>Desc: 
          <textarea value={userDesc} onChange={e =>{ setUserDesc(e.target.value)}}></textarea>
          <button className="waveButton" onClick={wave}>
            Post
          </button>
        </div>
      </div>
    </div>
    );
  }
export default App