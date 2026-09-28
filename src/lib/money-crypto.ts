// Browser-side decryption for the money ledger.
//
// The passphrase IS the key: the payload at /money/ledger.enc.json is
// AES-256-GCM ciphertext, so a wrong passphrase fails the GCM auth tag and
// yields nothing. There is no "check the password then serve the data" step to
// bypass, which is what makes this safe to sit in a public repo.

export type Envelope = {
  v: number;
  kdf: string;
  iterations: number;
  cipher: string;
  salt: string;
  iv: string;
  ct: string;
};

const b64ToBytes = (b64: string) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

export class WrongPassphrase extends Error {
  constructor() {
    super("wrong passphrase");
    this.name = "WrongPassphrase";
  }
}

export async function decryptLedger<T>(envelope: Envelope, passphrase: string): Promise<T> {
  const enc = new TextEncoder();

  const baseKey = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: b64ToBytes(envelope.salt),
      iterations: envelope.iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );

  let plaintext: ArrayBuffer;
  try {
    plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: b64ToBytes(envelope.iv) },
      key,
      b64ToBytes(envelope.ct)
    );
  } catch {
    // GCM auth failure is the only way a bad passphrase surfaces.
    throw new WrongPassphrase();
  }

  return JSON.parse(new TextDecoder().decode(plaintext)) as T;
}

const bytesToB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

// Same KDF strength as the ledger: saved budget edits are no weaker than it.
const ITERATIONS = 600_000;

/** Encrypt a value into the same envelope the ledger uses, under the same passphrase. */
export async function encryptJSON(value: unknown, passphrase: string): Promise<Envelope> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  const ct = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(JSON.stringify(value))));
  return {
    v: 1,
    kdf: "PBKDF2-SHA256",
    iterations: ITERATIONS,
    cipher: "AES-256-GCM",
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    ct: bytesToB64(ct),
  };
}

/**
 * The write key for /api/money/budget, derived from the passphrase under its own
 * salt. The server holds only a SHA-256 of it, so it can check a save without
 * ever being able to decrypt anything.
 */
export async function deriveWriteToken(passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey("raw", enc.encode(passphrase), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode("ridermccallum-money-write-v1"), iterations: ITERATIONS, hash: "SHA-256" },
    baseKey,
    256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
