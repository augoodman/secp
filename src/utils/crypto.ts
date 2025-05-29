import nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';

export function generateKeyPair() {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey),
  };
}

export function signMessage(message: string, privateKey: string): string {
  const decodedKey = util.decodeBase64(privateKey);
  const signature = nacl.sign.detached(util.decodeUTF8(message), decodedKey);
  return util.encodeBase64(signature);
}

export function verifySignature(message: string, signature: string, publicKey: string): boolean {
  const msgBytes = util.decodeUTF8(message);
  const sigBytes = util.decodeBase64(signature);
  const pubKeyBytes = util.decodeBase64(publicKey);
  return nacl.sign.detached.verify(msgBytes, sigBytes, pubKeyBytes);
}
