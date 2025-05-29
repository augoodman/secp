import nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';

/**
 * Generates a signing key pair (Ed25519) for identity + signatures
 */
export function generateKeyPair() {
  const keyPair = nacl.sign.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey),
  };
}

/**
 * Generates an encryption key pair (X25519) for message encryption
 */
export function generateEncryptionKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: util.encodeBase64(keyPair.publicKey),
    privateKey: util.encodeBase64(keyPair.secretKey),
  };
}
  
  
/**
 * Signs a message with a base64-encoded Ed25519 private key
 */
export function signMessage(message: string, privateKey: string): string {
  const decodedKey = util.decodeBase64(privateKey);
  const signature = nacl.sign.detached(util.decodeUTF8(message), decodedKey);
  return util.encodeBase64(signature);
}

/**
 * Verifies a signature with a base64-encoded Ed25519 public key
 */
export function verifySignature(message: string, signature: string, publicKey: string): boolean {
  const msgBytes = util.decodeUTF8(message);
  const sigBytes = util.decodeBase64(signature);
  const pubKeyBytes = util.decodeBase64(publicKey);
  return nacl.sign.detached.verify(msgBytes, sigBytes, pubKeyBytes);
}
