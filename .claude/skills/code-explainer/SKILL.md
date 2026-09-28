---
name: code-explainer
description: Explains a given piece of code, file, or module with an ASCII data-flow diagram, a plain-language analogy, and a step-by-step walkthrough of the key lines. Trigger whenever the user asks to explain, walk through, understand, or describe how a file, function, module, or code snippet works — including phrasing like "what does this do", "how does X work", "walk me through this file". Read-only: never edit code as part of this skill.
---

# Code Explainer

A read-only, explanation-only skill. Its job is to make an unfamiliar piece of code
understandable to someone reading it for the first time — never to change it, refactor
it, or suggest fixes, even if a bug is spotted along the way (mention it in one line at
most, then move on).

## When this applies

Use this skill when the request is about **understanding** existing code rather than
**changing** it:

- "Explain how `Checkout.jsx` calculates the total."
- "Walk me through `src/utils/customOrder.js`."
- "What does this function do?" (with code pasted or referenced)
- "How does the cart survive a page refresh in this project?"

Do **not** use it when the user asks for a code review, a bug fix, a refactor, or new
functionality — those are different tasks even if they also involve reading code first.

## Scope selection

Before explaining, decide the right unit of explanation:

- A single function or a short snippet → explain that unit directly.
- A file → explain the file's exported surface first, then its most important
  internal function(s); do not narrate every line of a large file.
- A whole module/feature spanning several files (e.g. "how does checkout work") →
  identify the 2-4 files that carry the actual logic (skip styling, types-only files,
  and boilerplate) and explain them as one connected story, in the order data actually
  flows through them.

## Process

Always produce the explanation in exactly these three parts, in this order:

### 1. ASCII data-flow diagram

A compact text diagram — boxes and arrows — showing what comes into the code, what
intermediate steps/branches it passes through, and what comes out (a return value, a
side effect like a DB write, an emitted event, a rendered UI element). Keep it to
roughly 5-12 lines; it should be skimmable, not a full flowchart of every branch.

Example shape:

```
cart[], discountPercent
      │
      ▼
 getCartSubtotal()  ──►  subtotal
      │
      ▼
 apply discount (subtotal * discount / 100)
      │
      ▼
 return subtotal - discount
```

### 2. Plain-language analogy

One or two sentences that map the code's behavior onto something familiar outside
programming — a kitchen, a checkout line, a post office, a filing cabinet — chosen to
fit what the code actually does (a calculation analogy differs from a caching analogy).
Skip jargon; a non-programmer should follow it.

### 3. Step-by-step walkthrough

Walk through the code's key lines/branches in execution order. For each one, state
line/range if useful, then explain *what* happens and, more importantly, *why* it
matters (an invariant it protects, an edge case it handles, a value it's about to be
used for downstream). Do not narrate purely cosmetic lines (imports, simple variable
renames) unless they matter to understanding.

## Guidelines

- Prefer the smallest correct explanation. A 15-line pure function does not need the
  same depth as a 200-line component.
- If the code has an evident bug or footgun, you may note it in a single sentence at
  the end, clearly separated from the explanation — but do not fix it unless asked.
- If context is missing (the referenced file doesn't exist, or the snippet is
  incomplete), say so and ask for the missing piece instead of guessing at intent.
- Never present the explanation as a diff or a rewritten version of the code.
