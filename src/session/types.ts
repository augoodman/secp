import { SessionConfig } from './config';
import { Identity } from '../identity/identity';

export interface SessionState {
  sessionId: string;
  config: SessionConfig;
  accepted: boolean;
  participant: {
    publicKey: string;
    alias?: string;
    signingPrivateKey?: string;
    encryptionPrivateKey?: string;
    encryptionPublicKey?: string;
  };
}
