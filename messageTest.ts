import { encryptMessage, decryptMessage } from './src/message/message';
import { createIdentity } from './src/identity/identity';
import { proposeSession, acceptSession } from './src/session/session';
import { signConfig } from './src/session/config';

const alice = createIdentity('Alice');
const bob = createIdentity('Bob');

const config = signConfig({
  encryption: 'DoubleRatchet',
  forwardSecrecy: true,
  metadataProtection: true,
  transport: 'relay',
  identityModel: 'key-only',
  multiDevice: false,
  backupAllowed: false,
  sessionExpiry: 86400,
  createdAt: Date.now(),
  createdBy: alice.publicKey,
}, alice.privateKey);

const session = acceptSession(proposeSession(config, bob)!);

const plaintext = 'Secret: Alice is watching.';
const encrypted = encryptMessage(plaintext, alice.encryptionPrivateKey, bob.encryptionPublicKey, session);
console.log('🔒 Encrypted Message:\n', encrypted);

// 🔧 This is where you fix the key direction:
const decrypted = decryptMessage(encrypted, bob.encryptionPrivateKey, alice.encryptionPublicKey);
console.log('🔓 Decrypted:', decrypted);
