import { createIdentity, FullIdentity } from './src/identity/identity';
import { signConfig, verifyConfig, hashConfig, SessionConfig } from './src/session/config';
import { proposeSession, acceptSession, declineSession } from './src/session/session';

// Step 1: Admin creates identity (with private key)
const admin: FullIdentity = createIdentity('admin-overlord');

// Step 2: Define a secure session policy
const rawConfig: SessionConfig = {
  encryption: 'DoubleRatchet',
  forwardSecrecy: true,
  metadataProtection: true,
  transport: 'relay',
  identityModel: 'key-only',
  multiDevice: false,
  backupAllowed: false,
  sessionExpiry: 86400,
  createdAt: Date.now(),
  createdBy: admin.publicKey,
};

// Step 3: Admin signs the config
const signedConfig = signConfig(rawConfig, admin.privateKey);

// Confirm it verifies cleanly
console.log('🧾 Config valid?', verifyConfig(signedConfig));
console.log('🔑 Config hash:', hashConfig(signedConfig));

// Step 4: User joins with their own identity
const user = createIdentity('anon-bastard');

// Step 5: Propose session to user
const session = proposeSession(signedConfig, user);
if (!session) {
  console.error('❌ Session rejected: invalid config');
  process.exit(1);
}

console.log('📡 Proposed session:', session);

// Step 6: Simulate user accepting the session
const acceptedSession = acceptSession(session);
console.log('✅ Session accepted:', acceptedSession);
