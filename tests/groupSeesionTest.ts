import { createIdentity } from '../src/identity/identity';
import { acceptGroupSession } from '../src/session/session';
import { SessionProposal } from '../src/session/proposal';
import { SessionConfig } from '../src/session/config';
import { signMessage } from '../src/utils/crypto';

console.log('💀 Group Session Test Starting...');

// Create 3 identities
const alice = createIdentity('doom-alice');
const bob = createIdentity('doom-bob');
const charlie = createIdentity('doom-charlie');

// Create group config
const groupConfig: SessionConfig = {
  encryption: 'DoubleRatchet',
  forwardSecrecy: true,
  metadataProtection: true,
  transport: 'relay',
  identityModel: 'key-only',
  multiDevice: false,
  backupAllowed: false,
  sessionExpiry: 86400,
  createdAt: Date.now(),
  createdBy: alice.signingPublicKey,
  participants: [
    alice.signingPublicKey,
    bob.signingPublicKey,
    charlie.signingPublicKey
  ],
};

// Each signs the config (simulate real behavior)
const sigs: Record<string, string> = {};
const payload = JSON.stringify(groupConfig);

sigs[alice.signingPublicKey] = signMessage(payload, alice.signingPrivateKey);
sigs[bob.signingPublicKey] = signMessage(JSON.stringify(groupConfig), bob.signingPrivateKey);
// charlie ghosts the squad and doesn't sign

const proposal: SessionProposal = {
    type: 'group', 
    config: groupConfig,
    proposedBy: alice.signingPublicKey,
    sigs,
  };
  

// Now simulate acceptance
const sessionAlice = acceptGroupSession(proposal, alice);
const sessionBob = acceptGroupSession(proposal, bob);
const sessionCharlie = acceptGroupSession(proposal, charlie);

console.log('\n🔓 Accepted Group Sessions:');
if (sessionAlice) console.log('✅ Alice accepted:', sessionAlice.acceptedParticipants.length, 'members');
if (sessionBob) console.log('✅ Bob accepted:', sessionBob.acceptedParticipants.length, 'members');
if (!sessionCharlie) console.warn('❌ Charlie did NOT accept (no signature)');

