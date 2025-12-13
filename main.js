const { ethers } = window

console.log('ethers loaded:', !!ethers);

const privateKeyInput = document.getElementById('privet-key')
const transferAmountInput = document.getElementById('transfer-amount')
const publicKeyInput = document.getElementById('public-key')
const sendBtn = document.getElementById('send-btn');
const provideSelect = document.getElementById('provider-select');

/*
    Добавить код провайдера
*/

sendBtn.addEventListener('click', async () => {

        const privateKey = privateKeyInput.value.trim()
        const amountStr = transferAmountInput.value.trim()
        const toAddress = publicKeyInput.value.trim()
        const selectedProvider = provideSelect.value.trim()

        const result = await sendTransaction(privateKey, toAddress, amountStr, selectedProvider)
        let windowMsg

        console.log('Ответ от сервиса = ', result)

        if (result === 'success') {
            windowMsg = 'Поздравляю с успешной транзакцией'
        } else {
            windowMsg = result
        }

        showMsg(windowMsg)

})

async function sendTransaction(privateKey, toAddress, amountStr, provider) {
    try {
        if (!provider) throw new Error('Provider is not selected');
        if (!privateKey) throw new Error('Private key is empty');
        if (!amountStr) throw new Error('Amount is empty');
    
        const amount = Number(amountStr);
        if (Number.isNaN(amount) || amount <= 0) throw new Error('Amount must be a positive number');
    
        if (!ethers.utils.isAddress(toAddress)) throw new Error('Invalid recipient address');
    
      } catch (err) {
        console.log('Validation error:', err.message);
        return err.message;
      }
    
      // Безопасность: предупреждение
      console.log('Warning: signing with client-side private key. Do not use real funds in demo.');
    
      try {
        // v5 API: providers.JsonRpcProvider
        const provider = new ethers.providers.JsonRpcProvider(provider);
        console.log('provider:', provider);
    
        // кошелек (подписывающий)
        const wallet = new ethers.Wallet(privateKey, provider);
        console.log('wallet address:', wallet.address);
    
        // Формирование транзакции
        const txRequest = {
          to: toAddress,
          value: ethers.utils.parseEther(amountStr)
        };
    
        console.log('Sending transaction...', txRequest);
    
        // Отправка
        const txResponse = await wallet.sendTransaction(txRequest);
        console.log('TX hash:', txResponse.hash);
    
        // Опционально: ожидание подтверждения
        const receipt = await txResponse.wait();
        console.log('Transaction confirmed. Receipt:', receipt);

        return "success"
    
      } catch (err) {
        // Показываем полную ошибку
        console.log('Transaction failed:', err && err.message ? err.message : String(err));
        console.error(err);
        return err.message; 
      }
}

function showMsg(msg) {
    let timeout = 0
    const msgWindow = document.querySelector('.error-window')
    const msgElement = document.createElement('p')

    const lastMsgElement = msgWindow.querySelector('p')

    console.log(lastMsgElement)

    if(lastMsgElement !== null) lastMsgElement.remove()

    msgWindow.classList.add('show')
    msgElement.textContent = msg
    msgWindow.appendChild(msgElement)

    timeout = setTimeout(
        function(){ 
            msgWindow.classList.remove('show')
        }, 3000);
}

// Пример вызова
sendTransaction(
  "PRIVATE_KEY",
  "0xReceiverAddress",
  "0.01"
);
