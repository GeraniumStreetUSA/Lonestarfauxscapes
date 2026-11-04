import { ArrowRight, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ComponentProps } from 'react';

import Callout from '../components/Callout';
import Layout from '../components/Layout';
import PageHero from '../components/page/PageHero';
import QuoteBand from '../components/page/QuoteBand';
import Picture from '../components/Picture';
import { GALLERY } from '../data/pages/hubs/gallery';
import { PROJECTS, type ProjectPhoto } from '../data/projects';
import type { PageProps } from '../routes';
import '../styles/hubs.css';

type ImageName = ComponentProps<typeof Picture>['name'];

export interface GalleryPhoto extends ProjectPhoto {
  /** The job's case study, linked from the larger view. */
  href?: string;
}

/**
 * A grid of photos that each open larger in a native dialog: Escape and the
 * Close button shut it, a click outside shuts it, the page behind is inert
 * while it is open, and focus goes back to the photo that opened it. Two
 * columns on phones. No carousel: one photo at a time, chosen by the visitor.
 */
export function PhotoGrid({ photos }: { photos: readonly GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const captionId = useId();
  const current = open === null ? null : photos[open];

  useEffect(() => {
    const el = dialog.current;
    if (!el || open === null) return;
    if (!el.open) el.showModal();
    // The dialog covers the page, so the page behind should not scroll.
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    return () => {
      html.style.overflow = before;
    };
  }, [open]);

  const onClose = () => {
    setOpen(null);
    opener.current?.focus();
  };

  return (
    <>
      <ul className="hb-p-photos" data-count={photos.length} data-reveal>
        {photos.map((photo, index) => (
          <li key={photo.name}>
            <button
              type="button"
              className="photo hb-p-photo"
              aria-haspopup="dialog"
              onClick={(event) => {
                opener.current = event.currentTarget;
                setOpen(index);
              }}
            >
              <Picture
                name={photo.name as ImageName}
                alt={photo.alt}
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 30vw, 46vw"
              />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="hb-p-dialog"
        aria-labelledby={current ? captionId : undefined}
        data-lenis-prevent
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        {current ? (
          <div className="hb-p-dialog-body">
            <button type="button" className="hb-p-dialog-close" onClick={() => dialog.current?.close()}>
              <X size={20} strokeWidth={2.2} aria-hidden="true" />
              <span>Close</span>
            </button>
            <div className="hb-p-dialog-photo">
              <Picture name={current.name as ImageName} alt={current.alt} sizes="(min-width: 1100px) 1100px, 96vw" eager />
            </div>
            <div className="hb-p-dialog-bar">
              <p id={captionId} className="hb-p-dialog-caption">
                {current.caption}
              </p>
              {current.href ? (
                <a href={current.href} className="link-go">
                  {GALLERY.readLabel}
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

/**
 * /gallery: the real photos of the three documented Texas jobs, grouped by
 * job. Each opens larger in the dialog with a caption that names the job.
 */
export default function GalleryPage({ route }: PageProps) {
  return (
    <Layout route={route}>
      <PageHero route={route} callout={GALLERY.callout} title={GALLERY.title} lede={GALLERY.lede} actions />
      <section aria-label="Project photos" className="hb-p-gallery">
        <div className="wrap">
          {PROJECTS.map((project) => (
            <div key={project.slug} className="hb-p-group">
              <header className="hb-p-group-head" data-reveal>
                <Callout text={project.callout} />
                <h2 className="t-h3-lg hb-p-group-title">{project.shortTitle}</h2>
                <a href={project.path} className="link-go hb-p-group-link">
                  {GALLERY.readLabel}
                  <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
                </a>
              </header>
              <PhotoGrid photos={project.photos.map((photo) => ({ ...photo, href: project.path }))} />
            </div>
          ))}
        </div>
      </section>
      <QuoteBand />
    </Layout>
  );
}
