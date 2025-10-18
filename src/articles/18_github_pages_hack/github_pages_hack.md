---
type: article
title: "How my GitHub Pages got Hacked"
description: "
A DNS forward is an expression of trust.
GitHub broke my trust and someone else received control over my domain.
"
banner: /social_banner/github_pages_hack.png
thumb: ../../../static/social_banner/github_pages_hack.png
title_banner: ../../images/photography/bravo_charlie.jpg
title_banner_horizontal_position: 100%
title_banner_vertical_position: 80%
slug: github_pages_hack
date: 2025-10-18T00:00:00+00:00
listed: true
version: 1.0.0
---

import hacked_page from "./hacked_page.png";
import github_pages_settings from "./github_pages_settings.png";
import name_com from "./name_com.png";
import github_verified_domains from "./github_verified_domains.png";

On 13th October 2025 at 16:22 UTC+2 I opened one of my websites, `dev.chris-besch.com`, and found it hacked (see the below screenshot).

<HalfImage src={hacked_page} />

Let me explain what happened and how I resolved the situation.
Firstly, I'm using [GitHub Pages](https://docs.github.com/en/pages) to host the website in question.
GitHub Pages allows me to define what domain to host the website on.

<HalfImage full={true} src={github_pages_settings} />

<HalfImage src={name_com} />

How does that work?
After all GitHub doesn't have control over my domain, only I do.
GitHub asks me to forward `dev.chris-besch.com` to `christopher-besch.github.io`, which is under their control.
I do so with a DNS record using the domain registrar of my choice.
There's no way around doing this and I never thought much of it, until the other day.
That other day when someone else apparently got control over my domain.

### What Happened?
A few days ago I accidentally deleted the git branch GitHub Pages feeds on.
Although I recreated the branch shortly after and unbeknown to me, that disabled my GitHub Pages deployment.
Therefore, my domain forwarded to GitHub's infrastructure but wasn't used by any GitHub Page anymore.
Someone realized that and chose the domain for their malicious website.
Luckily I realized the malicious website fairly quickly.
Furthermore, I only use that domain for debugging purposes, anyways.
Still, this means people are constantly scanning for domains that point to GitHub's infrastructure but aren't used by any GitHub Page.
That's scary.

Another scary thing is the valid SSL certificate the attacker received for my domain.
She used the domain validation of GitHub's Let's Encrypt certificate.
Those are easy to get once she had control over my domain.
An organization or extended validation wouldn't be possible here.
Those kinds of validations proof that a website has a right to be where it is; this situation shows that.
Still, browsers don't really differentiate between the validation types in the user interface.

### Resolution
<HalfImage src={github_verified_domains} />

I didn't forward to a generic GitHub domain, I forwarded to `christopher-besch.github.io`.
So, GitHub could have checked my DNS record and realized that I don't want someone else hosting GitHub Pages on my domain.
Though, GitHub doesn't do that.
Instead, it needs a specific TXT DNS record to understand that that's my domain.
They call this feature ["verified domains"](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages).
I enabled that and got my domain back.

### Conclusion
This was a lesson for me.
By pointing my domain at someone else's infrastructure I put trust in that someone else.
And in this situation GitHub broke that trust.
Whenever you're forwarding to infrastructure you don't directly control, you're trusting them.
Every DNS forward, every web link, foreign IP address is an expression of trust in foreign infrastructure.
Be aware of that.
