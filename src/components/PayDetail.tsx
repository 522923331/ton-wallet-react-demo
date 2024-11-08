import useSendTransaction from "../hooks/nal/useTransferErc20.ts";
import {useState} from "react";

function PayDetail() {
    const [privateKey, setPrivateKey] = useState("");
    const {sendTransaction} = useSendTransaction(privateKey);
    return (
      <div>
          <input
              type="text"
              placeholder="Enter your private key"
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
              style={{ border: "1px solid #ccc",borderRadius: "5px", padding: "5px" }}
          />

          <button onClick={sendTransaction}>Pay</button>

      </div>
  );
}

export default PayDetail;