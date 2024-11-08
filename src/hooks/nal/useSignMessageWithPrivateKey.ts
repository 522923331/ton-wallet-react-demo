import {useState} from "react";
import {ethers, SigningKey} from "ethers";
interface UseSignMessageWithPrivateKeyResult {
  signedMessage: string | null;
  signMessage: (message: string) => Promise<void>;
  error: string | null;
}

const useSignMessageWithPrivateKey = (privateKey:string | SigningKey): UseSignMessageWithPrivateKeyResult=> {
  const [signedMessage, setSignedMessage] =useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const signMessage = async(message:string | Uint8Array) =>{
    try{
      if (!privateKey) throw new Error("privateKey is required")

      const wallet = new ethers.Wallet(privateKey);
      const signature = await wallet.signMessage(message);
      setSignedMessage(signature)

    }catch(e){
      setError((e as Error).message)
    }
  };

  return {signedMessage, error, signMessage};
}
export default useSignMessageWithPrivateKey;
