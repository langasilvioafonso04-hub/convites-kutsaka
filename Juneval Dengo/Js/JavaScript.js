 // ── Preloader ──
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('preloader').classList.add('hide');
    }, 7000);
  });

  // ── Nav scroll ──
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── Hamburger ──
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mob.classList.toggle('open');
    document.body.style.overflow = mob.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', () => {
      ham.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Countdown ──
  function updateCountdown() {
    const target = new Date('2026-09-12T15:00:00');
    const now = new Date();
    const diff = target - now;

    if (diff <= 0) {
      document.getElementById('cd-msg').textContent = '🎉 O grande dia chegou!';
      ['days','hours','mins','secs'].forEach(u => document.getElementById('cd-'+u).textContent = '00');
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ── SCROLL ANIMATIONS ──
  const animClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-zoom', '.reveal-line'];
  const allAnimEls  = document.querySelectorAll(animClasses.join(','));

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  allAnimEls.forEach(el => scrollObserver.observe(el));

  // Schedule items — deslizam da esquerda escalonados
  document.querySelectorAll('.schedule-item').forEach((el, i) => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => el.classList.add('visible'), i * 130);
        obs.unobserve(el);
      }
    }, { threshold: 0.18 });
    obs.observe(el);
  });

  // Countdown cells — zoom ao entrar
  document.querySelectorAll('.countdown-cell').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .6s ${i*120}ms ease, transform .6s ${i*120}ms ease`;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'none';
        obs.unobserve(el);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
  });

  // ── MÚSICA ──
  const audio     = document.getElementById('bg-music');
  const btn       = document.getElementById('music-btn');
  const iconPlay  = document.getElementById('icon-play');
  const iconPause = document.getElementById('icon-pause');
  const toast     = document.getElementById('music-toast');
  let toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function spawnNote() {
    const notes = ['♪','♫','♬','♩'];
    const el = document.createElement('div');
    el.className = 'music-note';
    el.textContent = notes[Math.floor(Math.random() * notes.length)];
    el.style.right = (1.8 + Math.random() * 1.5) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  function setPlaying(playing) {
    btn.classList.toggle('playing', playing);
    iconPlay.style.display  = playing ? 'none'  : 'block';
    iconPause.style.display = playing ? 'block' : 'none';
    if (playing) {
      showToast('♪ A tocar música');
      spawnNote();
    } else {
      showToast('⏸ Música pausada');
    }
  }

  btn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setPlaying(false);
    }
  });

  // Notas flutuantes periódicas enquanto toca
  setInterval(() => { if (!audio.paused) spawnNote(); }, 3000);

  // Autoplay após interação do utilizador (política dos browsers)
  // Tenta tocar após o preloader fechar
  window.addEventListener('load', () => {
    setTimeout(() => {
      audio.volume = 0.4;
      audio.play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Browser bloqueou autoplay — aguarda primeiro clique
          showToast('▶ Clique ♪ para tocar música');
        });
    }, 1200);
  });

  // ── RSVP ──
  function submitRSVP() {
    const name    = document.getElementById('rsvp-name').value.trim();
    const confirm = document.getElementById('rsvp-confirm').value;

    if (!name || !confirm) {
      alert('Por favor preencha o seu nome e confirmação de presença.');
      return;
    }

    document.getElementById('rsvpForm').style.display = 'none';
    document.getElementById('rsvpSuccess').classList.add('show');
  }
  function submitRSVP() {
    const nome = document.getElementById("rsvp-name").value;
    const acompanhante = document.getElementById("rsvp-name2").value;
    const telefone = document.getElementById("rsvp-tel").value;
    const presenca = document.getElementById("rsvp-confirm").value;
    const observacao = document.getElementById("rsvp-msg").value;

    // Verificação dos campos obrigatórios
    if (!nome || !telefone || !presenca) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    let resposta;

    switch (presenca) {
        case "sim":
            resposta = "✓ Sim, estarei presente.";
            break;
        case "talvez":
            resposta = "Talvez, confirmarei mais tarde.";
            break;
        case "nao":
            resposta = "Infelizmente não poderei comparecer.";
            break;
    }

    const mensagem = `
💍 *Confirmação de Presença na cerimonia de casamento*

👤 Nome: ${nome}
👥 Acompanhante: ${acompanhante || "Nenhum"}
📞 Contacto: ${telefone}

📌 Presença:
${resposta}

📝 Observações:
${observacao || "Nenhuma"}
`;

    const numero = "258854319740"; // Coloque aqui o seu número

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}