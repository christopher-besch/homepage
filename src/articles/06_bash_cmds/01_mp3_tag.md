---
type: article
title: "Bodging MP3 Names in Bash"
description: "
Why do it properly when a Bash one-liner does it too?
"
banner: /social_banner/bash_cmds.png
thumb: ../../../static/social_banner/bash_cmds.png
slug: bash_cmds/mp3_tag
date: 2022-10-12T00:00:00+00:00
listed: true
version: 1.0.0
---

```bash
find . -name '*.mp3' \
    -printf 'echo $(exiftool -json "%p" | jq -r .[0].Track | python3 -c "print(str(int(input())).rjust(3, \\"0\\"))") "-" ' \
    -printf '$(exiftool -json "%p" | jq -r .[0].Title) | ' \
    -printf 'mv "%p" "%h/$(tee).mp3" && ' \
    -printf 'echo "%p" \n' | \
        sh
```

Ok, let me break this down for you:
```bash
find . -name '*.mp3' -printf '%p'
```
get's all files ending with `.mp3` (and directories too but I didn't bother adding `-type f` to exclude them).
Then it prints something for each file (without adding newlines between the files).
`%p` gets replaced by the file's path.

Instead of just printing the file name we print multiple commands that get piped into sh.
Each one consists of two parts plus a cherry on top.

## The First Part
Bash replaces `$(some_cmd)` with the output of `some_cmd`.
Therefore
```bash
echo $(exiftool -json "%p" | jq -r .[0].Track | python3 -c "print(str(int(input())).rjust(3, \\"0\\"))") "-"
```
expands to the output of that big concoction plus the little dash after the last brace.
In bash pipes, denoted by `|`, take the output of the left-hand command and input it into the right-hand one.
This is used to get all the metadata of our MP3 file in JSON format (`exiftool -json "%p"`) and extract the track number with `jq -r .[0].Track`.

But we want to pad that number to always have three digits (`007` instead of `7`).
There are thousands of different ways to do that but I didn't bother looking them up and settled for probably the most complicated one:
We're going to use Python!
```bash
python3 -c 'print("Hello World")'`
```
runs
```python
print("Hello World")
```
So
```bash
python3 -c "print(str(int(input())).rjust(3, \"0\"))"
```
runs (`\"` gets escaped to `"`)
```python
print(str(int(input())).rjust(3, "0"))
```
which does the padding in a very, very bad way.
But we're not here to do clean stuff, we're here to bodge.
To make this run in the `-printf` flag, we have to escape the `\` (which we used to escape the `"`) with another `\`.

### The First Part, Part Two
```bash
-printf '$(exiftool -json "%p" | jq -r .[0].Title) | ' \
```
Does the same as what we've just seen but with the song title, which doesn't require our Python <s>bodge</s> magic.

So the entire first part prints out `007 - song name`.

## The Second Part
Now we want to use this to name our MP3 file.
Therefore we pipe the first part's output into mv.
But mv doesn't support pipes like that so we have to spill some tee.
I'm terribly sorry, I mean `$(tee)`.
The tee command does a lot of stuff but for all intents and purposes it just prints out whatever is piped into it.

So
```bash
-printf 'mv "%p" "%h/$(tee).mp3"'
```
first replaces `%p` with the file's original path and `%h` with the path to the directory the file is located in.
Then `$(tee).mp3` get's replaced with the output of our echo command plus the file extension.
So it changes the name to `007 - song name.mp3`.

## The Cherry on Top
Once all that has been done,
```bash
-printf 'echo "%p" \n'
```
ensures that after mv did it's business, the file path get's printed to the console, so that the user knows something is happening.
And it also adds a linebreak in the end so that sh executes one command at a time.

# To Put it in a Nutshell
sh executes a list of commands that got printf-ed by find.
In the end these commands change the name of a file to something else.
And that something else got created by echo, which is printing a string that bash expands to the track number, a `-` and a string that bash expands to the song title.
Bash does that by cleaning up the output of exiftool.
This cleaning up is in turn being partially performed by python3, which runs a tiny Python script.

Pretty easy, isn't it?
Getting this one-liner to work with files that include `'` and/or `"` is left as an exercise to the reader.

Oh and it might also delete files without a track number, maybe try fixing that too.

