---
title: "Forgejo Actions Notification Development"
description: "
Some stories of how I work on Forgejo.
How is a Go project structured?
What's the point of Forgejo's layered architecture and what's that pub-sub pattern?
Additionally, I exhaustively explain how to setup a development environment for Forgejo.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 85
hero_vertical_position: 60
slug: forgejo_actions_notification
date: "2025-11-20"
tags: [software_development, forgejo, go, web, server]
listed: true
---

This article is about Forgejo, a code forge:
Just like GitHub or GitLab it's a place to (collaboratively) develop software.
I've already explained at length [why we benefit greatly from Open-Source](/articles/open_source).
Motivated by that concept, Forgejo's amazing community and perhaps because it's incredibly easy to set up, you select it for your private code forge.
With your Forgejo instance up and running you might, however, miss a few features.
I, for example, needed to receive email notifications and webhooks when a CI Workflow failed.
Forgejo didn't offer that feature so I started contributing.
You might find yourself in those shoes, too.
In this article I want to help you on that journey and give my experience contributing to Forgejo.
The parts that took the most effort where
- [setting up a development environment](#development-setup),
- understanding [Forgejo's layered architecture](#forgejos-layered-architecture) and [pub-sub pattern](#forgejos-pub-sub-pattern),
- [actually implementing the features](#my-contribution) and
- writing exhaustive tests.

Be aware that I'm describing all of this as of commit `b2c4fc9f94` from 21st July 2025.
Some of this information may be outdated by the time you read it.

## Any Go Project's Directory Structure
Firstly we need to take a look behind Forgejo's pretty curtain:
Forgejo uses Go for its backend.
I've always found Go's module system illusive, especially its use of domains as module paths.
Also, Go does a lot of things implicitly, for example:
How do you tell Go that some function is a unit test?
You place it in a file with the `_test.go` suffix.
Or another one:
How do you declare a symbol to be exported or not-exported (analogous to public or private in other languages)?
There's no keyword for that.
Instead, symbols with a leading capital letter are implicitly exported, otherwise not.
Those things are hard to figure out if you haven't inhaled the Go docs and for the first time read through a project.
Therefore, I want to quickly explain how Go handles dependencies.
There also is an [official generic explanation](https://go.dev/doc/modules/managing-dependencies) if you prefer that.

Okay, so, you find Forgejo's source code on [codeberg.org/forgejo/forgejo](https://codeberg.org/forgejo/forgejo).
In this section we'll concern ourself with this subsection of Forgejo's files:
```
/
├── go.mod
├── main.go
├── cmd
│   └─ main.go
└── modules
    └─ log
       └─ init.go
```
Firstly, there are modules.
A Go library is a module, a Go executable too.
Typically one git repo houses a single Go module.
Forgejo is a binary Go module with the module path `forgejo.org`.
We can figure that out by looking at its [`go.mod`](https://codeberg.org/forgejo/forgejo/src/branch/forgejo/go.mod) file.
```go
// /go.mod
module forgejo.org
// --snip--
require (
    // --snip--
    github.com/hashicorp/go-version v1.7.0
// --snip--
replace github.com/hashicorp/go-version => github.com/6543/go-version v1.3.1
// --snip--
```
We notice that Forgejo uses the `github.com/hashicorp/go-version` Go module.
That's a dependency, which the Go tools will download directly from GitHub.
We notice that Go uses a decentralized system for publishing modules:
There isn't some central package index like NPM, crates.io or PyPI.
Because Go identifies a module with these URL-like paths, you also need to use statements like `import github.com/hashicorp/go-version` to import the dependency.
Consequently, Forgejo's code is full of domains where dependencies should be pulled from.
And that really annoyed me at first.
Do you really have to touch possibly hundreds of files only when the dependency's git repo changes?
While I'm still not entirely onboard, I'm slowly warming up to this decentralized system; mainly because of the `replace` statement above.
It states that while the Forgejo's Go source code will `import github.com/hashicorp/go-version`, the go tooling should download it from `github.com/6543/go-version`, instead.
In this case Forgejo uses `replace` to switch to a fork.

As we've seen, Go code is grouped in modules but there's another level of granularity: packages.
Go uses packages to isolate code into neat, contained, well, packages.
Every Go file declares what package they are in.
Go code can use exported and not-exported symbols inside its own package (i.e., functions, values, etc.).
To use symbols in other packages, however, they must be exported and you need to import that other package.<br />
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
)
// --snip--
func main() {
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
And the `forgejo.org/cmd` package imports some more packages.
When you read this, be aware of the to-be-imported package's location in the directory structure.
The package lies in the [`/modules/log`](https://codeberg.org/forgejo/forgejo/src/branch/forgejo/modules/log) directory of the `forgejo.org` module, thus `forgejo.org/modules/log` refers to it.
`github.com/urfave/cli/v3`, however, refers to a dependency Go will download from GitHub during a build.
The imports look so similar but one is resolved locally and the other from the internet.<br />
Notice that the Go files in the `forgejo.org/modules/log` package declare their package without its full path:
```go
// /modules/log/init.go
// --snip--
package log
// --snip--
```
It only says `log` but the full package path required to import the package is `forgejo.org/modules/log`.
Remember how the code's directory influences the package's path.

## Forgejo's Layered Architecture
We have seen that packages can import each other.
They import the functionality of those other packages but also their complexity.
It is much easier to reason about a package that is as self-contained as possible, that doesn't import as many other packages.
If every package imports every other package, the code-base turns into soup.
Forgejo tackle this issue by introducing a layered [architecture](https://forgejo.org/docs/next/contributor/architecture).
It groups packages into layers and forbids packages from importing code in higher layers.
I've drawn an overview over this structure:

<HalfImage full={true} src="architecture.svg" />

`/routers`, `/services`, `/models` and `/modules` are some of the *main directories* where most of Forgejo's Go code lives.
As we can see, there are three layers.
Firstly, all code may access packages inside their respective main directory.
The code in the bottom layer, however, doesn't have access to besides that.
So for example, code in `/modules` may not access the Forgejo-specific database models defined in `/models`.
(The Go compiler doesn't enforce this, code reviewers do.)
This code in `/modules` could theoretically be used as a library outside of Forgejo and is, thus, highly encapsulated.<br />
Thirdly, code in `/services` may access other code in `/services` and both the below `/models` and `/modules` but not the `/routers` above.
The `/services` directory we find Forgejo's *logic*.
It describes what should happen when something else happens.<br />
Finally, the `/routers` code may use everything below it.
Here reside Forgejo's input/output to the outside world, its API and web UI.

Naturally, we want as little code as possible in the upper layers because it is more difficult to reason about.
After all it has access to so much stuff with so many effects and side-effects.
This will become important when I talk about the refactoring my feature required.

## Forgejo's Pub-Sub Pattern
We've seen how Go packages may import other Go packages.
Now take a look at this situation where simple imports don't work:<br />
`forgejo.org/services/automerge` imports `forgejo.org/services/pull` to check if a pull request is mergeable.
But when there has been a pull request review, `forgejo.org/services/automerge` needs to realize that.
Who knows there has been a pull request review?
`forgejo.org/services/pull` of course.
So one package needs the other and the other needs the one; a cyclical dependency.
Simply importing the respective package doesn't work because Go forbids cyclical imports.
What does work is importing a third package, `forgejo.org/services/notify`.
`forgejo.org/services/notify` is a broker and relays messages grouped into topics to interested code.
An example topic is `PullRequestReview`.
`forgejo.org/services/pull` sends a message to that topic whenever there is a new review for a pull request.
Because `forgejo.org/services/automerge` is interested in such messages, it creates a struct abiding by the `Notifier` interface.
The notifier implements the `PullRequestReview` function and registers itself with the broker.
Therefore the broker doesn't have to import the `forgejo.org/services/automerge` package.
This is called dependency injection and resolves the cyclic dependency.
Here is some example code:

```go
// in /services/automerge
import notify_service "forgejo.org/services/notify"

// Define the notifier.
type automergeNotifier struct {
	notify_service.NullNotifier
}

// Ensure that this struct fulfills the Notifier interface.
var _ notify_service.Notifier = &automergeNotifier{}

// Declare functions for all topics the package is interested in.
func (n *automergeNotifier) PullRequestReview(/* --snip-- */) {
// --snip--

// Tell the broker there's a new notifier to be notified.
notify_service.RegisterNotifier(&automergeNotifier{})
```

```go
// in /services/pull

// send a message to some topic
notify_service.PullRequestReview(/* --snip-- */)
```

Because code can publish messages and subscribe to topics, this pattern is called the pub-sub pattern.
I find this pub-sub pattern pretty intuitive because topics and messages are a concept we're confronted with in our everyday lives.
Additionally, it allows you to get a quick overview over what code is interested in what change.
For example, if you give this interactive visualization a brief look, you can figure out that the code related to Forgejo packages is quite separate from everything else.

<HalfIframe full={true} src="https://christopher-besch.github.io/go_observer_pattern_visualizer/viewer" allowFullScreen={true}/>

If you're interested in this visualization and what the commit history on the right has to do with it, take a look at my new article: [The History of Forgejo's Pub-Sub Pattern](/articles/forgejo_pub_sub_pattern_history).

## My Contribution
Forgejo features Actions, enabling continuous integrations.
One can configure an Action to compile or test code e.g., whenever there is a new commit or pull request.
A failed Action Run indicates a problem with the just introduced code.
Thus, the developer must change her code in this situation.
But how does she notice something went amiss?
Before my Contribution the only option was Forgejo's web UI.
This is a *pull notification* because the developer must open the UI and *pull* the notification from the server.
I desired *push notifications* in the form of email and webhooks.
With email notifications the developer receives a friendly notice mail that her Action Run failed and a webhook sends a machine readable web request to some automated system.
I wanted to develop those features.
But where do you even start?
Firstly, it makes sense to add a new topic to the pub-sub pattern, `ActionRunNowDone`.
`forgejo.org/services/mailer` and `forgejo.org/services/webhook` are responsible for sending mails and webhooks so they should listen to that new topic.
We only need something to send a message to that topic whenever an Action Run completes.
`forgejo.org/models/actions` provides the database abstraction for Action Runs.
It's `UpdateRunJob` function performs all changes including those indicating a completed Action Run.
Therefore, that function should send the message.
However, there's a problem:
When we think back to Forgejo's layered architecture we realize that
`forgejo.org/models/actions` is not allowed to import `forgejo.org/services/notify`, because it lies in a lower layer.

At this point I already compiled everything I figured out and planned to do into issue [#3719](https://codeberg.org/forgejo/forgejo/issues/3719).
That gave Forgejo's maintainers the option to share their opinion.
After all, perhaps I didn't understand Forgejo's structure well enough.
It's better to find that out before spending hours implementing something no one needs.

### PR [#7510](https://codeberg.org/forgejo/forgejo/pulls/7510): Refactoring
This is where my first pull request comes in.
I had to move some code from `forgejo.org/models/actions` up a layer into `forgejo.org/services/actions`.
That's where Actions-related code lives that needs to import more things.
In order to make my PR as easy to review (and approve) as possible, I tried to move as little code as was absolutely necessary.
Of course, I had to move `UpdateRunJob` but e.g., `CleanRepoScheduleTasks` calls `UpdateRunJob`.
If I had only moved `UpdateRunJob`, `CleanRepoScheduleTasks` would require an import of `forgejo.org/services/actions`.
But that is, again, not possible because of the layered architecture.
Therefore, I also had to move all the function transitively changing the Actions Run's status.

### PR [#7491](https://codeberg.org/forgejo/forgejo/pulls/7491): `ActionRunNowDone` Topic
Now `UpdateRunJob` calls the `sendActionRunNowDoneNotificationIfNeeded` function, which I just implemented.
It sends a message to the new `ActionRunNowDone` topic whenever an Action Run is now done.
Finally, I added a bunch of tests ensuring that in all cases the `ActionRunNowDone` topic is used.

### PR [#7509](https://codeberg.org/forgejo/forgejo/pulls/7509): Actions Done Mail
`forgejo.org/services/mailer`'s notifier received interest in the `ActionRunNowDone` topic in this PR.
I made it send out a mail whenever a Run failed or recovered (i.e., succeeded after a prior failure).
Again, I added many tests ensuring whenever an `ActionRunNowDone` message requires it, a mail is sent.

### [#7508](https://codeberg.org/forgejo/forgejo/pulls/7508): Actions Done Webhook

<HalfImage full={false} src="webhook_settings.png" />

In this PR `forgejo.org/services/webhook` got interested in the `ActionRunNowDone` topic, too.
It sends out HTTP requests to the webhooks configured in the new settings.<br />
For this I had to introduce the `ActionRun` struct, which allows serialising an action to be sent to the webhook.
Of course, I added tests ensuring whenever an `ActionRunNowDone` message requires it, a webhook is sent.

<Spacer />

### `RepoActionRun` and `ActionRun` Structs
While I got [#7508](https://codeberg.org/forgejo/forgejo/pulls/7508) merged, [klausfyhn](https://codeberg.org/klausfyhn)'s [#7699](https://codeberg.org/forgejo/forgejo/pulls/7699) extended Forgejo's API.
The new API endpoints allow for retrieving Action Runs programmatically, which, of course, needed an `ActionRun` struct for serialisation.
So his and my PR introduced the same struct at the same time and broke the main `forgejo` branch, ups.
[Earl Warren](https://codeberg.org/earl-warren) quickly resolved the merge conflict in [#8066](https://codeberg.org/forgejo/forgejo/pulls/8066) by renaming [#7699](https://codeberg.org/forgejo/forgejo/pulls/7699)'s struct to `RepoActionRun`.
Then, because having two structs for the same purpose is bad, he removed the `RepoActionRun`, leaving only `ActionRun` in [#8250](https://codeberg.org/forgejo/forgejo/pulls/8250).
Both the webhook and the API use the same struct now.

### Other PRs

<HalfImage full={false} src="release_notes.png" />

A few more PRs accompanied this feature, which I won't get into detail:
- [#7697](https://codeberg.org/forgejo/forgejo/pulls/7697): After the Fact Cleanup
- [#8227](https://codeberg.org/forgejo/forgejo/pulls/8227): (Earl Warren) Only single user receives mail
- [#8242](https://codeberg.org/forgejo/forgejo/pulls/8242): (Earl Warren) actions mail opt-in

With all that work done, Action notification got into the v12.0 release of Forgejo!
You can go back up to the visualization and see if you can find my PRs.
And because I got my features upstreamed into Forgejo, Forgejo's maintainers take care of it now.
I don't have to maintain my own custom fork.
Having your features upstreamed really is the best thing that could happen to you.

<Spacer />

## Development Setup
Here I want to give an in-depth technical explanation of my development setup.
After all, I quickly got into the situation where I changed some of Forgejo's code and wanted to test it.
For this I don't just need the Forgejo executable.
No, I also need an action runner, a mail server and some place to send webhooks to.

### Forgejo itself
Let's start with just getting a Forgejo test instance up and running.
1. I use Debian but this setup should work on all Linux distros (and maybe macOS and BSD?).
2. [Install node and npm](https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script).
3. [Install go](https://go.dev/doc/install).
4. Install [gotestsum](https://github.com/gotestyourself/gotestsum).
   This is entirely optional.
   If you don't install gotestsum, ignore all the `USE_GOTESTSUM=yes` statements below.
5. Download the [Forgejo repo](https://codeberg.org/forgejo/forgejo) with `git clone https://codeberg.org/forgejo/forgejo ~/forgejo && cd ~/forgejo`.
6. Build an executable with `STRIP="0" EXTRA_GOFLAGS='-gcflags="all=-N -l"' TAGS="sqlite sqlite_unlock_notify" make build`.
   It took me a while to realize that `go build` enables optimization by default but keeps all debug symbols present.
   We change that with the `gsflags` by neither optimizing or inlining.
   Furthermore, Forgejo's Makefile strips the debug symbols so we disable that with the `STRIP` environment variable.
7. Run `./gitea`.
   Yes, the executable is still called that.
8. Open a webbrowser and navigate to `http://localhost:3000`.
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
To test a workflow I need a runner.
1. Download the [Forgejo runner binary](https://code.forgejo.org/forgejo/runner/releases) into `~/forgejo_runner`.
2. Register the runner with `./forgejo-runner-11.1.2-linux-amd64 register`, give the instance URL `http://localhost:3000`, the runner token you get from the repo settings in the web interface, choose a name like `test-runner` and select the label `self-hosted:host`.
3. Run `./forgejo-runner-11.1.2-linux-amd64 daemon` and click the workflow trigger button in the web interface.
   You should see your workflow run now.

### Mail Server
Okay, that works fine but we also want to test sending emails.
I use [MailDev](https://github.com/maildev/maildev) to create a development email server.
It provides an SMTP server, which Forgejo connects to, and a web interface for me, the developer.
1. [Install Docker](https://docs.docker.com/engine/install).
2. Run `docker run --network host -p 1080:1080 -p 1025:1025 maildev/maildev`.
3. Open `http://localhost:1080` in a webbrowser.
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
5. Now, when the workflow fails you should receive a mail in the MailDev web interface.

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
Notice that many of the settings I showed you are awfully insecure for a productive deployment.
They just make things easier for development.

## Running Tests
Forgejo has many different types of tests.
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

## Conclusion and Lessons Learned
We've seen the structure of any Go project, Forgejos layered architecture and pub-sub pattern, how I contributed and with what development setup.
Now I understand better just how valuable a deep understanding of the project you're working on is.
This really allows you to make the least invasive change to the code and still implement your feature.
And a smaller change is much easier to understand, review and approve.
We all benefit from that.
Breaking things up into multiple PRs goes along nicely with that, too.
Furthermore and even though I didn't go in-depth in this article, I spent a lot of time writing tests.
Those tests are really important and not just a side-gig you slap onto the *"real"* code.
They enable the maintainers to check things still work as they should when new code comes along and you might have left the project.

And lastly, of course, the Forgejo maintainers are absolutely amazing.
Especially [Earl Warren](https://codeberg.org/earl-warren) did a lovely job helping me on my journey.
Thank you!

## P.S.
I created the talk [Contributing to Forgejo](https://present.chris-besch.com/2025_11_21_ibm_forgejo/) around this article.
