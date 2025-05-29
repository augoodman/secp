import { Identity } from '../identity/identity';
import { FullIdentity } from '../identity/identity';
import { SessionConfig, verifyConfig } from './config';

export interface SessionState {
  sessionId: string;
  config: SessionConfig;
  accepted: boolean;
  participant: FullIdentity;
}
  
export function proposeSession(config: SessionConfig, participant: FullIdentity): SessionState | null {
    if (!verifyConfig(config)) {
      console.warn('Invalid session config — signature mismatch');
      return null;
    }
  
    return {
      sessionId: generateSessionId(config, participant),
      config,
      accepted: false,
      participant,
    };
  }

function generateSessionId(config: SessionConfig, participant: Identity): string {
  return `${config.createdBy.slice(0, 8)}-${participant.publicKey.slice(0, 8)}-${config.createdAt}`;
}

export function acceptSession(session: SessionState): SessionState {
  return {
    ...session,
    accepted: true,
  };
}

export function declineSession(session: SessionState): void {
  console.warn(`Session declined by ${session.participant.alias || 'user'}. Session data wiped.`);
}