# Moving the site to a custom domain

The site's address lives in one place: `src/content/site.json`. The HTML
pages (canonical links, link previews, structured data), the resume's printed
address, `sitemap.xml`, `robots.txt`, the use-case pages and the UX audit all
read it. Links to the GitHub repo keep the repo's name and don't change.

Below, `example.com` stands for the domain you bought.

## 1. DNS records (at your registrar)

Apex domain (`example.com`), GitHub Pages' published addresses:

| Type | Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | bkashjee.github.io |

On Cloudflare, set these records to "DNS only" (grey cloud) so GitHub can
issue the HTTPS certificate.

## 2. Verify the domain with GitHub (prevents takeover)

GitHub → Settings (your account) → Pages → Add a domain. It shows a TXT record
like `_github-pages-challenge-BkashJEE.example.com`; add it at the registrar,
then press Verify.

## 3. Point the site at it

1. Edit `src/content/site.json`: `{ "url": "https://example.com" }`.
2. Add `public/CNAME` containing the bare domain: `example.com`.
3. Build (`npm run build`), check `dist/` has no `bkashjee.github.io` page
   addresses left, then PR → merge → push `private` as usual.
4. Set the custom domain on the repo (Settings → Pages → Custom domain), or:
   `gh api -X PUT repos/BkashJEE/bkashjee.github.io/pages -f cname=example.com`
5. When the DNS check passes, tick **Enforce HTTPS** (the certificate can take
   up to an hour).

## 4. After the switch

- `bkashjee.github.io` redirects to the new domain automatically (this repo is
  the account's user site). Other repos' Pages under `bkashjee.github.io/<repo>`
  move to `example.com/<repo>` too.
- Update the website field on GitHub and X profiles, and the link in the
  partner kit and resume PDF (`npm run resume:pdf`).
- Re-run `npm run ux:audit` against the new address.
- Submit `https://example.com/sitemap.xml` in Google Search Console.
