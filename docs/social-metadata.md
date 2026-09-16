# Social previews and attribution

`src/presets/meta.tsx` emits metadata in the initial HTML, before JavaScript or the
crossword runs. Every visitor and crawler receives the same metadata. The home
page and its `#content` and section fragments share one canonical URL:
`https://www.hobin.dev/`.

## Metadata coverage

| Consumer                                                                       | Metadata supplied                                                                                                                              |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Facebook and Open Graph consumers                                              | Website type, site name, title, description, canonical URL, locale, HTTPS image URL, MIME type, dimensions, and image description              |
| X / Twitter                                                                    | Large image card, site and creator account `@jasonvinhson`, title, description, image, and image description                                   |
| LinkedIn                                                                       | Open Graph title, description, URL, and 1200 × 630 PNG image                                                                                   |
| Apple Messages                                                                 | Open Graph title and image, favicon, and high-resolution Apple touch icon                                                                      |
| Slack                                                                          | Open Graph and Twitter Card metadata available to its link-expanding crawler                                                                   |
| Other link preview clients, including WhatsApp, Discord, Telegram, and Bluesky | The same public Open Graph metadata; each client controls whether and how previews appear, and these clients have not been individually tested |
| Search engines and structured-data consumers                                   | Canonical URL, robots directives, sitemap, and connected WebSite, WebPage, Person, and ImageObject JSON-LD nodes                               |

Authorship is linked through `author`, `rel="author"`, X creator attribution, and
JSON-LD author/publisher relationships. Existing public profile URLs are listed
in `rel="me"` links and the Person node's `sameAs` property. These links describe
identity; they do not constitute platform account verification.

The share image is `public/og.png`, a solid cobalt-blue graphic. It is 1200 × 630
and about 20 KB. Its alt text describes the actual graphic; the structured data
does not present it as a photograph of Jason.

Pinterest article, product, and recipe Rich Pin markup is not applicable to this
portfolio homepage. Facebook App IDs, Facebook Page IDs, Pinterest verification,
and search-console verification require actual account-issued values and are not
fabricated. No app-install, video-player, article, product, or recipe metadata is
claimed for this page.

## Validation

Run `bun run check`, then inspect `.next-build/server/pages/index.html`. Confirm
the initial head contains one of each Open Graph and Twitter property, one
canonical URL, and valid JSON-LD with resolvable local node references. Check image
dimensions against the PNG header, and confirm the sitemap and robots policy
still reference the canonical origin. These checks verify generated output, not
each platform's cached live preview.

After deployment, inspect the URL with the
[Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/).
Preview visibility and caching remain controlled by each service.

## Sources

Reviewed with Context7 using `/vercel/next.js` and
`/facebook/open-graph-protocol`, plus official platform documentation:

- [Next.js Pages Router Head](https://nextjs.org/docs/pages/api-reference/components/head): direct head children and stable keys for deduplication.
- [Open Graph protocol](https://ogp.me/): required properties, website type, image structure, locale, and site name.
- [LinkedIn website sharing requirements](https://www.linkedin.com/help/linkedin/answer/a521928/making-your-website-shareable-on-linkedin?lang=en): Open Graph fields and image requirements.
- [Apple rich previews for Messages](https://developer.apple.com/documentation/technotes/tn3156-create-rich-previews-for-messages): Open Graph, initial HTML, consistent metadata, and icons.
- [Slack robots](https://api.slack.com/robots): link-expanding crawler and Open Graph/Twitter Card processing.
- [Schema.org WebPage](https://schema.org/WebPage): author, publisher, page identity, and linked entities.
- [Pinterest Rich Pins](https://developers.pinterest.com/docs/web-features/rich-pins-overview/): article, product, and recipe scope.

The legacy X Cards markup URL redirected to the general X documentation during
review, and the Facebook webmaster guide returned HTTP 429. Existing X Card fields
were retained; Facebook's published Open Graph protocol was checked via Context7.
