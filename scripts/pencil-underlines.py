"""Generate the pencil underline tiles in public/pencil/.

Each variant is a seamless 300x12 tile: a few overlapping wavy graphite
strokes with paper grain. Variants use different random wobble and grain so
neighbouring links don't look stamped. Run: python3 scripts/pencil-underlines.py
"""
import random
from pathlib import Path

W, H, VARIANTS = 300, 12, 6
OUT = Path(__file__).resolve().parent.parent / "public" / "pencil"
TONES = {
    "light": ("#333333", 0.85),
    "light-strong": ("#141414", 1),
    "dark": ("#e6e6e6", 0.7),
    "dark-strong": ("#f5f5f5", 1),
}


def wavy(rng, y, amp, n):
    """Periodic Catmull-Rom curve across the tile, so repeats join cleanly."""
    xs = sorted(rng.uniform(0, W) for _ in range(n - 1))
    xs = [0] + xs
    pts = [(x, y + rng.uniform(-amp, amp)) for x in xs]
    ext = [(pts[-1][0] - W, pts[-1][1])] + pts + [(W, pts[0][1]), (W + pts[1][0], pts[1][1])]
    d = f"M{ext[1][0]:.1f} {ext[1][1]:.2f}"
    for i in range(1, len(ext) - 2):
        p0, p1, p2, p3 = ext[i - 1], ext[i], ext[i + 1], ext[i + 2]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C{c1[0]:.1f} {c1[1]:.2f} {c2[0]:.1f} {c2[1]:.2f} {p2[0]:.1f} {p2[1]:.2f}"
    return d


def dashes(rng):
    segs = []
    x = rng.uniform(0, 40)
    while x < W - 30:
        length = rng.uniform(30, 75)
        y0, y1 = 6 + rng.uniform(-1, 1), 6 + rng.uniform(-1, 1)
        segs.append(f"M{x:.1f} {y0:.2f} L{x + length:.1f} {y1:.2f}")
        x += length + rng.uniform(20, 60)
    return " ".join(segs)


def tile(seed, color, opacity):
    rng = random.Random(seed)
    main_y = 6.3 + rng.uniform(-0.4, 0.4)
    strokes = [
        (wavy(rng, main_y, rng.uniform(0.7, 1.4), rng.randint(4, 6)), rng.uniform(1.8, 2.2), 0.85),
        (wavy(rng, main_y + 1, rng.uniform(0.5, 1.1), rng.randint(3, 5)), rng.uniform(0.9, 1.3), 0.6),
        (wavy(rng, main_y - 1.1, rng.uniform(0.4, 1.0), rng.randint(3, 5)), rng.uniform(0.6, 0.9), 0.45),
    ]
    paths = "".join(
        f"<path d='{d}' stroke-width='{w:.2f}' stroke-opacity='{o}'/>" for d, w, o in strokes
    )
    paths += f"<path d='{dashes(rng)}' stroke-width='.6' stroke-opacity='.55' stroke-dasharray='7 3 12 2'/>"
    freq = f"{rng.uniform(0.8, 1.0):.2f} {rng.uniform(0.4, 0.6):.2f}"
    return (
        f"<svg xmlns='http://www.w3.org/2000/svg' width='{W}' height='{H}' viewBox='0 0 {W} {H}' preserveAspectRatio='none'>"
        f"<filter id='g' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='{freq}' numOctaves='2' seed='{seed}'/>"
        "<feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.1 1.35'/><feComposite in='SourceGraphic' operator='in'/></filter>"
        f"<g filter='url(#g)' fill='none' stroke='{color}' stroke-linecap='round' opacity='{opacity}'>{paths}</g></svg>\n"
    )


OUT.mkdir(parents=True, exist_ok=True)
for v in range(VARIANTS):
    for name, (color, opacity) in TONES.items():
        # Same seed across tones so hover darkens the same line.
        (OUT / f"{name}-{v}.svg").write_text(tile(v + 11, color, opacity))
print(f"wrote {VARIANTS * len(TONES)} tiles to {OUT}")
