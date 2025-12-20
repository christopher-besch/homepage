// Copyright 2025 Christopher Besch
// This file is published under the MIT license:

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { decode } from "html-entities";

export function assertIsString(input: any): string {
    if (typeof input != "string") {
        throw new Error(`${input} is no string but ${typeof input}`);
    }
    return input;
}

export function assertIsOptionalString(input: any): string | undefined {
    if (typeof input != "string" && typeof input != "undefined") {
        throw new Error(`${input} is no string or undefined but ${typeof input}`);
    }
    return input;
}

export function assertIsNumber(input: any): number {
    if (typeof input != "number") {
        throw new Error(`${input} is no number but ${typeof input}`);
    }
    return input;
}

export function assertIsBoolean(input: any): boolean {
    if (typeof input != "boolean") {
        throw new Error(`${input} is no boolean but ${typeof input}`);
    }
    return input;
}

export function htmlToPlaintext(html: string): string {
    return decode(html.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ');
}

export function assertIsArrayOfStrings(input: any): string[] {
    if (!Array.isArray(input)) {
        throw new Error(`${input} is no array`);
    }
    return input.map(assertIsString);
}
