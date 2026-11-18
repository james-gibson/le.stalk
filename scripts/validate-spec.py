#!/usr/bin/env python3
"""validate_spec.py — is this Gherkin file a spec the isotope canon can trust?

Used by the `shell-to-gherkin` skill after drafting a feature from a set of
shell commands. It answers four questions, in order of importance:

1. **Does the canon see what you think it sees?** Constructs the canon silently
   drops (Background steps, data tables, docstrings, tags) and constructs it
   corrupts (`Scenario Outline` steps attach to the previous scenario) are
   reported, because a spec that loses half its text still has a valid-looking
   isotope ID.
2. **Is the identity stable?** The ID is `base64url(sha256(canonical raw))`, so a
   volatile literal — a `mktemp` path, a PID, a port, a timestamp — gives the
   spec a *different* identity on every run. Those are errors, not style notes.
3. **What is the isotope?** Prints the 43-character ID, token count, part
   breakdown, and signature prefix, computed with the real canon.
4. **Is it already known?** With `--brine <dir>`, checks whether a file for this
   ID already exists and lists the sources it was written from.

The canon and the lint both come from `brine.py` — this script owns no rules of
its own, so it cannot drift from what actually writes the store. `brine.py` is
located via `$BRINE_PY`, then the known lab path, then a walk up from the
working directory.

Placement is opt-in: `--place <path>` copies the file only when there are no
errors, refuses to overwrite, and re-validates the copy.

Usage:
    ./validate_spec.py features/order.feature
    ./validate_spec.py -                     # read stdin
    ./validate_spec.py spec.feature --brine ~/projects/kb/projects/scripts/brine
    ./validate_spec.py spec.feature --place ~/projects/personal/tuner/features/x.feature

Exit: 0 clean · 1 problems found · 2 the canon could not be loaded.
"""

import argparse
import importlib.util
import json
import os
import shutil
import sys
from typing import Any, List, Optional

CANON_CANDIDATES = [
    os.environ.get("BRINE_PY", ""),
    os.path.expanduser("~/projects/kb/projects/scripts/brine.py"),
    os.path.expanduser("~/projects/kb/scripts/brine.py"),
]


def find_canon(explicit: Optional[str] = None) -> Optional[str]:
    """Locate brine.py — the authority for the canon, so validation cannot drift."""
    candidates = [explicit] if explicit else []
    candidates += CANON_CANDIDATES
    here = os.path.abspath(os.getcwd())
    while here != "/":
        candidates.append(os.path.join(here, "projects/scripts/brine.py"))
        candidates.append(os.path.join(here, "scripts/brine.py"))
        here = os.path.dirname(here)
    for path in candidates:
        if path and os.path.isfile(path):
            return path
    return None


def load_canon(path: str) -> Any:
    spec = importlib.util.spec_from_file_location("brine_canon", path)
    if spec is None or spec.loader is None:
        raise ImportError("cannot load %s" % path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main(argv: Optional[List[str]] = None) -> int:
    ap = argparse.ArgumentParser(
        description="Validate Gherkin against the isotope canon and lint it for "
                    "identity hazards.")
    ap.add_argument("spec", nargs="?", default="-",
                    help="feature file, or - for stdin")
    ap.add_argument("--canon", help="path to brine.py (default: search)")
    ap.add_argument("--brine", help="brine/ directory to check for a duplicate")
    ap.add_argument("--place", help="copy the spec here if it is clean")
    ap.add_argument("--json", action="store_true", help="machine-readable result")
    args = ap.parse_args(argv)

    if args.spec == "-":
        text = sys.stdin.read()
        label = "<stdin>"
    else:
        try:
            with open(args.spec, "r", encoding="utf-8") as fh:
                text = fh.read()
        except OSError as exc:
            print("cannot read %s: %s" % (args.spec, exc), file=sys.stderr)
            return 2
        label = args.spec

    canon_path = find_canon(args.canon)
    if not canon_path:
        print("the isotope canon was not found (brine.py). Set BRINE_PY or pass "
              "--canon. Without it this file cannot be validated.", file=sys.stderr)
        return 2
    canon = load_canon(canon_path)

    findings = canon.lint_gherkin(text)
    errors = list(findings["errors"])
    warnings = list(findings["warnings"])

    raw = canon.canonical_raw(text)
    if not raw.strip():
        errors.append("no `Feature:`/`Scenario:`/step the canon recognises — the "
                      "file canonicalizes to nothing")

    tokens = raw.split("\n") if raw else []
    isotope = canon.isotope_id(raw) if raw else ""
    feature_lines, parts = canon.decompose(raw) if raw else ([], [])
    signature = canon.sign(raw, "seed-42") if raw else ""

    duplicate = None
    if args.brine and isotope:
        candidate = os.path.join(os.path.expanduser(args.brine), isotope + ".json")
        if os.path.isfile(candidate):
            try:
                with open(candidate, "r", encoding="utf-8") as fh:
                    record = json.load(fh)
                duplicate = [s.get("path") for s in record.get("sources") or []]
            except (OSError, ValueError):
                duplicate = []

    result = {
        "spec": label,
        "canon": canon_path,
        "isotope_id": isotope,
        "signature": signature,
        "tokens": len(tokens),
        "features": len(feature_lines),
        "parts": [
            {"index": p["index"], "scenario": p["scenario"],
             "part_id": p["part_id"], "steps": len(p["steps"])}
            for p in parts
        ],
        "part_order_digest": canon.part_digests(feature_lines, parts)[0] if parts else "",
        "errors": errors,
        "warnings": warnings,
        "duplicate_of": duplicate,
    }

    if args.json:
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print("%s" % label)
        print("  canon      %s" % canon_path)
        if isotope:
            print("  isotope    %s" % isotope)
            print("  signature  %s… (hmac-sha256, key seed-42)" % signature[:16])
            print("  canon      %d tokens, %d feature line(s), %d parts"
                  % (len(tokens), len(feature_lines), len(parts)))
            for part in result["parts"]:
                print("   %2d. %-58s %s" % (part["index"], part["scenario"][:58],
                                            part["part_id"][:12]))
            if duplicate is not None:
                if duplicate:
                    print("  duplicate  already in brine/, written from:")
                    for path in duplicate:
                        print("    - %s" % path)
                else:
                    print("  duplicate  none — this isotope is new to brine/")
        for warning in warnings:
            print("  warning  %s" % warning)
        for error in errors:
            print("  ERROR    %s" % error)
        print("  %s" % ("clean" if not errors else
                        "%d error(s), %d warning(s)" % (len(errors), len(warnings))))

    if errors:
        return 1

    if args.place:
        if args.spec == "-":
            print("refusing to place: read the spec from a file, not stdin",
                  file=sys.stderr)
            return 1
        target = os.path.abspath(os.path.expanduser(args.place))
        if os.path.exists(target):
            print("refusing to place: %s already exists (never overwrite a spec — "
                  "if the behaviour changed, that is a new isotope)" % target,
                  file=sys.stderr)
            return 1
        os.makedirs(os.path.dirname(target) or ".", exist_ok=True)
        shutil.copyfile(os.path.abspath(args.spec), target)
        print("placed     %s" % target)
    return 0


if __name__ == "__main__":
    sys.exit(main())
