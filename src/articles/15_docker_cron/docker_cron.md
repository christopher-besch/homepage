---
type: article
title: "docker_cron"
description: "
"
banner: /social_banner/mc_missile.png
thumb: ../../../static/social_banner/bookmarks.png
title_banner: ../../images/photography/alpha_zulu.jpg
title_banner_horizontal_position: 0%
title_banner_vertical_position: 60%
slug: docker_cron
date: 2025-09-15T00:00:00+00:00
listed: true
version: 1.0.0
---

I have this voice in my head.
When I create, it highlights things I should be cautious of using.
It is on high alert when some dependency relies on external servers;
external servers that could go dark at any moment.
Or when I consider something hacky that will fall apart too soon.
Or in those situations I feel too smart and come up with too clever a solution when.
That voice is basically the gegenspieler of not simple enough things.

The below article is about when to quell that voice.

The other day I set up [Renovate](https://docs.renovatebot.com), a bot that continuously scans my code for outdated dependencies.
I chose to deploy it via Docker.
Then the problem arose of starting Renovate at regular intervals.

```yaml
services:
  Renovate:
    image: "{{ docker_forgejo_renovate_image }}"
    volumes:
      - "{{ docker_forgejo_dir }}/entrypoint.sh:/usr/src/app/entrypoint.sh"
      - "{{ docker_forgejo_dir }}/config.js:/usr/src/app/config.js"
    environment:
      - "CRON_TIME={{ docker_forgejo_renovate_cron }}"
      - GITHUB_COM_TOKEN={{ docker_forgejo_github_token }}
      - RENOVATE_TOKEN={{ docker_forgejo_codeberg_token }}
      - LOG_LEVEL=debug
    entrypoint: /usr/src/app/entrypoint.sh
    restart: "unless-stopped"
```

```bash
#!/bin/bash

trap 'renovate' HUP
echo sleeping and waiting for HUP to launch renovate
while :; do
    sleep 10 & wait ${!}
done
```
