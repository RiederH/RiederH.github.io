const grid = document.querySelector('#project-grid');
const isCapstonePage = document.body.dataset.page === 'capstones';
const pageProjects = projects.filter(p => isCapstonePage ? p.capstone : !p.capstone);
const tags = p => `<div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
const preview = (p, inDialog = false) => p.preview ? `<figure class="project-preview">${inDialog ? `<a href="${p.preview}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size Atlas knowledge graph"><img src="${p.preview}" alt="${p.previewAlt}" width="651" height="472"></a>` : `<button class="preview-button" data-project="${p.id}" aria-label="View Atlas graph and project details"><img src="${p.preview}" alt="${p.previewAlt}" width="651" height="472" loading="lazy"></button>`}<figcaption>${p.previewCaption}</figcaption></figure>` : '';
function render(filter = 'All') {
  const list = pageProjects.filter(p => filter === 'All' || p.category === filter);
  grid.innerHTML = list.map(p => `<article class="card"><div class="card-meta"><span>${p.course}</span><span>${p.date}</span></div><h2><button class="title-button" data-project="${p.id}">${p.title}</button></h2><p>${p.description}</p>${preview(p)}${tags(p)}<button class="demo-launch" data-project="${p.id}">${p.capstone ? 'Project details' : 'Interactive demo'} →</button>${p.repository ? `<a class="source-link card-source" href="${p.repository}" target="_blank" rel="noopener noreferrer">Private repository ↗</a>` : ''}</article>`).join('');
  document.querySelector('#result-status').textContent = `${list.length} projects shown`;
}
const total = document.querySelector('#total'); if (total) total.textContent = pageProjects.length;
document.querySelectorAll('[data-filter]').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  render(b.dataset.filter);
}));
const dialog = document.querySelector('#project-dialog'); let opener; let cleanupDemo = () => {};
grid.addEventListener('click', e => {
  const button = e.target.closest('[data-project]'); if (!button) return;
  const p = projects.find(p => p.id === button.dataset.project); opener = button; cleanupDemo();
  dialog.classList.toggle('has-demo', !p.capstone);
  document.querySelector('#dialog-content').innerHTML = `<p class="card-meta">${p.course} · ${p.date}</p><h2 id="dialog-title">${p.title}</h2>${tags(p)}<p>${p.detail}</p>${preview(p, true)}${!p.capstone ? '<section id="project-demo" class="project-demo" aria-label="Interactive project example"></section>' : ''}${p.approach ? `<h3>Implementation</h3><p>${p.approach}</p>` : ''}${p.features ? `<ul class="project-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}${p.repository ? `<a class="source-link" href="${p.repository}" target="_blank" rel="noopener noreferrer">Private repository ↗</a>` : ''}`;
  if (!p.capstone) cleanupDemo = globalThis.mountProjectDemo(p.id, document.querySelector('#project-demo'));
  dialog.showModal(); dialog.scrollTop = 0;
});
document.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => {
  if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); }
});
dialog.addEventListener('close', () => { cleanupDemo(); cleanupDemo = () => {}; opener?.focus(); });
render();
