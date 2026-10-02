// ===== Configuração =====
const DATA_CASAMENTO = new Date('2026-11-07T07:30:00+02:00'); // hora de Maputo
const WHATSAPP = '258844457120'; // <- troque pelo número dos noivos
const MENSAGEM = 'Olá! Confirmo a minha presença no casamento de Helena & Basilio.';

// ===== Música automática =====
const musica = document.getElementById('musica');
const som = document.getElementById('som');
const overlay = document.getElementById('overlay');
function tocar(){ return musica.play().then(()=>som.classList.remove('mudo')).catch(()=>{}); }
// tenta autoplay direto; se o navegador bloquear, o toque em "Abrir convite" inicia a música
musica.volume = 0.7;
tocar().then(()=>{ if(!musica.paused) overlay.classList.add('sai'); });
document.getElementById('abrir').addEventListener('click',()=>{ tocar(); overlay.classList.add('sai'); });
som.addEventListener('click',()=>{ if(musica.paused){tocar();} else {musica.pause();som.classList.add('mudo');} });

// ===== Contagem regressiva =====
const p2 = n => String(n).padStart(2,'0');
function contar(){
  let t = Math.max(0, DATA_CASAMENTO - new Date());
  const d=Math.floor(t/864e5); t%=864e5;
  const h=Math.floor(t/36e5); t%=36e5;
  const m=Math.floor(t/6e4); const s=Math.floor(t%6e4/1e3);
  d_.textContent=p2(d); h_.textContent=p2(h); m_.textContent=p2(m); s_.textContent=p2(s);
}
const d_=document.getElementById('d'),h_=document.getElementById('h'),m_=document.getElementById('m'),s_=document.getElementById('s');
contar(); setInterval(contar,1000);

// ===== Carrossel =====
const slides=document.querySelector('.slides'); const total=slides.children.length; let i=0;
const pontos=document.querySelectorAll('.pontos span');
function ir(n){ i=(n+total)%total; slides.style.transform=`translateX(-${i*100}%)`;
  pontos.forEach((p,k)=>p.classList.toggle('on',k===i)); }
document.querySelector('.seta.dir').onclick=()=>ir(i+1);
document.querySelector('.seta.esq').onclick=()=>ir(i-1);
setInterval(()=>ir(i+1),5000);

// ===== Manual do convidado (interativo) =====
const regras=[
 ['✅','Confirme Presença','Confirme a sua presença para podermos organizar tudo com carinho.'],
 ['🧍','Seja educado','Trate todos com respeito e simpatia.'],
 ['⏰','Não atrase','Chegue a horas para não perder nenhum momento.'],
 ['👗','Branco é cor exclusiva da noiva','Evite vestir branco neste dia.'],
 ['📷','Não atrapalhe os fotógrafos','Deixe os profissionais trabalharem para guardarmos cada recordação.'],
 ['💐','Não leve decoração para casa','A decoração faz parte da cerimónia e deve permanecer no local.'],
 ['🎂','Aguarde a liberação da mesa dos doces','Os doces serão liberados no momento certo.'],
 ['📋','Respeite os protocolos escolhidos pelos noivos','Siga a organização preparada para o dia.'],
 ['🤝','Evite confusões. Não saia sem dar abraço aos noivos','Venha celebrar em paz e despeça-se com um abraço.'],
 ['✉️','Não convide outras pessoas','O convite é pessoal e limitado.'],
 ['💃','Não tenha vergonha de dançar','Venha dançar connosco!'],
 ['🗣️','Não faça comentários negativos','Ajude a manter a alegria do dia.'],
 ['👕','Roupa confortável','Vista-se com elegância, mas confortável.']
];
const grade=document.getElementById('grade'), dica=document.getElementById('dica');
regras.forEach(([e,t,txt])=>{
  const b=document.createElement('button');
  b.innerHTML=`<span class="e">${e}</span><span>${t}</span>`;
  b.onclick=()=>{ dica.innerHTML=`<b>${t}</b><br>${txt}`; dica.classList.add('on'); };
  grade.appendChild(b);
});

// ===== Confirmar presença =====
document.getElementById('confirmar').href=`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(MENSAGEM)}`;

// ===== Lista de Presentes: copiar M-Pesa / NIB =====
document.querySelectorAll('.copiar').forEach(function (btn) {
  var textoOriginal = btn.textContent;

  btn.addEventListener('click', function () {
    var valor = btn.getAttribute('data-copiar');

    function sucesso() {
      btn.textContent = '✓ Copiado!';
      btn.classList.add('ok');
      setTimeout(function () {
        btn.textContent = textoOriginal;
        btn.classList.remove('ok');
      }, 2000);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(valor).then(sucesso);
    } else {
      // alternativa para navegadores antigos
      var t = document.createElement('textarea');
      t.value = valor;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); sucesso(); } catch (e) {}
      document.body.removeChild(t);
    }
  });
});

