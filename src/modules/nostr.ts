import { Event } from "nostr-tools";
import { normalizeRelay } from "./utils";
import { Relay, Req } from "./relay";
import { bytesToHex, randomBytes } from "@noble/hashes/utils";

const KIND_RELAYS = 10002;

const OUTBOX_RELAYS = [
  "wss://relay.primal.net",
  "wss://purplepag.es",
  "wss://user.kindpag.es/",
  "wss://relay.nos.social/",
];

export async function fetchReplaceableEvent(pubkey: string, kind: number) {
  let event: Event | undefined;
  const makeReq = (ok: () => void): Req => {
    return {
      id: bytesToHex(randomBytes(6)),
      fetch: true,
      filter: {
        kinds: [kind],
        authors: [pubkey],
        limit: 1,
      },
      onEOSE(events) {
        for (const e of events) {
          if (!event || event.created_at < e.created_at) event = e;
        }
        ok();
      },
    };
  };

  const promises = OUTBOX_RELAYS.map((url) => {
    const r = new Relay(url);
    return new Promise<void>((ok) => r.req(makeReq(ok))).finally(() =>
      r.dispose()
    );
  });
  await Promise.race([
    new Promise((ok) => setTimeout(ok, 5000)),
    Promise.allSettled(promises),
  ]);

  return event;
}

export async function fetchPubkeyRelays(pubkey: string) {
  const event = await fetchReplaceableEvent(pubkey, KIND_RELAYS);
  if (!event) throw new Error("Relays not found for pubkey");

  return event.tags
    .filter((r) => r.length > 1 && r[0] === "r")
    .map((t) => normalizeRelay(t[1]) as string)
    .filter((r) => !!r);
}
