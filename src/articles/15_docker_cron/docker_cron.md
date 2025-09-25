---
type: article
title: "The Bitter Feeling of Technial Compromises"
description: "
My very personal troubles dealing with compromises,
explained at an example of docker_cron with Renovate.

Sometimes you really don't have to worry as much and trust your previous, careful considerations.
"
banner: /social_banner/docker_cron.png
thumb: ../../../static/social_banner/docker_cron.png
title_banner: ../../images/photography/bravo_alpha.jpg
title_banner_horizontal_position: 10%
title_banner_vertical_position: 100%
slug: technical_compromises
date: 2025-09-25T00:00:00+00:00
listed: true
version: 1.0.0
---

The other day I set up [Renovate](https://docs.renovatebot.com), a bot that scans my code for outdated dependencies.
There is a [Renovate Docker image](https://hub.docker.com/r/renovate/renovate) and my [personal server](https://codeberg.org/christopher-besch/docker_setups) runs everything else in Docker containers, too.
So I chose that deployment and was only looking for a way to initiate scans at regular intervals.
You initiate a scan by executing the Renovate binary inside the container.

Of course this is not a new problem.
The typical approach on a deployment without Docker uses cron.
cron is a simple tool that takes a command combined with a time/date pattern, which I call cron time.
It then runs the command at the provide cron time (e.g. hourly, daily, ...).
Docker, however, doesn't provide something like cron.
To fill this gap I created [docker_cron](https://github.com/christopher-besch/docker_cron), a separate Docker container that searches for other containers with the `CRON_TIME` environment variable set.
Let's call those service containers.
docker_cron sends a Unix HUP signal to the service container whenever the provided cron time is hit.
A tiny script inside the service container awaits that signal and then runs the container's main executable.

This is how you configure the service container's `docker-compose.yml`:
```yaml
services:
  Renovate:
    image: renovate/renovate
    volumes:
      - "entrypoint.sh:/entrypoint.sh"
    environment:
      - GITHUB_COM_TOKEN=some_token
      - RENOVATE_TOKEN=some_token
      - "CRON_TIME=13 0 * * *"
    entrypoint: /entrypoint.sh

  DockerCron:
    image: chrisbesch/docker_cron
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:rw"
```

You only need one docker_cron container for the entire host.
Then all you have to do is place the `entrypoint.sh` file next to the `docker-compose.yml`.
```bash
#!/bin/bash

# Launch renovate when we receive a HUP signal
# from the docker_cron container.
trap 'renovate' HUP
# Sleep and wait for the HUP signal.
while :; do
    sleep 10 & wait ${!}
done
```

What's good about docker_cron is how small it is.
You can easily review everything docker_cron is in a few minutes:
There's a total of 45 lines of [Dockerfile](https://github.com/christopher-besch/docker_cron/blob/main/Dockerfile), [bash script](github.com/christopher-besch/docker_cron/blob/main/init.sh) and [crontab template](https://github.com/christopher-besch/docker_cron/blob/main/crontab.tmpl).
Its only dependencies are docker-gen and, well of course, cron.
FYI, the nginx team develops docker-gen for their official Docker image.
So it's not some obscure thing no one uses or maintains.

## So What About that "Bitter Feeling" in the Title?

Unfortunately there is no way of creating something like docker_cron without giving it access to the Docker daemon socket.
With this access the container has full root access to the host machine.
That, of course, is not great.
I really dislike this, actually.
I dislike it so much that whenever I look at my server's deployment, with it's dozens of containers relying on docker_cron, I have this bitter feeling. <br />
You know, I recognise this feeling from whenever I create, whenever I design.
It highlights things I should be cautious of using.
It is on high alert when some dependency uses external servers;
external servers that could go dark at any moment.
Or when I consider something hacky that will fall apart too soon or just waits to be exploited.
This feeling fights for the simplest, cleanest solution possible and no less.

Now this time I indulged it and again looked for a simpler solution:
I tried integrating cron in the container itself.
So instead of an entrypoint script I'm using cron inside the Renovate container directly.
That sounds a lot simpler than the docker_cron solution, right? <br />
Cue the first problem:
cron isn't already installed inside the Renovate container.
What do you do?
You add the entrypoint script back and make it install cron from the Debian repositories.
Let's hope those haven't gone dark when you want to restart your container.
Oh, and that of course doesn't work for containers that shouldn't have any access to the internet.
That's actually a bunch of my containers.

But there's another problem: stdout.
For debugging purposes I want access to Renovate's log output.
Docker already provides a way to store a process' log output.
For this the Docker daemon attaches to the stdout of the container's main process.
In our case the main process is cron and not Renovate because cron lauches it's commands in the background.
Therefore, the Renovate's log output is lost.
What you have to do is redirect the bot's stdout to cron's stdout.
That's quite a complicated thing to do and there is a lot to trip over.
And you know what?
That feels like a hack — a hack making that bitter feeling flare up again.
So this alternative solution felt simpler at first but turned out causing a bunch of other problems requiring workarounds and trade-offs.

Which solution do you want to use?
Though you could argue both ways, personally I prefer docker_cron and will keep using it.
I find the security implications acceptable considering how easy to review docker_cron is. <br />
Unfortunately, this Renovate-endeavour of mine didn't rid myself of that bitter feeling.
After all I didn't actually improve docker_cron, I only showed that the alternative is worse.
In a perfect world Docker itself offers some form of cron support.
My docker_cron solution, right now, is the next best thing and all it's problems originate from a carefully weighted trade-off.
Now it's on me to accept that and keep going.

## What Remains
What remains at the end of this more personal article?
An article I mostly wrote for myself, that is.
Let's put it this way: <br />
Criteria like code smells, best practices and the like can only get you so far.
At some level of problem complexity you need to compromise.
Then you trade one best practice against some other.
That's normal.
What's important is **when** you have these considerations: <br />
When you design the architecture, this is fine.
When you review your deployment, this is fine.
When you implement, deploy and administrate, however, you just have to trust your previous considerations.
