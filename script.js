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

  /* ---------- Serviços: cards expansíveis ---------- */
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const detail = document.getElementById(card.dataset.target);
      const isOpen = detail.classList.contains('open');

      // fecha os outros
      document.querySelectorAll('.service-detail.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.service-card[aria-expanded="true"]').forEach(c => c.setAttribute('aria-expanded', 'false'));

      if (!isOpen) {
        detail.classList.add('open');
        card.setAttribute('aria-expanded', 'true');
        setTimeout(() => detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
      }
    });
  });

  /* ---------- Agenda tributária: calendário do mês atual ---------- */
  const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

  // dia -> { tag, escopo }
  const TAX_DAYS = {
    7:  { tag: 'FGTS', escopo: 'Federal' },
    15: { tag: 'EFD Contribuições', escopo: 'Federal' },
    20: { tag: 'Simples Nacional / INSS', escopo: 'Federal' },
    25: { tag: 'ICMS / IPI', escopo: 'Estadual' },
  };

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
