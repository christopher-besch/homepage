---
title: "Docker: Breathing Life into Decades old Fortran"
description: "
Bringing decades old Fortran code to life with Docker and animating it with Python.

Now you get to see Fig.3.5. from \"Introduction to Conventional Transmission Electron Microscopy\" by Prof. Marc De Graef at 30 frames a second.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 70
hero_vertical_position: 70
slug: ctemsoft
date: "2025-04-06"
listed: true
---

<HalfImage src="lens_3_5_cropped.png" />

The other day a friend came by: "Do you know some Fortran90?"
She was reading "Introduction to Conventional Transmission Electron Microscopy" by Prof. Marc De Graef and wanted to reproduce Fig.3.5 on the right (or above on mobile).
That figure is rendered by [lens.f90](https://github.com/christopher-besch/ctemsoft/blob/main/src/lens.f90).
Thing is, I don't have any experience with Fortran or electron microscopy for that matter.
The code is two decades old and the documentation slim.

So what do you do?
You spin up a new Docker *container* and start hacking.
Naturally, you like Debian so go with that and download the [original code](https://ctem.web.cmu.edu) into the current working directory:

```bash
docker run --name ctemsoft -ti -v .:/code debian
```

This creates a new Docker *container* off of the Debian *image* and jumps you into a bash shell inside that *container*.
Once you've figured out what commands make that Fortran code compile you can write them to <del>your diary</del> a *Dockerfile*.
A *Dockerfile* specifies how an *image* is to be built allowing someone else to pick up your work where you left it off.

Docker, if you don't already know, is great for these sorts of things.
When you need a reproducible environment a virtual machine is too big a gun most of the time.
Docker is a lot more efficient and offers more rapid turnaround times.
And still, when "it works on my machine" using Docker, it'll work on yours too, using Docker.

Unfortunately, this amazing tool doesn't save you from compilation errors and figuring out what dependencies you need and how to get them.
Some [stackoverflow](https://stackoverflow.com/questions/19916119/how-do-i-find-where-a-symbol-is-defined-among-static-libraries) might help:

```bash
find / -name \*.a -exec bash -c "nm --defined-only {} 2>/dev/null | grep 'cgetrf_' && echo {}" \;
```

After patching the code a couple of times you get it to compile.
For the runtime errors you mail Prof. De Graef and are eternally grateful for his kind support.
Seriously, do get in touch with people!
The patched code is on [github.com/christopher-besch/ctemsoft](https://github.com/christopher-besch/ctemsoft).

In the end you'll have this *Dockerfile*, split into two stages:
1.  The compilation stage:
    Here you need the compiler and some build dependencies.
    All you do is copy the source code over into the *container* and run `make all` to compile.
    The final binary will be in `/code/exe/lens`.
2.  You need that binary in the second container so you copy it over and install some runtime dependencies.
    This includes Python which we'll get to just below.
```dockerfile
# compilation stage
FROM debian AS builder

RUN apt-get update && \
    apt-get -y install \
    make \
    gfortran \
    liblapack3 \
    libblas3 \
    liblapack-dev \
    libblas-dev

RUN mkdir -p /code/exe
COPY ./src/ /code/src

WORKDIR /code/src
RUN make all

# Python runtime stage
FROM debian

RUN apt-get update && \
    apt-get -y install \
    libgfortran5 \
    python3 \
    python3-numpy \
    ghostscript \
    ffmpeg

COPY --from=builder /code/exe/lens \
    /usr/bin/lens
COPY ./python_src/ /python_src
WORKDIR /python_src
ENTRYPOINT ["/bin/python3", "/python_src/main.py"]
```

# Let's make it twirl!

<HalfVideo src="lens_cropped.mp4" />

lens.f90 takes in a bunch of configuration parameters: the magnetic field strength your electron microscope boasts and the number of sampling points for example.
Let's interpret these parameters as a vector in the six-dimensional (or nine-dimensional if you have two fields) configuration space.
Now you can interpolate from one configuration to another:
Just take the vector representation of the first and last configuration and linearly interpolate.
You can choose how many intermediate frames you want and run lens.f90 for each of them.
This makes a video!

Writing a [Python script](https://github.com/christopher-besch/ctemsoft/blob/main/python_src/main.py) is probably a great idea.
[`subprocess.Popen`](https://docs.python.org/3/library/subprocess.html) is pretty neat for starting lens.f90 as it reads the configuration from stdin.

```py
proc = subprocess.Popen(
    "lens",
    stdin=subprocess.PIPE,
)
proc.communicate(input=str.encode(input_str))
```

You can even start multiple renderings at the same time and properly parallelize this baby — if you've already burned four hours on this maybe save two minutes twiddling your thumbs?
lens.f90 creates a bunch of Postscript files as a result.

With Ghostscript you convert these Postscript files to PNGs.

```py
subprocess.Popen(
    [
        "gs",
        "-dSAFER",
        "-dEPSCrop",
        f"-r150",
        "-sDEVICE=pngalpha",
        "-o",
        input.output_png_file,
        input.output_ps_file,
    ],
)
```

And now you use ffmpeg to convert the PNGs to an MP4.
Getting ffmpeg to spit out MP4s that can be played by anything other than VLC always takes some wiggling around.
This is what you come up with:

```py
subprocess.Popen(
    [
        "ffmpeg",
        "-framerate",
        f"30",
        "-i",
        f"./out/%03d.png",
        "-vcodec",
        "libx264",
        "-f",
        "mp4",
        "-vb",
        "1024k",
        "-preset",
        "slow",
        "-pix_fmt",
        "yuv420p",
        "./out/lens.mp4",
    ],
)
```

If you'd been especially fancy you could've used more than two configuration vectors and a spline interpolation instead of the lerp.
But you already consumed all your fancyness on some over-engineered application-design with way too many structs, so you don't.

# Conclusion

With the (patched) Fortran code, the *Dockerfile* and the Python script everyone can reproduce the compilation:
Check out the [Git Repo](https://github.com/christopher-besch/ctemsoft) and run Docker:
```bash
git clone https://github.com/christopher-besch/ctemsoft
cd ctemsoft
# [edit python_src/main.py to your liking]
docker build -t chrisbesch/ctemsoft .
docker run -v ./out:/python_src/out chrisbesch/ctemsoft
vlc out/lens.mp4
```
And now you have made an animated video out of decades old code in a language you don't know in a way people will be able to understand for decades to come.

So when you're creating something of your own consider creating a *Dockerfile* for that, too.

{/* ffmpeg -i lens.mp4 -vf 'crop=1026:1437:144:187' lens_cropped.mp4 */}
{/* ffmpeg -i lens_3_5.png -vf 'crop=1026:1437:144:187' lens_3_5_cropped.png */}
