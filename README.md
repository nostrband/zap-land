# Zap.Land

This server provides a Lightning Network [LUD-16](https://github.com/lnurl/luds/blob/luds/16.md) address
with Nostr Zap [NIP-57](https://github.com/nostr-protocol/nips/blob/master/47.md) support for your
Nostr Wallet Connect ([NWC](https://github.com/nostr-protocol/nips/blob/master/47.md)) wallet. It relies
on a new `make_invoice_for` NWC method that allows third-party pubkeys to generate invoices for
the target (NIP-47 PR coming soon). The only wallet currently supporting this new method is
[nwc-enclaved](https://github.com/nostrband/nwc-enclaved).

## Usage

Having your NWC connection string in the form of:

```
nostr+walletconnect://<wallet-service-pubkey>?relay=<...>&secret=<client-secret>
```

you can get your LN address as:

```
<npub(wallet-service-pubkey)>@<npub(getPublicKey(client-secret))>.zap.land
```

Example ([example.js](./example.js)):

```js
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
```

## Self-Hosting

You can easily self-host this server, a docker image is provided. We also encourage you to
experiment with various address formats, paid short addresses etc. - any way to convert
`<username>@<domain>` to `<wallet-service-pubkey>` and `<client-pubkey>` could work.
