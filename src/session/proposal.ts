import { SessionConfig } from './config';
import { Identity } from '../identity/identity';
import { signMessage, verifySignature } from '../utils/crypto';

export interface SessionProposal {
  config: SessionConfig;
  proposedBy: string;
  signature?: string;
  sigs?: Record<string, string>;
  type?: 'direct' | 'group';
}

export function createProposal(config: SessionConfig, signerPrivateKey: string): SessionProposal {
  const payload = JSON.stringify(config);
  const signature = signMessage(payload, signerPrivateKey);
  return {
    config,
    proposedBy: config.createdBy,
    signature,
  };
}

export function verifyProposal(proposal: SessionProposal): boolean {
    const payload = JSON.stringify(proposal.config);
  
    if (proposal.type === 'group') {
      if (!proposal.sigs || Object.keys(proposal.sigs).length === 0) return false;
      return Object.entries(proposal.sigs).every(
        ([signer, sig]) => verifySignature(payload, sig, signer)
      );
    }
  
    if (!proposal.signature) return false;
    return verifySignature(payload, proposal.signature, proposal.proposedBy);
  }
  
