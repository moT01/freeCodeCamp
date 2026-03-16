---
name: convert-to-py
description: Converts freeCodeCamp JS daily coding challenge .md files into Python equivalents.
---

# JS → Python Challenge Converter

Converts completed JavaScript coding challenge `.md` files into Python
counterparts, filling pre-existing Python placeholder files.

## Invocation

```
/convert-to-py 230-240
/convert-to-py 235
```

If no argument is given, ask which challenges to convert.

## File paths (relative to repo root)

Structure files (used to map challenge numbers → IDs):
- JS: `curriculum/structure/blocks/daily-coding-challenges-javascript.json`
- Python: `curriculum/structure/blocks/daily-coding-challenges-python.json`

Challenge files:
- JS: `curriculum/challenges/english/blocks/daily-coding-challenges-javascript/`
- Python: `curriculum/challenges/english/blocks/daily-coding-challenges-python/`

Challenge files are named by their `id` (e.g. `69b1028d6e265413d0198a2c.md`).
Use the JS structure file to look up which ID corresponds to each challenge
number — don't scan all files.

---

## Transformation rules

### Front matter

Don't touch `id`, `challengeType`, or `dashedName`. Copy only `title` from the JS file.

### Description (`# --description--`)

Copy verbatim.

### Hints (`# --hints--`)

Each hint has a **description line** and a **code block**.

**Description line** (e.g. `` `functionName(args)` should return `value`. ``):
- Function name → snake_case
- Booleans: `true` → `True`, `false` → `False`
- Everything else unchanged

**Code block** — replace the JS assertion with the `runPython` wrapper:

````
```js
({test: () => { runPython(`
from unittest import TestCase
TestCase().ASSERTION_METHOD(ARGS)`)
}})
```
````

JS → Python assertion mapping:

| JS | Python |
|---|---|
| `assert.isTrue(x)` | `assertIs(x, True)` |
| `assert.isFalse(x)` | `assertIs(x, False)` |
| `assert.equal(x, y)` | `assertEqual(x, y)` |
| `assert.strictEqual(x, y)` | `assertEqual(x, y)` |
| `assert.deepEqual(x, y)` | `assertEqual(x, y)` |
| `assert.approximately(x, y, d)` | `assertAlmostEqual(x, y, delta=d)` |
| `assert.isNull(x)` | `assertIsNone(x)` |
| `assert.isNotNull(x)` | `assertIsNotNone(x)` |
| `assert.include(arr, x)` | `assertIn(x, arr)` |

Use `assertIs` for booleans — not `assertTrue`. In assertion args: function name
→ snake_case, all other args unchanged.

### Seed (`# --seed--` → `## --seed-contents--`)

Function name → snake_case, `str` param → `s`, `def` + Python indentation,
minimal body.

```js
function isValidIsbn10(str) {

  return str;
}
```

```py
def is_valid_isbn10(s):

    return s
```

### Solution (`# --solutions--`)

Write idiomatic Python — don't transliterate JS line by line.

- Function name → snake_case; `str` param → `s`
- Standard JS→Python: `const`/`let` → bare assignment, `===`/`!==` → `==`/`!=`,
  `true`/`false`/`null` → `True`/`False`/`None`, `arr.length` → `len()`,
  `.map()`/`.filter()` → list comprehensions, string methods map directly
  (`.toLowerCase()` → `.lower()`, `.trim()` → `.strip()`, `.includes()` → `in`)
- Regex flags: `s.replace(/-/g, "")` → `s.replace("-", "")`
- `Number(x)` → `int(x)` with error handling; `Number.isNaN(x)` → `try/except`
  or `.isdigit()`

---

## Processing challenges

1. Update the Python structure JSON: set the `title` for each converted challenge that needs to be converted
   to match the title in the JS structure JSON (same field, same value)
2. Read the JS structure JSON to find the IDs for the requested challenge number(s)
3. For each ID, open the JS challenge file and locate the matching Python challenge file, has the same filename (ID) but in the Python directory
4. Transform the JS file and write to the Python challenge file
5. Report what was updated; explain anything skipped — never skip silently

## Quality checks before writing

- Hint count matches JS ↔ Python
- No leftover JS syntax (`const`, `let`, `===`, `.length`)
- Seed signature matches what hints call
- Booleans capitalized, snake_case consistent throughout

Flag issues to Tom rather than writing a broken file. Save without prompting —
only overwrite existing files, never create new ones.

## File formatting

- Single trailing newline at end of file
- 4-space indentation in Python code blocks