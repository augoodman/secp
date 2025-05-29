import { generateKeyPair, signMessage, verifySignature } from '../utils/crypto';

export interface Identity {
  alias?: string;
  publicKey: string;
  createdAt: number;
  signature: string;
}

export interface FullIdentity extends Identity {
  privateKey: string;
}

export function createIdentity(alias?: string): FullIdentity {
  const { publicKey, privateKey } = generateKeyPair();
  const createdAt = Date.now();

  const identity: Omit<Identity, 'signature'> = {
    alias,
    publicKey,
    createdAt,
  };

  const signature = signMessage(JSON.stringify(identity), privateKey);

  return {
    ...identity,
    signature,
    privateKey,
  };
}

export function verifyIdentity(identity: Identity): boolean {
  const { signature, ...unsigned } = identity;
  return verifySignature(JSON.stringify(unsigned), signature, identity.publicKey);
}
