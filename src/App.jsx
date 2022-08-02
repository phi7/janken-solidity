import React, { useEffect, useState } from "react";
import "./App.css";
/* ethers 変数を使えるようにする*/
import { ethers } from "ethers";
import abi from "./utils/JankenPortal.json";

const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");
  /* ユーザーのメッセージを保存するために使用する状態変数を定義 */
  // const [messageValue, setMessageValue] = useState("");
  /* すべてのwavesを保存する状態変数を定義 */
  // const [allWaves, setAllWaves] = useState([]);
  const [allJankens, setAllJankens] = useState([]);

  console.log("currentAccount: ", currentAccount);
  /*
   * デプロイされたコントラクトのアドレスを保持する変数を作成
   */
  const contractAddress = "0x8EC606b47bD74E06D177D217FcfaC1FC124D99C7";
  /*
   * ABIの内容を参照する変数を作成
   */
  const contractABI = abi.abi;
  //マイニング中かどうか
  const [isMining, setIsMinging] = useState(false);
  // let robotHand2 = "";

  // const getAllWaves = async () => {
  //   const { ethereum } = window;

  //   try {
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       const wavePortalContract = new ethers.Contract(
  //         contractAddress,
  //         contractABI,
  //         signer
  //       );
  //       /* コントラクトからgetAllWavesメソッドを呼び出す */
  //       const waves = await wavePortalContract.getAllWaves();
  //       /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定 */
  //       const wavesCleaned = waves.map((wave) => {
  //         return {
  //           address: wave.waver,
  //           timestamp: new Date(wave.timestamp * 1000),
  //           message: wave.message,
  //         };
  //       });

  //       /* React Stateにデータを格納する */
  //       setAllWaves(wavesCleaned);
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // /**
  //  * `emit`されたイベントに反応する
  //  */
  // useEffect(() => {
  //   let wavePortalContract;

  //   const onNewWave = (from, timestamp, message) => {
  //     console.log("NewWave", from, timestamp, message);
  //     setAllWaves((prevState) => [
  //       //これまで持ってたwaveの配列を展開
  //       ...prevState,
  //       {
  //         address: from,
  //         timestamp: new Date(timestamp * 1000),
  //         message: message,
  //       },
  //     ]);
  //   };

  //   /* NewWaveイベントがコントラクトから発信されたときに、情報を受け取ります */
  //   if (window.ethereum) {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();

  //     wavePortalContract = new ethers.Contract(
  //       contractAddress,
  //       contractABI,
  //       signer
  //     );
  //     //フロントエンドは、NewWave イベントがコントラクトから発信されたときに、情報を受け取り,onNewWave が呼び出される．
  //     wavePortalContract.on("NewWave", onNewWave);
  //   }
  //   /*メモリリークを防ぐために、NewWaveのイベントを解除します*/
  //   return () => {
  //     if (wavePortalContract) {
  //       wavePortalContract.off("NewWave", onNewWave);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    let jankenPortalContract;

    const onNewJanken = (from, hand, timestamp, result) => {
      // const { ethereum } = window;
  
      setAllJankens((prevState) => [
        //これまで持ってたwaveの配列を展開
        ...prevState,
        {
          address: from,
          hand: hand,
          timestamp: new Date(timestamp * 1000),
          result: result,
        },
      ]);

      /* NewJankenイベントがコントラクトから発信されたときに、情報を受け取ります */
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        jankenPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        //フロントエンドは、NewWave イベントがコントラクトから発信されたときに、情報を受け取り,onNewWave が呼び出される．
        jankenPortalContract.on("NewJanken", onNewJanken);
      }
      /*メモリリークを防ぐために、NewJankenのイベントを解除します*/
      return () => {
        if (jankenPortalContract) {
          jankenPortalContract.off("NewJanken", onNewJanken);
        }
      };
    }


  },[]);

  const getAllJankens = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const jankenPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        /* コントラクトからgetAllWavesメソッドを呼び出す */
        const jankens = await jankenPortalContract.getAllJankens();
        /* UIに必要なのは、アドレス、タイムスタンプ、メッセージだけなので、以下のように設定 */
        const jankensCleaned = jankens.map((janken) => {
          return {
            address: janken.player,
            hand: janken.hand,
            timestamp: new Date(janken.timestamp * 1000),
            result: janken.result,
          };
        });

        /* React Stateにデータを格納する */
        setAllJankens(jankensCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  

  // console.log("currentAccount: ", currentAccount);
  // window.ethereumにアクセスできることを確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // ユーザーのウォレットへのアクセスが許可されているかどうかを確認します。
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        // getAllWaves();
        getAllJankens();
      } else {
        console.log("No authorized account found");
      }

      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain " + chainId);
      // 0x4 は　Rinkeby の ID です。
      const rinkebyChainId = "0x4";
      if (chainId !== rinkebyChainId) {
        alert("You are not connected to the Rinkeby Test Network!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // connectWalletメソッドを実装
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      // 持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める。許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納する。
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // waveの回数をカウントする関数を実装
  // const wave = async () => {
  //   try {
  //     // ユーザーがMetaMaskを持っているか確認
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       //provider(=metamask) を介して、ユーザーはブロックチェーン上に存在するイーサリアムノードに接続できる
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       //signer は、ユーザーのウォレットアドレスを抽象化したもの
  //       const signer = provider.getSigner();
  //       //コントラクトへの接続
  //       const wavePortalContract = new ethers.Contract(
  //         contractAddress,
  //         contractABI,
  //         signer
  //       );
  //       let count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());
  //       //コントラクトの現在の資金額
  //       let contractBalance = await provider.getBalance(
  //         wavePortalContract.address
  //       );
  //       console.log(
  //         "Contract balance:",
  //         ethers.utils.formatEther(contractBalance)
  //       );
  //       /*
  //        * コントラクトに👋（wave）を書き込む。ここから...
  //        */
  //       const waveTxn = await wavePortalContract.wave(messageValue, {
  //         gasLimit: 300000,
  //       });
  //       // isMining = true;
  //       console.log("IsMining:", isMining);
  //       setIsMinging(true);
  //       console.log("IsMining:", isMining);
  //       console.log("Mining...", waveTxn.hash);
  //       await waveTxn.wait();
  //       // isMining = false;
  //       setIsMinging(false);
  //       console.log("IsMining:", isMining);
  //       console.log("Mined -- ", waveTxn.hash);
  //       count = await wavePortalContract.getTotalWaves();
  //       console.log("Retrieved total wave count...", count.toNumber());
  //       let contractBalance_post = await provider.getBalance(
  //         wavePortalContract.address
  //       );
  //       /* コントラクトの残高が減っていることを確認 */
  //       if (contractBalance_post.lt(contractBalance)) {
  //         /* 減っていたら下記を出力 */
  //         console.log("User won ETH!");
  //       } else {
  //         console.log("User didn't win ETH.");
  //       }
  //       console.log(
  //         "Contract balance after wave:",
  //         ethers.utils.formatEther(contractBalance_post)
  //       );
  //       // console.log("Signer:", signer);
  //     } else {
  //       console.log("Ethereum object doesn't exist!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //じゃんけんをする関数
  //コントラクトのじゃんけん関数を呼び出す
  const janken = async(hand)=>{
    try{
      // ユーザーがMetaMaskを持っているか確認
      const { ethereum } = window;
      if(ethereum){
        //provider(=metamask) を介して、ユーザーはブロックチェーン上に存在するイーサリアムノードに接続できる
        const provider = new ethers.providers.Web3Provider(ethereum);
        //signer は、ユーザーのウォレットアドレスを抽象化したもの
        const signer = provider.getSigner();
        //コントラクトへの接続
        const jankenPortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        //コントラクトの現在の資金額
        let contractBalance = await provider.getBalance(
          jankenPortalContract.address
        );

        const jankenTxn = await jankenPortalContract.janken(hand, {
          gasLimit: 300000,
        })
        console.log("IsMining:", isMining);
        setIsMinging(true);
        console.log("IsMining:", isMining);
        console.log("Mining...", jankenTxn.hash);
        await jankenTxn.wait();
        setIsMinging(false);
        console.log("IsMining:", isMining);
        console.log("Mined -- ", jankenTxn.hash);

        //
        let contractBalance_post = await provider.getBalance(
          jankenPortalContract.address
        );
         /* コントラクトの残高が減っていることを確認 */
        if (contractBalance_post.lt(contractBalance)) {
          /* 減っていたら下記を出力 */
          console.log("User won ETH!");
        } else {
          console.log("User didn't win ETH.");
        }
        console.log(
          "Contract balance after wave:",
          ethers.utils.formatEther(contractBalance_post)
        );

      }

    }catch(error){
      console.log(error);
    }


  }

  const jankenCaliculate = (hand, result)=>{
    let robotHand = "";
    if(result==="win"){
      if(hand==="gu"){
        robotHand = "tyoki"
      }else if(hand==="tyoki"){
        robotHand = "pa"
      }else{
        robotHand = "gu"
      }
    }else if(result==="draw"){
      if(hand==="gu"){
        robotHand = "gu"
      }else if(hand==="tyoki"){
        robotHand = "tyoki"
      }else{
        robotHand = "pa"
      }

    }else{
      if(hand==="gu"){
        robotHand = "pa"
      }else if(hand==="tyoki"){
        robotHand = "gu"
      }else{
        robotHand = "tyoki"
      }
    }
    return robotHand;

  }

  const handToEmoji = (hand) =>{
    let emojiHnad;
    if(hand==="gu"){
      emojiHnad = "✊"
    }else if(hand==="tyoki"){
      emojiHnad = "✌"
    }else{
      emojiHnad = "✋"
    }
    return emojiHnad;

  }

  // WEBページがロードされたときに下記の関数を実行します。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, [isMining]);







  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
          ロボットじゃんけんゲーム!
        </div>
        <div className="bio">
          イーサリアムウォレットを接続して、じゃんけんボタンを押し、
          <span role="img" aria-label="hand-wave" className="robotImg">
           🤖
          </span>
          と勝負
          <span role="img" aria-label="shine">
          ⚔️
          </span>
        </div>
        <br />
        {/* ローディング画面 */}
        {!isMining && <div className="miningFalseParent">
          <span role="img" className="">😴</span>
          <div className="miningZ3">z</div>
          <div className="miningZ2">z</div>
          <div className="miningZ1">z</div>
          </div>}
        {isMining && (
          <div className = "miningTrueParent">
            <span role="img" className="miningStone">🪨</span>
            <span role="img" className="miningSpark">💥</span>
            <span role="img" className="miningPickel">⛏️</span>
            <span role="img" className="miningTrue">😫</span>
            <span role="img" className="miningSweat">💦</span>
            <div>結果
              判定中...</div>
          </div>
        )}
        {/* ウォレットコネクトのボタンを実装 */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        {currentAccount && (
          <button className="waveButton">Wallet Connected</button>
        )}
        {/* waveボタンにwave関数を連動 */}
        {/* {currentAccount && (
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
        )} */}
        {/* メッセージボックスを実装*/}
        {/* {currentAccount && (
          <textarea
            name="messageArea"
            placeholder="メッセージはこちら"
            type="text"
            id="message"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
        )} */}
        <br/>
        <span className="selectAnnoucement">👇👇👇👇👇👇👇👇👇👇 Select Your Hand! 👇👇👇👇👇👇👇👇👇👇</span>
        <br/>
        <div className="jankenButtonList">
          <button className="guButton" onClick={()=>janken("gu")}>✊</button>
          <button className="tyokiButton" onClick={()=>janken("tyoki")}>✌</button>
          <button className="paButton" onClick={()=>janken("pa")}>✋</button>
        </div>
        {/* 履歴を表示する */}
        <br/>
        <div>過去の戦歴</div>
        {currentAccount &&
          allJankens
            .slice(0)
            .reverse()
            .map((janken, index) => {
              const emojiHnad = handToEmoji(janken.hand);
              const robotHand2 = jankenCaliculate(janken.hand,janken.result)
              const robotEmojiHand = handToEmoji(robotHand2);
              const etherLink = "https://rinkeby.etherscan.io/address/"+ janken.address;
              return (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#F8F8FF",
                    marginTop: "16px",
                    padding: "8px",
                  }}
                >
                  <div className = "addressParent">
                    <div>Your Address:</div>
                    <a target="_blank" href={etherLink}>イーサスキャンで見る</a>
                  </div>
                  <div>Your Hand: {emojiHnad}</div>
                  <div>Robot🤖 Hand: {robotEmojiHand}</div>
                  <div>Your Result: {janken.result}</div>
                  <div>Battle Time: {janken.timestamp.toString()}</div>
                  
                </div>
              );
            })}
      </div>
    </div>
  );
};
export default App;
