import { getPublicKey, nip19 } from "nostr-tools";

const nwc =
  "nostr+walletconnect://9d2eeab6c443e19ccca52b09f0b5c8f5f99ed4a98dfc7a350dbc753e562ad324?relay=wss%3A%2F%2Frelay.damus.io&secret=555738bcdce320ae5566b20507a7d9e9386f43236dc578f7aca6ddcfd2235a13";

const url = new URL(nwc);

// works differently in Safari
const walletServicePubkey = url.hostname || url.pathname.split("//")[1];
const clientSecret = url.searchParams.get("secret");

const walletServiceNpub = nip19.npubEncode(walletServicePubkey);
const clientNpub = nip19.npubEncode(getPublicKey(clientSecret));
const lnAddress = `${clientNpub}@${walletServiceNpub}.zap.land`;
console.log("ln address", lnAddress);
