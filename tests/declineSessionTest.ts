import { createIdentity } from '../src/identity/identity';
import { signConfig } from '../src/session/config';
import { proposeSession, declineSession, acceptSession } from '../src/session/session';

console.log('💀 Decline Session Test Starting...');

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

const proposed = proposeSession(config, alice);
if (!proposed) throw new Error('Proposal failed');

console.log('⚠ Declining this sketchy-ass session...');
declineSession(proposed);
