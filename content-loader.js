// =========================================================
// SOLUTIO — carrega o conteúdo editável a partir do Supabase
// (progressive enhancement: se o Supabase não responder, o
// site continua funcionando normalmente com o texto padrão
// que já está no HTML)
// =========================================================
(function () {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function applyContent(map) {
    if (!map) return;

    // Textos simples e atributos (href)
    document.querySelectorAll('[data-cms]').forEach(function (el) {
      var key = el.getAttribute('data-cms');
      if (!(key in map)) return;
      var value = map[key];
      if (value === null || value === undefined) return;

      var attr = el.getAttribute('data-cms-attr');
      if (attr) {
        var prefix = el.getAttribute('data-cms-attr-prefix') || '';
        el.setAttribute(attr, prefix + value);
        return;
      }

      if (el.hasAttribute('data-cms-html')) {
        el.innerHTML = escapeHtml(value).replace(/\n/g, '<br>');
      } else {
        el.textContent = value;
      }
    });

    // Listas de bullets (serviços)
    document.querySelectorAll('[data-cms-list]').forEach(function (ul) {
      var key = ul.getAttribute('data-cms-list');
      if (!(key in map)) return;
      var value = map[key];
      if (!value) return;
      var items = value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      if (!items.length) return;
      ul.innerHTML = items.map(function (it) { return '<li>' + escapeHtml(it) + '</li>'; }).join('');
    });

    // Agenda tributária: repassa os 4 prazos para o script.js re-renderizar o calendário
    var days = {};
    for (var i = 1; i <= 4; i++) {
      var dayKey = 'agenda_item' + i + '_day';
      var tagKey = 'agenda_item' + i + '_tag';
      var scopeKey = 'agenda_item' + i + '_scope';
      if (map[dayKey] && map[tagKey]) {
        var dayNum = parseInt(map[dayKey], 10);
        if (!isNaN(dayNum)) {
          days[dayNum] = { tag: map[tagKey], escopo: map[scopeKey] || '' };
        }
      }
    }
    if (Object.keys(days).length && window.TAX_DAYS) {
      // substitui o conteúdo do objeto mantido pelo script.js
      Object.keys(window.TAX_DAYS).forEach(function (k) { delete window.TAX_DAYS[k]; });
      Object.keys(days).forEach(function (k) { window.TAX_DAYS[k] = days[k]; });
      if (typeof window.renderCalendar === 'function') window.renderCalendar();
    }
  }

  function fetchContent() {
    var url = window.SOLUTIO_SUPABASE_URL;
    var key = window.SOLUTIO_SUPABASE_ANON_KEY;
    if (!url || !key) return;

    fetch(url + '/rest/v1/solutio_site_content_blocks?select=key,value', {
      headers: {
        apikey: key,
        Authorization: 'Bearer ' + key,
      },
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (rows) {
        var map = {};
        rows.forEach(function (row) { map[row.key] = row.value; });
        applyContent(map);
      })
      .catch(function (err) {
        // Sem conexão com o Supabase: mantém o conteúdo padrão do HTML.
        console.warn('[Solutio] não foi possível carregar conteúdo dinâmico, usando padrão.', err);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchContent);
  } else {
    fetchContent();
  }
})();
