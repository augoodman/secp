import nacl from 'tweetnacl';
import * as util from 'tweetnacl-util';
import { SessionState } from '../session/session';
import { hashConfig } from '../session/config';

export interface EncryptedMessage {
  sessionId: string;
  configHash: string;
  senderPublicKey: string;
  nonce: string;
  ciphertext: string;
  timestamp: number;
}

/**
 * Encrypts a message to the session recipient using NaCl box.
 */
export function encryptMessage(
    plaintext: string,
    senderPrivateKey: string,
    recipientPublicKey: string,
    session: SessionState
  ): EncryptedMessage {
    const nonce = nacl.randomBytes(nacl.box.nonceLength);
    const sharedSecret = nacl.box.before(
      util.decodeBase64(recipientPublicKey),
      util.decodeBase64(senderPrivateKey).slice(0, 32)
    );
  
    const ciphertext = nacl.box.after(
      util.decodeUTF8(plaintext),
      nonce,
      sharedSecret
    );
  
    return {
      sessionId: session.sessionId,
      configHash: hashConfig(session.config),
      senderPublicKey: session.participant.encryptionPublicKey,
      nonce: util.encodeBase64(nonce),
      ciphertext: util.encodeBase64(ciphertext),
      timestamp: Date.now()
    };
  }

/**
 * Decrypts a message using recipient private key and sender pubkey.
 */
export function decryptMessage(
  message: EncryptedMessage,
  recipientPrivateKey: string,
  senderPublicKey: string
): string | null {
  const sharedSecret = nacl.box.before(
    util.decodeBase64(senderPublicKey),
    util.decodeBase64(recipientPrivateKey).slice(0, 32)
  );
 
  const plaintext = nacl.box.open.after(
    util.decodeBase64(message.ciphertext),
    util.decodeBase64(message.nonce),
    sharedSecret
  );

  return plaintext ? util.encodeUTF8(plaintext) : null;
}
  
