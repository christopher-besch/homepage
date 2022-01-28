---
type: article
title: Maki, Atoms and Time Travel
description: How to implement an efficient time traveling renderer.
slug: maki_01
date: 2022-01-26T00:00:00+00:00
listed: true
---

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
The goal of Maki is to allow the user to specify 3D animations using Python.
While the user is constructing their animation in an interactive shell, Maki shows the current status of the animation in a separate window.
The user is able to freely move the camera in that window.
In addition to that, Maki provides the ability to *jump in time*.
This can be used to show an arbitrary frame of the animation or even reverse its flow of time.

# Atoms
Just like how real atoms were thought to be the indivisible unit of the universe `Atom`s are the smallest renderable unit in Maki.
A collection of them form a frame, multiple of which form an entire scene that can be rendered to a video file.
The first frame is frame `0`.
It cannot display anything as it is used as the foundation for any following frames.
Any subsequent frames can be the target of `AtomDiff`s.
These `AtomDiff`s alter an atom: for example move the atom, apply a linear transformation, change the color or just change the `render` flag.
This flag, set to `false`, excludes the atom from the being-rendered-club, which explains why the frame `0` never shows anything.

## On the Matter of Frames
There are two different types of frames when talking about Maki:
1. Frames building a scene can be stored in an output video file.
2. The frame rate of the interactive Maki window is detached from that idea.
   If the user wishes to "freeze" time and show one frame for as long as they like, they can do that while still being able to fly around in the scene.
   In fact the user can freely choose in which direction the scene's time should flow.
   This is analogous to any video editing software.
   There the frames of the video being editing also don't have anything to do with the frame rate of the editor's window.

## Atom-Classes Overview
To implement `Atom`s a multitude of different classes is used.
This chapter briefly summarizes their reason to life.

## `Atom`
An `Atom` stores all the data required to render that `Atom`.
This mainly includes any vertex data, like position or colour.

Example:
```cpp
struct Atom {
    bool render {false};

    // to be defined by implementation:
    // static constexpr const char* type_name {"AtomType"};
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

## `AtomDiff`
`AtomDiff`s are immutable (always declared `const`).
They define how an atom has to be altered to cross a frame-border (from one frame to the next, or back from the next to the current).
This functionality is implemented in the `apply` and `reverse` member functions.
These take an atom and apply (or reverse) the changes this `AtomDiff` represents.
Their `m_id` member variable can be used to determine the `Atom` any `AtomDiff` should be used for.

Templating is used to accept any type of `Atom`.
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

## `AtomDiffFrame`
An `AtomDiffFrame` is a container for all `AtomDiff`s belonging to a single frame.
Templating is again used to specify the type of `Atom` being used.
In this case the `apply` and `reverse` member functions take an entire list of `Atom`s as a parameter.
The aforementioned `m_id` member variable is used to apply (or reverse) the correct `AtomDiff` on the correct `Atom`.
```cpp
void apply(std::vector<AtomType>& atoms) const
{
    for(const AtomDiff<AtomType>* atom_diff: m_atom_diffs) {
        atom_diff->apply(atoms[atom_diff->get_id()]);
    }
}
```

## `AtomDiffLifetime`
Multiple `AtomDiffFrame`s are stored in one `AtomDiffLifetime`, one for each frame.
Thus an `AtomDiffLifetime` represents the entire scene for one type of `Atom`, as it is again templated.
Their `apply` and `reverse` member functions take an added `frame` and simply call the underlying functions defined in the `AtomDiffFrame` for the specified frame.

## `AtomChain`
Being one of the central classes, an `AtomChain` contains all `Atoms` of one type in a specific state defined by the `AtomDiffLifetime`.
It can be seen as a pointing to within the `AtomDiffLifetime`.
This "pointer" can freely be moved around to represent the requested frame.
<!-- used twice, for renderer and control thread -->
A `set_frame` member function takes a target frame and an `AtomDiffLifetime`.
The `AtomDiffLifetime`'s `apply` and `reverse` member functions are then used to adjust all atoms to match the target frame.
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
<!-- chrono sync -->

## `AtomDispenser`
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
<!-- specialization -->

## `AtomRenderer`
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
Why not use the arguably much simpler object-oriented approach?

An `AtomDiff` can be applied to any `Atom` that provides the used member functions and/or effected data (an atom that doesn't have a color can't be painted red).
So `AtomDiff`s are templated to suit any such `Atom`.
Instead of using templates, I could have used an abstract `Atom` base class and make the `AtomDiff`s be applied to an inheritor of such base class.

The problem with that lays in the way the `Atom`s are being accessed.
`Atom`s are currently stored in an `std::vector`, which is the screwed up C++ way of saying "dynamic size array".
There is one `std::vector` for each type of `Atom`.
Memory allocated by an `std::vector` is always contiguous.
Therefore the atoms lay side by side and the renderer, chewing through all atoms one at a time, gets sped up by the hardware prefetcher.

But this only works since the compiler knows the size of that type of `Atom`.
If I were to use inheritance, the size of an actual `Atom` isn't always the same.
For example a Cube needs a lot more data than a triangle and thus requires more data.
So the way to store multiple different inherited types of `Atom`s in an `std::vector` is by storing pointers to the actual objects.
That means that the objects are scattered all over the memory and the hardware prefetcher feels an urge to give up.
In this case using contiguous memory amounts to a total performance increase of 35 to 60 (!!!) percent.

<!-- One could argue that I could have stuck to an inheritance based approach and simply use multiple `std::vector`s with that. -->
<!-- Here another problem comes into play: -->
<!-- I am horribly afraid of loosing type information. -->

## Repo Overview
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
