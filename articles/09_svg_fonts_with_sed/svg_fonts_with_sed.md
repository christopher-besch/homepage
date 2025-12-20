---
title: "Inject Fonts into Web SVGs with sed"
description: "
Add font-loading CSS to SVGs with a sed script.
"
banner: "./banner.png"
hero: "./hero.jpg"
hero_horizontal_position: 30
hero_vertical_position: 25
slug: svg_fonts_with_sed
date: "2025-02-10"
tags: [web, bash]
listed: true
---

So you want to embed an SVG on your website and add this to your HTML:
```html
<object class="page" data="input_svg.svg" type="image/svg+xml"></object>
```
In my case this is an Affinity Designer SVG export.

But now we realize that the fonts don't work.
That's because your pretty SVG doesn't tell the browser where to find these fonts.
Usually you can fix this with CSS like this, making sure you actually host the `.woff` file at the specified location:
```css
@font-face {
    font-family: 'Candara';
    src: url('/vendor/fonts/Candara-Regular.woff')format('woff');
    font-weight: normal;
    font-style: normal;
}
```

Unfortunately this CSS can't just be included in your HTML document, it has to be part of the SVG itself.
This is how the original SVG looks like:
```svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg [...]>
    [...]
</svg>
```

After the injection we need it to look like this:
```svg
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg [...]>
    <defs>
        <style type="text/css"><![CDATA[
            @font-face {
                font-family: 'Candara';
                src: url('/vendor/fonts/Candara-Regular.woff')format('woff');
                font-weight: normal;
                font-style: normal;
            }
        ]]></style>
    </defs>

    [...]
</svg>
```

# All Hail sed, a **s**tream **ed**itor!

So, how do we do this?

We have the font-loading CSS in the file `fonts.css`.
Our first challenge lies in surrounding this CSS with the required SVG stuff.

Let's do this with sed and start with creating the file `fonts_css_template.txt`:
```xml
<defs>
    <style type="text/css"><![CDATA[
OHtFGivqhAswi
    ]]></style>
</defs>
```
As you can see the (randomly chosen) string `OHtFGivqhAswi` needs to be replaced with the CSS.
```bash
sed "/OHtFGivqhAswi/e cat fonts.css" fonts_css_template.txt | \
    sed 's/OHtFGivqhAswi//' \
    > final_text_to_include_in_svg.txt
```
1. The first sed command reads `fonts.css` and puts it right before `OHtFGivqhAswi`;
2. the second deletes `OHtFGivqhAswi`.
    This only works because `OHtFGivqhAswi` is on its own line.
3. We pipe the output into `final_text_to_include_in_svg.txt`.
    This is what needs to be injected into the SVG.

## Commence the Injection

```bash
sed -E 's/(<svg [^>]+>)/\1\ncI0WWZKD2UKEj\n/' input_svg.svg | \
    sed "/cI0WWZKD2UKEj/e cat final_text_to_include_in_svg.txt" | \
    sed 's/cI0WWZKD2UKEj//' \
    > output_svg.svg
```
1. Our first command finds the opening `svg` tag and appends the random string `cI0WWZKD2UKEj`, making sure it is on its own line.
2. This is followed by exactly what we've done before: prepend what needs to be injected,
3. replace `cI0WWZKD2UKEj` and
4. pipe the output where it is needed.

You don't need that ginormous web framework for simple things—some CSS and sed does the trick just fine.
Perhaps, first take a look at what the GNU toolbox offers when solving the next challenge you come across.

## [The Final Script](https://github.com/SelinaStrobel/homepage/blob/main/fonts_loader/load_fonts_in_css.sh)
```bash
#!/bin/bash
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

FONTS_CSS_TEMPLATE="$DIR/fonts_css_template.txt"
FINAL_TEXT_TO_INCLUDE_IN_SVG="$DIR/final_text_to_include_in_svg.txt"
FONTS_CSS_FILE="$DIR/fonts.css"

echo "converting $1 to $2"

sed "/OHtFGivqhAswi/e cat $FONTS_CSS_FILE" "$FONTS_CSS_TEMPLATE" | \
    sed 's/OHtFGivqhAswi//' \
    > "$FINAL_TEXT_TO_INCLUDE_IN_SVG"

sed -E 's/(<svg [^>]+>)/\1\ncI0WWZKD2UKEj\n/' "$1" | \
    sed "/cI0WWZKD2UKEj/e cat $FINAL_TEXT_TO_INCLUDE_IN_SVG" | \
    sed 's/cI0WWZKD2UKEj//' \
    > "$2"
```
Save this as `load_fonts_in_css.sh`, run:
```bash
chmod +x ./load_fonts_in_css.sh
./load_fonts_in_css.sh input_svg.svg output_svg.svg
```
