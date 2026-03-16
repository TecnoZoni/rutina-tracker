from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw


@dataclass(frozen=True)
class Palette:
    primary: str = "#2563EB"
    secondary: str = "#0891B2"
    background: str = "#F8FAFC"
    on_primary: str = "#FFFFFF"
    monochrome: str = "#111827"


def draw_mark(
    draw: ImageDraw.ImageDraw,
    *,
    box: tuple[int, int, int, int],
    palette: Palette,
    radius: int,
    top_bar_ratio: float = 0.28,
) -> None:
    x0, y0, x1, y1 = box
    w = x1 - x0
    h = y1 - y0

    draw.rounded_rectangle(box, radius=radius, fill=palette.primary)

    top_h = int(h * top_bar_ratio)
    draw.rounded_rectangle((x0, y0, x1, y0 + top_h), radius=radius, fill=palette.secondary)

    # Binder "rings"
    ring_y0 = y0 + int(top_h * 0.25)
    ring_y1 = y0 + int(top_h * 0.95)
    ring_w = max(2, int(w * 0.045))
    x_ring_1 = x0 + int(w * 0.30)
    x_ring_2 = x0 + int(w * 0.70)
    draw.line((x_ring_1, ring_y0, x_ring_1, ring_y1), fill=palette.on_primary, width=ring_w)
    draw.line((x_ring_2, ring_y0, x_ring_2, ring_y1), fill=palette.on_primary, width=ring_w)

    # Check mark
    check_w = max(3, int(w * 0.085))
    p1 = (x0 + int(w * 0.30), y0 + int(h * 0.58))
    p2 = (x0 + int(w * 0.44), y0 + int(h * 0.72))
    p3 = (x0 + int(w * 0.72), y0 + int(h * 0.44))
    draw.line((p1[0], p1[1], p2[0], p2[1]), fill=palette.on_primary, width=check_w, joint="curve")
    draw.line((p2[0], p2[1], p3[0], p3[1]), fill=palette.on_primary, width=check_w, joint="curve")


def make_icon(path: Path, *, size: int, palette: Palette) -> None:
    img = Image.new("RGBA", (size, size), palette.background)
    draw = ImageDraw.Draw(img)

    margin = int(size * 0.14)
    mark = (margin, margin, size - margin, size - margin)
    radius = int(size * 0.12)
    draw_mark(draw, box=mark, palette=palette, radius=radius)

    img.save(path, format="PNG", optimize=True)


def make_splash(path: Path, *, size: int, palette: Palette) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    mark_size = int(size * 0.52)
    x0 = (size - mark_size) // 2
    y0 = (size - mark_size) // 2
    mark = (x0, y0, x0 + mark_size, y0 + mark_size)
    radius = int(mark_size * 0.12)
    draw_mark(draw, box=mark, palette=palette, radius=radius)

    img.save(path, format="PNG", optimize=True)


def make_adaptive_background(path: Path, *, size: int, palette: Palette) -> None:
    img = Image.new("RGBA", (size, size), palette.background)
    img.save(path, format="PNG", optimize=True)


def make_adaptive_foreground(path: Path, *, size: int, palette: Palette) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    mark_size = int(size * 0.70)
    x0 = (size - mark_size) // 2
    y0 = (size - mark_size) // 2
    mark = (x0, y0, x0 + mark_size, y0 + mark_size)
    radius = int(mark_size * 0.12)
    draw_mark(draw, box=mark, palette=palette, radius=radius)

    img.save(path, format="PNG", optimize=True)


def make_adaptive_monochrome(path: Path, *, size: int, palette: Palette) -> None:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    stroke = palette.monochrome
    w = int(size * 0.10)

    # Simple check mark
    p1 = (int(size * 0.30), int(size * 0.56))
    p2 = (int(size * 0.43), int(size * 0.69))
    p3 = (int(size * 0.72), int(size * 0.40))
    draw.line((p1[0], p1[1], p2[0], p2[1]), fill=stroke, width=w, joint="curve")
    draw.line((p2[0], p2[1], p3[0], p3[1]), fill=stroke, width=w, joint="curve")

    img.save(path, format="PNG", optimize=True)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    assets = root / "assets"
    palette = Palette()

    make_icon(assets / "icon.png", size=1024, palette=palette)
    make_splash(assets / "splash-icon.png", size=1024, palette=palette)
    make_icon(assets / "favicon.png", size=48, palette=palette)

    make_adaptive_background(assets / "android-icon-background.png", size=1024, palette=palette)
    make_adaptive_foreground(assets / "android-icon-foreground.png", size=1024, palette=palette)
    make_adaptive_monochrome(assets / "android-icon-monochrome.png", size=1024, palette=palette)

    print("Generated brand assets in:", assets)


if __name__ == "__main__":
    main()

