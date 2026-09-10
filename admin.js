// =========================================================
// SOLUTIO — Painel de administração do conteúdo do site
// =========================================================
(function () {
  if (!window.supabase || !window.supabase.createClient) {
    document.addEventListener('DOMContentLoaded', function () {
      var lv = document.getElementById('loginView');
      var msg = document.getElementById('loginMsg');
      if (lv) lv.hidden = false;
      if (msg) {
        msg.textContent = 'Não foi possível carregar o painel (falha ao conectar). Verifique sua internet e recarregue a página.';
        msg.className = 'admin-msg show err';
      }
    });
    return;
  }

  var supabase = window.supabase.createClient(
    window.SOLUTIO_SUPABASE_URL,
    window.SOLUTIO_SUPABASE_ANON_KEY
  );
  window.__solutioClient = supabase;

  // ---------------------------------------------------------------
  // Definição dos campos editáveis (agrupados como aparecem no site)
  // ---------------------------------------------------------------
  var SECTIONS = [
    {
      title: 'Topo do site (Hero)',
      fields: [
        { key: 'hero_badge', label: 'Selo acima do título' },
        { key: 'hero_title_line1', label: 'Título — 1ª parte' },
        { key: 'hero_title_accent', label: 'Título — palavra em destaque (dourado)' },
        { key: 'hero_title_line2', label: 'Título — parte final' },
        { key: 'hero_lead', label: 'Texto de apoio abaixo do título', type: 'textarea' },
        { key: 'hero_cta_primary', label: 'Botão principal' },
        { key: 'hero_cta_secondary', label: 'Botão secundário' },
        { key: 'hero_trust1', label: 'Selo de confiança 1' },
        { key: 'hero_trust2', label: 'Selo de confiança 2' },
        { key: 'hero_trust3', label: 'Selo de confiança 3' },
        { key: 'hero_panel_label', label: 'Legenda dentro do painel ilustrativo' },
        { key: 'hero_badge1_title', label: 'Card flutuante 1 — título' },
        { key: 'hero_badge1_sub', label: 'Card flutuante 1 — subtítulo' },
        { key: 'hero_badge2_title', label: 'Card flutuante 2 — título' },
        { key: 'hero_badge2_sub', label: 'Card flutuante 2 — subtítulo' },
        { key: 'hero_badge3_title', label: 'Card flutuante 3 — título' },
        { key: 'hero_badge3_sub', label: 'Card flutuante 3 — subtítulo' },
      ],
    },
    {
      title: 'Serviços',
      fields: [
        { key: 'services_eyebrow', label: 'Etiqueta da seção' },
        { key: 'services_title_line1', label: 'Título — 1ª linha' },
        { key: 'services_title_line2', label: 'Título — 2ª linha' },
        { key: 'services_subtitle', label: 'Subtítulo', type: 'textarea' },
      ],
      subgroups: [
        { title: 'Contábil', fields: [
          { key: 'svc1_title', label: 'Nome do serviço' },
          { key: 'svc1_desc', label: 'Descrição curta (no card)', type: 'textarea' },
          { key: 'svc1_bullets', label: 'Itens detalhados (um por linha)', type: 'textarea' },
        ]},
        { title: 'Fiscal', fields: [
          { key: 'svc2_title', label: 'Nome do serviço' },
          { key: 'svc2_desc', label: 'Descrição curta (no card)', type: 'textarea' },
          { key: 'svc2_bullets', label: 'Itens detalhados (um por linha)', type: 'textarea' },
        ]},
        { title: 'Pessoal / RH', fields: [
          { key: 'svc3_title', label: 'Nome do serviço' },
          { key: 'svc3_desc', label: 'Descrição curta (no card)', type: 'textarea' },
          { key: 'svc3_bullets', label: 'Itens detalhados (um por linha)', type: 'textarea' },
        ]},
        { title: 'Imposto de Renda', fields: [
          { key: 'svc4_title', label: 'Nome do serviço' },
          { key: 'svc4_desc', label: 'Descrição curta (no card)', type: 'textarea' },
          { key: 'svc4_bullets', label: 'Itens detalhados (um por linha)', type: 'textarea' },
        ]},
        { title: 'Auditoria', fields: [
          { key: 'svc5_title', label: 'Nome do serviço' },
          { key: 'svc5_desc', label: 'Descrição curta (no card)', type: 'textarea' },
          { key: 'svc5_bullets', label: 'Itens detalhados (um por linha)', type: 'textarea' },
        ]},
        { title: 'Societária e Tributária', fields: [
          { key: 'svc6_title', label: 'Nome do serviço' },
          { key: 'svc6_desc', label: 'Descrição curta (no card)', type: 'textarea' },
          { key: 'svc6_bullets', label: 'Itens detalhados (um por linha)', type: 'textarea' },
        ]},
        { title: 'Banner PDAF/PDDE', fields: [
          { key: 'pdaf_title', label: 'Título do banner' },
          { key: 'pdaf_text', label: 'Texto do banner', type: 'textarea' },
          { key: 'pdaf_cta', label: 'Texto do botão' },
        ]},
      ],
    },
    {
      title: 'Empresa (Quem somos)',
      fields: [
        { key: 'company_eyebrow', label: 'Etiqueta da seção' },
        { key: 'company_title_line1', label: 'Título — 1ª linha' },
        { key: 'company_title_line2', label: 'Título — 2ª linha' },
        { key: 'company_text1', label: 'Parágrafo 1', type: 'textarea' },
        { key: 'company_text2', label: 'Parágrafo 2', type: 'textarea' },
        { key: 'company_chip1_title', label: 'Selo 1 — título' },
        { key: 'company_chip1_sub', label: 'Selo 1 — subtítulo' },
        { key: 'company_chip2_title', label: 'Selo 2 — título' },
        { key: 'company_chip2_sub', label: 'Selo 2 — subtítulo' },
        { key: 'company_chip3_title', label: 'Selo 3 — título' },
        { key: 'company_chip3_sub', label: 'Selo 3 — subtítulo' },
      ],
      subgroups: [
        { title: 'Aba Missão', fields: [
          { key: 'tab_missao_text', label: 'Texto', type: 'textarea' },
          { key: 'tab_missao_foot', label: 'Nota de rodapé da aba', type: 'textarea' },
        ]},
        { title: 'Aba Visão', fields: [
          { key: 'tab_visao_text', label: 'Texto', type: 'textarea' },
          { key: 'tab_visao_foot', label: 'Nota de rodapé da aba', type: 'textarea' },
        ]},
        { title: 'Aba Valores', fields: [
          { key: 'tab_valores_text', label: 'Texto', type: 'textarea' },
          { key: 'tab_valores_foot', label: 'Nota de rodapé da aba', type: 'textarea' },
        ]},
      ],
    },
    {
      title: 'Ferramentas e portal do cliente',
      fields: [
        { key: 'tools_eyebrow', label: 'Etiqueta da seção' },
        { key: 'tools_title', label: 'Título da seção' },
        { key: 'tools_subtitle', label: 'Subtítulo', type: 'textarea' },
      ],
      subgroups: [
        { title: '1. Artigos', fields: [
          { key: 'tool1_title', label: 'Título' }, { key: 'tool1_desc', label: 'Descrição' }, { key: 'tool1_url', label: 'Link', type: 'url' },
        ]},
        { title: '2. iDocumentos', fields: [
          { key: 'tool2_title', label: 'Título' }, { key: 'tool2_desc', label: 'Descrição' }, { key: 'tool2_url', label: 'Link', type: 'url' },
        ]},
        { title: '3. Tabelas Práticas', fields: [
          { key: 'tool3_title', label: 'Título' }, { key: 'tool3_desc', label: 'Descrição' }, { key: 'tool3_url', label: 'Link', type: 'url' },
        ]},
        { title: '4. Utilitários Contábeis', fields: [
          { key: 'tool4_title', label: 'Título' }, { key: 'tool4_desc', label: 'Descrição' }, { key: 'tool4_url', label: 'Link', type: 'url' },
        ]},
        { title: '5. Manual Empresarial', fields: [
          { key: 'tool5_title', label: 'Título' }, { key: 'tool5_desc', label: 'Descrição' }, { key: 'tool5_url', label: 'Link', type: 'url' },
        ]},
        { title: '6. Índices Econômicos', fields: [
          { key: 'tool6_title', label: 'Título' }, { key: 'tool6_desc', label: 'Descrição' }, { key: 'tool6_url', label: 'Link', type: 'url' },
        ]},
        { title: '7. Canal no YouTube', fields: [
          { key: 'tool7_title', label: 'Título' }, { key: 'tool7_desc', label: 'Descrição' }, { key: 'tool7_url', label: 'Link', type: 'url' },
        ]},
        { title: 'Banner do iDocumentos', fields: [
          { key: 'idoc_title', label: 'Título' },
          { key: 'idoc_text', label: 'Texto', type: 'textarea' },
          { key: 'idoc_cta', label: 'Texto do botão' },
        ]},
      ],
    },
    {
      title: 'Agenda tributária',
      fields: [
        { key: 'agenda_note', label: 'Aviso sobre variação de prazos', type: 'textarea' },
      ],
      subgroups: [
        { title: 'Prazo 1', fields: [
          { key: 'agenda_item1_day', label: 'Dia do mês (número)' },
          { key: 'agenda_item1_tag', label: 'Nome do prazo' },
          { key: 'agenda_item1_scope', label: 'Esfera (Federal/Estadual/Municipal)' },
        ]},
        { title: 'Prazo 2', fields: [
          { key: 'agenda_item2_day', label: 'Dia do mês (número)' },
          { key: 'agenda_item2_tag', label: 'Nome do prazo' },
          { key: 'agenda_item2_scope', label: 'Esfera (Federal/Estadual/Municipal)' },
        ]},
        { title: 'Prazo 3', fields: [
          { key: 'agenda_item3_day', label: 'Dia do mês (número)' },
          { key: 'agenda_item3_tag', label: 'Nome do prazo' },
          { key: 'agenda_item3_scope', label: 'Esfera (Federal/Estadual/Municipal)' },
        ]},
        { title: 'Prazo 4', fields: [
          { key: 'agenda_item4_day', label: 'Dia do mês (número)' },
          { key: 'agenda_item4_tag', label: 'Nome do prazo' },
          { key: 'agenda_item4_scope', label: 'Esfera (Federal/Estadual/Municipal)' },
        ]},
      ],
    },
    {
      title: 'Contato e WhatsApp',
      fields: [
        { key: 'contact_title', label: 'Título do formulário' },
        { key: 'contact_subtitle', label: 'Subtítulo do formulário', type: 'textarea' },
        { key: 'contact_address', label: 'Endereço (pode usar 2 linhas)', type: 'textarea' },
        { key: 'contact_phones', label: 'Telefones fixos' },
        { key: 'contact_whatsapp_display', label: 'WhatsApp — como aparece escrito', hint: 'Ex: (61) 99811-2040' },
        { key: 'contact_whatsapp_number', label: 'WhatsApp — número para o link', hint: 'Só números, com código do país e DDD. Ex: 5561998112040' },
        { key: 'contact_emails', label: 'E-mails (um por linha, para a seção de contato)', type: 'textarea' },
        { key: 'contact_emails_first', label: 'E-mail principal (usado no rodapé)' },
        { key: 'contact_chip1_label', label: 'Selo 1 — rótulo' },
        { key: 'contact_chip1_value', label: 'Selo 1 — valor' },
        { key: 'contact_chip2_label', label: 'Selo 2 — rótulo' },
        { key: 'contact_chip2_value', label: 'Selo 2 — valor' },
        { key: 'wa_card_title', label: 'Card do WhatsApp — título' },
        { key: 'wa_card_sub', label: 'Card do WhatsApp — subtítulo' },
        { key: 'lgpd_note', label: 'Nota de LGPD (depois de "LGPD, sigilo e segurança:")', type: 'textarea' },
      ],
    },
    {
      title: 'Rodapé e redes sociais',
      fields: [
        { key: 'footer_tagline', label: 'Frase de efeito abaixo da logo', type: 'textarea' },
        { key: 'footer_copyright', label: 'Texto de copyright' },
        { key: 'social_instagram_url', label: 'Link do Instagram', type: 'url' },
        { key: 'social_youtube_url', label: 'Link do YouTube', type: 'url' },
        { key: 'social_facebook_url', label: 'Link do Facebook', type: 'url' },
      ],
    },
  ];

  var els = {};
  document.addEventListener('DOMContentLoaded', function () {
    els.loginView = document.getElementById('loginView');
    els.recoveryView = document.getElementById('recoveryView');
    els.appView = document.getElementById('appView');
    els.loginForm = document.getElementById('loginForm');
    els.loginEmail = document.getElementById('loginEmail');
    els.loginPassword = document.getElementById('loginPassword');
    els.loginMsg = document.getElementById('loginMsg');
    els.forgotBtn = document.getElementById('forgotBtn');
    els.recoveryForm = document.getElementById('recoveryForm');
    els.newPassword = document.getElementById('newPassword');
    els.recoveryMsg = document.getElementById('recoveryMsg');
    els.formSections = document.getElementById('formSections');
    els.saveBtn = document.getElementById('saveBtn');
    els.saveStatus = document.getElementById('saveStatus');
    els.logoutBtn = document.getElementById('logoutBtn');
    els.userEmail = document.getElementById('userEmail');
    els.changePwBtn = document.getElementById('changePwBtn');

    buildForm();
    wireEvents();
    boot();
  });

  function showMsg(el, text, ok) {
    el.textContent = text;
    el.className = 'admin-msg show ' + (ok ? 'ok' : 'err');
  }

  function buildForm() {
    var html = '';
    SECTIONS.forEach(function (section, si) {
      html += '<details class="admin-section"' + (si === 0 ? ' open' : '') + '><summary>' + section.title + '</summary><div class="section-body">';
      (section.fields || []).forEach(function (f) { html += renderField(f); });
      (section.subgroups || []).forEach(function (sg) {
        html += '<div class="admin-subgroup"><div class="admin-subgroup-title">' + sg.title + '</div>';
        sg.fields.forEach(function (f) { html += renderField(f); });
        html += '</div>';
      });
      html += '</div></details>';
    });
    els.formSections.innerHTML = html;
  }

  function renderField(f) {
    var id = 'f_' + f.key;
    var hint = f.hint ? '<div class="hint">' + f.hint + '</div>' : '';
    if (f.type === 'textarea') {
      return '<div class="field"><label for="' + id + '">' + f.label + '</label><textarea id="' + id + '" data-key="' + f.key + '"></textarea>' + hint + '</div>';
    }
    return '<div class="field"><label for="' + id + '">' + f.label + '</label><input id="' + id + '" data-key="' + f.key + '" type="text">' + hint + '</div>';
  }

  function allFieldEls() {
    return els.formSections.querySelectorAll('[data-key]');
  }

  // ---------------------------------------------------------------
  // Autenticação
  // ---------------------------------------------------------------
  function boot() {
    // Detecta link de recuperação de senha (Supabase adiciona type=recovery)
    supabase.auth.onAuthStateChange(function (event, session) {
      if (event === 'PASSWORD_RECOVERY') {
        showView('recovery');
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session) checkAdminAndEnter(session);
      } else if (event === 'SIGNED_OUT') {
        showView('login');
      }
    });

    supabase.auth.getSession().then(function (res) {
      var session = res.data && res.data.session;
      if (session) {
        checkAdminAndEnter(session);
      } else {
        showView('login');
      }
    });
  }

  function checkAdminAndEnter(session) {
    supabase
      .from('solutio_site_admins')
      .select('email')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(function (res) {
        if (res.error || !res.data) {
          showMsg(els.loginMsg, 'Este login não tem acesso ao painel da Solutio.', false);
          supabase.auth.signOut();
          return;
        }
        els.userEmail.textContent = session.user.email;
        showView('app');
        loadContent();
      });
  }

  function showView(name) {
    els.loginView.hidden = name !== 'login';
    els.recoveryView.hidden = name !== 'recovery';
    els.appView.hidden = name !== 'app';
  }

  function wireEvents() {
    els.loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      els.loginMsg.className = 'admin-msg';
      supabase.auth
        .signInWithPassword({ email: els.loginEmail.value.trim(), password: els.loginPassword.value })
        .then(function (res) {
          if (res.error) {
            showMsg(els.loginMsg, 'Não foi possível entrar: ' + res.error.message, false);
          }
          // sucesso é tratado pelo onAuthStateChange
        });
    });

    els.forgotBtn.addEventListener('click', function () {
      var email = els.loginEmail.value.trim();
      if (!email) {
        showMsg(els.loginMsg, 'Digite seu e-mail acima e clique em "Esqueci minha senha" novamente.', false);
        return;
      }
      supabase.auth
        .resetPasswordForEmail(email, { redirectTo: window.location.href.split('#')[0] })
        .then(function (res) {
          if (res.error) {
            showMsg(els.loginMsg, 'Erro ao enviar e-mail: ' + res.error.message, false);
          } else {
            showMsg(els.loginMsg, 'Enviamos um link de redefinição de senha para ' + email + '.', true);
          }
        });
    });

    els.recoveryForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var pw = els.newPassword.value;
      if (pw.length < 8) {
        showMsg(els.recoveryMsg, 'A senha precisa ter pelo menos 8 caracteres.', false);
        return;
      }
      supabase.auth.updateUser({ password: pw }).then(function (res) {
        if (res.error) {
          showMsg(els.recoveryMsg, 'Erro: ' + res.error.message, false);
        } else {
          showMsg(els.recoveryMsg, 'Senha atualizada! Entrando...', true);
          supabase.auth.getSession().then(function (r) {
            if (r.data && r.data.session) checkAdminAndEnter(r.data.session);
          });
        }
      });
    });

    els.logoutBtn.addEventListener('click', function () {
      supabase.auth.signOut();
    });

    els.changePwBtn.addEventListener('click', function () {
      var email = els.userEmail.textContent;
      supabase.auth
        .resetPasswordForEmail(email, { redirectTo: window.location.href.split('#')[0] })
        .then(function (res) {
          if (!res.error) {
            alert('Enviamos um e-mail para ' + email + ' com um link para trocar sua senha.');
          } else {
            alert('Erro: ' + res.error.message);
          }
        });
    });

    els.saveBtn.addEventListener('click', saveContent);
  }

  // ---------------------------------------------------------------
  // Conteúdo
  // ---------------------------------------------------------------
  function loadContent() {
    els.saveStatus.textContent = 'Carregando conteúdo atual...';
    supabase
      .from('solutio_site_content_blocks')
      .select('key,value')
      .then(function (res) {
        if (res.error) {
          els.saveStatus.textContent = 'Erro ao carregar: ' + res.error.message;
          return;
        }
        var map = {};
        res.data.forEach(function (row) { map[row.key] = row.value; });
        allFieldEls().forEach(function (el) {
          var key = el.getAttribute('data-key');
          if (key in map) el.value = map[key];
        });
        els.saveStatus.textContent = 'Conteúdo carregado.';
      });
  }

  function saveContent() {
    var rows = [];
    allFieldEls().forEach(function (el) {
      rows.push({ key: el.getAttribute('data-key'), value: el.value });
    });
    els.saveBtn.disabled = true;
    els.saveStatus.textContent = 'Salvando...';
    supabase
      .from('solutio_site_content_blocks')
      .upsert(rows, { onConflict: 'key' })
      .then(function (res) {
        els.saveBtn.disabled = false;
        if (res.error) {
          els.saveStatus.textContent = 'Erro ao salvar: ' + res.error.message;
        } else {
          var now = new Date();
          els.saveStatus.textContent = 'Salvo às ' + now.toLocaleTimeString('pt-BR') + '. O site já reflete as mudanças.';
        }
      });
  }
})();
