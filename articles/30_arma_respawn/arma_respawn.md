---
title: "Enable Respawn in ARMA: Cold War Assault"
description: "
The milestone in gaming history that is Arma: Cold War Assault (previously Operation Flashpoint) is a blast and runs on a toaster.

Now I'm creating my own missions and wanted to enable respawning.
That's not easy so here I explain how you go about doing that.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 40
hero_vertical_position: 50
slug: arma_respawn
date: "2026-06-21"
tags: [gaming, arma, wine]
listed: true
---

I wanted to play a military simulator with friends that is
- DRM free and
- runs on Linux (through Wine).

That brought me to the milestone in gaming history that is [Arma: Cold War Assault](https://www.gog.com/en/game/arma_cold_war_assault) (previously Operation Flashpoint).
It's a blast and runs on a toaster.<br />
Now I'm creating my own missions and wanted to enable respawning.
That's not easy so here I explain how you go about doing that.

Open the Mission Editor and create the mission of your dreams.
In my case that's a multiplayer mission.
I want players to respawn at their base so I add a marker called `respawn_west` because we're playing as NATO and not as the USSR.
`respawn_east`, `respawn_guerrila` and `respawn_civilian` are the other three options.
Usually you need to select `Save` and then `Export to multiplayer missions`.
Unfortunately, this makes it more difficult to enable respawning in your mission.
We need to select `User mission`, instead.
<HalfImage src="./save_mission.png" full="true" />

That is because The Mission Editor exports a `.pbo` file into, e.g., `C:\GOG Games\Arma Cold War Assault\MPMissions\defend_the_fort_v9.cain.pbo` when selecting `Export to multiplayer missions`.
(I called the mission `defend_the_fort_v9`.)
`.pbo` is the format ARMA expects the mission to be in so that one may play it.
However, in that format we cannot adjust any options, like respawning behaviour.
The `.pbo` file is a compressed directory containing a bunch of files.
When saving as `User mission`, however, the Mission Editor doesn't create a `.pbo` file but saves the raw directory, e.g., into `C:\GOG Games\Arma Cold War Assault\Users\Stromel\missions\defend_the_fort_v9.Cain`.
That's where you'll find a `mission.sqm` file, also.

We need to create (or modify) the `description.ext` file inside it.
It is explained on the [Bohemia Interactive wiki](https://community.bistudio.com/wiki/Description.ext#Respawn/Revive).
What I want is to respawn at the base so I write:
```
respawn = "BASE";
respawnDelay = 20;
```
You can choose from `NONE`, `BIRD`, `INSTANT`, `BASE`, `GROUP` and `SIDE` (see the above wiki for an explanation).
Okay, but we want to *play* our mission and for that we need a `.pbo` file.
To convert our directory into a `.pbo`, we use BinPBO, which is a part of the official [BI Tools](https://community.bistudio.com/wiki/BI_Tools).
During installation it will ask you *a lot of times* to continue the install.
Just install everything;
I tried only installing some of the tools and it didn't work.
Oh, and ignore any funny prompts.
<HalfImage src="./not_enough_space.png" full="true" />

Now we can start `C:/Program Files (x86)/Bohemia Interactive/Tools/BinPBO Personal Edition/BinPBO.exe` and choose the mission directory and where to put it.
Lastly, the `Binarize` option didn't work for me so I disabled it.
It works all the same.<br />
You can upload your `.pbo` to [ofpisnotdead-com.github.io/rust-pbo-wasm](https://ofpisnotdead-com.github.io/rust-pbo-wasm) and check if the `description.ext` file exists.
<HalfImage src="./binpbo.png" full="true" />

And that should be everything.
Load your new mission in the `Multiplayer` section in ARMA and you should respawn on your base when you die.
Though, do remember that you need to do this procedure every time you export from the Mission Editor.<br />
And as I've said, I'm doing all this on Linux through Wine, managed by [Lutris](https://lutris.net).
Just use the `Run EXE inside Wine prefix` function to run programs and installers.<br />
Have fun blowing eachother up—repeatedly.
<HalfImage src="./banner.png" full="true" />

{/*
- https://pmc.editing.wiki/doku.php?id=ofp
- https://steamcommunity.com/sharedfiles/filedetails/?id=936337313
- https://community.bistudio.com/wiki/Operation_Flashpoint:_Weapons

`this addWeaponCargo ["LAWLauncher", 10]; this addMagazineCargo ["LAWLauncher", 100]; this addWeaponCargo ["M16GrenadeLauncher", 10]; this addMagazineCargo ["M16", 100];`
*/}
