import * as tweetnacl from 'tweetnacl';
import { encode as encodeBase58, decode as decodeBase58 } from 'bs58';

export const generateSessionKey = () => {
  const keyPair = tweetnacl.sign.keyPair();
  return {
    publicKey: encodeBase58(keyPair.publicKey),
    privateKey: encodeBase58(keyPair.secretKey)
  };
};

export const signMessage = (message: string, privateKey: string) => {
  const messageBytes = new TextEncoder().encode(message);
  const secretKeyBytes = decodeBase58(privateKey);
  const signature = tweetnacl.sign.detached(messageBytes, secretKeyBytes);
  return encodeBase58(signature);
};

export const verifySignature = (
  message: string,
  signature: string,
  publicKey: string
) => {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = decodeBase58(signature);
  const publicKeyBytes = decodeBase58(publicKey);
  return tweetnacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
};