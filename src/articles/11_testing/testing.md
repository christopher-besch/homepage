---
type: article
title: "Saving Time with Tests"
description: "
Using tests not to increase quality but to the more quickly get things done.

Or: How I started to enjoy writing tests.
"
banner: /social_banner/testing.png
thumb: ../../../static/social_banner/testing.png
title_banner: ../../images/photography/alpha_whiskey.jpg
title_banner_horizontal_position: 20%
title_banner_vertical_position: 80%
slug: testing
date: 2025-05-13T00:00:00+00:00
listed: true
version: 1.0.0
---

Writing tests is awful!
When I program I often think,
"I don't need tests.
Tests are for other people's code that doesn't work.
[I'm built different](https://www.youtube.com/watch?v=5TTcbMv5tDc&t=144s) — my code will work."

And then I spend an hour in gdb...

# Invariants
Take a look at this C code.
```c
size_t last_size = 1;
for(size_t i = 0; i < num_allocators; ++i) {
    ASSERT(allocators[i].size >= last_size,
           "allocators must be ordered by size");
    last_size = allocators[i].size;
}
```
It asserts an invariant of a toy allocator I wrote.
More specifically it asserts that the `allocators` list is ordered by the `size` attribute of each allocator — that's the invariant that must hold.
This code is very quick to write and easy to manually verify.

All the places that touch the `allocators` list, on the other hand, are quite complex and potentially break the invariant.
Verifying those is way more difficult.
And when there is a bug in one of these places that bug will likely become visible some other place — a segfault, wrong output, ....
Figuring out that this bug has something to do with `allocators`' order takes time.
And I often spend that time writing debugging or `printf` statements.
Those statements could have been asserts in the first place.

What's more, this declares intent.
Reading through all the actual code is a lot easier when you already know that `allocators` is sorted.
Additionally, you can clarify that these invariants don't hold in specific sections by writing a comment on why you don't check the invariant.

# Example Usage
Here's another one:
Sometimes I know some example input/output-pair for a function before actually implementing the function.
So I just write down all the example pairs I can think of and get some tests for cheap!
```c
ASSERT(alloc_idx_to_size(0) == 8);
ASSERT(alloc_idx_to_size(1) == 16);
ASSERT(alloc_idx_to_size(2) == 32);
ASSERT(alloc_idx_to_size(3) == 64);
ASSERT(alloc_idx_to_size(4) == 128);
ASSERT(alloc_idx_to_size(5) == 256);
ASSERT(alloc_idx_to_size(6) == 512);
ASSERT(alloc_idx_to_size(7) == 1024);
```

# In Code
Here there are two ways of finding the allocator I'm looking for:
A binary search with `find_alloc_binary_search` and a linear search by checking `is_object_in_alloc` for all `allocators`.
I ended up performing the faster but more complicated binary search and then asserting what I did with `is_object_in_alloc`.
```c
struct balloc* alloc = find_alloc_binary_search(memory);
ASSERT(is_object_in_alloc(alloc, memory),
       "found allocator must contain memory");
```

When I have three ways of implementing something I implement it one way and use the other two to assert I did so correctly.
Every different implementation is another perspective on the problem.
Using more than one perspective makes sure you actually understand your problem.

I write these asserts not to create a higher quality product.
I use other things for that: exhaustive unit tests, stress tests, end-to-end tests, user tests, contracts, ...
Sometimes I don't care about quality and I just want my script to not crash.

These tests and asserts and invariants I talked about are only so that I get my job done more quickly.
As such, every assert I write helps.
When you're aiming for quality your tests need to be somewhat exhaustive and actually ensure they catch everything that's wrong.
When you're aiming for a speed-up your test only need to help pinpoint the origin when something is wrong.
I invite you to try this perspective — it's fun!

You can write these tests in whatever language for whatever project.
Just leave them out for the final release build and you don't loose any performance, too.

# Concluding
These sorts of tests are
- easy to create,
- save a bunch of time,
- declare intent and 
- don't have to be exhaustive — just write down whatever pops into your head.

With all these asserts my commit history looks like this:
One feature, then a bunch of fixes until all my asserts are happy.
```
feat: implement alloc and dealloc - christopher-besch
fix:  these asserts do find bugs - christopher-besch
fix:  use index instead of pointer to same size alloc; fixes issue when moving allocs - christopher-besch
fix:  lower_bound assert - christopher-besch
fix:  keep alloc_idx as before as it should - christopher-besch
fix:  >= in is_object_after_alloc - christopher-besch
fix:  handle nullptr in dealloc gracefully - christopher-besch
fix:  alloc with size 0 - christopher-besch
fix:  forgot to multiply with BLOCKS_PER_SLAB - christopher-besch
```
If I had to find all those bugs without my asserts I wouldn't have had as much fun.

# PS
All the code in this article has been heavily abbreviated and was part of an assignment to write fast but correct code.
I really tried to maximize my use of asserts and ended up with every fifth line being an assert.
Was my code particularly fast?
No, quite definitely not.
Was it still fun, yeah!

# PPS
Yes, my commit messages could use some work but committing often is more important I think.
