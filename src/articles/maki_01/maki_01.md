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
banner: /social_banner/maki_01.png
thumb: ../../../static/social_banner/maki_01.png
slug: maki_01
date: 2022-01-26T00:00:00+00:00
listed: true
---
import AutoPlayVideo from "src/components/autoplay_video";
import full_showcase_01 from "./full_showcase_01.mp4";
import full_showcase_01_poster from "./full_showcase_01_poster.png";

<AutoPlayVideo src={full_showcase_01} poster={full_showcase_01_poster} />

<!-- problem -->
To create animations for technical concepts, one is advised to use graphics software with a programmatic approach.
While these provide the required precision, they suffer from an inherent disconnect between input and output.
An alternative are WYSIWYG programs, which avoid this detachment with interactivity at the cost of precision.

<!-- purpose and methods -->
The purpose of this article is to outline how a program for interactive and programmatic animation development can be implemented.
To experiment with different technologies and programming paradigms, I created a developmental implementation called Maki.
This article analyses Maki's design and evaluates the feasibility of its inclusion in an already existing animation framework.

<!-- results -->

<!-- conclusion -->

# Maki
<!-- ideals -->
**Extensibility**, **performance**, **ease of use**, **strict type and thread safety**, **clear ownership** and the **fear of loosing type information** form Maki's main ideals.
I chose C++ because it enforces **strict rules** and offers handy containers, algorithms and many light-weight abstractions, aiding in the development of a complex system, without compromising on **performance**.

The goal of [Maki](https://github.com/christopher-besch/maki) is to allow the user to create 3D animations using Python;
while the user is constructing their animation in an interactive shell, Maki shows the current status of the enimation in a separate window.
The user is able to freely move the camera in that window.
In addition to that, Maki provides the ability to *jump in time*;
The user can decide which frame of the animation should be played.

This allows an **easy to use** workflow minimizing the time between defining animations and seeing and playing with the results.

# Clear Ownership

Shared ownership, where multiple classes or functions own a single resource, facilitates programs where *everything owns everything* and *everything calls everything*.
This is relatively easy to implement (The programmer doesn't have to consider complicated ownership models.) but easily leads to stack traces resembling hell on earth.
When instead every resource is owned by only one object, that object's constructor acquires any needed resources and the destructor subsequently frees them.
This programming technique (called [RAII](https://en.cppreference.com/w/cpp/language/raii) by the C++ committee for silly names) leaves no need for any garbage collection.
Therefore **clear ownership** is highly performant and safe.

Though in some situations the same resource has to be *used* by multiple objects.
With an emphasis on *used*;
these situations don't warrant the use of shared ownership.
Instead the resource can be *borrowed*.
For example, without going into detail of what these classes actually do:
A `RenderDriver` owns a `Renderer` and an `AtomDispenser`.
The `AtomDispenser` needs the `Renderer` to perform its task, so it *borrows* it from the `RenderDriver`.
And because both the `AtomDispenser` and the `Renderer` are owned by the same `RenderDriver`; the `AtomDispenser` can rest assured that all its resources haven't been destructed yet.

```cpp
void AtomDispenser::create_all_atom_renderers(Renderer* renderer)
{
    ...
}
```

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
By using preprocessor statements to only compile the required platform, some runtime overhead can be removed.
```cpp
#if PROJECT == glfw
    GLFWwindow* m_handle {nullptr};
#endif
```
This macro can be set using the `-Dplatform=glfw` flag.

As you can see **extensibility** lies at the heart of Maki.

# Multi Threading
There are always two things happening at the same time:

1. accepting new or changes to atoms from Python and
2. rendering the scene or handling user interaction.

It makes sense to use two different threads, a control and a render thread, to tackle this concurrency.
Since OpenGL doesn't allow multiple threads to use the same context, only the render thread is allowed to perform render calls.
The control thread on the other hand is the only one Python can directly interface with.
Therefore data has to safely be exchanged between the two threads.
In addition to, that each thread should under no circumstances be allowed to perform actions outside of its jurisdiction.

The `RenderDriver` owns all threads and contains the entry point for each.
When Maki wakes up, the first order of business is to initialize the (main) control thread, after which the render thread is to be created.
This initialization includes calling `SET_THREAD_TYPE_CONTROL()` and `SET_THREAD_TYPE_RENDER()` from the respective thread.
These preprocessor macros define a thread local global variable keeping track of the current thread being used.

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

To prevent race conditions, no two threads are accessing the same resource concurrently, mutexes are being used.
These "mutual exclusion objects" allow the locking of a resource for the duration of its use.
In addition to this locking operation being a rather expensive one, all other threads in need of that resource are being stalled.
Therefore the use of mutexes should be minimized.

These two precautions, preventing the threads from running wrong functions and accessing resources at the same time, form the basis for Maki's **thread safety**.

# Atoms
Just like how real atoms were thought to be the indivisible unit of the universe atoms are the smallest renderable unit in Maki.
A collection of them form a frame, multiple of which form an entire scene that can be rendered to a video file.

An `Atom` stores all the data required to render that atom.
This mainly includes any vertex data, like position or colour.

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

Because Maki allows the user to *jump in time*, it needs to keep track of each and every frame.
The simplest way of implementing this is to store all atoms for each frame.
This results in a multitude of problems:

1. This way of storing atoms requires a huge (possibly) two-dimensional array, which can quickly drain all available memory.
2. When the user changes an atom at any frame, all representations of that atom after this frame have to be changed too.
3. A wait instruction, which simply leaves the scene as is, would consume as much memory as any other instruction.
   More frames always mean more memory being consumed, no matter how much is actually happening in them.
4. Adding a new atom means adding it to all frames.

## Difference array
To solve these problems I'm using a difference array.
This difference array can be seen as the numerical derivative of the original array;
instead of storing all atoms for every frame, I'm only storing how the atoms change from frame to frame.
`AtomDiff`s define how an atom has to be altered to cross a frame-border (from one frame to the next, or back from the next to the current).
Anything from moving the atom, applying a linear transformation, changing the color or just changing the `render` flag.

This functionality is implemented in the `apply` and `reverse` member functions.
These take an atom and apply (or reverse) the changes this `AtomDiff` represents.
Their `m_id` member variable can be used to determine the `Atom` any `AtomDiff` should be used for.

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

1. Since `AtomDiff`s only contain the data they absolutely need to apply the change they represent, they consume very little memory.
2. When the user changes an atom at any frame, only an `AtomDiff` for that frame has to be created.
3. When nothing happens in your scene, no `AtomDiff`s are being stored and basically no memory is consumed;
   you can wait for as long as you like.
4. Adding a new atom doesn't change anything about the `AtomDiff`s.

The actual difference array is implemented in the `AtomDiffLifetime`.
An `AtomDiffLifetime` contains one `AtomDiffFrame` for each frame.
`AtomDiffFrame`s are a container for all `AtomDiff`s belonging to a single frame.
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

## `AtomChain`
`AtomChain`s can be seen as pointing to within the `AtomDiffLifetime`.
Being one of the central classes, an `AtomChain` contains all `Atoms` of one type in a specific state defined by the `AtomDiffLifetime`.
This "pointer" can freely be moved around to represent the requested frame.
To achieve this the underlying `AtomDiff`s owned by the `AtomDiffLifetime` are being used to reach the target frame.
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

There are always two atom chains in use for any type, a control and a render atom chain.
- The render atom chain is needed to render the frame the interactive window requests.
- To apply any absolute changes at frame `x` the control thread needs to know what the last state of frame `x` is.
  Otherwise it wouldn't know how to adjust the atoms in frame `x-1` to `x`.
  Thus the control thread needs its own atom chain that can be moved without tampering with the render atom chain.
  This is not necessary for relative changes.

The first frame is frame `0`.
It cannot display anything as it is used as the foundation for any following frames.
Only subsequent frames can be the target of `AtomDiff`s.

## Chrono Syncs
One might wonder what happens when the control atom chain changes a frame that lies before the render atom chain.
In this situation the render atom chain would be outdated, because its *past* changed.
To fix this Maki performs a chrono sync.
This means that the render atom chain evicts all of it's data and recreates all atoms.
Therefore it points at the 0th frame.
Since this frame can't contain any atom diffs, the render thread is synchronised again.
To get back to where the render atom chain left off, it can use the already explained `set_frame` member function.

## Templated Memory
The `AtomDispenser` gives birth to `Atoms` and `AtomDiffs` besides owning one `AtomDiffLifetime` and all `AtomChains` for each type of `Atom`.
Multiple templated member functions are being used to access the correct ones.
```cpp
class AtomDispenser {

    ...

    template<typename AtomType>
    AtomDiffLifetime<AtomType>& get_diff_lifetime();
    
    ...
};

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
<!-- TODO: specialization -->

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
Why not use an arguably much simpler object-oriented approach?

An `AtomDiff` can be applied to any `Atom` that provides the necessary member functions (an atom that doesn't have a color can't be painted red).
So `AtomDiff`s are templated to suit any such `Atom`.
Instead of using templates, I could have used an abstract `Atom` base class and make the `AtomDiff`s be applied to an inheritor of such base class.

The problem with that lays in the way the `Atom`s are being accessed.
`Atom`s are currently stored in an `std::vector`, which is the silly C++ way of saying "dynamic size array".
There is one `std::vector` for each type of `Atom`.
Memory allocated by an `std::vector` is always contiguous.
Therefore the atoms lay side by side and the renderer, chewing through all atoms one at a time, gets sped up by the hardware prefetcher.

But this only works since the compiler knows the size of that type of `Atom`.
If I were to use inheritance and a single `std::vector` of type `Atom`, the size of an actual `Atom` isn't always the same.
For example a Cube needs a lot more data than a triangle.

This can still be done of course.
The way to do it is by storing pointers to the actual objects.
That means that the objects are scattered all over the memory and the hardware prefetcher feels an urge to give up.
In this case using contiguous memory amounts to a total **performance** increase of 35 to 60 (!!!) percent.

I could have still used multiple `std::vector`s even with inheritance.
But that means that all `AtomDiff`s and any other objects need to accept abstract types and potentially cast them down into more specific ones.
This adds performance overhead because any one function can't be optimized for one type of atom and dynamic casting isn't exactly free.
To put it in a nutshell, I'm incredibly **afraid of loosing type information**.

<!-- TODO: path of an atom -->
<!-- TODO: conclusion -->
<!-- TODO: bigger emphasis on time travelling -->

## Appendix
You can find Maki's current status on GitHub at [christopher-besch/maki](https://github.com/christopher-besch/maki).
Maki's version as of this article's writing can be accessed [here](https://github.com/christopher-besch/maki/tree/0b844480b511a08b81e7f87d50a3b7Fc4e764d85).
Feel free to leave a star ^^

### Directory Overview
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
