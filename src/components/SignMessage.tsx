import { useState } from 'react';
import useSignMessageWithPrivateKey from "../hooks/nal/useSignMessageWithPrivateKey.ts";

const SignMessage = () => {
    const [privateKey, setPrivateKey] = useState("");
    const { signedMessage, signMessage, error } = useSignMessageWithPrivateKey(privateKey);
    const [message, setMessage] = useState('');

    const handleSign = () => {
        signMessage(message);
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your private key"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
                style={{ border: "1px solid #ccc",borderRadius: "5px", padding: "5px" }}
            />
            <input
                type="text"
                placeholder="Enter message to sign"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ border: "1px solid #ccc",borderRadius: "5px", padding: "5px" }}
            />
            <button onClick={handleSign}>Sign Message</button>
            {signedMessage && <p>Signed Message: {signedMessage}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default SignMessage;
