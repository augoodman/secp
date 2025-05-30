import { Identity } from '../identity/identity';
import { FullIdentity } from '../identity/identity';
import { SessionConfig, verifyConfig } from './config';
import { SessionProposal, verifyProposal } from './proposal';
import { SessionState } from './types';
import { verifySignature } from '../utils/crypto';

export interface GroupSessionState {
    sessionId: string;
    config: SessionConfig;
    participant: FullIdentity;
    acceptedParticipants: string[];
  }

  export function acceptGroupSession(
    proposal: SessionProposal,
    identity: FullIdentity
  ): GroupSessionState | null {
    if (proposal.type !== 'group' || !proposal.sigs) {
      console.warn(`❌ Not a group proposal or missing signatures for ${identity.alias}`);
      return null;
    }
  
    const { config, sigs } = proposal;
    const myKey = identity.signingPublicKey;
  
    if (!config.participants.includes(myKey)) {
      console.warn(`❌ Identity not in participant list: ${identity.alias}`);
      return null;
    }
  
    const sig = sigs[myKey];
    if (!sig || !verifySignature(JSON.stringify(config), sig, myKey)) {
      console.warn(`❌ Missing or invalid signature for ${identity.alias}`);
      return null;
    }
  
    return {
      sessionId: generateSessionId(config, identity),
      config,
      participant: identity,
      acceptedParticipants: config.participants.filter((k) => sigs[k]),
    };
  }  
  
export function acceptProposal(proposal: SessionProposal): SessionState | null {
    const valid = verifyProposal(proposal);
    if (!valid) {
      console.warn('❌ Invalid session proposal');
      return null;
    }
  
    return {
      sessionId: `${Math.random().toString(36).slice(2, 10)}-${Date.now()}`,
      config: proposal.config,
      accepted: true,
      participant: {
        publicKey: proposal.proposedBy,
        alias: proposal.config.createdBy || 'Unknown',
      } as Identity, 
    };
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