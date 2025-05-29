import { createIdentity } from './src/identity/identity';
import { signConfig } from './src/session/config';
import { proposeSession, acceptSession } from './src/session/session';
import { encryptMessage, decryptMessage, hashMessage, EncryptedMessage } from './src/message/message';

const alice = createIdentity('thread-alice');
const bob = createIdentity('thread-bob');

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
}, alice.signingPrivateKey);

const proposed = proposeSession(config, bob);
if (!proposed) {
  throw new Error('Session proposal failed.');
}

const session = acceptSession(proposed);
if (!session) {
  throw new Error('Session acceptance failed.');
}

let prevHash: string | undefined;
const messages: EncryptedMessage[] = [];
const texts = [
  'First message in the void.',
  'Second message—still unseen.',
  'Third message: it knows too much.'
];

for (const text of texts) {
  const msg = encryptMessage(text, alice, bob.encryptionPublicKey, session, prevHash);
  prevHash = hashMessage(msg);
  messages.push(msg);
  console.log('\n🧾 Encrypted + Hashed:\n', msg);
}

console.log('\n========== DECRYPTING + VERIFYING CHAIN ==========');

for (let i = 0; i < messages.length; i++) {
  const msg = messages[i];
  const expectedPrev = i > 0 ? hashMessage(messages[i - 1]) : undefined;
  const actualPrev = msg.prevHash;

  console.log(`\n🔗 Checking message ${i + 1}`);
  if (expectedPrev !== actualPrev) {
    console.error('❌ Thread break! Expected prevHash:', expectedPrev, 'but got:', actualPrev);
  } else {
    console.log('✅ prevHash matches');
  }

  const plaintext = decryptMessage(msg, bob.encryptionPrivateKey, alice.publicKey);
  console.log('📬 Decrypted:', plaintext);
}
