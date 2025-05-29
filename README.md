# SecP — Secure Protocol of the Damned™

A modular, paranoid, zero-compromise secure messaging protocol. Built from scratch with VS Code, TweetNaCl, TypeScript, and existential distrust.

## 🔥 Core Principles

- **Key-only identity** — no phone numbers, emails, or weak-ass usernames
- **Admin-enforced session policy** — accept the config or get kicked and wiped
- **No message restore** — you opt out, you lose everything. Permanently.
- **Metadata resistance** — mixnets, sealed sender, and cover traffic incoming
- **Multi-device restrictions** — optional, strict, and always user-controlled
- **Transport agnostic** — relay, mixnet, p2p—whatever hell you want to route it through

## 🚧 Roadmap

### ✅ Implemented
- Identity generation + signature binding (ed25519)
- Session config signing + verification
- Canonical JSON serialization for hash stability
- Policy-bound session negotiation
- Encrypted message envelopes (NaCl box.before)
- Detached message signature + verification

### 🔜 Next Up
- [ ] Group chat enforcement (join, opt-in, kick-on-decline)
- [ ] Multi-device session sync + device key binding
- [ ] Config update propagation + opt-out purge
- [ ] Mixnet-capable routing layer (decoy traffic, sealed sender)
- [ ] Key-only contact exchange + discovery
- [ ] Replay protection, nonce reuse prevention

### 🧪 Possible Experiments
- [ ] Post-quantum fallback (Kyber encapsulation swap-in)
- [ ] Pluggable transport modules (Tor, I2P, Bluetooth relays?)
- [ ] One-time key preloading (X3DH-style ratchet bootstrap)

## 💣 No Compromise Mode

This protocol is not here to hold your hand or forgive your mistakes.

- Decline a config update? You're out.
- Lost your key? You're fucked.
- Want to restore history? LOL no.
- This protocol respects freedom, not convenience.

## 📜 License

MIT — use it, break it, fork it, just don’t blame us when it actually works.

---

Built with hate for surveillance, by [Andrew Goodman](https://github.com/augoodman).
