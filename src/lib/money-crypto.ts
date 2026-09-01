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
