/**
 * Share build only (a private preview link of the homepage). The other pages
 * are not in the preview, so links to them would open a blank page inside
 * the preview frame. Instead, a click on one shows a short note. In-page
 * anchors (#quote), tel:, mailto: and outside sites behave normally.
 */
export function installSharePreview(): void {
  let note: HTMLDivElement | null = null;
  let timer = 0;

  const show = (text: string) => {
    if (!note) {
      note = document.createElement('div');
      note.setAttribute('role', 'status');
      note.className = 'share-note';
      document.body.appendChild(note);
    }
    note.textContent = text;
    note.dataset.on = 'true';
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      if (note) delete note.dataset.on;
    }, 2600);
  };

  document.addEventListener('click', (event) => {
    const link = (event.target as Element | null)?.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') ?? '';
    if (!href.startsWith('/') || href.startsWith('//')) return;
    event.preventDefault();
    show(href === '/' ? 'You are on the homepage preview.' : 'That page is not in this preview yet. Only the homepage is.');
  });
}
