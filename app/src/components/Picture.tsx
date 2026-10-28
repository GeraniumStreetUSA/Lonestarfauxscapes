import manifest from '../data/image-manifest.json';

type ImageName = keyof typeof manifest;

interface ImageEntry {
  width: number;
  height: number;
  widths: number[];
}

function entry(name: ImageName): ImageEntry {
  return manifest[name] as ImageEntry;
}

function srcSet(name: string, widths: number[], format: 'avif' | 'webp'): string {
  return widths.map((w) => `/images/${name}-${w}.${format} ${w}w`).join(', ');
}

/** Largest variant's pixel size, for the <img> width and height attributes. */
function intrinsic(name: ImageName): { width: number; height: number; src: string } {
  const e = entry(name);
  const largest = e.widths[e.widths.length - 1];
  const height = Math.round((e.height / e.width) * largest);
  // The 768 variant (or the largest below it) is the plain-src fallback.
  const fallback = [...e.widths].reverse().find((w) => w <= 768) ?? e.widths[0];
  return { width: largest, height, src: `/images/${name}-${fallback}.webp` };
}

interface PictureProps {
  name: ImageName;
  alt: string;
  sizes: string;
  /** The LCP image: eager, high fetch priority. Everything else is lazy. */
  priority?: boolean;
  /** Eager without high priority: for images revealed by script, where lazy loading would show a blank or stale frame. */
  eager?: boolean;
  /** Art-directed crop for narrow screens, e.g. the hero's 4:5 phone crop. */
  narrow?: { name: ImageName; media: string };
}

/**
 * AVIF then WebP, with real src, width, height and alt on every <img>.
 * Variant widths come from the manifest that scripts/make-images.mjs writes.
 */
export default function Picture({ name, alt, sizes, priority = false, eager = false, narrow }: PictureProps) {
  const main = intrinsic(name);
  const narrowEntry = narrow ? entry(narrow.name) : null;
  const narrowSize = narrow ? intrinsic(narrow.name) : null;

  return (
    <picture>
      {narrow && narrowEntry && narrowSize ? (
        <>
          <source
            type="image/avif"
            media={narrow.media}
            srcSet={srcSet(narrow.name, narrowEntry.widths, 'avif')}
            sizes={sizes}
            width={narrowSize.width}
            height={narrowSize.height}
          />
          <source
            type="image/webp"
            media={narrow.media}
            srcSet={srcSet(narrow.name, narrowEntry.widths, 'webp')}
            sizes={sizes}
            width={narrowSize.width}
            height={narrowSize.height}
          />
        </>
      ) : null}
      <source type="image/avif" srcSet={srcSet(name, entry(name).widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, entry(name).widths, 'webp')} sizes={sizes} />
      <img
        src={main.src}
        width={main.width}
        height={main.height}
        alt={alt}
        sizes={sizes}
        decoding="async"
        {...(priority ? { fetchPriority: 'high' as const } : eager ? { loading: 'eager' as const } : { loading: 'lazy' as const })}
      />
    </picture>
  );
}
