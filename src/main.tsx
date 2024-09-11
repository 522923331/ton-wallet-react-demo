import {createRoot} from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {TonConnectUIProvider} from "@tonconnect/ui-react";

createRoot(document.getElementById('root')!).render(
    <TonConnectUIProvider manifestUrl="https://github.com/522923331/ton-wallet-react-demo/blob/master/manifest.json">
      <App />
    </TonConnectUIProvider>
)
