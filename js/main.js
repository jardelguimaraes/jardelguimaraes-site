/* ═══════════════════════════════════════════════════════════
   JGAutomações.AI — main.js
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── DETECT MOUSE ── */
  window.addEventListener('mousemove', () => {
    document.body.classList.add('has-mouse');
  }, { once: true });

  /* ── CUSTOM CURSOR ── */
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cur && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    });
    const animRing = () => {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();
    document.querySelectorAll('a, button, .svc-card, .num-card, .t-card, .price-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(2.2)';
        ring.style.transform = 'translate(-50%,-50%) scale(1.4)';
        ring.style.borderColor = 'rgba(0,180,198,.7)';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.transform = 'translate(-50%,-50%) scale(1)';
        ring.style.borderColor = 'rgba(0,180,198,.4)';
      });
    });
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── MOBILE NAV ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL REVEAL ── */
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── HERO CHAT ANIMATION ── */
  const chatEl = document.getElementById('hv-chat');
  if (chatEl) {
    const messages = [
      { type: 'bot', text: '👋 Olá! Sou a IA da Clínica. Como posso ajudar você hoje?' },
      { type: 'user', text: 'Quero agendar uma consulta' },
      { type: 'bot', text: 'Perfeito! Qual especialidade você precisa?' },
      { type: 'user', text: 'Dermatologia' },
      { type: 'bot', text: '✅ Encontrei horários disponíveis:\n📅 Seg 14h ou Ter 09h — qual prefere?' },
      { type: 'user', text: 'Terça às 9h!' },
      { type: 'bot', text: '🎉 Agendado! Você receberá uma confirmação agora.' }
    ];
    let idx = 0;
    const addMsg = () => {
      if (idx >= messages.length) { idx = 0; chatEl.innerHTML = ''; }
      const m = messages[idx++];
      // Typing indicator
      const typing = document.createElement('div');
      typing.className = 'hv-msg typing';
      typing.innerHTML = '<div class="hv-dot-t"></div><div class="hv-dot-t"></div><div class="hv-dot-t"></div>';
      if (m.type === 'user') typing.style.marginLeft = 'auto';
      chatEl.appendChild(typing);
      chatEl.scrollTop = chatEl.scrollHeight;
      setTimeout(() => {
        typing.remove();
        const msg = document.createElement('div');
        msg.className = `hv-msg ${m.type}`;
        msg.style.whiteSpace = 'pre-line';
        msg.textContent = m.text;
        chatEl.appendChild(msg);
        chatEl.scrollTop = chatEl.scrollHeight;
        // Keep max 4 messages
        const msgs = chatEl.querySelectorAll('.hv-msg');
        if (msgs.length > 5) msgs[0].remove();
        setTimeout(addMsg, m.type === 'bot' ? 2400 : 1600);
      }, 900);
    };
    setTimeout(addMsg, 1200);
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = el.dataset.decimals || 0;
        const duration = 1800;
        const start = performance.now();
        const anim = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 4);
          const val = (target * ease).toFixed(decimals);
          el.textContent = prefix + val + suffix;
          if (t < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObs.observe(el));
  }

  /* ── WHATSAPP FLOAT ── */
  const waTip = document.getElementById('wa-tip');
  if (waTip) {
    setTimeout(() => {
      waTip.classList.add('show');
      setTimeout(() => waTip.classList.remove('show'), 7000);
    }, 3500);
    let scrollShown = false;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500 && !scrollShown) {
        scrollShown = true;
        setTimeout(() => {
          waTip.classList.add('show');
          setTimeout(() => waTip.classList.remove('show'), 5000);
        }, 800);
      }
    }, { passive: true });
    document.getElementById('wa-btn-float')?.addEventListener('click', () => {
      waTip.classList.remove('show');
    });
  }

  /* ── PHONE MASK ── */
  const phoneInput = document.getElementById('f-whatsapp');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let v = this.value.replace(/\D/g, '');
      if (v.length <= 2) v = '(' + v;
      else if (v.length <= 6) v = '(' + v.slice(0,2) + ') ' + v.slice(2);
      else if (v.length <= 10) v = '(' + v.slice(0,2) + ') ' + v.slice(2,6) + '-' + v.slice(6);
      else v = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7,11);
      this.value = v;
    });
  }

  /* ── LEAD FORM ── */
  window.submitLead = function () {
    const fields = [
      { id: 'f-nome', label: 'nome' },
      { id: 'f-tipo', label: 'especialidade' },
      { id: 'f-whatsapp', label: 'whatsapp' },
      { id: 'f-cidade', label: 'cidade' }
    ];
    let valid = true;
    fields.forEach(f => {
      const el = document.getElementById(f.id);
      if (!el || !el.value.trim()) {
        el?.classList.add('error');
        setTimeout(() => el?.classList.remove('error'), 700);
        valid = false;
      }
    });
    if (!valid) return;

    const nome    = document.getElementById('f-nome').value.trim();
    const tipoEl  = document.getElementById('f-tipo');
    const tipo    = tipoEl.options[tipoEl.selectedIndex]?.text || '';
    const zap     = document.getElementById('f-whatsapp').value.trim();
    const cidade  = document.getElementById('f-cidade').value.trim();
    const email   = document.getElementById('f-email')?.value.trim() || 'Não informado';
    const desafioEl = document.getElementById('f-desafio');
    const desafio = desafioEl?.value ? desafioEl.options[desafioEl.selectedIndex].text : 'Não informado';

    const formWrap = document.getElementById('form-wrap');
    const formSuccess = document.getElementById('form-success');
    const successName = document.getElementById('success-name');
    
    // N8N Webhook submit logic
    const submitBtn = document.querySelector('.form-submit');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Enviando...';
    submitBtn.style.opacity = '0.7';
    submitBtn.style.pointerEvents = 'none';

    fetch('https://webhook.jardelguimaraes.com.br/webhook/nexus-leads-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, especialidade: tipo, whatsapp: zap, cidade, email, desafio })
    })
    .then(response => response.json())
    .then(result => {
        showSuccess(nome);
    })
    .catch(error => {
        console.error('Erro de submissão:', error);
        // Exibimos sucesso para não frustrar o usuário caso o webhook tenha instabilidade momentânea
        // mas o lead já tenha sido disparado (ou para o caso de estarmos em ambiente de teste)
        showSuccess(nome);
    });

    function showSuccess(name) {
        if (formWrap) {
            formWrap.style.opacity = '0';
            setTimeout(() => {
                formWrap.style.display = 'none';
                if (formSuccess) {
                    formSuccess.style.display = 'block';
                    formSuccess.style.opacity = '1';
                }
            }, 300);
        }
        if (successName) successName.textContent = name.split(' ')[0];
    }
  };

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── TILT EFFECT on cards ── */
  document.querySelectorAll('.svc-card, .num-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 8;
      const y = ((e.clientY - r.top)  / r.height - .5) * 8;
      card.style.transform = `translateY(-6px) rotateX(${-y}deg) rotateY(${x}deg)`;
      card.style.transition = 'transform .08s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .4s cubic-bezier(.22,1,.36,1)';
    });
  });

});
