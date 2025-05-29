import { generateKeyPair, generateEncryptionKeyPair, signMessage, verifySignature } from '../utils/crypto';

export interface Identity {
  alias?: string;
  publicKey: string;
  encryptionPublicKey: string;
  createdAt: number;
  signature: string;
}

export interface FullIdentity extends Identity {
  privateKey: string;
  encryptionPrivateKey: string;
}
  

export function createIdentity(alias?: string): FullIdentity {
  const { publicKey, privateKey } = generateKeyPair();
  const { publicKey: encryptionPublicKey, privateKey: encryptionPrivateKey } = generateEncryptionKeyPair();
  const createdAt = Date.now();

  const identity: Omit<Identity, 'signature'> = {
    alias,
    publicKey,
    encryptionPublicKey,
    createdAt,
  };

  const signature = signMessage(JSON.stringify(identity), privateKey);

  return {
    ...identity,
    signature,
    privateKey,
    encryptionPrivateKey,
    encryptionPublicKey,
  };
}

export function verifyIdentity(identity: Identity): boolean {
  const { signature, ...unsigned } = identity;
  return verifySignature(JSON.stringify(unsigned), signature, identity.publicKey);
}
