import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react";

createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/522923331/ton-wallet-react-demo/master/tonconnect-manifest.json">
      <App />
    </TonConnectUIProvider>
)
