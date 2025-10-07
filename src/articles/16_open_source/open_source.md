---
type: article
title: "Why I love Open-Source"
description: "
I love Open-Source.
Somehow I never got to sort my reasons for that feeling.
This article does just that and tries to sell Open-Source to you.
Find out its price and what you get in return; regardless if you are a developer, user, corporation, the government or just a citizen.

I argue that Open-Source is a quality mark, a form of democratization and ownership, capitalism at its best and thus the response to a world in which software exists.
"
banner: /social_banner/open_source.png
thumb: ../../../static/social_banner/open_source.png
title_banner: ../../images/photography/bravo_bravo.jpg
title_banner_horizontal_position: 40%
title_banner_vertical_position: 0%
slug: open_source
date: 2025-10-12T00:00:00+00:00
listed: true
version: 1.0.0
---

import eniac from "./eniac.jpg";

I won't hide my love for Open-Source.
I love it so much it aches whenever I'm not allowed to work with Open-Source.
For me, Open-Source is a quality mark, a form of democratization and ownership, capitalism at its best and thus the response to a world in which software exists.
This article gets to that conclusion without requiring any prior technical knowledge.

## Background
Nevertheless, you'll need the following concepts, which I'll explain blow: *hardware*, *software*, *executable*, *compilation*, *source code* and *software license*.
Firstly, I'll start with an example.
Take a look at your smartphone:
The thing you can hold in your hand is *hardware*, the calendar app you use on it is *software*.
To use this calender app you need to give your smartphone an *executable*.
The developer of that calendar app wrote *source code* and converted (i.e., *compiled*) that into the executable.

<HalfImage src={eniac} />

With this example in mind, enjoy the general explanation:
For centuries we humans have been hard at working creating technology.
For most of that history, technology has been pieces of physical machinery designed to fulfil a specific purpose.
This is *hardware*, something you can touch.
Now at some time smart people created hardware that didn't just fulfil any single specific purpose.
They invented the general purpose computer (the image on the right or above), a machine that executes an *executable*.
An executable instructs the computer exactly what to do and is a form of *software*.
And this is what your smartphone is:
A joker card that performs different specific purposes depending on what software you execute on it.
You can't touch software, you can only touch the hardware you feed the software into.

Though an executable is an abstract piece of data you can represent it using `0` and `1` characters.
This is such a truncated representation of an example executable:
```
01111111 01000101 01001100 01000110 00000010 00000001
00000001 00000000 00000000 00000000 00000000 00000000
00000000 00000000 00000000 00000000 00000011 00000000
00111110 00000000 00000001 00000000 00000000 00000000
01010000 00010000 00000000 00000000 00000000 00000000
00000000 00000000 01000000 00000000 00000000 00000000
00000000 00000000 00000000 00000000 10010000 00110110
00000000 00000000 00000000 00000000 00000000 00000000
00000000 00000000 00000000 00000000 01000000 00000000
00111000 00000000 00001110 00000000 01000000 00000000
00011111 00000000 00011110 00000000 00000110 00000000
00000000 00000000 00000100 00000000 00000000 00000000
01000000 00000000 00000000 00000000 00000000 00000000
00000000 00000000 01000000 00000000 00000000 00000000
00000000 00000000 00000000 00000000 01000000 00000000
00000000 00000000 00000000 00000000 00000000 00000000
...
```
You won't understand any of this, in fact basically no-one will.
If, instead, you give it to a computer, it will execute this executable and perform the action defined in the software.
In this example's case, the computer would simple say `Hello World!`.
As you hopefully notice, even if I gave you the entire executable, you can't simply figure out what the executable does.
For all intents and purposes you can think of an executable as a black-box that does something but doesn't let you know how.

This executable is pretty obnoxious to even look at.
So you might wonder how you create this executable in the first place.
Nowadays you don't do so directly, but write source code instead.
Just like an executable, source code is a form of software, too.
Here is the source code that belongs to the executable you've already seen above:
```c
#include <printf.h>
#include <stdio.h>

int main() {
    printf("Hello World!\n");
    return 0;
}
```
In contrast to the executable from before, you can already make sense of this.
For example, you can see the text `Hello World!` in there.
You could probably figure out how to modify this software so that is says `Hello Anna!` instead, right?.
Source code is understandable and editable by humans.
The developer uses a tool called the *compiler* to compile her source code into an executable.

Remember the differences between source code and executable as they are crucial for this article:
- The user needs only an executable to use a piece of software.
- A human cannot understand or edit an executable.
- However, a human can understand and edit source code.
- The compiler easily converts source code into an executable.
- On the other hand, you cannot convert an executable back into its source code.

### Software License and Open-Source
(This is no legal advice.)
Source code falls under the law of copyright:
Because the developer wrote the source code, she can decide what to do with it.
Typically, the developer wants people to use her software so she compiles an executable and gives that to the user.
However, she might not allow the user to do whatever he wants with her software.
For example he might not be allowed to sell the software himself.
The developer lays out conditions in a legal document called the *software license*, which the user must accept.
*Open-Source software* is software under a license that give the user specific rights.
The Open Source Initiative (OSI) keeps a list of OSI approved licenses that fulfil the [definition of Open-Source](https://opensource.org/osd).
To me, the most important aspects of Open-Source software are:

1. Everyone has free access to the source code.
2. Everyone may modify the software.
3. Everyone is allowed to sell and redistribute the (modified) software, both as an executable and as source code.

Note how this does not mean that the executable must be free.
It also doesn't mean the developers waives her copyright.
Actually, she still very much has the copyright and, within the definition of Open-Source, may define restrictions on using the software.
For example, some Open-Source licenses require you to publish any modified source code under the same license.
Such licenses (e.g., GPLv3) are *copyleft* licenses.
Others, like the MIT license, don't have such a copyleft clause.
So while the concept of Open-Source might sound radical to some, it leaves a surprising amount of power to the software developer.
This will become important when we talk about one of the main issues with Open-Source: monetization.

*Closed-Source*, as you might imagine, is the opposite of Open-Source.
Closed-Source software generally doesn't allow the user to see the source code.
As stated above, you need the source code to understand and modify the software.
Without the source code, the user isn't able to do any of that.

## The Reality of Open-Source/Closed-Source
Okay, this has been all long and windy.
Let's get to the point.

### Open-Source Case Study: Linux

## The Problem with Closed-Source

## The Horrific Security Implications

### Closed-Source Case Study: Tetra

### Why wasn't this a problem back in the day?

## Monetization

## The bigger picture
- Democratization
- Ownership
- Capitalism
- never repeat, except for when you want to

## Sidenote
So I was looking to get my hand on an actual typewriter and searched for "Stuttgart Schreibmaschine".
The first result was an official wiki on the matter of [how to properly discard a typewriter](https://www.stuttgart.de/service/entsorgung/abfall-abc/abfall-abc/schreibmaschine).
How German, I suppose...

Furthermore, I've simplified one thing:
You actually can take a closer look at an executable and undo the compilation.
This process of converting an executable back into source code is called `reverse-engineering`.
It is often incredibly tedious and unfeasable.



Take a look at this typewriter.
Sure, you can write your document with it but there's more.
You can open it up; just pop off the metal panels and you get a good look at its internals.
Perhaps all the metallic pieces don't make much sense at first to you but you can still look at them.
You bought this view alongside the typewriter.
And you can use this view to let your curiosity feast.
Perhaps you press a key and follow the mechanics that result in some ink on the page.
You follow the ribbon unspooling on the left, getting hit by the hammer in the middle and collecting on the other spool on the right.
You get a chance to understand all there is about this typewriter.
You get to unroll the spent ribbon and see the letters you pressed through it.
Now, on some typewriters you can see the typed letters on the ink ribbon.
Maybe you've written something confidential and that's a security concern for you.
You know about that because you're so close to the technology.
You're the one replacing the ink and thus know that this is a security concern.

Compare this to the modern text processor.


You understand the security implications of writing on a typewriter, perhaps a shared typewriter.

You know exactly what the ink is for and how it is used.
Yes, if you only want to write that one document none of this matters at all.


- ownership


So, how did things use to work.
Picture a mechanical kitchen scale.
You know, the thing you weigh flour with.
And now consider a mechanical one, without batteries, without microprocessors, just metal, gears and springs.
You want to own a mechanical kitchen scale because you need it.
When you go to the manufacturer, money in-hand, what do you expect to receive?
A scale, of course.
Let's look at it.

What if you want to modify it in some way?
Maybe you want to change it's color or replace the keycaps.
What do you need to do that?

Now fast-forward half a century and now we don't use typewriters any more.
We use personal computers, machines capable of all kinds of work.
You can use the same computer for different tasks by installing a different application on it.
All they need is 

Let's look at a different thing:
A text processing program, something like LibreOffice Writer or Word or Google Docs.
You have some document to write and go to a manufacturer, money in-hand.
What do you expect to receive.
You already have a personal computer running an operating system like Linux or Windows or macOS.
To use your text processor you need a piece a binary executable.
A binary executable is a piece of compiled source code.

I argue this is a fundamentally different situation.
What we've been doing before, receive the thing that we need right now, i.e., the executable is not enough.

Also, what world is this?
What life is this when we all walk among things we can't touch or open or tinker with.

When you're surrounded by Open-Source systems you are invited, encouraged, to interact with the world differently.
You aren't waiting for some corporation approving your access request and giving you the secret source code.
You can just grab the source of the things you love and look at how they work, you can discuss how they work, you can discuss how safe they are.
And, of course, you can change them, create your own or improve.
From this perspective, Open-Source really is just an entirely different mind-set, a mind-set of openness, that **you** are the one to change things.
Everyone is.
Everyone is!
Damn, EDM is pretty great.
I have no idea how I should pour this into something more coherent but typing is fun!

Thank goodness, we don't do this in the military sector.
Just imagine what power the manufacturer, and the manufacturer's country, would have over the customer.
Wait a moment!

When something is closed-source that means the manufacturer doesn't want you, the customer, to understand the product.
It means their business model somehow depends on everyone else not understanding this, not grasping it, not being allowed to play with it, work with it, tinker with it.
I think, in the world that we and software live in, that is horrible and doomed to failure.
Especially security requires as many people (users) to understand as much of the world as possible.
That's why we need as much Open-Source as possible.

Let's start by stating that software is fundamentally different to everything that has come before.

Fundamentally, 

If you don't do that, if you don't pick up the developer hat and take a look behind the scenes, you still benefit from others doing so.

You get safer, cheaper, higher-quality, sovereign products.

Sometimes people, more specifically my bosses at IBM, ask me why the hell we should open-source something.
Who would ever want to look at the code for this server application.
Well, it's about the principle.
It has always been about the principle, the mind-set, the society.
That's all about the principles.
And the principle is to publish as a default and, maybe, keep things private if there are really good reasons not to.

The arrival of software changed things.
Open-Source is the response to that change.

While I've structured this article to only come to the conclusion that Open-Source is amazing, it's been more the other way around.

- easy to change (i.e. satellite)
- easy to do yourself
- look **and** touch
- security -> ongoing support
- final product inherently opaque
- 

Furthermore, the final software product is inherently opaque.
You cannot easily look into a binary and figure out what it does or change it.
There's an entire science dedicated to trying anyways, reverse engineering.


https://netzpolitik.org/2024/open-source-bundestag-staerkt-sovereign-tech-fund/

- hate depending on things
- hate having things taken away from me
- hate when tools get in the way
- Einstiegsdiskussionsfrage
- in neue Bereiche einarbeiten
- Autonomie durch Forken -> Demokratie

- Problem: oft Abhängig von einzelnen Entwicklern
- Bug-Resilience-Projekt: Investition in Sicherheit

- self-governing, self-organizing community
- do not repeat yourself, but supply-chain attacks
- differnt mind-set: **you** are the one capable of changing things, improving things -> Democracy
- Digitale Souveränität

- Perspektiven: Nutzer, Entwickler, 

# Chris
- mehr als Code: text, wikipedia, hardware
- Konzept
- public code < open-source
- jeder kann zu gleichen Teilen mitwirken
- demokratisch?
- Stolz auf Code, so sehr, dass ich will, dass jemand draufschaut
- Feature Request zu Pull Request schnell -> Feature Complete durch Demokratie, Meinungsfreiheit

- Problem: GitHub als Platform
- Problem: Maintainer machen keinen guten Job in Lineage OS

### Als Nutzer
- bessere Software im Allgemeinen
- bessere Software durch keine Pop-ups
- mitwirken als Entwickler
- viel von Entwickler für Entwickler
    - viel manuel zu konfigurieren
- manches gibt es nicht in Open-Source, Kleinigkeiten ein Problem für nicht-Entwickler
- kein Support
- keine Haftung
- kein Vendor lock-in
- Wechsel: Windows -> macOS vs Fedore GNOME -> Debian GNOME

### Als Firma, Dienstleister
- Wichtig: Support, Hosting, Haftung, SLAs, Zertifizierungen
- DRM schwierig
- Auftraggeber muss komplette Entwicklung bezahlen
- Supportvertrag -> Geldquelle

### Als Bürger
- Ohne Vendor lock-in, wenn der Kunde entscheiden kann, wenn es tatsächlich Konkurenz gibt, dann funktioniert Kapitalismug -> weniger Optionen
  Open-Source macht Wechsel einfacher -> bessere Welt (z.B. )
- bessere Dienste durch bessere Konkurenz
- Grundgesetz Rechte lagen bei Verlag, jetzt: https://www.gesetze-im-internet.de/gg/BJNR000010949.html
  Gleiches für Software
- PCWahl: keine Sicherheit durch offene Software
- Autonomie von USA, Microsoft
- DSGVO
- Frankreich Office Suite?
- Behörde geht zu SAP: Entwickel das Open-Source
- Software (SaaS) ist kein Stück Munition oder Service, der abgeschlossen ist und komplett dem Kunden gegeben wird
  Software muss sich ändern, weiterentwickelt werden, Sicherheitsupdates, Software ist nie fertig, Laufender Prozess
- Public Money, Public Code
- Ownership: keine Lizens, sondern Besitz des Codes -> teurer
- EU Sammlung an Software
- Flickenteppich kostet Zeit und Geld

### Wo nicht
- Militär 
- aber: KPMG Reaktor im Geheimen, Probleme (Positive Voide, Runaway Void) bekannt aber geheim
- Open-Source as a default, manche Bereiche heikel

### China?
- 
- RiscV
democratization

