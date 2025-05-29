import { signMessage, verifySignature } from '../utils/crypto';
import { createHash } from 'crypto';

export interface SessionConfig {
  encryption: 'MLSv1' | 'DoubleRatchet';
  forwardSecrecy: boolean;
  metadataProtection: boolean;
  transport: 'relay' | 'mixnet' | 'p2p';
  identityModel: 'key-only' | 'username';
  multiDevice: boolean;
  backupAllowed: boolean;
  sessionExpiry: number;
  createdAt: number;
  createdBy: string;
  signature?: string;
}

function serializeConfig(config: SessionConfig): string {
  const ordered: any = {};
  Object.keys(config)
    .sort()
    .forEach((k) => {
      if (k !== 'signature') {
        ordered[k] = (config as any)[k];
      }
    });
  return JSON.stringify(ordered);
}

export function signConfig(config: SessionConfig, adminPrivateKey: string): SessionConfig {
  const canonical = serializeConfig(config);
  const signature = signMessage(canonical, adminPrivateKey);
  return {
    ...config,
    signature,
  };
}

export function verifyConfig(config: SessionConfig): boolean {
  if (!config.signature) return false;
  const canonical = serializeConfig(config);
  return verifySignature(canonical, config.signature, config.createdBy);
}

export function hashConfig(config: SessionConfig): string {
  const encoder = new TextEncoder();
  const data = encoder.encode(serializeConfig(config));
  const hashBuffer = createHash('sha256').update(data).digest();
  return Buffer.from(hashBuffer).toString('hex');
}
