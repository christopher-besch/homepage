---
type: article
title: "Maki, Atoms and Time Travel"
description: "
    Maki showcases how a program for interactive and programmatic animation development can be implemented.

    To create animations for technical concepts, one is advised to use graphics software with a programmatic approach.
    While these provide the required precision, they suffer from an inherent disconnect between input and output.
    An alternative are WYSIWYG programs, which avoid this detachment with interactivity at the cost of precision.

    Maki combines the best of both worlds.
"
banner: /social_banner/maki_atoms_and_time_travel.png
thumb: ../../../static/social_banner/maki_atoms_and_time_travel.png
slug: maki_atoms_and_time_travel
date: 2022-02-06T00:00:00+00:00
listed: true
version: 1.0.2
---
import AutoPlayVideo from "src/components/autoplay_video";
import Spacer from "src/components/spacer";
import Quote from "src/components/quote";

import full_showcase_01 from "./full_showcase_01.mp4";
import full_showcase_01_poster from "./full_showcase_01_poster.png";

import init from "./01_init.mp4";
import create_cube from "./02_create_cube.mp4";
import show_cube from "./03_show_cube.mp4";
import colouring from "./04_colouring.mp4";
import translate_cube from "./05_translate_cube.mp4";
import smooth_translation from "./06_smooth_translation.mp4";
import time_travel from "./07_time_travel.mp4";

import fly_around_01 from "./fly_around_01.mp4";
import fly_around_02 from "./fly_around_02.mp4";

<!-- problem -->
To create animations for technical concepts, one is advised to use graphics software with a programmatic approach.
While these provide the required precision, they suffer from an inherent disconnect between input and output.
WYSIWYG programs avoid this detachment with interactivity at the cost of precision.

<!-- purpose and methods -->
The purpose of this article is to outline how a program for interactive and programmatic animation development can be implemented.
To experiment with different technologies and programming paradigms, I created a developmental implementation called Maki.
This article outlines Maki's design decisions and discusses planned future development.

### Table of Contents
<AutoPlayVideo src={full_showcase_01} poster={full_showcase_01_poster} />

```toc
exclude: Table of Contents|Directory Overview
```

# Maki

- **Extensibility**,
- **performance**,
- **ease of use**,
- **strict type and thread safety**,
- **clear ownership** and the
- **fear of loosing (type) information** form Maki's main ideals.

I chose C++ because it enforces **strict rules** and offers handy containers, algorithms and many light-weight abstractions, aiding in the development of a complex system, without compromising on **performance**.

The goal of [Maki](https://github.com/christopher-besch/maki) is to allow the user to create 3D animations using Python;
while the user is constructing their animation in an interactive shell, Maki shows the current status of the scene in a separate window.
Here the user is able to freely move the camera.
In addition to spacial movement, Maki provides the ability to *jump in time*;
The user can decide which frame of the animation should be played.

This allows an **easy to use** workflow, minimizing the time between defining animations and playing with the results.

## Walkthrough
<AutoPlayVideo src={init} />

To start working with Maki, one has to initialize it.
This defines the rendering API to be used and creates a window of the specified size.

<AutoPlayVideo src={create_cube} />

Once that is done, you can create an atom.
This call to `add_cuboid_atom` returns a handle to the cuboid.
But you will see...that you don't see anything.

<AutoPlayVideo src={show_cube} />

That's because you've only created the atom;
you still have to tell Maki to actually render it.
This call to `show_cuboid_atom` orders Maki to start showing the atom at frame `1`.

<AutoPlayVideo src={colouring} />

We can also change the colour.
Each call again needs to know what frame it should be applied to.

<AutoPlayVideo src={translate_cube} />

Our cube can also be moved.
But Maki currently only supports instant movement—"teleporting" from one frame to the next.

<AutoPlayVideo src={smooth_translation} />

Smooth transitions have to be implemented on the Python side. 
This quick implementation performs just that; it smoothly shifts the cube from frame `60` to frame `200`.

<AutoPlayVideo src={time_travel} />

As you can see, Maki currently shows the 199th frame.
But now I'm applying another downward translation from frame `5` to `50`.
This downward shift lies in the past, so we expect the cube to be in a lower position in the present.
And that's exactly what we see:
The moment the shift is being applied, Maki performs a [Chrono Sync](#chrono-sync) and the cube changes it's position.
The past was altered, and we see the repercussions in the present.

<Quote text="The past was erased, the erasure was forgotten, the lie became truth." author="1982" />


<Spacer />

# Clear Ownership

Shared ownership, where multiple classes own a single resource, are convenient to implement;
*everything has access to everything*, so the optimum of possibilities has been achieved.
But those programs, in which *everything owns everything* and *everything calls everything* are very difficult to reason about and tend to be less performant.

When instead every resource is owned by only one object, that object's constructor acquires the resources and the destructor subsequently frees them.
This programming technique (called [RAII](https://en.cppreference.com/w/cpp/language/raii) by the C++ committee for silly names) leaves no need for any garbage collection.

But in some situations the same resource has to be *used* by multiple objects.
With an emphasis on *used*;
these situations don't necessarily warrant the use of shared ownership.
Instead the resource can be *borrowed*.
For example, without going into detail of what these classes actually do:
A `RenderDriver` owns a `Renderer` and an `AtomDispenser`.
The `AtomDispenser` needs the `Renderer` to perform its task, so it *borrows* it from the `RenderDriver`.
And because both the `AtomDispenser` and the `Renderer` are owned by the same `RenderDriver`, the `AtomDispenser` can rest assured that all its resources are (still) available.

This member function lends the `Renderer` to an `AtomDispenser`:
```cpp
void AtomDispenser::create_all_atom_renderers(Renderer* renderer)
{
    ...
}
```

But not having to garbage collect isn't the only performance advantage.
A **clear ownership model** also bestows a definitive purpose on each function and object.
Objects are restricted to the resources they need to fulfill their task:
Anything they don't need, they don't have access to.
This reduces side-effects and consequently improves debuggability.

Knowing in which context what data is being used, allows the programmer to optimize memory accesses for just these contexts.

<Quote text="Software does not run in a magic fairy aether powered by the fever dreams of CS PhDs." author="Mike Acton" />

Software runs on hardware, hardware that has certain tastes.
So if you intend to write fast software, you should base your data layout on the silicon it's supposed to run on.
Only because two concepts have something in common in the mental model of yours, doesn't mean their data representation has to have anything to do with each other.
In fact they may vary wildly.
That's why, what a concept's implementation should be based on, is the hardware in use, not the mental model of any programmer.

Therefore a **clear ownership** model is easier to reason about and the foundation for high performing software.
Memory layout will also play a major role in [Why Templates?](#why-templates).

# Renderer Abstraction
Even though Maki is currently using OpenGL only, different rendering APIs (like Vulcan, Metal or DirectX) can easily be added.
To achieve this many low-lever rendering concepts are implemented using abstract classes (e.g. `Shader`, `Renderer` and `VertexBuffer`).
The actual API specific implementations (e.g. `OpenGLShader`) can be found in a subdirectory:
```
.
├── opengl
│   ├── opengl_buffer.cpp
│   ├── opengl_buffer.h
│   ├── opengl_renderer.cpp
│   ├── opengl_renderer.h
│   ├── ...
├── buffer.cpp
├── buffer.h
├── renderer.cpp
├── renderer.h
├── ...
```
The abstract classes define the static function `create` to create an instance of the appropriate class:
```cpp
IndexBuffer* IndexBuffer::create(uint32_t count, const uint32_t* indices)
{
    switch(Renderer::get_renderer_impl()) {
    ...
    case Renderer::Implementation::opengl:
        return new OpenGLIndexBuffer(count, indices);
    default:
        MAKI_RAISE_CRITICAL("The requested renderer implementation is not supported.");
        return nullptr;
    }
}
```
The static function `Renderer::set_renderer_impl` is used to globally define the renderer API at Maki's boot up.

This decision, which renderer API should be used, is performed at runtime.
That way the user can decide which implementation to use:
Even so you're on Windows, you might want to use OpenGL instead of DirectX because you have custom shaders written in GLSL.

The situation is different for the platform, i.e. the window handling mechanism, which is selected based on the type of target system.
GLFW can be used on Linux, Windows and the MacOS;
WebAssembly might need something else.
The crucial difference to the renderer API is that the decision, which platform is to be used, can be made at compile time.
By using preprocessor statements to only compile the required platform, the switch statement can be avoided and some runtime overhead removed.
```cpp
#if PROJECT == glfw
    GLFWwindow* m_handle {nullptr};
#endif
```
This macro has to be set using the `-Dplatform=glfw` flag at compilation.

As you can see, **extensibility** lies at the heart of Maki.

# Multi Threading
<AutoPlayVideo src={fly_around_01} />

There are always two things happening concurrently:

1. accepting new atoms or changing existing ones and
2. rendering the scene or handling user interaction.

This is why it makes sense to use two threads, a control and a render thread.
Since OpenGL doesn't allow multiple threads to use the same context, only the render thread is allowed to perform render calls.
The control thread on the other hand is the only one Python can directly interface with.
Consequently, data has to be safely exchanged between the two threads.
In addition to that, each thread should under no circumstances be allowed to perform actions outside of its jurisdiction.

When Maki wakes up, the first order of business is to initialize the (main) control thread, after which the render thread is to be created.
This initialization includes calling `SET_THREAD_TYPE_CONTROL()` and `SET_THREAD_TYPE_RENDER()` from the respective threads.
These preprocessor macros define a thread local variable.
Since each thread has it's own thread local variables, they can be used to deduce the type of any thread.

Every function can then be equipped with a call to `MAKI_ASSERT_CTRL_THREAD()` or `MAKI_ASSERT_RNDR_THREAD()`, which asserts that the correct thread is being used.
Since these checks are being removed for `Release` mode and are only included in `Debug` builds (which can be specified using the `-DCMAKE_BUILD_TYPE=Release` flag) there is no runtime overhead.

```cpp
#ifndef NDEBUG
...
#define MAKI_ASSERT_CTRL_THREAD()                              \
    MAKI_ASSERT_CRITICAL(g_thread_type == ThreadType::control, \
                         "This function can only be called from the control thread.")
#define MAKI_ASSERT_RNDR_THREAD()                             \
    MAKI_ASSERT_CRITICAL(g_thread_type == ThreadType::render, \
                         "This function can only be called from the render thread.")
#else
...
// don't do anything in release mode
#define MAKI_ASSERT_CTRL_THREAD()
#define MAKI_ASSERT_RNDR_THREAD()

#endif
```

To prevent race conditions (uncontrolled, concurrent access to the same resource) mutexes are being used.
These "mutual exclusion objects" allow the locking of a resource for the duration of its use.
In addition to this locking operation being a rather expensive one, all other threads in need of that resource are being stalled.
Therefore the use of mutexes ought to be minimized.

These two precautions, preventing the threads from running incorrect functions and accessing resources at the same time, form the basis for Maki's **thread safety**.

<Spacer />

# Atoms
Just like how real atoms were thought to be the indivisible unit of the universe, atoms are the smallest renderable unit in Maki.
A collection of them form a frame, multiple of which form an entire scene, which can be rendered to a video file.

An `Atom` stores all the data required to render that atom.
This mainly includes vertex data, like position or colour.

```cpp
struct Atom {
    bool render {false};

    // to be defined by implementation:
    // static constexpr const char* type_name {"Atom"};
};

struct QuadrilateralAtom: public Atom {
    std::array<vec3, 4> ver_pos {
        vec3 {-1.0f, -1.0f, +0.0f},  // bottom left
        vec3 {+1.0f, -1.0f, +0.0f},  // bottom right
        vec3 {-1.0f, +1.0f, +0.0f},  // top    left
        vec3 {+1.0f, +1.0f, +0.0f}}; // top    right
    ...
    static constexpr const char* type_name {"Quadrilateral"};
};
```
The `render` flag, set to `false`, excludes the atom from the being-rendered-club.

Because Maki allows the user to *jump in time*, it needs to keep track of not only the current, but also any past and future frames.
The simplest way of implementing this is to store all atoms for each frame.
This results in a multitude of problems:

1. A huge two-dimensional array is required.
   This can quickly drain all available memory or slow Maki to a crawl.
2. When the user changes an atom at any frame, this atom and all future incarnations thereof have to be changed.
3. A wait instruction, which simply leaves the scene as is, would consume as much memory as any other.
   More frames always mean more memory being consumed, no matter how much is actually happening in them.
4. Adding a new atom means adding it to all frames.

## Difference Array
To solve these problems I'm using a difference array.
This difference array can be seen as the numerical derivative of the original array;
instead of storing all atoms for every frame, I'm only storing how the atoms change from frame to frame.
`AtomDiff`s define how an atom has to be altered to cross a frame-border (from one frame to the next, or back from the next to the current).
Anything from applying a linear transformation, changing the color or just toggling the `render` flag, can be expressed with such an `AtomDiff`.

This functionality is implemented in the `apply` and `reverse` member functions.
These take an atom and apply (or reverse) the changes this `AtomDiff` represents.
Their `m_id` member variable can be used to determine the `Atom` this `AtomDiff` should be used for.

```cpp
template<typename AtomType>
class ToggleRenderDiff: public AtomDiff<AtomType> {
public:
    explicit ToggleRenderDiff(uint32_t id)
        : AtomDiff<AtomType> {id} {}

    virtual void apply(AtomType& atom) const override
    {
        atom.render = !atom.render;
    }
    virtual void reverse(AtomType& atom) const override
    {
        atom.render = !atom.render;
    }
};
```
Templating is used to accept any type of `Atom`.
`AtomDiff`s are always immutable (always declared `const`).

This solves all of the aforementioned problems:

1. Since `AtomDiff`s only contain the data absolutely needed to apply the represented change, they consume very little memory.
2. When the user changes an atom at any frame, only one `AtomDiff` has to be created for that frame.
3. When nothing happens in your scene, no `AtomDiff`s are being added and basically no memory is consumed;
   you can wait for as long as you like.
4. Adding a new atom doesn't add another `AtomDiff`.
   Only all systems using the `AtomDiff`s should be made aware that a new atom exists.

The actual difference array is implemented in the `AtomDiffLifetime`.
An `AtomDiffLifetime` contains one `AtomDiffFrame` for each frame.
`AtomDiffFrame`s are a container for all `AtomDiff`s belonging to that frame.
The `apply` and `reverse` member functions take an entire list of `Atom`s as a parameter.
The aforementioned `m_id` member variable is used to apply (or reverse) the correct `AtomDiff`s on the correct `Atom`.
```cpp
void apply(std::vector<AtomType>& atoms) const
{
    for(const AtomDiff<AtomType>* atom_diff: m_atom_diffs) {
        atom_diff->apply(atoms[atom_diff->get_id()]);
    }
}
```

## Atom Chain
Being one of the central classes, an `AtomChain` contains all `Atoms` for one frame `x`.
They can be seen as pointing to the frame `x` within the `AtomDiffLifetime`.
To stick with the mathematical terminology, think of it as the integral from frame `0` to frame `x`.
This "pointer" can freely be moved around to represent the requested frame.
To achieve this, the underlying `AtomDiff`s owned by the `AtomDiffLifetime` are being used to approach the target frame.
```cpp
void set_frame(
    uint32_t frame,
    const AtomDiffLifetime<AtomType>& atom_diff_lifetime)
{
    ...
    while(m_frame < frame)
        // adjust m_frame and call atom_diff_lifetime.apply
        next_frame(atom_diff_lifetime);
    while(m_frame > frame)
        prev_frame(atom_diff_lifetime);
}
```
The difference between an `AtomChain` and an `AtomDiffFrame` is that the `AtomChain` represents the absolute status of a frame.
The `AtomDiffFrame`, on the other hand, defines how two consecutive frames differ.

There are always two atom chains in use for any type, a control and a render atom chain.
- The render atom chain is needed to render the frame the interactive window requests.
- To apply any absolute changes at frame `x` the control thread needs to know what the current state of frame `x` is.
  Otherwise it wouldn't know how to adjust the atoms in frame `x-1` to become the new `x`.
  Thus the control thread needs its own atom chain.

The first frame is frame `0`.
It cannot display anything as it is used as the foundation for any following frames;
you can see it as a defined [constant of integration](https://en.wikipedia.org/wiki/Constant_of_integration).
Only subsequent frames can be the target of `AtomDiff`s.

## Chrono Syncs
One might wonder what happens when the control atom chain changes a frame that lies before the render atom chain.
This is exactly what happened in the [Walkthrough](#walkthrough).
In this situation the render atom chain would be outdated, because its *past* changed.
To fix this, Maki performs a chrono sync.

This means that the render atom chain evicts all of it's data and recreates all atoms with default member variables.
Therefore it points to the 0th frame.
Since none of the atoms in this frame have been changed, the default atoms currently in the render atom chain are correct—
the render thread is synchronised again.
To get back to where the render atom chain left off, it can use the already explained `set_frame` member function.

# Templates
All functions and classes handling atoms are templated, so that all kinds of atoms can be accepted.
But that also means that each `AtomDiffLifetime` can only handle one type of atom.
Therefore multiple `AtomDiffLifetime`s are required to express the entire breadth of atom types.

## Templated Memory
To conveniently access the correct `AtomDiffLifetime`, "templated memory" is being used:
```cpp
class AtomDispenser {
    ...
    // general declaration
    template<typename AtomType>
    AtomDiffLifetime<AtomType>& get_diff_lifetime();

    AtomDiffLifetime<CuboidAtom>        m_cuboid_diff_lifetime {};
    AtomDiffLifetime<QuadrilateralAtom> m_quadrilateral_diff_lifetime {};
};

// specializations //
// for CuboidAtoms
template<>
inline AtomDiffLifetime<CuboidAtom>& AtomDispenser::get_diff_lifetime<CuboidAtom>()
{
    return m_cuboid_diff_lifetime;
}
// for QuadrilateralAtoms
template<>
inline AtomDiffLifetime<QuadrilateralAtom>& AtomDispenser::get_diff_lifetime<QuadrilateralAtom>()
{
    return m_quadrilateral_diff_lifetime;
}
```
The function `AtomDiffLifetime<AtomType>& get_diff_lifetime()` is actually nowhere defined.
Only the specialized versions can be found, like `AtomDiffLifetime<QuadrilateralAtom>& get_diff_lifetime<QuadrilateralAtom>`.
As you can see, the general type `AtomType` has been specialized with `QuadrilateralAtom`.
This way the templating system decides which definition should be called, or fails when there is no specialization for the requested type.

## Rendering Atoms
An `AtomRenderer` uses the underlying rendering abstraction to actually render an `Atom`.
The implementation of such may vary wildly as each `Atom` has a different optimal way of being rendered.
While some may use a common base class (like the `BatchRenderer`) others stand on their own.

The `AtomRendererRouter` is unfortunately needed to make these different implementations accessible from the templated world of `Atom`s.
```cpp
template<typename AtomType>
struct AtomRendererRouter {
    // can't be used unspecialized
    typedef void type;
};

template<>
struct AtomRendererRouter<CuboidAtom> {
    typedef CuboidRenderer type;
};

template<>
struct AtomRendererRouter<QuadrilateralAtom> {
    typedef QuadrilateralRenderer type;
};
```
This router can be used like this to resolve `Atom` types to their respective renderer:
```cpp
typename AtomRendererRouter<CuboidAtom>::type* m_cuboid_renderer {nullptr};
```
Being converted to this by the compiler:
```cpp
CuboidRenderer* m_cuboid_renderer {nullptr};
```
(The `{nullptr}` is not necessary but always a nice touch ^^).

## Why Templates?
<AutoPlayVideo src={fly_around_02} />

Why not use an arguably much simpler object-oriented approach?

An `AtomDiff` can be applied to any `Atom` that provides the necessary member functions (an atom that doesn't have a color can't be painted red).
So `AtomDiff`s are templated to suit any such `Atom`.
Instead of using templates, I could have used an abstract `Atom` base class.

The problem with that lays in the way the `Atom`s are being accessed.
`Atom`s are currently stored in an `std::vector`, which is the silly C++ way of saying "dynamic size array".
There is one `std::vector` for each type of `Atom`.
Memory allocated by an `std::vector` is always contiguous.
Therefore the atoms lay side by side and the renderer, chewing through all atoms one at a time, gets sped up by the hardware prefetcher.

But this only works since the compiler knows the size of that type of `Atom`.
If I were to use inheritance and a single `std::vector` of type `Atom`, the size of one of these `Atom`s isn't always the same.
For example a Cube needs a lot more data than a triangle.

This can still be done of course.
The way to do it is by storing pointers to the actual objects.
Consequently, that the objects are scattered all over memory and the hardware prefetcher feels an urge to give up.
In this case using contiguous memory amounts to a total **performance** increase of 35 to 60 (!!!) percent.

I could have still used multiple `std::vector`s with inheritance.
But that means that all `AtomDiff`s and any other objects need to accept abstract types and potentially cast them down into more specific ones.
This adds performance overhead, because any one function can't be optimized for one type of atom, and dynamic casting isn't exactly free.
The main problem is that calling function discards information, which the called function has to painstakingly recreate.
To put it in a nutshell, I'm incredibly **afraid of loosing type information**.

<Spacer />

# Path of an Atom
Let's wrap things up by looking at the path an atom takes, from the interactive Python shell to the screen.

1. A cuboid gets created from Python using the `add_cuboid_atom` function, which gets redirected to `RenderDriver::add_atom<CuboidAtom>`.
   This creates a new default constructed `CuboidAtom` in the control and render `AtomChain<CuboidAtom>`s.
   Python receives an identifier with which it can apply changes to the atom.
2. Since all default constructed atoms have their `render` flag set to false, our cuboid doesn't get shown.
   This flag gets checked in the `draw_atom` member functions in the respective `AtomRenderer`.
3. We perform an operation on the cuboid, namely `show_cuboid_atom`, to start showing the atom in frame `3`.
   To apply the requested change, the control atom chain is being moved to the 3rd frame.
4. Now the newly created `ToggleRenderDiff<CuboidAtom>` can be added to the correct `AtomDiffFrame`.
   Because the control atom chain needs to stay synchronised, the new `AtomDiff` is being applied to it.
5. The last task the control thread has to perform is to warn the render thread that something got changed.
   `m_first_outdated_frame` in the `AtomDiffLifetime` gets set to `3-1=2`.
6. Say our render atom chain is currently representing frame `5`.
   Because `5>=2` a chrono sync has to be performed, after which the render atom chain is being moved back to frame `5`.
7. Now the `CuboidRenderer` has a new cube to render, which it does by using the underlying renderer API abstraction.

# Conclusion and Future Plans
Currently Maki is a developmental example for the practical use of diff arrays, templates and multi threading.
At the time being it isn't a usable program, though that might change in the future.

One of the biggest areas of development is adding more atoms.
This includes bezier curves, spheres and LaTeX rendering.
Any already implemented atoms can be improved with better shaders.
Among other features, these would bring shadows and wireframe rendering to Maki.
A more complicated aspect is morphing, which is required to smoothly transform atoms into different types.
And lastly the user interface has to be greatly improved.
The integration or reimplementation of an already existing graphics library is conceivable.

A major question of debate will concern weather any given feature should be implemented in C++ or Python.

# Appendix
You can find Maki's current status on GitHub at [christopher-besch/maki](https://github.com/christopher-besch/maki).
Maki's version as of this article's writing can be accessed [here](https://github.com/christopher-besch/maki/tree/30f3d5a358e1b89803a534c666318b14138a6756).
Feel free to leave a star ^^

## Directory Overview
```
.
├── maki
│   ├── src
│   │   └── maki.cpp
│   └── CMakeLists.txt
├── maki_core
│   ├── include
│   │   └── maki.h
│   ├── res
│   │   └── shaders
│   │       ├── cuboid_frag.glsl
│   │       ├── cuboid_vert.glsl
│   │       ├── simple_fragment.glsl
│   │       └── simple_vertex.glsl
│   ├── src
│   │   ├── atom
│   │   │   ├── atoms
│   │   │   │   ├── cuboid_atom.cpp
│   │   │   │   ├── cuboid_atom.h
│   │   │   │   ├── quadrilateral_atom.cpp
│   │   │   │   └── quadrilateral_atom.h
│   │   │   ├── renderers
│   │   │   │   ├── batch_renderer.cpp
│   │   │   │   ├── batch_renderer.h
│   │   │   │   ├── cuboid_renderer.cpp
│   │   │   │   ├── cuboid_renderer.h
│   │   │   │   ├── quadrilateral_renderer.cpp
│   │   │   │   └── quadrilateral_renderer.h
│   │   │   ├── atom_chain.h
│   │   │   ├── atom_diff_frame.h
│   │   │   ├── atom_diff.h
│   │   │   ├── atom_diff_lifetime.h
│   │   │   ├── atom_dispenser.cpp
│   │   │   ├── atom_dispenser.h
│   │   │   ├── atom.h
│   │   │   └── atom_renderer.h
│   │   ├── core
│   │   │   ├── definitions.h
│   │   │   ├── log.cpp
│   │   │   ├── log.h
│   │   │   ├── thread_safety.cpp
│   │   │   └── thread_safety.h
│   │   ├── driver
│   │   │   ├── camera_driver.cpp
│   │   │   ├── camera_driver.h
│   │   │   ├── interface.h
│   │   │   ├── render_driver_control.cpp
│   │   │   ├── render_driver.h
│   │   │   └── render_driver_render.cpp
│   │   ├── platform
│   │   │   ├── glfw
│   │   │   │   └── glfw_window.cpp
│   │   │   ├── enums.h
│   │   │   ├── event.h
│   │   │   ├── window.cpp
│   │   │   └── window.h
│   │   ├── renderer
│   │   │   ├── opengl
│   │   │   │   ├── opengl_buffer.cpp
│   │   │   │   ├── opengl_buffer.h
│   │   │   │   ├── opengl_renderer.cpp
│   │   │   │   ├── opengl_renderer.h
│   │   │   │   ├── opengl_shader.cpp
│   │   │   │   ├── opengl_shader.h
│   │   │   │   ├── opengl_stringifier.cpp
│   │   │   │   ├── opengl_stringifier.h
│   │   │   │   ├── opengl_types.h
│   │   │   │   ├── opengl_vertex_array.cpp
│   │   │   │   └── opengl_vertex_array.h
│   │   │   ├── buffer.cpp
│   │   │   ├── buffer.h
│   │   │   ├── camera.cpp
│   │   │   ├── camera.h
│   │   │   ├── renderer.cpp
│   │   │   ├── renderer.h
│   │   │   ├── shader.cpp
│   │   │   ├── shader.h
│   │   │   ├── types.h
│   │   │   ├── vertex_array.cpp
│   │   │   └── vertex_array.h
│   │   ├── pch.cpp
│   │   └── pch.h
│   └── CMakeLists.txt
├── stub
│   ├── src
│   │   └── main.cpp
│   └── CMakeLists.txt
└── CMakeLists.txt
```
Created with
```bash
tree --dirsfirst . -I 'vendor|build|pretty_bugs|block.txt|imgui.ini|LICENSE|maki.cpython-310-x86_64-linux-gnu.so|maki_showcase.ipynb|README.md'
```
