# Moving the site to a custom domain

The site's address lives in one place: `src/content/site.json`. The HTML
pages (canonical links, link previews, structured data), the resume's printed
address, `sitemap.xml`, `robots.txt`, the use-case pages and the UX audit all
read it. Links to the GitHub repo keep the repo's name and don't change.

Below, `example.com` stands for the domain you bought. Do the steps in this
order: until the domain is verified with GitHub and set on this repo, a DNS
record pointing at GitHub Pages lets any GitHub user claim the domain.

## 1. Verify the domain with GitHub (prevents takeover)

GitHub → Settings (your account) → Pages → Add a domain. It shows a TXT record
named `_github-pages-challenge-BkashJEE` (on `example.com`); add it at the
registrar, wait for it to resolve, then press Verify. Leave the TXT record in
place afterwards.

## 2. Point the site at it

1. Edit `src/content/site.json`: `{ "url": "https://example.com" }`.
2. Add `public/CNAME` containing the bare domain: `example.com`.
3. Build (`npm run build`), check `dist/` has no `bkashjee.github.io` page
   addresses left, then PR → merge → push `private` as usual.
4. Set the custom domain on the repo (Settings → Pages → Custom domain), or:
   `gh api -X PUT repos/BkashJEE/bkashjee.github.io/pages -f cname=example.com`.
   The site deploys with GitHub Actions, so this setting is what counts;
   `public/CNAME` alone does nothing.

## 3. DNS records (at your registrar)

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

Never add a wildcard (`*`) record pointing at GitHub: anyone could serve a
page on the subdomains it covers.

The domain sends no email, so tell the world not to accept mail from it, and
allow only Let's Encrypt (which GitHub uses) to issue certificates:

| Type | Name | Value |
|---|---|---|
| MX | @ | `0 .` (a "null MX": this domain takes no mail) |
| TXT | @ | `v=spf1 -all` |
| TXT | _dmarc | `v=DMARC1; p=reject; sp=reject; pct=100` |
| CAA | @ | `0 issue "letsencrypt.org"` |
| CAA | @ | `0 issuewild ";"` |

If you later add email at this domain, replace the MX, SPF and DMARC records
with the ones your mail provider gives you.

On Cloudflare, set the A, AAAA and CNAME records to "DNS only" (grey cloud) so
GitHub can issue the HTTPS certificate.

When the DNS check passes on the repo's Pages settings, tick **Enforce
HTTPS** (the certificate can take up to an hour).

## 4. After the switch

- `bkashjee.github.io` redirects to the new domain automatically (this repo is
  the account's user site). Other repos' Pages under `bkashjee.github.io/<repo>`
  (today: `shelf`) move to `example.com/<repo>` too.
- Update the website field on GitHub and X profiles, and the link in the
  partner kit and resume PDF (`npm run resume:pdf`).
- Re-run `npm run ux:audit` against the new address.
- Submit `https://example.com/sitemap.xml` in Google Search Console.
- Keep the domain renewing automatically: if it lapses, someone else can buy
  it, and every link to it (resume PDF, profiles, old posts) leads to their
  site.
