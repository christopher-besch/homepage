---
type: article
title: "Forgejo Development"
description: "
Some stories of how I work on Forgejo.
"
banner: /social_banner/testing.png
thumb: ../../../static/social_banner/testing.png
title_banner: ../../images/photography/alpha_whiskey.jpg
title_banner_horizontal_position: 20%
title_banner_vertical_position: 80%
slug: forgejo
date: 2025-05-22T00:00:00+00:00
listed: true
version: 1.0.0
---

- architecture of Forgejo notifications
- importance of tests, what tests I wrote
- testing setup

A while back I started contributing to Forgejo.

Right now that happens to be Forgejo Action notifications.
Actions are Forgejo's pendant to GitHub Actions.
They are used to build and test code in a **c**ontinuous **i**ntegration/**d**eployment (CI/CD) pipeline.
Now something Forgejo lacked was a notification when something went wrong

I [#7508](https://codeberg.org/forgejo/forgejo/pulls/7508)

```bash
STRIP="0" EXTRA_GOFLAGS='-gcflags="all=-N -l"' TAGS="sqlite sqlite_unlock_notify" make build
```

# Testing

I'm using [this node script](https://stackoverflow.com/a/46787467) to as a test webhook:
```js
const http = require("http");

const hostname = "0.0.0.0";
const port = 8001;

const server = http.createServer((req, res) => {
  console.log(`\n${req.method} ${req.url}`);
  console.log(req.headers);

  req.on("data", function(chunk) {
    console.log("BODY: " + chunk);
  });

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
```

For Forgejo to accept `http://localhost:8001` as a webhook target I had to configure like so:
```ini
[webhook]
ALLOWED_HOST_LIST = *
SKIP_TLS_VERIFY = true
```
