import {useState} from "react";
import {CHAIN, SendTransactionRequest, useTonConnectUI, useTonWallet,} from "@tonconnect/ui-react";
import {Address, beginCell, Cell, loadMessage, storeMessage, Transaction,} from "@ton/core";
import {useTonClient} from "../../../hooks/ton/useTonClient";
import {fromNano, toNano, TonClient} from "@ton/ton";
import "./TxFrom.css"

// In this example, we are using a predefined smart contract state initialization (`stateInit`)
// to interact with an "EchoContract". This contract is designed to send the value back to the sender,
// serving as a testing tool to prevent users from accidentally spending money.
const defaultTx: SendTransactionRequest = {
  // The transaction is valid for 10 minutes from now, in unix epoch seconds.
  validUntil: Math.floor(Date.now() / 1000) + 600,
  messages: [
    {
      // The receiver's address.
      address: "UQDEyS6PGYZW8OlNefaAK5Wv5ZMa6b9FCbbks0cFiARMzD9F",
      // Amount to send in nanoTON. For example, 0.005 TON is 5000000 nanoTON.
      amount: "7000000",
      // (optional) State initialization in boc base64 format.
      stateInit:
        "te6cckEBBAEAOgACATQCAQAAART/APSkE/S88sgLAwBI0wHQ0wMBcbCRW+D6QDBwgBDIywVYzxYh+gLLagHPFsmAQPsAlxCarA==",
      // (optional) Payload in boc base64 format.
      payload: "te6ccsEBAQEADAAMABQAAAAASGVsbG8hCaTc/g==",
    },

    // Uncomment the following message to send two messages in one transaction.
    /*
    {
      // Note: Funds sent to this address will not be returned back to the sender.
      address: 'UQAuz15H1ZHrZ_psVrAra7HealMIVeFq0wguqlmFno1f3B-m',
      amount: toNano('0.01').toString(),
    }
    */
  ],
};

interface WaitForTransactionOptions {
  address: string;
  hash: string;
  refetchInterval?: number;
  refetchLimit?: number;
}

const waitForTransaction = async (
  options: WaitForTransactionOptions,
  client: TonClient
): Promise<Transaction | null> => {
  const { hash, refetchInterval = 1000, refetchLimit, address } = options;

  return new Promise((resolve) => {
    let refetches = 0;
    const walletAddress = Address.parse(address);
    const interval = setInterval(async () => {
      refetches += 1;

      console.log("waiting transaction..."+ refetches+" times");
      const state = await client.getContractState(walletAddress);
      console.log("state", state);
      if (!state || !state.lastTransaction) {
        clearInterval(interval);
        resolve(null);
        return;
      }
      const lastLt = state.lastTransaction.lt;
      const lastHash = state.lastTransaction.hash;
      const lastTx = await client.getTransaction(
        walletAddress,
        lastLt,
        lastHash
      );
      console.log("lastTx", lastTx);
      if (lastTx && lastTx.inMessage) {
        const msgCell = beginCell()
          .store(storeMessage(lastTx.inMessage))
          .endCell();

        const inMsgHash = msgCell.hash().toString("base64");
        console.log("InMsgHash", inMsgHash);
        if (inMsgHash === hash) {
          clearInterval(interval);
          resolve(lastTx);
          return;
        }
      }
      if (refetchLimit && refetches >= refetchLimit) {
        clearInterval(interval);
        resolve(null);
      }
    }, refetchInterval);
  });
};

export function TxForm() {
  const [finalizedTx, setFinalizedTx] = useState<Transaction | null>(null);
  const [msgHash, setMsgHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { client,network } = useTonClient();

  const wallet = useTonWallet();

  const [tonConnectUi] = useTonConnectUI();

  const [toAddress, setToAddress] = useState(defaultTx.messages[0].address)
  const [amount, setAmount] =  useState(fromNano(defaultTx.messages[0].amount))

  // const { waitForTransaction } = useWaitForTransaction(client!!);

  return (
    <div className="send-tx-form">
      <h3 className={"tx-title"}>on TON send transaction(network: ({network && CHAIN.MAINNET == network? "MAINNET" : "TESTNET"})</h3>
      <div className={"tx-info"}>
        <div className={"tx-info-item"}>from: <span className={"tx-value"}>{wallet?.account.address}</span></div>
        <div className={"tx-info-item"}>to:
          <input
              style={{
                color: 'blue', // 字体颜色
                width: '90%', // 输入框宽度
                // padding: '10px', // 内边距
                borderRadius: '5px', // 圆角边框
              }}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder={"Enter address"}
              value={toAddress}

          />
        </div>
        <div className={"tx-info-item"}>amount:
          <input
              style={{
                color: 'blue', // 字体颜色
                width: '90%', // 输入框宽度
                // padding: '10px', // 内边距
                borderRadius: '5px', // 圆角边框
              }}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={"Enter amount"}
              value={amount}

          />
        </div>
      </div>
      {wallet ? (
          <button className={"send-tx-button"}
                  disabled={loading}
                  onClick={async () => {
                    try {
                      defaultTx.messages[0].address = toAddress;
                      defaultTx.messages[0].amount = toNano(amount).toString();
                      const result = await tonConnectUi.sendTransaction(defaultTx);
                      setLoading(true);
                      const hash = Cell.fromBase64(result.boc)
                          .hash()
                          .toString("base64");
                      console.log("Transaction hash:", hash);
                      const message = loadMessage(
                Cell.fromBase64(result.boc).asSlice()
              );
              console.log("Message:", message.body.hash().toString("hex"));
              setMsgHash(hash);

              if (client) {
                const txFinalized = await waitForTransaction(
                  {
                    address: tonConnectUi.account?.address ?? "",
                    hash: hash,
                  },
                  client
                );
                setFinalizedTx(txFinalized);
              }
            } catch (e) {
              console.error(e);
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Loading..." : "Send transaction"}
        </button>
      ) : (
        <button className={"send-tx-button"} onClick={() => tonConnectUi.openModal()}>
          Connect wallet to send the transaction
        </button>
      )}
      <div className={"tx-hash"}>Sending Tx Message Hash: {msgHash}</div>
      <div className={"tx-hash"}>Sending Tx Hash: {finalizedTx?.hash().toString("hex")}</div>
    </div>
  );
}
