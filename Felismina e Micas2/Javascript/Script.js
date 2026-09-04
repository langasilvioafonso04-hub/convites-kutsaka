 // ---------- Reveal on scroll ----------
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.35 });
  revealEls.forEach(el => io.observe(el));

  // ---------- Music ----------
  const music = document.getElementById('bgMusic');
  const toggleBtn = document.getElementById('musicToggle');
  const enterBtn = document.getElementById('enterBtn');
  const story = document.getElementById('story');

  function playMusic() {
    music.volume = 0.6;
    music.play().catch(() => { /* autoplay bloqueado até haver interação */ });
    toggleBtn.classList.remove('paused');
    toggleBtn.classList.add('show');
  }

  // O clique em "Abrir o Convite" conta como interação do utilizador,
  // por isso é o momento mais fiável para iniciar a música automaticamente.
  enterBtn.addEventListener('click', () => {
    playMusic();
    document.getElementById('verse').scrollIntoView({ behavior: 'smooth' });
  });

  toggleBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      toggleBtn.classList.remove('paused');
    } else {
      music.pause();
      toggleBtn.classList.add('paused');
    }
  });

  // Caso o browser permita autoplay sem interação (raro em mobile),
  // tentamos também ao carregar a página.
  window.addEventListener('load', () => {
    music.volume = 0.6;
    music.play().then(() => {
      toggleBtn.classList.add('show');
    }).catch(() => { /* espera pelo clique em "Abrir o Convite" */ });
  });

  // ---------- Contagem regressiva ----------
  // Ajuste a data/hora do casamento aqui:
  const weddingDate = new Date('2026-11-07T10:00:00');

  function updateCountdown() {
    const now = new Date();
    const diff = weddingDate - now;

    const dEl = document.getElementById('cd-dias');
    const hEl = document.getElementById('cd-horas');
    const mEl = document.getElementById('cd-min');
    const sEl = document.getElementById('cd-seg');
    if (!dEl) return;

    if (diff <= 0) {
      dEl.textContent = '00'; hEl.textContent = '00';
      mEl.textContent = '00'; sEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    dEl.textContent = String(days).padStart(2, '0');
    hEl.textContent = String(hours).padStart(2, '0');
    mEl.textContent = String(minutes).padStart(2, '0');
    sEl.textContent = String(seconds).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ---------- RSVP → WhatsApp ----------
  // Número que vai RECEBER as confirmações, em formato internacional,
  // só dígitos, sem "+", espaços ou traços. Ex.: Moçambique 84 123 4567 → "258841234567"
  const WHATSAPP_NUMBER = '258848024711';

  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpMsg = document.getElementById('rsvpMsg');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const presencaSelect = document.getElementById('presenca');
    const presencaTexto = presencaSelect.options[presencaSelect.selectedIndex].text;
  

    // Monta o texto que vai aparecer já escrito no WhatsApp
    let texto = 'Confirmação de presença - Casamento Felismina & Micas\n\n';
   
    texto += `Estará presente: ${presencaTexto}\n`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;

    rsvpMsg.classList.add('show');
    window.open(url, '_blank');
  });

  // ---------- Nav inferior: destaca a secção ativa ----------
  const navLinks = document.querySelectorAll('.nav-link');
  const navTargets = { cover:'cover', noivos:'noivos', galeria:'galeria', rsvp:'rsvp', agenda:'agenda' };
  const navSections = Object.values(navTargets).map(id => document.getElementById(id)).filter(Boolean);

  const navIo = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (match) match.classList.add('active');

      // Esconde o menu inferior enquanto estiver na capa
      const bottomNav = document.getElementById('bottomNav');
      if (entry.target.id === 'cover') {
        bottomNav.classList.add('hidden');
      } else {
        bottomNav.classList.remove('hidden');
      }
    }
  });
}, { threshold: 0.6 });
navSections.forEach(sec => navIo.observe(sec));

// Garante que o menu já começa escondido, já que a página abre na capa
document.getElementById('bottomNav').classList.add('hidden');



// ---------- Mural de Mensagens → Google Sheets ----------

// Cole aqui o URL do Apps Script que você copiou no passo 2
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRB3K5y3OVpX_-3NxiZcJW_M_wuc-VMj4MwxsL9153PLAZf2xyfxeDVgTSkuUBFogg/exec';

function renderMessage(msg){
  const card = document.createElement('div');
  card.className = 'msg-card';
  card.innerHTML = `<p>"${msg.texto}"</p><span class="msg-author">&mdash; ${msg.autor}</span>`;
  messagesWall.appendChild(card);
}

// Carrega as mensagens da Sheet quando a página abre
function carregarMensagens(){
  fetch(GOOGLE_SCRIPT_URL)
    .then(res => res.json())
    .then(mensagens => {
      messagesWall.innerHTML = ''; // limpa antes de redesenhar
      mensagens.forEach(renderMessage);
      messagesWall.scrollTop = messagesWall.scrollHeight;
    })
    .catch(err => console.error('Erro ao carregar mensagens:', err));
}

carregarMensagens();

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = document.getElementById('novaMensagem').value.trim();
  const autor = document.getElementById('autorMensagem').value.trim();
  if (!texto || !autor) return;

  const novaMsg = { autor, texto };

  // Mostra logo no ecrã, sem esperar pela resposta do servidor
  renderMessage(novaMsg);
  messagesWall.scrollTop = messagesWall.scrollHeight;

  // Envia para a Google Sheet
  fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    body: JSON.stringify(novaMsg)
  }).catch(err => console.error('Erro ao guardar:', err));

  messageForm.reset();
});
