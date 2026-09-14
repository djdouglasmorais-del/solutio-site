// =========================================================
// SOLUTIO — interações do site
// =========================================================
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Header: sombra ao rolar ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Empresa: abas Missão / Visão / Valores ---------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- Serviços: modal com detalhes ---------- */
  const serviceModal = document.getElementById('serviceModal');
  const serviceModalIcon = document.getElementById('serviceModalIcon');
  const serviceModalTitle = document.getElementById('serviceModalTitle');
  const serviceModalDesc = document.getElementById('serviceModalDesc');
  const serviceModalBody = document.getElementById('serviceModalBody');
  const serviceModalClose = document.getElementById('serviceModalClose');

  function openServiceModal(card) {
    const detail = document.getElementById(card.dataset.target);
    if (!detail || !serviceModal) return;
    const iconEl = card.querySelector('.s-icon');
    serviceModalIcon.className = 's-icon' + (iconEl ? ' ' + iconEl.className.replace('s-icon', '').trim() : '');
    serviceModalIcon.innerHTML = iconEl ? iconEl.innerHTML : '';
    serviceModalTitle.textContent = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
    serviceModalDesc.textContent = card.querySelector('p') ? card.querySelector('p').textContent : '';
    serviceModalBody.innerHTML = detail.innerHTML;
    serviceModal.classList.add('open');
    serviceModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
  }

  function closeServiceModal() {
    if (!serviceModal) return;
    serviceModal.classList.remove('open');
    serviceModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => openServiceModal(card));
  });
  if (serviceModalClose) serviceModalClose.addEventListener('click', closeServiceModal);
  if (serviceModal) {
    serviceModal.addEventListener('click', (e) => { if (e.target === serviceModal) closeServiceModal(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && serviceModal && serviceModal.classList.contains('open')) closeServiceModal();
  });

  /* ---------- Agenda tributária: calendário do mês atual ---------- */
  const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  // dia -> { tag, escopo }
  // Exposto em window.TAX_DAYS para que o painel admin (via content-loader.js)
  // possa substituir os prazos sem precisar editar este arquivo.
  window.TAX_DAYS = window.TAX_DAYS || {
    7:  { tag: 'FGTS', escopo: 'Federal' },
    15: { tag: 'EFD Contribuições', escopo: 'Federal' },
    20: { tag: 'Simples Nacional / INSS', escopo: 'Federal' },
    25: { tag: 'ICMS / IPI', escopo: 'Estadual' },
  };
  const TAX_DAYS = window.TAX_DAYS;

  function renderCalendar() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const today = now.getDate();

    document.getElementById('agendaTitle').textContent = `${MONTH_NAMES[month]} • ${year}`;
    document.getElementById('calendarMonthLabel').textContent = `${MONTH_NAMES[month]} ${year}`;
    document.getElementById('todayPill').textContent = `Hoje: ${today} ${MONTH_NAMES[month].slice(0,3).toLowerCase()}`;

    const firstDay = new Date(year, month, 1);
    // getDay(): 0=Dom..6=Sab -> convertendo para semana começando na Segunda
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    for (let i = 0; i < startOffset; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-cell empty';
      grid.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      const info = TAX_DAYS[d];
      if (info) cell.classList.add('tagged');
      if (d === today) cell.classList.add('today');

      const num = document.createElement('span');
      num.className = 'num';
      num.textContent = d;
      cell.appendChild(num);

      if (info) {
        const tag = document.createElement('span');
        tag.className = 'cal-tag';
        tag.textContent = info.tag;
        cell.appendChild(tag);
      }
      grid.appendChild(cell);
    }

    // legenda lateral
    const legend = document.getElementById('agendaLegend');
    legend.innerHTML = '';
    Object.keys(TAX_DAYS).sort((a,b) => a - b).forEach(day => {
      const info = TAX_DAYS[day];
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="legend-left">
          <span class="legend-day">${day}</span>
          <div><strong>${info.tag}</strong><span>${info.escopo}</span></div>
        </div>
        <svg class="legend-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      `;
      legend.appendChild(li);
    });
  }
  renderCalendar();
  window.renderCalendar = renderCalendar;

  /* ---------- Formulário de contato (Netlify Forms via AJAX) ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const body = new URLSearchParams(data).toString();

      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      })
        .then(() => {
          form.hidden = true;
          document.getElementById('formSuccess').hidden = false;
        })
        .catch(() => {
          // fallback: envia normalmente se o fetch falhar
          form.submit();
        });
    });
  }

  /* ---------- Ano no rodapé ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
