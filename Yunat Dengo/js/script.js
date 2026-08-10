/* ============================================
   Yunat Dengo — CONVITE DIGITAL — script.js
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Número de WhatsApp que vai receber as confirmações (com código do país, sem "+" nem espaços).
  const WHATSAPP_NUMBER = '258843682589';

  /* ---------- 1. Ecrã de entrada + música automática ---------- */
  const enterScreen = document.getElementById('enterScreen');
  const enterBtn    = document.getElementById('enterBtn');
  const music       = document.getElementById('bgMusic');
  const musicPlayer = document.getElementById('musicPlayer');

  function startExperience(){
    enterScreen.classList.add('hidden');
    // Os browsers só deixam tocar áudio com som após uma interação do utilizador.
    // Isto simula o "toca automaticamente" logo que o convite é aberto.
    music.play().catch(() => {
      // Se o browser bloquear mesmo assim, o player fica pronto para o utilizador tocar manualmente.
      musicPlayer.classList.add('paused');
    });
  }

  enterBtn.addEventListener('click', startExperience);

  // Fallback: se por algum motivo o ecrã de entrada não for usado,
  // qualquer primeiro clique/scroll também tenta iniciar a música.
  let started = false;
  ['click','touchstart','keydown'].forEach(evt => {
    document.addEventListener(evt, () => {
      if (!started && music.paused && !enterScreen.classList.contains('hidden') === false) {
        started = true;
      }
    }, { once:false });
  });

  /* ---------- 2. Player de música (toggle manual) ---------- */
  musicPlayer.addEventListener('click', () => {
    if (music.paused){
      music.play().catch(()=>{});
      musicPlayer.classList.remove('paused');
    } else {
      music.pause();
      musicPlayer.classList.add('paused');
    }
  });
  music.addEventListener('pause', () => musicPlayer.classList.add('paused'));
  music.addEventListener('play',  () => musicPlayer.classList.remove('paused'));


  /* ---------- 3. Animação ao entrar em cada secção (scroll reveal) ---------- */
  const reveals = document.querySelectorAll('.reveal, .section-inner');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold:0.25 });

  reveals.forEach(el => revealObserver.observe(el));


  /* ---------- 4. Navegação lateral por pontos (scrollspy) ---------- */
  const dotLinks = document.querySelectorAll('.dot-nav a');
  const sections = document.querySelectorAll('main .section');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.dot-nav a[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting){
        dotLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { threshold:0.5 });

  sections.forEach(sec => navObserver.observe(sec));


  /* ---------- 5. Barra de progresso de leitura ---------- */
  const progressBar = document.getElementById('progressBar');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  });


  /* ---------- 6. Contagem regressiva ---------- */
  // Ajusta esta data para a data real do casamento.
  const WEDDING_DATE = new Date('2026-09-12T15:00:00');

  const cdDays  = document.getElementById('cd-days');
  const cdHours = document.getElementById('cd-hours');
  const cdMins  = document.getElementById('cd-mins');
  const cdSecs  = document.getElementById('cd-secs');
  const countdownBox = document.getElementById('countdown');
  const celebratedMsg = document.getElementById('celebratedMsg');

  function pad(n){ return String(n).padStart(2,'0'); }

  function updateCountdown(){
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0){
      countdownBox.style.display = 'none';
      celebratedMsg.hidden = false;
      return;
    }

    const days  = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins  = Math.floor((diff / (1000*60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    cdDays.textContent  = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent  = pad(mins);
    cdSecs.textContent  = pad(secs);
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ---------- 7. Formulário RSVP ---------- */
  const rsvpForm    = document.getElementById('rsvpForm');
  const rsvpSuccess = document.getElementById('rsvpSuccess');
  const successName = document.getElementById('successName');

  rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const presenca = document.querySelector('input[name="presenca"]:checked').value;
    const mensagem = document.getElementById('mensagemRsvp').value.trim();

    if (!nome || !telefone){
      rsvpForm.reportValidity();
      return;
    }

    // Monta a mensagem e abre o WhatsApp já preenchido, a apontar para o número dos noivos.
    const presencaTexto = presenca === 'sim' ? 'Sim, estarei presente ✅' : 'Infelizmente não poderei comparecer ❌';

    let texto = `*Confirmação de Presença — Aniversario da Yunat Dengo *\n\n`;
    texto += `*Nome:* ${nome}\n`;
    texto += `*Telefone:* ${telefone}\n`;
    texto += `*Presença:* ${presencaTexto}\n`;
    if (mensagem){
      texto += `*Mensagem:* ${mensagem}\n`;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(whatsappUrl, '_blank');

    // Aqui também poderias enviar os dados para um backend / Google Sheets, se quiseres um registo próprio.
    successName.textContent = nome.split(' ')[0];
    rsvpForm.hidden = true;
    rsvpSuccess.hidden = false;
  });


  /* ---------- 8. Mural de mensagens dos convidados ---------- */
  const messagesWall = document.getElementById('messagesWall');
  const messageForm  = document.getElementById('messageForm');

  // Mensagens de exemplo — substitui pelas mensagens reais ou liga a uma base de dados.
  const SEU_NUMERO = '258843682589'; // o teu número com código do país, sem + nem espaços

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const texto = document.getElementById('novaMensagem').value.trim();
  const autor = document.getElementById('autorMensagem').value.trim();
  if (!texto || !autor) return;

  // Mostra a mensagem no site (usando localStorage ou Firebase, como antes)
  renderMessage({ autor, texto });

  // Monta o texto para o WhatsApp
  const mensagemWhatsApp = `Nova mensagem para o site:%0A%0A*De:* ${autor}%0A*Mensagem:* ${texto}`;
  const link = `https://wa.me/${SEU_NUMERO}?text=${mensagemWhatsApp}`;

  // Abre o WhatsApp numa nova aba
  window.open(link, '_blank');

  messageForm.reset();
});

  function renderMessage(msg){
    const card = document.createElement('div');
    card.className = 'msg-card';
    card.innerHTML = `<p>"${msg.texto}"</p><span class="msg-author">&mdash; ${msg.autor}</span>`;
    messagesWall.appendChild(card);
  }

  seedMessages.forEach(renderMessage);

  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = document.getElementById('novaMensagem').value.trim();
    const autor = document.getElementById('autorMensagem').value.trim();
    if (!texto || !autor) return;

    renderMessage({ autor, texto });
    messageForm.reset();
    messagesWall.scrollTop = messagesWall.scrollHeight;
  });

});
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOfsrzhPSS0QH26VAiud8eENpXkn_IDeYlWzpqRKW1oB_eJiVkMgLXQvYNV8fyrbhkAg/exec';

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



(function(){
    var events = document.querySelectorAll('.wedding-timeline .wt-event');

    events.forEach(function(el, i){
      el.style.animationDelay = (i * 0.12) + 's';
      el.style.animationPlayState = 'paused';
    });

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    events.forEach(function(el){ observer.observe(el); });
  })();

  document.addEventListener("DOMContentLoaded", function () {

    const storySection = document.querySelector(".story-visual.reveal-left");

    if (!storySection) return;

    const storyObserver = new IntersectionObserver(function (entries) {

        entries.forEach(function (entry) {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                storyObserver.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.15
    });

    storyObserver.observe(storySection);

});