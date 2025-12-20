---
title: "Why I love Open-Source"
description: "
We all live in a world of immensely complex technology.
The concept of Open-Source might seem radical at first but it's indispensable in our world.
Regardless if you are a user, developer or simply interested in a healthy society, you benefit from Open-Source and we should fight for every bit of it.
Open-Source is a quality mark, a form of democracy and ownership, capitalism at its best and thus the response to this world, a world in which software exists.
This article gets to that conclusion without requiring any prior technical knowledge.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 40
hero_vertical_position: 0
slug: open_source
date: "2025-10-11"
tags: [thoughts_and_emotions, politics]
listed: true
---

We all live in a world of immensely complex technology.
The concept of Open-Source might seem radical at first but it's indispensable in our world.
Regardless if you are a user, developer or simply interested in a healthy society, you benefit from Open-Source and we should fight for every bit of it.
Open-Source is a quality mark, a form of democracy and ownership, capitalism at its best and thus the response to this world, a world in which software exists.
This article gets to that conclusion without requiring any prior technical knowledge.

## Background
Nevertheless, you'll need the following concepts, which I'll explain below: *hardware*, *software*, *executable*, *compilation*, *source code* and *software license*.
Firstly, I'll start with an example, your laptop:
The thing you can hold in your hand is *hardware*, the text editor you use on it is *software*.
To use this text editor you need to give your laptop an *executable*.
The developer of that text editor wrote *source code* and converted (i.e., *compiled*) that into the executable.

<HalfImage src="eniac.jpg" />

With this example in mind, enjoy the general explanation:
For centuries we humans have been hard at work creating technology.
For most of that history, technology has been pieces of physical machinery designed to fulfil a specific purpose.
This is *hardware*, something you can touch.
Now at some time smart people created hardware that didn't just fulfil any single specific purpose.
They invented the general purpose computer (the image on the right or above), a machine that executes an *executable*.
An executable instructs the computer exactly what to do and is a form of *software*.
Your laptop is such a general purpose computer — a joker card that performs different specific purposes depending on what software you execute on it.
You can't touch software, you can only touch the hardware you feed the software into.

Though an executable is an abstract piece of data, you can represent it using `0` and `1` characters.
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
You won't understand any of this, in fact no-one will.
If, instead, you give it to a computer, it will execute this executable and perform the action defined in it.
In this example's case, the computer would simply say `Hello World!`.
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
You could probably figure out how to modify this software so that is says `Hello Anna!` instead, right?
Source code is understandable and editable by humans.
The developer uses a tool called the *compiler* to compile her source code into an executable.

Remember the differences between source code and executable as they are crucial for this article:
- The user needs only an executable to use a piece of software.
- A human cannot understand or edit an executable.
- However, a human can very well understand and edit source code.
- The compiler easily converts source code into an executable.
- On the other hand, you cannot convert an executable back into its source code.

### Software License and Open-Source
(This is no legal advice.)
Source code falls under the law of copyright:
Because the developer wrote the source code, she can decide what to do with it.
Of course, the developer gives the user an executable.
However, she might not allow the user to do whatever he wants with her software.
For example, he might not be allowed to sell the software himself.
The developer lays out conditions in a legal document called the *software license*, which the user must accept.
There are different kinds of such licenses.
In this article we are concerned about *Open-Source licenses*.
An Open-Source license makes a software Open-Source.
Technically, there are multiple different Open-Source licenses.
The Open Source Initiative (OSI) keeps a list of OSI approved licenses that fulfil the [definition of Open-Source](https://opensource.org/osd).
To me, the most important aspects of Open-Source software are:

1. Everyone has free access to the source code.
2. Everyone may modify the software.
3. Everyone is allowed to sell and redistribute the (modified) software, both as an executable and as source code.

Note how this does not mean that the executable must be free, too.
It also doesn't mean the developers waives her copyright.
Actually, she still very much has the copyright and, within the definition of Open-Source, may define restrictions on using the software.
For example, some Open-Source licenses require you to publish any modified source code under the same license.
Such licenses (e.g., GPLv3) are *copyleft* licenses.
Others, like the MIT license, don't have such a copyleft clause.
So while the concept of Open-Source might sound radical to some, it leaves a surprising amount of power to the software developer.
This will become important when we talk about one of the main issues with Open-Source: [monetization](#how-do-you-monetize-open-source-software).

*Closed-Source*, as you might imagine, is the opposite of Open-Source.
Closed-Source software generally doesn't allow the user to see the source code.
As stated above, you need the source code to understand and modify the software.
Without the source code, the user isn't able to do any of that.

## The User of Open/Closed-Source
Okay, this has been all long and windy.
Let's get to the point:
Say you want to write a document with your laptop.
You already have the hardware and are missing the software.
What you need is a text editing program, something like LibreOffice Writer or Word.
You choose one of them, pay the manufacturer and receive an executable.
Your laptop feeds on the executable, you can write your document and everything is well.
Word is a Closed-Source product by Microsoft.
LibreOffice Writer is an Open-Source product by the Document Foundation.
Now, what does that mean to you, the user?

Say you bought Word 2019.
Then you only receive the executable and no more.
You have no insight into how the thing you bought works because Microsoft keeps the source code secret.
There's no way of modifying the product you bought in any way.
Only Microsoft can change Word.<br />
What if you got Open-Source LibreOffice Writer instead?
You receive not just the executable, with which you can write your document, no.
Instead, you and everyone else has access to its source code, too.
This is the form of LibreOffice Writer in which the (original) programmers modify it.
Therefore, you can look into LibreOffice Writer and make sense of all its functions.
Perhaps you're interested in what happens to your document when you hit `Ctrl+S` and save your document.
Maybe you're concerned about who might read your <del>smut</del>confidential information.
Then you can just take a look at the source code and see exactly what happens to your data.
Nothing is hidden from you, because Open-Source means **Insight**.

Or, if there's a button in the user interface you're specifically interested in, you can look at the source code that belongs to that button.
You can figure out exactly what that button does and how.
Perhaps you have some very specific use-case.
Maybe you're color blind and want to change the color of the button.
Then you can implement that change yourself, because Open-Source means **Modifiability**.

Let's come back to what happens when you `Ctrl+S` your document.
Some versions of Word suddenly started sending the document to a Microsoft server per default.
Data on such a server can be accessed by, among others, Microsoft personnel and the government the data resides in.
That is probably not the country you're living in, btw.<br />
The Open-Source LibreOffice Writer doesn't suddenly start doing that.
After all you and everyone else is reading the source code so you'd notice a change like this.
And even if such a change did happen, you could change the source code back.
There are so many companies trying to sell their product under the name of privacy.
The companies that truly deliver on that create Open-Source software, because Open-Source means **Privacy**.

What's more, you probably don't just want to write documents but also read some written by other people.
When you download a document from the internet and open it in Word or LibreOffice Writer you might get hacked!
Okay, how's that?
Well, software is never perfect.
Developers make mistakes and some of these mistakes allow people to create documents that hack you, to e.g., steal your banking login.
Such mistakes are called *vulnerabilities* and they are, obviously, bad.
What you need is *security support*, which is someone hunting for vulnerabilities and fixing them.
In the case of Word, Microsoft provides that service.
Whenever they find a vulnerability they remove it and release a new executable.
No one else can do that because only Microsoft has access to the source code.
But if you're using Word 2019 you're out of luck:
Microsoft stops supporting Word 2019 after 14th October 2025.
They recommend you to use Microsoft 365 instead for a monthly fee.<br />
Because LibreOffice Writer is Open-Source, heaps of people read through its source code all the time, search for vulnerabilities and publish fixes.
Furthermore, any company with the technical abilities can provide support — not just the original manufacturer.
This most dearly matters to security critical applications like telecommunication encryption.
Tetra, for example, is a Closed-Source method of encrypted radio communication.
Unfortunately because it's source code is kept secret, very few people ever looked at it.
Therefore, it is ungodly insecure and has been [hacked](https://www.midnightblue.nl/research/tetraburst) many times in colorfully different ways.
Too bad, a lot of police and military use it.
TLS, on the other hand, is an Open-Source encryption software and powers most of the internet.
Consequently, incredibly many people comb through its source code.
Hence, it is one of the most secure encryption methods in existence, because Open-Source means **Security**.

There's one more important aspect to the debate: Interoperability.
LibreOffice Writer stores documents in the Open-Source OpenDocument format by default.
This format is supported by dozens of text editor, including LibreOffice Writer and Word.
Because it is Open-Source, those other manufacturers know how to make their software understand this format.
Therefore, when you've written a bunch of documents in LibreOffice Writer, you can switch to any other text editor whenever you like.
After all, you can easily open your documents with that new software, too.<br />
This is a different story with Word.
Word only fully supports a Closed-Source document format.
No other text editor fully supports that file format.
Though there are some ways of converting Word documents to the OpenDocument format, that process does not support all features (e.g., text might be misaligned).
This is called *vendor lock-in*:
The vendor, i.e., Microsoft, locks you into using Word because switching is harder than it should be.
When you use Open-Source software, on the other hand, you can easily switch to a competitor — even back to a Closed-Source one.
Open-Source means **Autonomy**.

There's another facet of this autonomy:
Microsoft doesn't just sell Word.
They also want to sell the operating system Windows, OneDrive and a bunch of other software.
They disallow using Word in conjunction with competitors to the software they also want to sell.
For example, you may not use the Word executable on a laptop using the Linux operating system.
If Word were Open-Source, people could enable support for other operating systems.
Closed-Source means being locket into not just one software, but a manufacturer's entire ecosystem.

To me, these are the main selling points of Open-Source for a user:

- **Insight**: the software doesn't hide anything from you.
- **Modifiability**: you can change whatever you want about the software.
- **Privacy**: you know and control what the software does with your data.
- **Security**: the software doesn't allow other people to hack you.
- **Autonomy**: you are free to choose what software you use.

As you can see there is a lot of "you" in that list.
Personally, that's why Open-Source gives me a sense of ownership that I can't get any other way.
We'll get back to this point, though.
First let me address a few counterpoints.

### But I Don't Want / Know How to Touch Source Code.
That's perfectly fine.
But trust me, there are plenty of people who do.
Actually, there are entire communities of people looking at Open-Source source code and improving it.
And Open-Source software benefits from that — you benefit from that.
Because everyone can read the source code of Open-Source software, you can pay everyone with the technical abilities to implement whatever specific feature you need.
This is what the [Austrian military](https://blog.documentfoundation.org/blog/2025/09/30/austrias-military-switches-from-microsoft-office-to-libreoffice) did.
They needed certain features in LibreOffice and contracted a local company to do so.
It is very important to them, and to me, to clarify that Open-Source does not mean cheap, it means *free* as in *free*dom.
The Austrian military very much cares for the data they handle and mainly seek the privacy LibreOffice Writer provides.
That's why they chose Open-Source.

### So you're just Bashing Word and Microsoft?
No, I don't, not at all!
I'm only using LibreOffice Writer and Word as an example for a bigger concept.
All of the above points apply to Open-Source in general.
Also, Microsoft is no more or less evil than any other corporation.
They actually do work on some Open-Source software, too.
And I think that's pretty cool!

### Why wasn't Closed-Source a Problem Back in the Day?
<HalfImage src="chrisw_typewriter.jpg" />

Let's buy a typewriter (picture by [Christoph Wolf](https://teccheck.xyz))!
Sure, you can write your document with it but there's more.
Open it up; just pop off the metal panels and you get a good look at its internals.
Perhaps all the metallic pieces don't make much sense at first but you can still look at them.
You bought this view alongside the typewriter.
You bought the ability to understand the typewriter.
These two things are linked together in a way software just isn't.
To understand software you need more than just the executable required for using it, you need the source code.
From this perspective, the old way of technology is much closer to Open-source than to Closed-Source.
However, if the manufacturer switched from mechanical typewriters to software and kept giving the user only the minimum to write a document, you end up with Closed-Source software like Word.
That's a loss.
I argue, Open-Source is the **response to a world in which software exists**.

<HalfImage src="chrisw_typewriter_open.jpg" />

Let me spin this along a little more:
Press a key on the typewriter and follow the mechanism producing some ink on the page.
You follow the ribbon unspooling on the left, getting hit by the hammer and collecting on the other spool.
On some typewriters you can still see the typed letters on the ink ribbon.
Maybe you've written something confidential and that's a security concern for you.
Because the typewriter is not a black-box like Word is, you can look inside and realize that yourself.
Now, go dispose of your spent ribbon responsibly.

I'm only using this typewriter as an example but I believe the problem to be fundamental.
Theoretical computer science tells us that software is inherently difficult to reason about.
Even the original developers of software can't foresee most of what the software will do.
Actually, that's one of the reasons there are so many vulnerabilities in software.
Consequently, with the arrival of software, we need more curious people than ever.
And those curious people need a chance at understanding the technology surrounding us.
This is the only way we can tame this beast.
We cannot delegate that understanding to a few select people and treat technology as black-boxes; we all need to participate in some way.
Open-Source is the way that is possible.
When you're surrounded with Open-Source software you are invited, encouraged, to interact with the world more intimately.
You realize that *you* are the one to understand, change and improve.
This results in an inherently more secure world.
When, instead, something is Closed-Source that means the manufacturer doesn't want you, the customer, to understand the product.
It means they don't see the potential in you or even fear it.
So much is lost when we just wait for others to do things.
Also, in a more poetic way, we are a species of curious animals.
What life is this when we all walk among devices we can't touch or open or tinker with?
Therefore, I consider Open-Source a form of **enlightenment**.

### So I've Changed some Source Code. What do I Do With It?
Say you implemented a new feature to the source code of LibreOffice Writer.
Very cool!
What do you do with this feature?
There are two options:

1. *Upstreaming* it.
2. Creating a *fork*.

Firstly you can go to the original LibreOffice Writer developers and offer them the features you have made.
They then discuss your changes and, if they like them, *upstream* them.
If that happens, your new feature will be in all new versions of LibreOffice Writer.
This is the best-case scenario, because you aren't the only user of your new feature.
Those other users might improve your new feature further.
You, of course, benefit from that.<br />
What if the LibreOffice Writer developers refuse to upstream your feature, however?
Then you can use the second option and create your own version of LibreOffice Writer.
This would be a *fork* of LibreOffice Writer.
Now it's up to the users to choose which version of LibreOffice Writer they want to use: the original or your fork?
This is actually very common in Open-Source.
People come up with all sorts of crazy ideas that are sometimes so radical, the original developers don't want to upstream them.
LibreOffice Writer itself is actually a fork of OpenOffice Writer, btw.
(And OpenOffice Writer is a fork of StarOffice Writer.)
The LibreOffice Writer developers implemented such cool new features they gathered so many people around them, they dwarfed the older OpenOffice and StarOffice Writer.

In contrast to Closed-Source software, there isn't just a single corporation deciding how things should be.
The power lies with the people.
Everyone with the technical abilities or is just curious enough can incur change.
Therefore, I consider Open-Source a form of **democracy**.

### But isn't Open-Source Incompatible with Capitalism?
Some might argue that Open-Source doesn't work well with capitalism.
They argue capitalism works so well because of all the competition.
Say, three companies develop software for the same purpose and fight for the user's favor.
If one of these products is Open-Source, the other two companies could simply copy that software and sell it, too.
Then the other two companies didn't have to develop their own software and there'd only be a single piece of software, not three.
Where's the competition?

Firstly, they are completely right, capitalism is quite the efficient machine and competition lies at its heart.
Secondly, we'll talk about how to monetize Open-Source software [later](#how-do-you-monetize-open-source-software).
Thirdly, that conclusion is wrong.
Open-Source does not lead to less competition; it leads to more.
Firstly, if you've read the [section above](#so-ive-changed-some-source-code-what-do-i-do-with-it) about forks you know how they compete for users.
There always are different ways of solving the same problem and the different forks reflect that.
Actually, the bigger problem in Open-Source is fragmentation where there is too much competition.
While I won't get into that in this article, rest assured, there are ways of dealing with fragmentation, too.

Think of the main reason Word is in use.
Is its interface easier to use or is it cheaper than the competition?
No, the main reason is that there already are so many documents written in Word's Closed-Source file format.
Because of that, people aren't able to easily use anything else.
That doesn't sound much like competition, does it?
Closed-Source is the real culprit here.
As discussed [above](#the-user-of-openclosed-source) Closed-Source tends to lock users into a single manufacturer's products.
In order for real competition to exist, users must be able to choose what restaurant they go to, what brand of toilet paper they buy.
And, of course, users must be able to easily choose what software they use.
The autonomy Open-Source provides enables that.
Hence, Open-Source is **capitalism at its best**.

## The Developer of Open/Closed-Source
Say you want to create a text editor yourself for some reason.
If you choose to make your software Open-Source, you don't have to develop the entire software yourself.
Instead, you can take LibreOffice Writer and use it as a basis for your idea of what a text editor should be.
This is a lot easier than starting from scratch and having to reinvent the wheel.
For you, personally, this has another facet when you're changing companies.
Make your work Open-Source and you never have to implement it again.
Open-Source is not an act of charity, it simply makes you **not repeat yourself**.

I've already talked about the sheer amount of text editors that support the OpenDocument file format.
You know how that came to be?
Well, the developers of StarOffice Writer developed that file format and made it Open-Source.
Then other people developing text editors simply used that file format.
Why develop a new standard, when there already is one you're free to use?
And that, in turn, benefited the developers of StarOffice because users of their file format can do more with it.
There, actually, are a lot of Open-Source standards.
So when you create an Open-Source product you might **establish a standard**.

Of course there's another point to this:
When you're keeping your software Closed-Source no one can see the crimes you've committed in the code.
If, however, you create Open-Source software, that means you're so proud of your source code, you want people to look at it.
Therefore, Open-Source is a form of **advertisement**.

To me, these are the main selling points of Open-Source for a developer:

- **Don't repeat yourself**, never have to implement something twice in your life.
- **Establish a standard** and thus an ecosystem around your product.
- **Advertise** yourself and your products.

### How do you Monetize Open-Source software?
Monetizing Closed-Source software is pretty straight-forward; you just sell the executable.
There's no one else who can do that.
Some might argue that companies need to keep their source code a trade secret to remain competitive.
Otherwise, other companies could just copy the source code and sell it themselves, driving you out of business.
I'll quickly go over a few ways you can monetize Open-Source, regardless of that threat.

Firstly, consider that **providing support** isn't easy.
You need both the source code and the technical expertise specific to the software in question.
Guess who is best qualified for that?
Of course, the programmers who originally developed the software; that's you.
Some companies make that their business model and sell support for their Open-Source software.<br />
Then there's another thing that isn't easy: **compilation and distribution**.
The Open-Source Android app DAVx⁵, for example, uses this approach.
If the user wants to easily install this app, they have to pay on the Google Play Store.
Instead, they could download the source code for free and compile an executable themselves.
But most users want the ease of simply hitting a download button and thus pay for that.
DAVx⁵ provides you with an up-to-date version of the executable.
The definition of Open-Source might force them to publish the source code but they are very well allowed to keep the executable secret.<br />
Or, maybe your Open-Source software goes nicely with some **hardware** you produce.
Then you can sell that.<br />
Or, instead, you take your product and make most of it Open-Source and some secret sauce **Closed-Source**.
Then you can sell that and still get most of the benefits of Open-Source (though some people frown upon that approach).<br />
Alternatively you can use the Open-Source software to establish a standard and then write some Closed-Source software for that standard.
You're the one who understands the standard the best, after all.<br />
Or, if you want to remain fully Open-Source, you can always **implement other people's feature requests** for some coin.

Those options, while they are not exhaustive, are all possible and done by players in the industry 
You're free to mix and match them however you like and, of course, always just ask for **donations**.
Sometimes that already suffices.
Wrapping this up, know that Open-Source requires a different business model than Closed-Source.
But notice that there is a business model for this and your developers and customers benefit hugely from your product being Open-Source.

## Conclusion
I won't hide my love for Open-Source.
I love it so much it aches whenever I'm not allowed to work with it.
Somehow I never got to sort my reasons for that feeling.
This article has been my attempt at doing just that.
We've seen why users benefit from Open-Source software.
Then we found those benefits to be vital in Open-Source's bigger role in society.
Lastly, we put on the shoes of a developer and found Open-Source to have many benefits here, too.
After all this, there are a few points I want to stress:

- Open-Source is no charity, though it can be.
- Open-Source does not mean *for free* or cheap.
- Open-Source also isn't a utopia.
  It's a world that already very much exists and we can have more of.
  Every little piece of Open-Source software makes the world a better place.

I hope you understand why I love Open-Source so much.
To me, the ownership aspect is the most important.
No one can take my way of experiencing an Open-Source product away from me.
I really want to own what I bought and that simply isn't possible with Closed-Source software.
Also, I just love this world.
It's a world in which you are invited to be curious, in which more and more people understand the technology they use.
It warms my heart to see that world being as huge as it already is and only seeing it grow.

### P.S.
I've simplified a few things:

- You actually can take a closer look at an executable and undo the compilation.
  This process of converting an executable back into source code is called *reverse-engineering*.
  It is often incredibly tedious and unfeasible.
- Technically not all programming languages produce executables.
  Though, the characteristics laid out in this article capture those compilation results, too.
  I just used *executable* as an example for a bigger concept.
- There are more flavours of Open-Source.
  For example there's Open-Hardware and Open-Data.
  In some places I called things Open-Source that are actually Open-Data.
  But the characteristics I described apply to all.

### P.P.S.
So I was looking to get my hand on an actual typewriter and searched for "Stuttgart Schreibmaschine".
The first result was an official wiki on the matter of [how to properly discard a typewriter](https://www.stuttgart.de/service/entsorgung/abfall-abc/abfall-abc/schreibmaschine).
How German, I suppose...<br />
Instead, [Christoph Wolf](https://teccheck.xyz) helped out, tracked down a typewriter and took a few pictures for me.
He even typed down this article's introduction on it, how cute!
<HalfImage src="chrisw_typewriter_article.jpg" full={true}/>
