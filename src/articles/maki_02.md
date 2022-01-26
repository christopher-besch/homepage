---
type: article
title: Stuff Stuff
description: I like cheese
slug: maki_02
date: 2022-01-26T00:00:00+00:00
listed: true
---

# Time Travel in Rendering

- rough structure of Maki
    - renderer API abstraction / platform abstraction
    - CMake/pybind11 -> maki_core vs maki
    - 
- CMake/pybind11 in-depth

<!-- tree --dirsfirst . -I 'vendor|build|pretty_bugs|block.txt|imgui.ini|LICENSE|maki.cpython-310-x86_64-linux-gnu.so|maki_showcase.ipynb|README.md' -->
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

