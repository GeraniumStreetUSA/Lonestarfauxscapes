// Photos for the system and use-case pages (/artificial-hedge ... /vallum-frx).
// Same shape as the IMAGES entries in ../make-images.mjs; `src` is relative to
// the repo root. Real photos only, uncaptioned (none of these is a documented
// Texas job except where a page says so).

export const IMAGES = [
  // Living wall: the mixed-foliage wall with the fire hose cabinet (full 4:3).
  { name: 'sys-living-wall-hero', src: 'images/hero/hero-main.jpg' },
  // A foliage-only close crop of the same wall, for the pool living wall page.
  {
    name: 'sys-living-wall-close',
    src: 'images/hero/hero-main.jpg',
    crop: { left: 380, top: 380, width: 1500, height: 1125 },
  },
  // Vallum FRX page: the finished wall, then the before and after pair (portrait).
  { name: 'sys-vallum-wall', src: 'images/vallum/vallum-living-wall.avif' },
  { name: 'sys-vallum-before', src: 'images/vallum/vallum-system-before.avif' },
  { name: 'sys-vallum-after', src: 'images/vallum/vallum-system-after.avif' },
  // Fence extension: hedge standing on top of a low wall.
  {
    name: 'sys-fence-topper',
    src: 'images/hedges/hedge-topper-la.jpg',
    crop: { left: 0, top: 300, width: 1350, height: 1012 },
  },
  // HOA page: a hedge along a residential walkway.
  {
    name: 'sys-hedge-path',
    src: 'images/hedges/hedge-privacy-3.jpg',
    crop: { left: 0, top: 500, width: 1350, height: 1012 },
  },
  // Pool privacy: a long hedge wall behind a backyard pool.
  { name: 'sys-pool-hedge', src: 'images/blog/pool-privacy/pool-privacy-12.webp' },
  // Hedge material samples, square, on white (shown contained, not cropped).
  {
    name: 'sys-mat-boxwood',
    src: 'public/mats/artificial fr boxwood.jpg',
    crop: { left: 0, top: 56, width: 464, height: 464 },
  },
  {
    name: 'sys-mat-ficus',
    src: 'public/mats/fr ficus mat.webp',
    crop: { left: 0, top: 56, width: 464, height: 464 },
  },
  {
    name: 'sys-mat-oasis',
    src: 'public/mats/oasis mat.jpg',
    crop: { left: 0, top: 56, width: 464, height: 464 },
  },
  {
    name: 'sys-mat-other',
    src: 'public/mats/artificial dragon mat.jpg',
    crop: { left: 0, top: 56, width: 464, height: 464 },
  },
];
