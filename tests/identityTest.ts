import { createIdentity, verifyIdentity } from '../src/identity/identity';

const user = createIdentity('anon-warlord');
console.log('Generated Identity:\n', user);
console.log('Signature Valid?', verifyIdentity(user));
