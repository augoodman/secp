import { createIdentity } from '../src/identity/identity';
import { signConfig } from '../src/session/config';
import { proposeSession, acceptSession } from '../src/session/session';

console.log('💀 Accept Session Test Starting...');

// 🧙 Alice configures her dictatorship
const alice = createIdentity('doom-alice');
const config = signConfig({
  encryption: 'DoubleRatchet',
  forwardSecrecy: true,
  metadataProtection: true,
  transport: 'relay',
  identityModel: 'key-only',
  multiDevice: false,
  backupAllowed: false,
  sessionExpiry: 3600,
  createdAt: Date.now(),
  createdBy: alice.publicKey
}, alice.signingPrivateKey);

// 🤝 Bob gets roped into this nonsense
const bob = createIdentity('gullible-bob');
const proposed = proposeSession(config, bob);

if (!proposed) throw new Error('🚫 Proposal failed.');

// 💡 Accept the offer he can’t refuse
const session = acceptSession(proposed);

if (!session.accepted) throw new Error('❌ Session not marked as accepted.');
if (!session.participant.alias) throw new Error('❌ Alias not set in participant.');

console.log('✅ Session accepted by:', session.participant.alias);
