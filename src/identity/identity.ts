import { generateKeyPair, signMessage, verifySignature } from '../utils/crypto';

export interface Identity {
  alias?: string;
  publicKey: string;
  createdAt: number;
  signature: string;
}

export function createIdentity(alias?: string): Identity {
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
  };
}

export function verifyIdentity(identity: Identity): boolean {
  const { signature, ...unsigned } = identity;
  return verifySignature(JSON.stringify(unsigned), signature, identity.publicKey);
}
