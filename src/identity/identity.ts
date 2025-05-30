import { generateKeyPair, generateEncryptionKeyPair, signMessage, verifySignature } from '../utils/crypto';
import nacl from 'tweetnacl';
import util from 'tweetnacl-util';

export interface Identity {
  alias?: string;
  publicKey: string;
  encryptionPublicKey: string;
  createdAt: number;
  signature: string;
}

export interface FullIdentity extends Identity {
  signingPrivateKey: string;
  signingPublicKey: string;
  encryptionPrivateKey: string;
  encryptionPublicKey: string;
}
  
export function createIdentity(alias?: string): FullIdentity {
  const signingKeyPair = nacl.sign.keyPair();
  const encryptionKeyPair = nacl.box.keyPair();
  
  const signingPublicKey = util.encodeBase64(signingKeyPair.publicKey);
  const signingPrivateKey = util.encodeBase64(signingKeyPair.secretKey);
  const encryptionPublicKey = util.encodeBase64(encryptionKeyPair.publicKey);
  const encryptionPrivateKey = util.encodeBase64(encryptionKeyPair.secretKey);
  
  const createdAt = Date.now();
  const identity = {
    alias,
    publicKey: signingPublicKey,
    createdAt,
  };

  const signature = signMessage(JSON.stringify(identity), signingPrivateKey);

  return {
    ...identity,
    signature,
    signingPrivateKey,
    signingPublicKey,
    encryptionPrivateKey,
    encryptionPublicKey,
  };
}

export function verifyIdentity(identity: Identity): boolean {
  const { signature, ...unsigned } = identity;
  return verifySignature(JSON.stringify(unsigned), signature, identity.publicKey);
}
