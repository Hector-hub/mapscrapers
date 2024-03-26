
export const encrypt = async (text, password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const key = await crypto.subtle.digest('SHA-256', encoder.encode(password));
    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const algorithm = { name: 'AES-GCM', iv: iv };
    const encryptedData = await crypto.subtle.encrypt(
        algorithm,
        cryptoKey,
        data
    );
    
    const ivString = arrayBufferToBase64(iv).replace(/[+/=]/g, char => {
        if (char === '+') return '-';
        if (char === '/') return '_';
        if (char === '=') return '';
        return char
    });
    const encryptedDataString = arrayBufferToBase64(encryptedData).replace(/[+/=]/g, char => {
        if (char === '+') return '-';
        if (char === '/') return '_';
        if (char === '=') return '';
        return char
    });
    console.log(`${encryptedDataString}:${ivString}`);
    return `${encryptedDataString}:${ivString}`;
}

export const  decrypt = async (encryptedText, password)=> {
  const [encryptedDataString, ivString] = encryptedText.split(':');
  const encryptedData = base64ToArrayBuffer(encryptedDataString.replace(/[-_]/g, char => {
      if (char === '-') return '+';
      if (char === '_') return '/';
      return char
  }));
  const iv = base64ToArrayBuffer(ivString.replace(/[-_]/g, char => {
      if (char === '-') return '+';
      if (char === '_') return '/';
      return char
  }));

  const encoder = new TextEncoder();
  const key = await crypto.subtle.digest('SHA-256', encoder.encode(password));
  const cryptoKey = await crypto.subtle.importKey(
      'raw',
      key,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
  );

  const algorithm = { name: 'AES-GCM', iv: iv };
  const decryptedData = await crypto.subtle.decrypt(
      algorithm,
      cryptoKey,
      encryptedData
  );

  return new TextDecoder().decode(decryptedData);
}
  
  const arrayBufferToBase64 = (buffer)  =>{
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
} 

const base64ToArrayBuffer =(base64) =>{
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

  //GET ENCRYPTION PASSWORD
  const getEncryptionPassword =(): string => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const timestampWithoutTime = currentDate.getTime();
    return timestampWithoutTime.toString();
  }