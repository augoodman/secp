import { createIdentity, FullIdentity } from './src/identity/identity';
import { signConfig, SessionConfig } from './src/session/config';
import { proposeSession, acceptSession } from './src/session/session';
import { encryptMessage, decryptMessage, EncryptedMessage } from './src/message/message';

const alice: FullIdentity = createIdentity('anon-alice');
const bob: FullIdentity = createIdentity('anon-bob');

const config: SessionConfig = signConfig({
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
}, alice.signingPrivateKey);

const proposed = proposeSession(config, bob)!;
const session = acceptSession(proposed);

// 📨 Alice sends Bob an encrypted, signed message
const encrypted = encryptMessage(
    'Secret: Alice is watching.',
    alice,
    bob.encryptionPublicKey,
    session
  );
  

console.log('🔒 Encrypted Message:\n', encrypted);

// 📭 Bob tries to verify + decrypt
const decrypted = decryptMessage(
    encrypted,
    bob.encryptionPrivateKey,
    alice.signingPublicKey
  );  

console.log('🔓 Decrypted:', decrypted);
