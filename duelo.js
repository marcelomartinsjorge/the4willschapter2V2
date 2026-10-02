/* ==========================================================================
   LER SIMON · o duelo do laranjal (Capítulo II)
   Um duelo de leitura, não de reflexo: Simon avisa com o corpo antes de cada
   golpe (o pé esquerdo arrasta, o ombro cai, os joelhos dobram). Quem lê,
   desvia; quem desvia, ganha uma abertura; quem ataca primeiro, apanha.
   No ponto final, o jogo congela e pergunta: tocar a costela, ou baixar a espada?
   Figuras em silhueta desenhadas no canvas (sem arquivos de imagem); se um dia
   houver sprites, basta trocar desenhaFigura().
   ========================================================================== */
(() => {
'use strict';
const TX = {
  pt: {
    titulo: 'Ler Simon', sub: 'Laranjal, antes da alvorada',
    regras: [
      ['O pé esquerdo arrasta', 'vem de cima', '← Recuar'],
      ['O ombro direito cai', 'vem a estocada', '↓ Inclinar'],
      ['Os joelhos dobram', 'ele quer as pernas', '↑ Aparar'],
      ['Ele erra e a costela abre', 'agora', '→ Tocar'],
    ],
    nunca: 'Nunca ataque primeiro. Espere o erro dele.',
    emGuarda: 'Em guarda', ja: 'Já!',
    fala0: '— Me mostra o que um homem de catorze anos consegue fazer.',
    fase2: 'Ele tenta outro ângulo.', fase3: 'Ele acelera o ritmo.',
    toque: 'Toque', acertou: 'Simon acerta', aparou: 'Aparado', precipitado: 'Cedo demais',
    leituras: (n) => `${n} leituras`, abertura: 'a costela', dicaPe: 'o pé arrasta', dicaOmbro: 'o ombro cai', dicaJoelho: 'os joelhos dobram',
    finta: 'Finta',
    botoes: ['Recuar', 'Inclinar', 'Aparar', 'Tocar'],
    fole: 'Fôlego', guarda: 'Guarda',
    congela: 'A costela dele, aberta.', tocar: 'Tocar a costela', baixar: 'Baixar a espada',
    venceu: 'Você venceu Simon.', marcas: 'Você venceu Simon, mas ele te acertou.', deixou: 'Você baixou a espada.', perdeu: 'Simon venceu.',
    seguir: 'Continuar', comecar: 'Em guarda',
    teclado: 'Teclado: setas ou 1 a 4.',
  },
  en: {
    titulo: 'Read Simon', sub: 'The orangery, before dawn',
    regras: [
      ['His left foot drags', 'it comes from above', '← Step back'],
      ['His right shoulder drops', 'the thrust is coming', '↓ Lean'],
      ['His knees bend', 'he wants your legs', '↑ Parry'],
      ['He misses and his ribs open', 'now', '→ Touch'],
    ],
    nunca: 'Never strike first. Wait for his mistake.',
    emGuarda: 'En garde', ja: 'Go!',
    fala0: '— Show me what a fourteen-year-old man can do.',
    fase2: 'He tries another angle.', fase3: 'He picks up the pace.',
    toque: 'Touch', acertou: 'Simon lands it', aparou: 'Parried', precipitado: 'Too soon',
    leituras: (n) => `${n} reads`, abertura: 'the ribs', dicaPe: 'the foot drags', dicaOmbro: 'the shoulder drops', dicaJoelho: 'the knees bend',
    finta: 'Feint',
    botoes: ['Step back', 'Lean', 'Parry', 'Touch'],
    fole: 'Breath', guarda: 'Guard',
    congela: 'His ribs, wide open.', tocar: 'Touch his ribs', baixar: 'Lower the sword',
    venceu: 'You beat Simon.', marcas: 'You beat Simon, but he landed a hit.', deixou: 'You lowered the sword.', perdeu: 'Simon won.',
    seguir: 'Continue', comecar: 'En garde',
    teclado: 'Keyboard: arrows or 1 to 4.',
  },
};

// ------------------------------------------------------------------ poses (personagem virado para a direita)
// ângulos em graus, medidos a partir de "para baixo"; positivo = para a frente.
// t = tronco (a partir de "para cima"); fl/bl = perna da frente/de trás [coxa, canela];
// fa/ba = braço da frente/de trás [braço, antebraço]; sw = espada; x = deslocamento.
const POSES = {
  guarda:        { x: 0,   t: 6,   fl: [24, 2],   bl: [-22, -4],  fa: [38, 100], ba: [-14, 30],  sw: 128 },
  respira:       { x: 0,   t: 9,   fl: [24, 4],   bl: [-22, -2],  fa: [34, 96],  ba: [-12, 34],  sw: 124 },
  tellAlto:      { x: -6,  t: -6,  fl: [20, 0],   bl: [-34, -12], fa: [165, 205], ba: [-20, 20], sw: 232 },
  golpeAlto:     { x: 16,  t: 22,  fl: [42, 0],   bl: [-26, -12], fa: [98, 92],  ba: [-30, 10],  sw: 72 },
  tellEstocada:  { x: 4,   t: 16,  fl: [34, 8],   bl: [-24, -8],  fa: [-8, 82],  ba: [-30, 20],  sw: 90 },
  golpeEstocada: { x: 26,  t: 24,  fl: [56, 8],   bl: [-42, -22], fa: [86, 90],  ba: [-50, -20], sw: 90 },
  tellBaixo:     { x: 0,   t: 30,  fl: [70, -26], bl: [-8, -70],  fa: [70, 140], ba: [-10, 40],  sw: 160 },
  golpeBaixo:    { x: 14,  t: 36,  fl: [74, -20], bl: [-14, -70], fa: [86, 62],  ba: [-30, 20],  sw: 42 },
  desequilibrio: { x: 22,  t: 34,  fl: [50, 12],  bl: [-36, -24], fa: [70, 50],  ba: [-60, -40], sw: 50 },
  atingido:      { x: -10, t: -16, fl: [14, -4],  bl: [-30, -10], fa: [30, 70],  ba: [-46, -20], sw: 108 },
  cansado:       { x: 0,   t: 24,  fl: [20, 6],   bl: [-18, 0],   fa: [8, 18],   ba: [-6, 10],   sw: 18 },
  recuar:        { x: -20, t: -10, fl: [10, 0],   bl: [-30, -12], fa: [44, 100], ba: [-20, 20],  sw: 134 },
  inclinar:      { x: -4,  t: -34, fl: [30, 8],   bl: [-16, -20], fa: [50, 110], ba: [-50, -30], sw: 140 },
  aparar:        { x: -2,  t: 4,   fl: [26, 4],   bl: [-24, -6],  fa: [92, 160], ba: [-10, 40],  sw: 176 },
  aparaBaixo:    { x: 0,   t: 18,  fl: [44, -10], bl: [-14, -40], fa: [60, 40],  ba: [-10, 30],  sw: 4 },
  tocar:         { x: 24,  t: 24,  fl: [56, 10],  bl: [-42, -22], fa: [84, 88],  ba: [-50, -24], sw: 88 },
  baixa:         { x: 0,   t: 10,  fl: [20, 2],   bl: [-20, -2],  fa: [6, 12],   ba: [-6, 8],    sw: 10 },
};
const LEN = { coxa: 24, canela: 24, tronco: 30, pesc: 4, cab: 6.6, braco: 17, ante: 15, espada: 50, madeira: 42 };
const rad = (g) => (g * Math.PI) / 180;
const mix = (a, b, k) => a + (b - a) * k;
const ease = (k) => (k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
function mixPose(a, b, k) {
  const o = {};
  for (const key of Object.keys(a)) o[key] = Array.isArray(a[key]) ? a[key].map((v, i) => mix(v, b[key][i], k)) : mix(a[key], b[key], k);
  return o;
}
class Lutador {
  constructor(nome) { this.nome = nome; this.de = POSES.guarda; this.para = POSES.guarda; this.t0 = 0; this.dur = 1; this.atual = POSES.guarda; }
  vai(p, dur, agora) { this.de = this.atual; this.para = POSES[p] || p; this.t0 = agora; this.dur = Math.max(1, dur); this.nomePose = p; }
  passa(agora) { const k = Math.min(1, (agora - this.t0) / this.dur); this.atual = mixPose(this.de, this.para, ease(k)); return this.atual; }
}

// ------------------------------------------------------------------ desenho
function esqueleto(p, x0, chao, s, face) {
  const pt = (o, len, ang) => ({ x: o.x + face * Math.sin(rad(ang)) * len * s, y: o.y + Math.cos(rad(ang)) * len * s });
  const altura = (perna) => LEN.coxa * Math.cos(rad(perna[0])) + LEN.canela * Math.cos(rad(perna[0] + perna[1]));
  const hy = chao - Math.max(altura(p.fl), altura(p.bl)) * s;
  const quadril = { x: x0 + face * p.x * s, y: hy };
  const joelhoF = pt(quadril, LEN.coxa, p.fl[0]), peF = pt(joelhoF, LEN.canela, p.fl[0] + p.fl[1]);
  const joelhoB = pt(quadril, LEN.coxa, p.bl[0]), peB = pt(joelhoB, LEN.canela, p.bl[0] + p.bl[1]);
  const pesc = { x: quadril.x + face * Math.sin(rad(p.t)) * LEN.tronco * s, y: quadril.y - Math.cos(rad(p.t)) * LEN.tronco * s };
  const cabeca = { x: pesc.x + face * Math.sin(rad(p.t)) * (LEN.pesc + LEN.cab) * s, y: pesc.y - Math.cos(rad(p.t)) * (LEN.pesc + LEN.cab) * s };
  const ombro = { x: mix(quadril.x, pesc.x, .9), y: mix(quadril.y, pesc.y, .9) };
  const cotF = pt(ombro, LEN.braco, p.fa[0]), maoF = pt(cotF, LEN.ante, p.fa[1]);
  const cotB = pt(ombro, LEN.braco, p.ba[0]), maoB = pt(cotB, LEN.ante, p.ba[1]);
  const costela = { x: mix(quadril.x, pesc.x, .55) - face * 3 * s, y: mix(quadril.y, pesc.y, .55) };
  return { quadril, joelhoF, peF, joelhoB, peB, pesc, cabeca, ombro, cotF, maoF, cotB, maoB, costela };
}
function desenhaFigura(cx, p, o) {
  const s = o.s, face = o.face, k = esqueleto(p, o.x, o.chao, s, face);
  cx.save();
  cx.lineCap = 'round'; cx.lineJoin = 'round';
  const linha = (pts, w) => { cx.lineWidth = w * s; cx.beginPath(); cx.moveTo(pts[0].x, pts[0].y); for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i].x, pts[i].y); cx.stroke(); };
  const seg = (a, b, w1, w2) => { // segmento afunilado
    const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    cx.beginPath(); cx.moveTo(a.x + nx * w1 * s / 2, a.y + ny * w1 * s / 2); cx.lineTo(b.x + nx * w2 * s / 2, b.y + ny * w2 * s / 2);
    cx.lineTo(b.x - nx * w2 * s / 2, b.y - ny * w2 * s / 2); cx.lineTo(a.x - nx * w1 * s / 2, a.y - ny * w1 * s / 2); cx.closePath(); cx.fill();
    cx.beginPath(); cx.arc(a.x, a.y, w1 * s / 2, 0, 6.29); cx.arc(b.x, b.y, w2 * s / 2, 0, 6.29); cx.fill();
  };
  const corpo = (cor, extra) => {
    cx.strokeStyle = cor; cx.fillStyle = cor;
    seg(k.quadril, k.joelhoB, 8.6 + extra, 6.4 + extra); seg(k.joelhoB, k.peB, 6.4 + extra, 4.2 + extra);
    seg(k.ombro, k.cotB, 5.4 + extra, 4.4 + extra); seg(k.cotB, k.maoB, 4.4 + extra, 3.4 + extra);
    seg(k.quadril, k.ombro, 10.5 + extra, 13 + extra); seg(k.ombro, k.pesc, 7 + extra, 4.5 + extra);
    seg(k.quadril, k.joelhoF, 8.6 + extra, 6.4 + extra); seg(k.joelhoF, k.peF, 6.4 + extra, 4.2 + extra);
    cx.beginPath(); cx.arc(k.cabeca.x, k.cabeca.y, (LEN.cab + extra / 2) * s, 0, 6.29); cx.fill();
    seg(k.peF, { x: k.peF.x + face * 6 * s, y: k.peF.y }, 4.2 + extra, 3 + extra);
    seg(k.peB, { x: k.peB.x + face * 6 * s, y: k.peB.y }, 4.2 + extra, 3 + extra);
  };
  // luz de fundo (as janelas atrás): contorno frio
  cx.shadowColor = o.rim; cx.shadowBlur = 16 * s;
  corpo(o.rim, 1.6);
  cx.shadowBlur = 0;
  corpo(o.cor, 0);
  // cabelo
  const up = { x: face * Math.sin(rad(p.t)), y: -Math.cos(rad(p.t)) }, tras = { x: -face * Math.cos(rad(p.t)), y: -face * Math.sin(rad(p.t)) * face };
  const P_ = (base, a, b) => ({ x: base.x + (up.x * a + tras.x * b) * s, y: base.y + (up.y * a + tras.y * b) * s });
  if (o.cabelo === 'longo') {
    const c = k.cabeca;
    const g = cx.createLinearGradient(c.x, c.y - 8 * s, c.x, c.y + 26 * s); g.addColorStop(0, 'rgba(232,198,120,.95)'); g.addColorStop(1, 'rgba(150,108,50,.75)');
    cx.fillStyle = g;
    cx.beginPath();
    const a0 = P_(c, 6.8, -1), a1 = P_(c, 5, 6.5), a2 = P_(c, -10, 9.5), a3 = P_(c, -26, 7.5), a4 = P_(c, -24, 1.5), a5 = P_(c, -8, 2.5), a6 = P_(c, 1, -.5);
    cx.moveTo(a0.x, a0.y); cx.quadraticCurveTo(a1.x, a1.y, a2.x, a2.y); cx.quadraticCurveTo(a3.x + tras.x * 2 * s, a3.y, a3.x, a3.y);
    cx.lineTo(a4.x, a4.y); cx.quadraticCurveTo(a5.x, a5.y, a6.x, a6.y); cx.closePath(); cx.fill();
    cx.strokeStyle = 'rgba(255,232,180,.35)'; cx.lineWidth = .8 * s;
    for (let i = 0; i < 3; i++) { const q0 = P_(c, 4 - i, 2 + i * 1.5), q1 = P_(c, -22 + i * 3, 3.5 + i * 1.4); cx.beginPath(); cx.moveTo(q0.x, q0.y); cx.quadraticCurveTo(P_(c, -8, 8 - i).x, P_(c, -8, 8 - i).y, q1.x, q1.y); cx.stroke(); }
  } else {
    cx.fillStyle = o.corCabelo; cx.beginPath(); cx.arc(k.cabeca.x - face * 1.2 * s, k.cabeca.y - 2.2 * s, LEN.cab * .95 * s, Math.PI * .95, Math.PI * 2.05); cx.fill();
  }
  // braço da espada por cima
  cx.fillStyle = o.cor; seg(k.ombro, k.cotF, 5.6, 4.6); seg(k.cotF, k.maoF, 4.6, 3.6);
  // espada
  const len = (o.madeira ? LEN.madeira : LEN.espada) * s, a = rad(p.sw);
  const ponta = { x: k.maoF.x + face * Math.sin(a) * len, y: k.maoF.y + Math.cos(a) * len };
  const cabo = { x: k.maoF.x - face * Math.sin(a) * 7 * s, y: k.maoF.y - Math.cos(a) * 7 * s };
  if (o.madeira) { cx.strokeStyle = '#6b4a2b'; cx.lineWidth = 3.4 * s; }
  else { const g = cx.createLinearGradient(k.maoF.x, k.maoF.y, ponta.x, ponta.y); g.addColorStop(0, '#9aa3ad'); g.addColorStop(.6, '#dfe6ee'); g.addColorStop(1, '#ffffff'); cx.strokeStyle = g; cx.lineWidth = 2.4 * s; cx.shadowColor = 'rgba(210,225,255,.7)'; cx.shadowBlur = 8 * s; }
  cx.beginPath(); cx.moveTo(k.maoF.x, k.maoF.y); cx.lineTo(ponta.x, ponta.y); cx.stroke(); cx.shadowBlur = 0;
  // guarda e cabo
  const px = Math.cos(a), py = -Math.sin(a) * face;
  cx.strokeStyle = o.madeira ? '#4a321d' : '#7b6a4c'; cx.lineWidth = 2.6 * s;
  cx.beginPath(); cx.moveTo(k.maoF.x + px * 5 * s * face, k.maoF.y + py * 5 * s * face); cx.lineTo(k.maoF.x - px * 5 * s * face, k.maoF.y - py * 5 * s * face); cx.stroke();
  cx.strokeStyle = o.lenco ? '#efe9dc' : '#2a2018'; cx.lineWidth = 3.2 * s; cx.beginPath(); cx.moveTo(k.maoF.x, k.maoF.y); cx.lineTo(cabo.x, cabo.y); cx.stroke();
  cx.restore();
  return { k, ponta };
}

// ------------------------------------------------------------------ o jogo
function start(root, opts) {
  const T = TX[opts.lang] || TX.en, A = opts.A;
  return new Promise((resolve) => {
    root.innerHTML = `
      <div class="dl-bg" style="background-image:url('${opts.fundo}')"></div>
      <canvas class="dl-cv"></canvas>
      <div class="dl-hud">
        <div class="dl-bar l"><b>Laura</b><span class="seg" data-n="3"></span><em>${T.guarda}</em></div>
        <div class="dl-meio"><span class="dl-combo"></span></div>
        <div class="dl-bar r"><b>Simon</b><span class="seg" data-n="5"></span><em>${T.fole}</em></div>
      </div>
      <p class="dl-legenda"></p>
      <div class="dl-anuncio"></div>
      <div class="dl-botoes">${T.botoes.map((b, i) => `<button data-a="${i}"><i>${['←', '↓', '↑', '→'][i]}</i>${b}</button>`).join('')}</div>
      <div class="dl-tela on">
        <h2>${T.titulo}</h2><p class="dl-sub">${T.sub}</p>
        <ul class="dl-regras">${T.regras.map((r) => `<li><span>${r[0]}</span><small>${r[1]}</small><b>${r[2]}</b></li>`).join('')}</ul>
        <p class="dl-nunca">${T.nunca}</p>
        <button class="cta dl-go">${T.comecar}</button>
        <p class="dl-teclado">${T.teclado}</p>
      </div>`;
    const cv = root.querySelector('.dl-cv'), cx = cv.getContext('2d');
    const leg = root.querySelector('.dl-legenda'), anuncio = root.querySelector('.dl-anuncio'), combo = root.querySelector('.dl-combo');
    const barL = root.querySelector('.dl-bar.l .seg'), barR = root.querySelector('.dl-bar.r .seg');
    let W = 0, H = 0, DPR = 1;
    const rs = () => { DPR = Math.min(devicePixelRatio || 1, 2); W = root.clientWidth; H = root.clientHeight; cv.width = W * DPR; cv.height = H * DPR; cx.setTransform(DPR, 0, 0, DPR, 0, 0); };
    addEventListener('resize', rs); rs();

    const META = 5, META_S = 3;
    const S = { toques: 0, sofridos: 0, leituras: 0, combo: 0, maxCombo: 0, aparos: 0, maos: 0, fintasLidas: 0 };
    const laura = new Lutador('laura'), simon = new Lutador('simon');
    let agora = 0, ultimo = performance.now(), escala = 1, rodando = false, acabou = false, pausa = false;
    let estado = 'pronto', tEstado = 0, ataque = null, resposta = null, janelaAbertura = 0, proxima = 0, fase = 1, congelado = false;
    const parts = [], flashes = [];
    const dica = { alvo: null, txt: '', ate: 0 };

    const barras = () => {
      barL.innerHTML = Array.from({ length: META_S }, (_, i) => `<i class="${i < META_S - S.sofridos ? 'on' : ''}"></i>`).join('');
      barR.innerHTML = Array.from({ length: META }, (_, i) => `<i class="${i < META - S.toques ? 'on' : ''}"></i>`).join('');
    };
    barras();
    const anuncia = (t, cls = '') => { anuncio.className = 'dl-anuncio ' + cls; anuncio.textContent = t; void anuncio.offsetWidth; anuncio.classList.add('on'); };
    const legenda = (t, ms = 2600) => { leg.textContent = t; leg.classList.add('on'); clearTimeout(legenda.t); legenda.t = setTimeout(() => leg.classList.remove('on'), ms); };
    const poeira = (x, y, n = 10, cor = '210,214,225') => { for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 60, vy: -Math.random() * 40 - 8, r: 1 + Math.random() * 2.5, a: .55, cor, vida: 900 + Math.random() * 500, t: agora }); };

    // sons (arquivo em assets/audio/sfx se existir; senão, sintetizado)
    const som = {
      choque() { opts.madeira ? A.sfx('espada-madeira', .7, () => { A.hiss(.12, 900, 2, .25); A.tone(260, .12, 'triangle', .12); }) : A.sfx('espada-aco', .7, () => { A.tone(1850, .5, 'triangle', .06); A.tone(2470, .4, 'sine', .04); A.hiss(.18, 4200, 3, .14, 0, 'highpass'); }); },
      zunido() { A.sfx('zunido', .5, () => A.hiss(.32, 1200, .9, .1)); },
      passo() { A.sfx('passo-pedra', .5, () => A.hiss(.14, 160, .6, .16, 0, 'lowpass')); },
      toque() { A.sfx('toque', .8, () => { A.tone(196, .7, 'sine', .1); A.tone(294, .9, 'sine', .07, .05); }); },
      dor() { A.sfx('golpe-recebido', .8, () => { A.tone(70, .5, 'sine', .3, 0, .6); A.hiss(.3, 300, .8, .2, 0, 'lowpass'); }); },
      sino() { A.tone(523, 1.4, 'sine', .05); A.tone(784, 1.6, 'sine', .03, .02); },
    };

    const fx = () => {
      const p = fase === 1 ? { tell: 1150, gapMin: 1300, gapMax: 1900, finta: 0, abertura: 950, tipos: ['alto', 'estocada'] }
        : fase === 2 ? { tell: 900, gapMin: 1000, gapMax: 1500, finta: .2, abertura: 780, tipos: ['alto', 'estocada', 'baixo'] }
          : { tell: 680, gapMin: 750, gapMax: 1150, finta: .3, abertura: 620, tipos: ['alto', 'estocada', 'baixo'] };
      return p;
    };
    const setFase = () => {
      const f = S.toques >= 4 ? 3 : S.toques >= 2 ? 2 : 1;
      if (f !== fase) { fase = f; legenda(f === 2 ? T.fase2 : T.fase3, 2400); anuncia(f === 2 ? T.fase2 : T.fase3, 'fase'); }
    };
    const agenda = (extra = 0) => { const p = fx(); proxima = agora + p.gapMin + Math.random() * (p.gapMax - p.gapMin) + extra; estado = 'guarda'; simon.vai('guarda', 380, agora); };

    // ---- Simon começa um ataque
    const inicia = (rapido) => {
      const p = fx();
      const tipo = p.tipos[Math.floor(Math.random() * p.tipos.length)];
      const finta = !rapido && Math.random() < p.finta;
      const dur = rapido ? 400 : p.tell;
      ataque = { tipo, finta, dur, t0: agora };
      resposta = null; estado = 'tell'; tEstado = agora;
      simon.vai(tipo === 'alto' ? 'tellAlto' : tipo === 'estocada' ? 'tellEstocada' : 'tellBaixo', finta ? dur * .55 : dur * .8, agora);
      const k = esqueleto(simon.atual, W * xS(), chao(), escalaFig(), -1);
      if (tipo === 'alto') { poeira(k.peB.x, chao(), 9); som.passo(); }
      if (tipo === 'baixo') { poeira(k.peF.x, chao(), 7); poeira(k.peB.x, chao(), 7); }
      if (fase === 1) dica.txt = tipo === 'alto' ? T.dicaPe : tipo === 'estocada' ? T.dicaOmbro : T.dicaJoelho, dica.alvo = tipo, dica.ate = agora + dur;
    };
    const certa = (tipo) => (tipo === 'alto' ? 0 : tipo === 'estocada' ? 1 : 2);

    // ---- o golpe chega: resolve contra o que Laura fez
    const golpe = () => {
      const t = ataque.tipo; estado = 'golpe'; tEstado = agora;
      simon.vai(t === 'alto' ? 'golpeAlto' : t === 'estocada' ? 'golpeEstocada' : 'golpeBaixo', 170, agora);
      som.zunido();
      setTimeout(() => {
        if (acabou) return;
        const r = resposta ? resposta.a : null;
        if (r === certa(t) && r !== 2) { // desvio limpo: abre a guarda dele
          S.leituras++; S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); mostraCombo();
          simon.vai('desequilibrio', 260, agora); estado = 'abertura'; tEstado = agora; janelaAbertura = fx().abertura;
          const k = esqueleto(simon.atual, W * xS(), chao(), escalaFig(), -1); poeira(k.peF.x, chao(), 8);
          if (S.toques === META - 1) congela();
        } else if (r === 2 && t === 'baixo') { // aparou o corte baixo: abre também
          som.choque(); S.leituras++; S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); mostraCombo(); faisca();
          simon.vai('desequilibrio', 300, agora); estado = 'abertura'; tEstado = agora; janelaAbertura = fx().abertura * .85;
          if (S.toques === META - 1) congela();
        } else if (r === 2) { // aparou o que devia ter desviado: segura, mas a mão sente
          som.choque(); faisca(); S.aparos++; if (!opts.lenco) S.maos++; S.combo = 0; mostraCombo();
          laura.vai('recuar', 220, agora); legenda(T.aparou, 1200); agenda(200);
        } else { // leu errado ou não leu: Simon acerta
          S.sofridos++; S.combo = 0; mostraCombo(); som.dor(); flashes.push({ t: agora, cor: '170,30,25' });
          laura.vai('atingido', 160, agora); anuncia(T.acertou, 'dor'); barras();
          if (S.sofridos >= META_S) return fim('perdeu');
          agenda(500);
        }
      }, 150);
    };
    const faisca = () => { const x = W * .5, y = chao() - escalaFig() * 60; for (let i = 0; i < 14; i++) parts.push({ x, y, vx: (Math.random() - .5) * 260, vy: (Math.random() - .7) * 220, r: 1 + Math.random(), a: 1, cor: opts.madeira ? '200,160,110' : '255,236,190', vida: 380, t: agora }); };
    const mostraCombo = () => { combo.textContent = S.combo >= 2 ? T.leituras(S.combo) : ''; combo.classList.remove('pop'); void combo.offsetWidth; if (S.combo >= 2) combo.classList.add('pop'); };

    // ---- o toque
    const tocar = () => {
      estado = 'tocou'; laura.vai('tocar', 160, agora); som.zunido();
      setTimeout(() => {
        S.toques++; barras(); som.toque(); anuncia(T.toque, 'toque'); simon.vai('atingido', 180, agora);
        flashes.push({ t: agora, cor: '255,240,210' });
        setTimeout(() => { laura.vai('guarda', 400, agora); }, 450);
        if (S.toques >= META) return fim(S.sofridos ? 'marcas' : 'limpo');
        setFase(); agenda(700);
      }, 170);
    };

    // ---- o ponto final: o jogo para e pergunta
    const congela = () => {
      congelado = true; escala = .06;
      const c = document.createElement('div'); c.className = 'dl-congela';
      c.innerHTML = `<p>${T.congela}</p><div><button class="cta dl-tocar">${T.tocar}</button><button class="ghost dl-baixar">${T.baixar}</button></div>`;
      root.appendChild(c); requestAnimationFrame(() => c.classList.add('on'));
      A.tone(110, 2.2, 'sine', .08); A.batida && A.batida(.8);
      c.querySelector('.dl-tocar').onclick = () => { c.remove(); escala = 1; congelado = false; tocar(); };
      c.querySelector('.dl-baixar').onclick = () => {
        c.remove(); escala = 1; congelado = false; laura.vai('baixa', 600, agora); estado = 'fim';
        setTimeout(() => { simon.vai('golpeAlto', 400, agora); }, 500);
        setTimeout(() => { som.choque(); fim('deixou'); }, 1100);
      };
    };

    // ---- entrada do jogador
    const age = (a) => {
      if (!rodando || acabou || congelado || pausa) return;
      const btn = root.querySelector(`.dl-botoes [data-a="${a}"]`); if (btn) { btn.classList.remove('hit'); void btn.offsetWidth; btn.classList.add('hit'); }
      if (a === 3) {
        if (estado === 'abertura') return tocar();
        if (estado === 'guarda' || estado === 'tell') { // atacou primeiro: Simon apara e devolve rápido
          laura.vai('tocar', 160, agora); som.zunido(); S.combo = 0; mostraCombo();
          setTimeout(() => { som.choque(); faisca(); laura.vai('guarda', 300, agora); legenda(T.precipitado, 1200); if (!acabou) { estado = 'pausa'; setTimeout(() => !acabou && inicia(true), 260); } }, 180);
        }
        return;
      }
      const pose = ['recuar', 'inclinar', ataque && ataque.tipo === 'baixo' && a === 2 ? 'aparaBaixo' : 'aparar'][a];
      laura.vai(pose, 140, agora); setTimeout(() => { if (estado !== 'abertura' && estado !== 'tocou' && estado !== 'fim') laura.vai('guarda', 420, agora); }, 620);
      if (a === 0) som.passo();
      if ((estado === 'tell' || estado === 'golpe') && !resposta) {
        resposta = { a, t: agora };
        if (ataque.finta && agora - ataque.t0 < ataque.dur * .55) ataque.fintaMordida = true;
      }
    };
    const teclas = { ArrowLeft: 0, a: 0, A: 0, 1: 0, ArrowDown: 1, s: 1, S: 1, 2: 1, ArrowUp: 2, w: 2, W: 2, 3: 2, ArrowRight: 3, d: 3, D: 3, ' ': 3, Enter: 3, 4: 3 };
    const kd = (e) => { if (!(e.key in teclas)) return; e.preventDefault(); e.stopPropagation(); if (e.repeat) return; age(teclas[e.key]); };
    addEventListener('keydown', kd, true);
    root.querySelectorAll('.dl-botoes button').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); age(+b.dataset.a); }));
    const vis = () => { pausa = document.hidden; };
    document.addEventListener('visibilitychange', vis);

    const chao = () => (H > W ? H * .64 : H * .74);
    const xL = () => (H > W ? .29 : .36), xS = () => (H > W ? .71 : .64);
    const escalaFig = () => Math.min(H * (H > W ? .0036 : .0042), W * (H > W ? .0053 : .0028));

    // ---- laço principal
    const passo = (now) => {
      if (acabou && estado === 'saiu') return;
      const dtReal = Math.min(50, now - ultimo); ultimo = now;
      if (!pausa) agora += dtReal * escala;
      if (rodando && !acabou && !congelado && !pausa) {
        if (estado === 'guarda' && agora >= proxima) inicia(false);
        else if (estado === 'tell') {
          if (ataque.finta && !ataque.cancelada && agora - ataque.t0 >= ataque.dur * .55) {
            ataque.cancelada = true; simon.vai('guarda', 240, agora);
            if (ataque.fintaMordida) { legenda(T.finta, 1100); estado = 'pausa'; setTimeout(() => !acabou && inicia(true), 280); }
            else { S.fintasLidas++; agenda(-300); }
          } else if (!ataque.finta && agora - ataque.t0 >= ataque.dur) golpe();
        } else if (estado === 'abertura' && agora - tEstado > janelaAbertura) { simon.vai('guarda', 360, agora); agenda(200); }
      }
      // respiração em guarda
      if (estado === 'guarda' && simon.nomePose === 'guarda' && agora - simon.t0 > 900) simon.vai('respira', 900, agora);
      else if (estado === 'guarda' && simon.nomePose === 'respira' && agora - simon.t0 > 900) simon.vai('guarda', 900, agora);
      desenha();
      requestAnimationFrame(passo);
    };
    const desenha = () => {
      cx.clearRect(0, 0, W, H);
      const s = escalaFig(), ch = chao();
      // feixes de luz das janelas
      cx.save(); cx.globalCompositeOperation = 'screen';
      for (let i = 0; i < 4; i++) {
        const x = W * (.16 + i * .23), g = cx.createLinearGradient(x, 0, x - W * .08, ch);
        g.addColorStop(0, 'rgba(150,180,230,.14)'); g.addColorStop(1, 'rgba(150,180,230,0)');
        cx.fillStyle = g; cx.beginPath(); cx.moveTo(x - 30, 0); cx.lineTo(x + 30, 0); cx.lineTo(x - W * .05, ch); cx.lineTo(x - W * .13, ch); cx.fill();
      }
      cx.restore();
      // chão
      const gc = cx.createLinearGradient(0, ch, 0, H); gc.addColorStop(0, 'rgba(14,18,26,.55)'); gc.addColorStop(1, 'rgba(4,6,10,.95)');
      cx.fillStyle = gc; cx.fillRect(0, ch, W, H - ch);
      cx.strokeStyle = 'rgba(170,190,220,.18)'; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(0, ch); cx.lineTo(W, ch); cx.stroke();
      // sombras no chão
      const sombra = (x) => { const g = cx.createRadialGradient(x, ch + 3, 1, x, ch + 3, 46 * s); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.beginPath(); cx.ellipse(x, ch + 3, 46 * s, 9 * s, 0, 0, 6.29); cx.fill(); };
      const pl = laura.passa(agora), ps = simon.passa(agora);
      sombra(W * xL() + pl.x * s); sombra(W * xS() - ps.x * s);
      const rim = 'rgba(150,180,235,.85)';
      const fs = desenhaFigura(cx, ps, { x: W * xS(), chao: ch, s, face: -1, cor: '#0b0d13', rim, cabelo: 'curto', corCabelo: '#120f0d', madeira: opts.madeira });
      desenhaFigura(cx, pl, { x: W * xL(), chao: ch, s, face: 1, cor: '#0d0c12', rim, cabelo: 'longo', corCabelo: 'rgba(214,176,98,.9)', madeira: opts.madeira, lenco: opts.lenco });
      // dicas da primeira fase: um anel onde o corpo dele avisa
      if (dica.alvo && agora < dica.ate && estado === 'tell') {
        const k = fs.k, alvo = dica.alvo === 'alto' ? k.peB : dica.alvo === 'estocada' ? k.ombro : k.joelhoF;
        const pulso = (Math.sin(agora / 90) + 1) / 2;
        cx.strokeStyle = `rgba(232,196,120,${.5 + pulso * .4})`; cx.lineWidth = 2; cx.beginPath(); cx.arc(alvo.x, alvo.y, (9 + pulso * 4) * s, 0, 6.29); cx.stroke();
        cx.font = `italic ${Math.max(13, 5.4 * s)}px 'Cormorant Garamond', Georgia, serif`; cx.fillStyle = 'rgba(240,222,180,.95)'; cx.textAlign = 'center';
        cx.fillText(dica.txt, alvo.x, alvo.y + 24 * s);
      }
      // a abertura: a costela dele
      if (estado === 'abertura') {
        const c = fs.k.costela, pulso = (Math.sin(agora / 70) + 1) / 2;
        const g = cx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 16 * s); g.addColorStop(0, `rgba(255,236,200,${.55 + pulso * .35})`); g.addColorStop(1, 'rgba(255,236,200,0)');
        cx.fillStyle = g; cx.beginPath(); cx.arc(c.x, c.y, 16 * s, 0, 6.29); cx.fill();
        if (fase === 1) { cx.font = `italic ${Math.max(13, 5.4 * s)}px 'Cormorant Garamond', Georgia, serif`; cx.fillStyle = 'rgba(255,240,215,.95)'; cx.textAlign = 'center'; cx.fillText(T.abertura, c.x, c.y - 20 * s); }
      }
      // poeira
      for (let i = parts.length - 1; i >= 0; i--) {
        const q = parts[i], v = (agora - q.t) / q.vida; if (v >= 1) { parts.splice(i, 1); continue; }
        q.x += q.vx * .016 * escala; q.y += q.vy * .016 * escala; q.vy += 20 * .016 * escala;
        cx.fillStyle = `rgba(${q.cor},${(q.a * (1 - v)).toFixed(3)})`; cx.beginPath(); cx.arc(q.x, q.y, q.r, 0, 6.29); cx.fill();
      }
      // clarões
      for (let i = flashes.length - 1; i >= 0; i--) {
        const f = flashes[i], v = (agora - f.t) / 380; if (v >= 1) { flashes.splice(i, 1); continue; }
        cx.fillStyle = `rgba(${f.cor},${(.28 * (1 - v)).toFixed(3)})`; cx.fillRect(0, 0, W, H);
      }
      if (congelado) { cx.fillStyle = 'rgba(0,0,0,.35)'; cx.fillRect(0, 0, W, H); }
    };

    // ---- fim
    const fim = (resultado) => {
      if (acabou) return; acabou = true; estado = 'fim';
      if (resultado !== 'deixou') simon.vai(resultado === 'perdeu' ? 'guarda' : 'cansado', 600, agora);
      laura.vai(resultado === 'perdeu' ? 'cansado' : resultado === 'deixou' ? 'baixa' : 'guarda', 600, agora);
      som.sino();
      setTimeout(() => {
        const t = document.createElement('div'); t.className = 'dl-tela on fim';
        t.innerHTML = `<h2>${T[resultado === 'limpo' ? 'venceu' : resultado]}</h2><button class="cta dl-seguir">${T.seguir}</button>`;
        root.appendChild(t);
        t.querySelector('.dl-seguir').onclick = () => {
          removeEventListener('keydown', kd, true); removeEventListener('resize', rs); document.removeEventListener('visibilitychange', vis);
          estado = 'saiu';
          resolve({ resultado, toques: S.toques, sofridos: S.sofridos, leituras: S.leituras, maxCombo: S.maxCombo, aparos: S.aparos, maos: S.maos, fintasLidas: S.fintasLidas });
        };
      }, 1300);
    };

    // ---- começar
    root.querySelector('.dl-go').onclick = () => {
      root.querySelector('.dl-tela').classList.remove('on');
      legenda(T.fala0, 2800);
      setTimeout(() => { anuncia(T.emGuarda, 'grande'); som.sino(); }, 900);
      setTimeout(() => { anuncia(T.ja, 'grande'); rodando = true; agenda(-600); }, 2400);
    };
    requestAnimationFrame((n) => { ultimo = n; requestAnimationFrame(passo); });
    window.__DUELO = { S, get estado() { return estado; }, age, get ataque() { return ataque; } };
  });
}
window.DUELO = { start };
})();
