#!/usr/bin/env python3
"""Prepare a supplied editorial image for We Love Musicals.

The original file is never changed. The output is a WebP image with the
appropriate maximum dimensions for its on-site role. Native affiliate
creatives are deliberately outside this pipeline: they must retain the exact
partner-supplied format and dimensions.
"""

from __future__ import annotations

import argparse
import io
import json
import sys
from pathlib import Path
from urllib.parse import urlparse
from urllib.request import Request, urlopen

from PIL import Image, ImageOps

ROLE_MAX_DIMENSIONS: dict[str, tuple[int, int]] = {
    "card": (1200, 1200),
    "city": (1200, 1500),
    "hero": (1920, 1280),
    "keyvisual": (1400, 1400),
    "gallery": (1920, 1440),
}


def source_bytes(source: str) -> bytes:
    parsed = urlparse(source)
    if parsed.scheme in {"https", "http"}:
        request = Request(source, headers={"User-Agent": "WeLoveMusicals Image Pipeline/1.0"})
        with urlopen(request, timeout=45) as response:
            return response.read()
    return Path(source).read_bytes()


def output_mode(image: Image.Image) -> Image.Image:
    if image.mode in {"RGBA", "LA"}:
        return image.convert("RGBA")
    if image.mode == "P" and "transparency" in image.info:
        return image.convert("RGBA")
    return image.convert("RGB")


def main() -> int:
    parser = argparse.ArgumentParser(description="Convert a supplied editorial image to optimized WebP.")
    parser.add_argument("source", help="Local file path or HTTPS image URL")
    parser.add_argument("--role", choices=ROLE_MAX_DIMENSIONS, required=True, help="On-site use of the image")
    parser.add_argument("--output", required=True, help="New WebP output path")
    parser.add_argument("--quality", type=int, default=82, choices=range(50, 96), metavar="50-95")
    args = parser.parse_args()

    output = Path(args.output)
    if output.suffix.lower() != ".webp":
        parser.error("--output must end in .webp")
    output.parent.mkdir(parents=True, exist_ok=True)

    try:
        raw = source_bytes(args.source)
        with Image.open(io.BytesIO(raw)) as source_image:
            image = ImageOps.exif_transpose(source_image)
            original_size = image.size
            image = output_mode(image)
            image.thumbnail(ROLE_MAX_DIMENSIONS[args.role], Image.Resampling.LANCZOS)
            image.save(output, "WEBP", quality=args.quality, method=6)
    except Exception as error:  # clear, script-friendly error message
        print(f"Bild konnte nicht verarbeitet werden: {error}", file=sys.stderr)
        return 1

    metadata = {
        "source": args.source,
        "role": args.role,
        "format": "webp",
        "quality": args.quality,
        "originalDimensions": {"width": original_size[0], "height": original_size[1]},
        "outputDimensions": {"width": image.width, "height": image.height},
        "outputBytes": output.stat().st_size,
        "output": str(output),
    }
    print(json.dumps(metadata, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
