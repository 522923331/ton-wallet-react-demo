import './App.css'
import {TonConnectButton} from "@tonconnect/ui-react";
import Mining from "./components/Mining.tsx";
import SignMessage from "./components/SignMessage.tsx";
import PayDetail from "./components/PayDetail.tsx";
import {TxForm} from "./components/ton/TxForm/TxForm.tsx";

function App() {

  return (
      <div className="App">
          <div className="nal-container">
              <h2 style={{color: 'white',marginBottom: '20px'}}>NAL Wallet</h2>
              <Mining />
              <SignMessage />
              <PayDetail />
          </div>
          <div className="ton-container">
              <TonConnectButton />
              <TxForm />
          </div>
      </div>
  )
}

export default App
