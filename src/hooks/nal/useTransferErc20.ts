import {ethers} from 'ethers';

const useSendTransaction = (privateKey: string) => {
// 创建一个以太坊提供者
    const provider = new ethers.JsonRpcProvider("https://testnet-rpc.nal.network");
// 合约地址和 ABI
    const contractAddress = '0xe4F926348D533d2B20857bD4D96bA92A4cEB9c15';
    const abi = [
        "function transfer(address to, uint amount) public returns (bool)"
    ];

// 调用 transfer 函数
    const sendTransaction = async () => {
        // 创建一个钱包实例
//     const privateKey = 'd17053df99d95ba1589fdbb1ee1a84cf12f48ff0446caca1ff277763045dfdc8'; // 不要将私钥硬编码到生产代码中
        const wallet = new ethers.Wallet(privateKey, provider);
        // 创建合约实例
        const contract = new ethers.Contract(contractAddress, abi, wallet);
        try {
            const tx = await contract.transfer('0xA33781f85f20CEE1bAf63aCA36e72Afc165bB5CC', ethers.parseUnits("1", 6));
            console.log('Transaction hash:', tx.hash);
            await tx.wait();
            console.log('Transaction confirmed');
        } catch (error) {
            console.error('Error:', error);
        }
    }
    return {sendTransaction};
}
export default useSendTransaction;
