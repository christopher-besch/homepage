---
type: article
title: "Forgejo Actions Notification Development"
description: "
Some stories of how I work on Forgejo.
"
banner: /social_banner/testing.png
thumb: ../../../static/social_banner/testing.png
title_banner: ../../images/photography/bravo_delta.jpg
title_banner_horizontal_position: 85%
title_banner_vertical_position: 60%
slug: forgejo_actions_notification
date: 2025-11-21T00:00:00+00:00
listed: true
version: 1.0.0
---

import architecture from "./architecture.svg";

This article is about Forgejo, a code forge:
Just like GitHub or GitLab it's a place to (collaboratively) develop software.
I've already explained at length [why we benefit greatly from Open-Source](/articles/open_source).
Motivated by that concept, Forgejo's amazing community and perhaps because it's incredibly easy to set up, you select it for your private code forge.
Though, with your Forgejo instance up and running you might miss a few features.
I, for example, needed to receive email notifications and webhooks when a CI Workflow failed.
Forgejo didn't offer that feature so I started contributing to Forgejo.
You might find yourself in those shoes, too.
In this article I want to help you and give my experience contributing to Forgejo.
The parts that took the most effort where
- setting up a development environment,
- understanding Forgejo's notification architecture,
- actually implementing the features and
- writing exhaustive tests for the features I implemented.

Be aware that I'm describing all of this as of commit `b2c4fc9f94` on 21st July 2025.
Some of this information may be outdated for any newer state of the code base.

## Development Setup
To test the features I developed I don't just need the Forgjeo executable.
No, I also need an action runner, a mail server and some place to send webhooks to.

### Forgejo itself
Let's start with just getting a Forgejo test instance up and running.
1. I use Debian but this setup should work on all Linux distros (and maybe macOS and BSD?).
2. [Install node and npm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script).
3. [Install go](https://go.dev/doc/install).
4. Install [gotestsum](https://github.com/gotestyourself/gotestsum).
   This is entirely optional.
   If you don't install gotestsum, ignore all the `USE_GOTESTSUM=yes` statements below.
5. Download the [Forgejo Repo](https://codeberg.org/forgejo/forgejo) with `git clone https://codeberg.org/forgejo/forgejo ~/forgejo && cd ~/forgejo`.
6. Build an executable with `STRIP="0" EXTRA_GOFLAGS='-gcflags="all=-N -l"' TAGS="sqlite sqlite_unlock_notify" make build`.
   It took me a while to realize that `go build` enables optimization by default but keeps all debug symbols present.
   We change that with the `gsflags` by neither optimizing or inlining.
   Furthermore, Forgejo's Makefile strips the debug symbols so we disable that with the `STRIP` environment variable.
7. Run `./gitea`.
   Yes, the executable is still called that.
8. Open a webbrowser and navigate to [http://localhost:3000](http://localhost:3000).
9. Choose SQLite, create an admin account and keep everything else default.
   Your config is in `~/forgejo/custom/conf/app.ini`.
10. Create the `test_repo` repository and add the file `.forgejo/workflows/main.yml`:
    ```yaml
    enable-email-notifications: true
    on:
      workflow_dispatch:
    
    jobs:
      test:
        runs-on: self-hosted
        steps:
          - name: Echo
            run: |
              echo Hello World!
          - name: Fail
            run: |
              false
    ```
    You can make your life a little easier by cloning the repo: `git clone http://localhost:3000/chris_admin/test_repo.git ~forgejo_test_repo`.
    You'll have to follow the prompts and configure your `user.email` and `user.name`.
    I'm using password login, btw.

### Forgejo Runner
To test workflow I need a runner.
1. Download the [Forgejo runner binary](https://code.forgejo.org/forgejo/runner/releases) into `~/forgejo_runner`.
2. Register the runner with `./forgejo-runner-11.1.2-linux-amd64 register`, give the instance URL `http://localhost:3000`, the runner token you get from the repo settings in the web interface, choose a name like `test-runner` and select the label `self-hosted:host`.
3. Run `./forgejo-runner-11.1.2-linux-amd64 daemon` and click the workflow trigger button in the web interface.
   You should see your workflow run now.

### Mail Server
Okay, that works fine but we also want to test sending emails.
I use [MailDev](https://github.com/maildev/maildev) to create a development email server.
It provides an SMTP server, which Forgejo connects to, and a webinterface for me, the developer.
1. [Install Docker](https://docs.docker.com/engine/install).
2. Run `docker run --network host -p 1080:1080 -p 1025:1025 maildev/maildev`.
3. Open [http://localhost:1080](http://localhost:1080) in a webbrowser.
4. Shutdown Forgejo and edit it's config (in `~/forgejo/custom/conf/app.ini`).
   ```ini
   [mailer]
   ENABLED = true
   PROTOCOL = smtp
   SMTP_ADDR = localhost
   SMTP_PORT = 1025
   FROM = forgejo@localhost

   # make sure this is true
   [service]
   ENABLE_NOTIFY_MAIL = true
   ```
5. Now, when the workflow fails you should get a mail in the MailDev web interface.

### Webhook
Furthermore, we want to test webhooks.
1. I'm using [this node script](https://stackoverflow.com/a/46787467) as a test webhook:
   `webhook_tester.js`:
   ```js
   #!/usr/bin/env node

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
2. Run `./webhook_tester.js`.
3. Shutdown Forgejo and edit it's config (in `~/forgejo/custom/conf/app.ini`).
   For Forgejo to accept `http://localhost:8001` as a webhook target you need to add this:
   ```ini
   [webhook]
   ALLOWED_HOST_LIST = *
   SKIP_TLS_VERIFY = true
   ```
4. Create a new webhook in the Repo Settings and use the target URL `http://localhost:8001`.
   Enable either *All events* or *Custom events*, selecting the *Action Run events*.
5. Start the workflow, let it fail and watch the sent webhook in the node terminal.

Now we have everything to play with the features I implemented.

## Running Tests
Forejeo has different types of tests.
I was concerned with these types.
- Run all unit tests with `TAGS='sqlite sqlite_unlock_notify' USE_GOTESTSUM=yes make test`.
- Run all integration tests with `TAGS='sqlite sqlite_unlock_notify' USE_GOTESTSUM=yes make test-sqlite`.

Say you only want to run this unit test in `~/forgejo/models/actions/run_test.go`:
```go
func TestGetRunBefore(t *testing.T) {
  // --snip--
}
```
Then you can execute `USE_GOTESTSUM=yes TAGS='sqlite sqlite_unlock_notify' GO_TEST_PACKAGES='forgejo.org/models/actions' make 'test#TestGetRunBefore'`.
But what if, instead, you are concerned with this integration test in `~/forgejo/tests/integration/actions_notifications_test.go`:
```go
func TestActionNotifications(t *testing.T) {
  // --snip--
}
```
Then you can run `USE_GOTESTSUM=yes TAGS='sqlite sqlite_unlock_notify' make 'test-sqlite#TestActionNotifications'`.
Btw, there are other types of tests, namely frontend tests and the End-to-End tests in a [special repo](https://code.forgejo.org/forgejo/end-to-end).
I didn't work with these yet so I direct you to the [testing docs](https://forgejo.org/docs/latest/contributor/testing).

## Debugging
I like the terminal and am used to GDB.
Therefore, I'm using the terminal debugger [Delve](https://github.com/go-delve/delve).
Let's set things up for that:
1. [Install Delve](https://github.com/go-delve/delve/tree/master/Documentation/installation).
2. Build Forgejo as described [above](#development-setup).
3. Run `dlv exec ./gitea`.
4. Now we can use the Delve console while Forgejo runs, letting you interact with the web interface.
   For example you can do `break forgejo.org/services/mailer.(*mailNotifier).ActionRunNowDone`, `break forgejo.org/services/notify.ActionRunNowDone` and `continue`.
   Hit `Ctrl+C` to enter a Delve command and type `quit` to exit.

Say you want to debug the above unit test.
Then you can use Delve with this command: `dlv test --build-flags "-tags='sqlite,sqlite_unlock_notify' -run TestGetRunBefore" forgejo.org/models/actions`.
If, instead,  you want to debug the above integration test, run `make integrations.sqlite.test generate-ini-sqlite && GITEA_ROOT="$(pwd)" GITEA_CONF=tests/sqlite.ini dlv exec ./integrations.sqlite.test -- -test.run TestActionNotifications`.
Here you can break on some line number, too: `break ./tests/integration/actions_notifications_test.go:22`
To debug something else, take a look at Forgejo's Makefile and find what command make the things you want to debug run.
Just replace `go test` with `delve` and place all `go test` arguments in the `--build_flags` Delve argument.
You can break on line numbers, too: `break ./models/actions/run_test.go:19`

## Any Go Project's Directory Structure
Forgejo uses Go for its backend and Go html templates for its frontend.
I didn't dabble much with the frontend but there's JavaScript, too.
(Of course there is...)
I've always found Go's module system illusive, especially its' use of domains as module paths.
Also, Go does a lot of things implicitly, for example:
How do you tell Go that some function is a unit test?
You place it in a file with the `_test.go` suffix.
Or another one:
How do you declare a symbol exported or not-exported (analogous to public or private in other languages)?
There's no keyword for that.
Symbols with a leading capital letter are implicitly exported, otherwise not.
Those things are hard to figure out if you haven't inhaled the Go docs and just read through a project for the first time.

Okay, so Forgejo's binary is built from a module, the `forgejo.org` module.
We can figure that out by looking at its [`go.mod`](https://codeberg.org/forgejo/forgejo/src/branch/forgejo/go.mod) file.
```go
// /go.mod
module forgejo.org
// --snip--
require (
    code.forgejo.org/f3/gof3/v3 v3.11.1
// --snip--
```
As we've seen every bit of Go code is inside a module but there's another level of granularity: packages.
Go uses packages to isolate code into neat, contained, well, packages.
Every Go file declares what package they are in.
Go code can use exported and not-exported symbols (i.e., the functions, values, etc.) inside its own package.
To use symbols in other packages, however, those symbols must be exported you need to import that package.
The package `main` is special, that's where the entrypoint is.
Take a look at Forgejo's [`main.go`](https://codeberg.org/forgejo/forgejo/src/branch/forgejo/main.go):
```go
// /main.go
// --snip--
package main
import (
    // [standard library imports]
    "os"
    "runtime"
    // --snip--

    // [import some other package from the Forgejo source code repo]
    "forgejo.org/cmd"
// --snip--
```
Now, this is what really confused me at first:
`forgejo.org` is a domain you can visit with your browser but that's more or less just a coincidence.
Go only uses it to identify Forgejo's main package's path.
Therefore, `forgejo.org/cmd` is not a web endpoint at all, even though it might look like one.
Instead, it refers to the package `cmd` located in the [`/cmd` directory](https://codeberg.org/forgejo/forgejo/src/branch/forgejo/cmd).
```go
// /cmd/main.go
// --snip--
package cmd

import (
    // --snip--
    "forgejo.org/modules/log"
    // --snip--
    "github.com/urfave/cli/v3"
// --snip--
```
When you read this you need to be aware you're in the source code of the `forgejo.org` module, thus `forgejo.org/modules/log` refers to a package in [`/modules/log`](https://codeberg.org/forgejo/forgejo/src/branch/forgejo/modules/log).
`github.com/urfave/cli/v3`, however, refers to a dependency Go will download from GitHub during a build.
Notice that these the Go files in the `forgejo.org/modules/log` package declare their package without the full path:
```go
// /modules/log/init.go
// --snip--
package log
// --snip--
```

Remember how the directory Go code lies in influences any package's path.

## Forgejo's Layered Architecture
This article is about implementing one specific feature, actions notifications.
Therefore, I'll only talk about the parts of Forgjeo's architecture that matter for this feature.
Firstly, we need to take a look at Forgjeo's layered architecture.
I've created a visualization of [Forgejo's architecture overview](https://forgejo.org/docs/next/contributor/architecture).

<HalfImage full={true} src={architecture} />

`\routers`, `\services`, `\models`, `\modules` and `\templates` are the *main directories* where most of Forgejo's Go code lives.
As we can see, there are three layers.
Firstly, code in the bottom layers may only access packages inside their respective main directory.
So for example, code in `\modules` may not access the Forgejo-specific database models defined in `\models`.
(The Go compiler doesn't enforce this, code reviewers do.)
Packages in `\modules` could theoretically be used as a library outside of Forgejo.
Secondly, the `\services` module may access both `\models` and `\modules` but not the `\routers` above.
Lastly, the `\routers` code may use everything below it.<br />
There are other main directories that we don't care about.
Furthermore, I've only drawn examples packages, files and structs inside the main directories.
They contain a lot more things; things we'll look at later.
The `api` package inside `\routers` doesn't actually contain any Go code directly.
Instead it is the parent-package of packages like `forgejo.org/services/api/actions/runner`.

## Forgejo's Observer Pattern
We've seen how Go packages may include other Go packages.
There's 

TODO: cyclic stuff -> solution observer pattern

- duplicity of structs

## My Changes
TODO
```
~/forgejo λ vit lg | grep -P '\(#(7510|7491|7697|7509|7508|8066|8250|8227|8242)\)'
cf4d0e6c34 b2c4fc9f94 9e6f722f94 2529923dea d17aa98262 386e7f8208 95ad7d6201 05273fa8d2 a783a72d6b

(git log --pretty=format: --name-only cf4d0e6c34~..cf4d0e6c34 ; \
git log --pretty=format: --name-only b2c4fc9f94~..b2c4fc9f94 ; \
git log --pretty=format: --name-only 9e6f722f94~..9e6f722f94 ; \
git log --pretty=format: --name-only 2529923dea~..2529923dea ; \
git log --pretty=format: --name-only d17aa98262~..d17aa98262 ; \
git log --pretty=format: --name-only 386e7f8208~..386e7f8208 ; \
git log --pretty=format: --name-only 95ad7d6201~..95ad7d6201 ; \
git log --pretty=format: --name-only 05273fa8d2~..05273fa8d2 ; \
git log --pretty=format: --name-only a783a72d6b~..a783a72d6b) | sort -u | uniq


models/actions/main_test.go
models/actions/run.go
models/actions/run_job.go
models/actions/run_test.go
models/actions/schedule.go
models/actions/task.go
models/forgejo_migrations/migrate.go
models/forgejo_migrations/v34.go
models/user/user_system.go
models/webhook/webhook.go
models/webhook/webhook_test.go
modules/structs/action.go
modules/structs/hook.go
modules/structs/repo_actions.go
modules/webhook/structs.go
modules/webhook/type.go
options/locale/locale_en-US.ini
options/locale_next/locale_en-US.json
routers/api/actions/runner/runner.go
routers/api/v1/repo/action.go
routers/api/v1/repo/repo.go
routers/api/v1/swagger/repo.go
routers/web/repo/actions/view.go
routers/web/repo/issue.go
routers/web/repo/setting/setting.go
routers/web/repo/setting/webhook.go
services/actions/clear_tasks.go
services/actions/job_emitter.go
services/actions/notifier.go
services/actions/notifier_helper.go
services/actions/schedule_tasks.go
services/actions/schedule_tasks_test.go
services/actions/task.go
services/actions/workflows.go
services/convert/action.go
services/convert/convert.go
services/forms/repo_form.go
services/mailer/mail_actions.go
services/mailer/mail_actions_now_done_test.go
services/mailer/mail_admin_new_user_test.go
services/mailer/main_test.go
services/mailer/notify.go
services/notify/notifier.go
services/notify/notify.go
services/notify/null.go
services/repository/branch.go
services/repository/setting.go
services/webhook/dingtalk.go
services/webhook/discord.go
services/webhook/feishu.go
services/webhook/general.go
services/webhook/general_test.go
services/webhook/matrix.go
services/webhook/msteams.go
services/webhook/notifier.go
services/webhook/notifier_test.go
services/webhook/shared/payloader.go
services/webhook/slack.go
services/webhook/sourcehut/builds.go
services/webhook/telegram.go
services/webhook/webhook.go
services/webhook/wechatwork.go
templates/mail/actions/now_done.tmpl
templates/swagger/v1_json.tmpl
templates/webhook/shared-settings.tmpl
tests/integration/actions_notifications_test.go
tests/integration/actions_runner_test.go
tests/integration/actions_run_now_done_notification_test.go
tests/integration/api_repo_actions_test.go
tests/integration/repo_webhook_test.go
```

- [#7510: Refactoring](https://codeberg.org/forgejo/forgejo/pulls/7510)
- [#7491: Actions Done Notification](https://codeberg.org/forgejo/forgejo/pulls/7491)
- [#7697: After the Fact Cleanup](https://codeberg.org/forgejo/forgejo/pulls/7697)
- [#7509: Actions Done Mail](https://codeberg.org/forgejo/forgejo/pulls/7509)
- [#7508: Actions Done Webhook](https://codeberg.org/forgejo/forgejo/pulls/7508)
- at same time to #7508 [#7699: (not mine) introduce ActionRun, too](https://codeberg.org/forgejo/forgejo/pulls/7508)
- [#8066: (not mine) rename #7699's struct to RepoActionRun](https://codeberg.org/forgejo/forgejo/pulls/8066)
- [#8250: (not mine) unify ActionRun and RepoActionRun](https://codeberg.org/forgejo/forgejo/pulls/8250)
- [#8227: (not mine) Only single user receives mail](https://codeberg.org/forgejo/forgejo/pulls/8227)
- [#8242: (not mine) actions mail opt-in](https://codeberg.org/forgejo/forgejo/pulls/8242)

## Testing my Features
TODO

## Conclusion and Lessons Learned
TODO

- architecture of Forgejo notifications
- importance of tests, what tests I wrote
- testing setup, I didn't have that much time directly after all PRs -> tests vital
- think of testing not as a side-gig!
- break things up into multiple PRs
- less code is better
- understand as much as possible, then make the minimal change that is needed (knock someone out with your pinky)
