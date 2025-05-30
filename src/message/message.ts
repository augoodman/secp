import nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import { hashConfig } from '../session/config';
import { SessionState } from '../session/types';
import { signMessage, verifySignature } from '../utils/crypto';
import { FullIdentity } from '../identity/identity';

export interface EncryptedMessage {
  sessionId: string;
  configHash: string;
  senderPublicKey: string;
  nonce: string;
  ciphertext: string;
  timestamp: number;
  signature: string;
  prevHash?: string;
}

function canonicalize(message: Omit<EncryptedMessage, 'signature'>): string {
  const ordered: any = {};
  Object.keys(message)
    .sort()
    .forEach((key) => {
      ordered[key] = (message as any)[key];
    });
  return JSON.stringify(ordered);
}

export function hashMessage(message: EncryptedMessage): string {
  const ordered: any = {};
  Object.keys(message)
    .filter((k) => k !== 'signature')
    .sort()
    .forEach((key) => {
      ordered[key] = (message as any)[key];
    });
  const json = JSON.stringify(ordered);
  const hash = require('crypto').createHash('sha256');
  return hash.update(json).digest('hex');
}

export function encryptMessage(
  plaintext: string,
  sender: FullIdentity,
  recipientPublicKey: string,
  session: SessionState,
  prevHash?: string
): EncryptedMessage {
  const nonce = nacl.randomBytes(nacl.box.nonceLength);
  const sharedSecret = nacl.box.before(
    util.decodeBase64(recipientPublicKey),
    util.decodeBase64(sender.encryptionPrivateKey).slice(0, 32)
  );

  const ciphertext = nacl.box.after(
    util.decodeUTF8(plaintext),
    nonce,
    sharedSecret
  );

  const messageMeta = {
    sessionId: session.sessionId,
    configHash: hashConfig(session.config),
    senderPublicKey: sender.encryptionPublicKey,
    nonce: util.encodeBase64(nonce),
    ciphertext: util.encodeBase64(ciphertext),
    timestamp: Date.now(),
    prevHash
  };

  const signature = signMessage(
    canonicalize(messageMeta),
    sender.signingPrivateKey
  );

  return {
    ...messageMeta,
    signature
  };
}

export function decryptMessage(
  message: EncryptedMessage,
  recipientEncryptionPrivateKey: string,
  senderSigningPublicKey: string
): string | null {
  const { signature, ...unsigned } = message;

  console.log('🔍 Verifying:', canonicalize(unsigned));
  console.log('🆚 Using pubkey:', senderSigningPublicKey);

  const valid = verifySignature(
    canonicalize(unsigned),
    signature,
    senderSigningPublicKey
  );

  if (!valid) {
    console.warn('🚨 Message signature failed verification. Tampered or spoofed.');
    return null;
  }

  const sharedSecret = nacl.box.before(
    util.decodeBase64(message.senderPublicKey),
    util.decodeBase64(recipientEncryptionPrivateKey).slice(0, 32)
  );

  const plaintext = nacl.box.open.after(
    util.decodeBase64(message.ciphertext),
    util.decodeBase64(message.nonce),
    sharedSecret
  );

  return plaintext ? util.encodeUTF8(plaintext) : null;
}