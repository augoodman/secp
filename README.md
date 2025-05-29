# SecP — Secure Protocol of the Damned™

A modular, paranoid, zero-compromise secure messaging protocol. Built from scratch with VS Code, TweetNaCl, TypeScript, and existential distrust.

## 🔥 Core Principles

- **Key-only identity** — no phone numbers, emails, or weak-ass usernames
- **Admin-enforced session policy** — accept the config or get kicked and wiped
- **No message restore** — you opt out, you lose everything. Permanently.
- **Metadata resistance** — mixnets, sealed sender, and cover traffic incoming
- **Multi-device restrictions** — optional, strict, and always user-controlled
- **Transport agnostic** — relay, mixnet, p2p—whatever hell you want to route it through

## 🧱 What It Has (So Far)

- Identity generation + verification via `ed25519` keypairs
- Signed session configs enforced by admin public key
- Canonical JSON serialization for reproducible config hashes
- Policy signature binding per chat session
- Bootstrapped in TypeScript with TweetNaCl for cryptography

## 🚧 Roadmap

- [ ] Session negotiation + config sync
- [ ] Encrypted message envelopes
- [ ] Group chat enforcement (join, opt-in, kick-on-decline)
- [ ] Mixnet-capable routing layer
- [ ] Multi-device session hygiene
- [ ] Contact discovery via key-only exchange

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
