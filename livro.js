/* ==========================================================================
   MOTOR DO LIVRO INTERATIVO · As Quatro Vontades · versão Capítulo II
   Derivado do motor do Capítulo I, sem o que era só do Aheryn (Luz, hino,
   goles, cabana). O que é de Laura: o Peso (invisível), o coração, o olhar,
   a prece e o duelo. O roteiro vem de window.LIVRO (capitulo2.js).
   ========================================================================== */
(() => {
'use strict';
const L = window.LIVRO, CFG = window.CHAPTER_CONFIG || {}, CODEX = CFG.codex || {}, ZONES = Object.assign({}, CFG.zones || {}, L.zonas || {});
const SUPA = { url: 'https://qoxvlgscpljsrybywivf.supabase.co', key: 'sb_publishable_XvoczGgXZGAezAmabNUBrQ_r25L-7ga' };
const $ = (s, r = document) => r.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const IS_TOUCH = matchMedia('(pointer: coarse)').matches;
const H264 = !!document.createElement('video').canPlayType('video/mp4; codecs="avc1.42E01E"');
const vsrc = (u) => (H264 || !/\.mp4$/.test(u) ? u : u.replace(/\.mp4$/, '.webm'));
const SAVE_KEY = 'livro_' + L.id;
let LANG = 'en'; try { LANG = localStorage.getItem('livro_lang') || 'en'; } catch (e) {}
const EN = window.LIVRO_EN || {};
const tr = (t) => (LANG === 'en' && t != null ? (EN[t] != null ? EN[t] : t) : t);
const UI = window.LIVRO_UI;
const U = (k) => UI[LANG][k];

// ---------------------------------------------------------------- estado
const novoEstado = () => ({ i: 0, peso: 0, perfil: {}, f: {}, escolhas: {}, dialogo: {}, feitos: {}, olhar: {}, duelo: null, sessao: (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random()) });
let st = novoEstado();
const salvar = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(st)); } catch (e) {} };
const carregar = () => { try { const j = JSON.parse(localStorage.getItem(SAVE_KEY)); return j && j.sessao ? j : null; } catch (e) { return null; } };
// o que capítulos anteriores deixaram (mesmo navegador)
let ANTES = {}; try { ANTES = JSON.parse(localStorage.getItem('aqv_estado') || '{}') || {}; } catch (e) {}
window.AQV_ANTES = ANTES;
const P = L.paginas;
const visivel = (p) => !p.se || p.se(st);
const narrOf = (p) => (typeof p.narracao === 'function' ? p.narracao(st) : p.narracao);
const idxVis = (from, dir) => { let i = from + dir; while (i >= 0 && i < P.length && !visivel(P[i])) i += dir; return i; };

// ---------------------------------------------------------------- áudio (Web Audio)
const AC = window.AudioContext || window.webkitAudioContext;
const A = {
  ctx: null, bufs: {}, zone: null, narr: null, on: true,
  init() {
    if (this.ctx) return; this.ctx = new AC();
    this.master = this.ctx.createGain(); this.master.connect(this.ctx.destination);
    this.bed = this.ctx.createGain(); this.bed.connect(this.master);
    this.fx = this.ctx.createGain(); this.fx.gain.value = .8; this.fx.connect(this.master);
    const n = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; this.noise = n;
  },
  resume() { this.ctx && this.ctx.state === 'suspended' && this.ctx.resume(); },
  async buf(url) {
    if (!this.ctx) return null;
    if (this.bufs[url]) return this.bufs[url];
    const p = fetch(url).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject())).then((ab) => new Promise((res, rej) => this.ctx.decodeAudioData(ab, res, rej))).catch(() => null);
    this.bufs[url] = p; return p;
  },
  async loop(url, vol, fade = 1.5) {
    const b = await this.buf(url); if (!b) return null;
    const s = this.ctx.createBufferSource(); s.buffer = b; s.loop = true;
    const g = this.ctx.createGain(); g.gain.value = 0; s.connect(g); g.connect(this.bed); s.start();
    g.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + fade);
    return { s, g };
  },
  stop(h, fade = 1.5) { if (!h) return; const t = this.ctx.currentTime; h.g.gain.cancelScheduledValues(t); h.g.gain.setValueAtTime(h.g.gain.value, t); h.g.gain.linearRampToValueAtTime(0, t + fade); setTimeout(() => { try { h.s.stop(); } catch (e) {} }, fade * 1000 + 100); },
  async setZone(z) {
    if (!this.ctx || z === this.zone) return; this.zone = z;
    const old = this.zoneH; this.zoneH = null; this.stop(old, 2);
    clearInterval(this.oneT);
    const cfg = ZONES[z]; if (!cfg) return;
    if (cfg.oneShot) { const l = [].concat(cfg.oneShot); this.oneT = setInterval(() => { if (this.zone === z && Math.random() < .5) this.once(l[Math.floor(Math.random() * l.length)], .35); }, 9000); }
    if (!cfg.src) return;
    const h = await this.loop(cfg.src, cfg.volume * .8, 2.2);
    if (this.zone === z) this.zoneH = h; else this.stop(h, .3);
  },
  async once(url, vol = .7) { const b = await this.buf(url); if (!b) return 0; const s = this.ctx.createBufferSource(); s.buffer = b; const g = this.ctx.createGain(); g.gain.value = vol; s.connect(g); g.connect(this.fx); s.start(); return b.duration; },
  async narrate(url, onEnd) {
    this.stopNarr(); const b = await this.buf(url); if (!b) return false;
    const s = this.ctx.createBufferSource(); s.buffer = b; s.connect(this.master); s.start();
    this.duck(true); this.narr = s; s.onended = () => { if (this.narr === s) { this.narr = null; this.duck(false); onEnd && onEnd(); } };
    return true;
  },
  stopNarr() { if (this.narr) { const s = this.narr; this.narr = null; try { s.stop(); } catch (e) {} this.duck(false); } },
  duck(on) { if (!this.ctx) return; const t = this.ctx.currentTime; this.bed.gain.cancelScheduledValues(t); this.bed.gain.setTargetAtTime(on ? .25 : 1, t, .25); },
  setOn(on) { this.on = on; if (this.master) this.master.gain.setTargetAtTime(on ? 1 : 0, this.ctx.currentTime, .1); },
  tone(f, d, type = 'sine', v = .08, when = 0, bend = 0) {
    if (!this.ctx) return; const t = this.ctx.currentTime + when, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (bend) o.frequency.exponentialRampToValueAtTime(f * bend, t + d);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(this.fx); o.start(t); o.stop(t + d + .05);
  },
  hiss(d, f, q, v, when = 0, type = 'bandpass') {
    if (!this.ctx) return; const t = this.ctx.currentTime + when, s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const fl = this.ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q; const g = this.ctx.createGain();
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(v, t + d * .3); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    s.connect(fl); fl.connect(g); g.connect(this.fx); s.start(t); s.stop(t + d + .05);
  },
  // sfx: se o arquivo existir em assets/audio/sfx, toca ele; senão, um som sintetizado de reserva
  async sfx(nome, vol = .6, reserva) { if (!this.ctx) return; const d = await this.once('assets/audio/sfx/' + nome + '.mp3', vol); if (!d && reserva) reserva(); },
  virar() { this.sfx('pagina', .35, () => this.hiss(.35, 2400, .7, .05)); },
  escolha() { this.tone(392, .5, 'sine', .05); this.tone(587, .6, 'sine', .035, .06); },
  aviso() { this.tone(440, .9, 'triangle', .03); },
  // o peso: um baque surdo, grave, dentro do peito
  peso() { this.sfx('peso', .7, () => { this.tone(48, 1.4, 'sine', .32, 0, .7); this.hiss(.9, 120, .6, .18, 0, 'lowpass'); }); },
  // batida do coração (sintetizada): tum-tum
  batida(forca = .5) { if (!this.ctx) return; const v = .12 + forca * .3; this.tone(58, .22, 'sine', v, 0, .6); this.hiss(.16, 90, .7, v * .5, 0, 'lowpass'); this.tone(52, .2, 'sine', v * .7, .17, .6); this.hiss(.14, 80, .7, v * .35, .17, 'lowpass'); },
};

// ---------------------------------------------------------------- o coração (a variável de Laura não tem nome; tem pulso)
// pulso da página (0 a 3) + peso acumulado = ritmo e força da batida e do aperto nas bordas
const Coracao = (() => {
  let alvo = 0, nivel = 0, t = null, extra = 0;
  const root = document.documentElement;
  const bater = () => {
    const pesoN = clamp(st.peso / 6, 0, 1);
    const n = clamp(nivel + extra, 0, 4);
    const bpm = 58 + n * 20 + pesoN * 10;
    document.body.classList.remove('bate'); void document.body.offsetWidth; document.body.classList.add('bate');
    if (A.ctx && A.on && (n >= 1 || pesoN > .5)) A.batida(clamp(n / 4 + pesoN * .3, 0, 1));
    t = setTimeout(bater, 60000 / bpm);
  };
  const desenha = () => {
    nivel += (alvo - nivel) * .03;
    const pesoN = clamp(st.peso / 6, 0, 1);
    root.style.setProperty('--pulso', clamp((nivel + extra) / 4, 0, 1).toFixed(3));
    root.style.setProperty('--peso', pesoN.toFixed(3));
    requestAnimationFrame(desenha);
  };
  return {
    start() { if (!t) { bater(); desenha(); } },
    set(v) { alvo = v || 0; },
    extra(v) { extra = v; },
  };
})();
function mudaPeso(d) {
  if (!d) return; st.peso = Math.max(0, st.peso + d);
  if (d < 0) { A.tone(392, 1.2, 'sine', .03); A.tone(523, 1.4, 'sine', .02, .1); return; }
  A.peso(); document.body.classList.remove('pesa'); void document.body.offsetWidth; document.body.classList.add('pesa');
}

// ---------------------------------------------------------------- fundos
const bgWrap = $('#bg');
let bgKey = '';
const resolveFundo = (p) => (st.fundoPag && st.fundoPag[p.id]) || (typeof p.fundo === 'function' ? p.fundo(st) : p.fundo);
function setFundo(f) {
  if (!f) return; const key = JSON.stringify(f); if (key === bgKey) return; bgKey = key;
  const layer = document.createElement('div');
  layer.className = 'bgl kb-' + (f.kb || 'in') + (f.tint ? ' tint-' + f.tint : '') + (f.retrato ? ' retrato' : '');
  layer.style.setProperty('--dim', f.dim != null ? f.dim : .5);
  layer.style.setProperty('--foco', f.foco || '50% 40%');
  const src = f.img;
  if (f.retrato) { const b = document.createElement('div'); b.className = 'blur'; b.style.backgroundImage = `url("${src}")`; layer.appendChild(b); }
  if (f.video || f.clip) {
    const v = document.createElement('video'); v.src = vsrc(f.video || f.clip); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.autoplay = true;
    v.style.objectPosition = f.foco || '50% 40%'; v.className = 'img';
    if (f.img) v.poster = f.img; layer.appendChild(v); v.play().catch(() => {});
  } else { const im = document.createElement('div'); im.className = 'img'; im.style.backgroundImage = `url("${src}")`; layer.appendChild(im); }
  bgWrap.appendChild(layer);
  document.body.classList.toggle('lado-dir', f.lado === 'dir');
  Clima.set(f.clima || null);
  requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.add('on')));
  const olds = [...bgWrap.children].filter((c) => c !== layer);
  setTimeout(() => olds.forEach((o) => o.remove()), 1600);
}

// ---------------------------------------------------------------- clima: poeira na luz, fagulhas de vela, poeira azul no laranjal
const Clima = (() => {
  const cv = $('#fx'), cx = cv.getContext('2d'); let modo = null, alvo = 0, dens = 0, parts = [], t0 = performance.now();
  const PERFIS = {
    poeira: { n: 70, cor: '236,214,170', vy: [-4, 6], vx: [-5, 8], r: [.5, 1.8], a: [.12, .45], wob: 10 },
    velas: { n: 26, cor: '255,196,120', vy: [-16, -5], vx: [-4, 4], r: [.5, 1.4], a: [.2, .7], wob: 8, pisca: true },
    'poeira-azul': { n: 80, cor: '200,214,232', vy: [-3, 5], vx: [-4, 6], r: [.5, 1.7], a: [.08, .35], wob: 9 },
  };
  const rs = () => { const d = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * d; cv.height = innerHeight * d; cx.setTransform(d, 0, 0, d, 0, 0); };
  addEventListener('resize', rs); rs();
  const rnd = (a) => a[0] + Math.random() * (a[1] - a[0]);
  const novo = (pf) => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: rnd(pf.vx), vy: rnd(pf.vy), r: rnd(pf.r), a: rnd(pf.a), ph: Math.random() * 6.28 });
  let last = performance.now();
  const loop = (now) => {
    const dt = Math.max(0, Math.min((now - last) / 1000, .05)); last = now;
    dens = Math.max(0, dens + (alvo - dens) * Math.min(1, dt * 1.5));
    cx.clearRect(0, 0, innerWidth, innerHeight);
    const pf = PERFIS[modo];
    if (pf) {
      const n = Math.max(0, Math.round(pf.n * dens * (innerWidth < 700 ? .55 : 1)) || 0);
      while (parts.length < n) parts.push(novo(pf));
      if (parts.length > n) parts.length = n;
      const tt = (now - t0) / 1000;
      for (const q of parts) {
        q.x += (q.vx + Math.sin(tt * .6 + q.ph) * pf.wob * .3) * dt; q.y += q.vy * dt;
        if (q.y > innerHeight + 10 || q.y < -12 || q.x < -20 || q.x > innerWidth + 20) { Object.assign(q, novo(pf)); if (q.vy < 0) q.y = innerHeight + 6; }
        const al = q.a * (pf.pisca ? .55 + .45 * Math.sin(tt * 3 + q.ph * 3) : 1) * dens;
        cx.beginPath(); cx.fillStyle = `rgba(${pf.cor},${al.toFixed(3)})`; cx.arc(q.x, q.y, q.r, 0, 6.283); cx.fill();
      }
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  return { set(m) { if (m === modo) return; if (matchMedia('(prefers-reduced-motion: reduce)').matches) m = null; modo = m; parts = []; dens = 0; alvo = m ? 1 : 0; } };
})();

// ---------------------------------------------------------------- codex
function aliasesAtuais() {
  const out = [];
  for (const [id, c] of Object.entries(CODEX)) {
    const al = LANG === 'en' ? (c.aliasesEn || [c.en && c.en.title]) : (c.aliasesPt || [c.pt && c.pt.title]);
    for (const a of al.filter(Boolean)) out.push([a, id]);
  }
  return out.sort((a, b) => b[0].length - a[0].length);
}
const esc = (t) => String(t).replace(/[&<>"]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[m]));
const linkUsados = new Set();
function linkify(text) {
  let html = esc(text);
  for (const [a, id] of aliasesAtuais()) {
    if (linkUsados.has(id)) continue;
    const re = new RegExp(`(^|[^\\p{L}])(${a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?![\\p{L}])`, 'u');
    if (re.test(html)) { html = html.replace(re, `$1<button class="gloss" data-codex="${id}">$2</button>`); linkUsados.add(id); }
  }
  return html;
}
function abrirCodex(id) {
  const c = CODEX[id]; if (!c) return; const t = c[LANG] || c.pt || c.en; let pg = 0;
  const m = $('#codex'); $('#cxImg').style.backgroundImage = `url("${c.image}")`; $('#cxEye').textContent = t.eyebrow || ''; $('#cxTitle').textContent = t.title;
  const draw = () => { $('#cxText').innerHTML = t.pages[pg].map((p) => `<p>${esc(p)}</p>`).join(''); $('#cxPg').textContent = `${pg + 1} / ${t.pages.length}`; $('#cxPrev').disabled = pg === 0; $('#cxNext').disabled = pg === t.pages.length - 1; };
  $('#cxPrev').onclick = () => { pg--; draw(); }; $('#cxNext').onclick = () => { pg++; draw(); };
  draw(); m.classList.add('show'); A.tone(660, .5, 'sine', .03);
}
document.addEventListener('click', (e) => { const g = e.target.closest('.gloss'); if (g) { e.preventDefault(); abrirCodex(g.dataset.codex); } });
$('#cxClose').onclick = () => $('#codex').classList.remove('show');

function toast(t) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; $('#toasts').appendChild(el); A.aviso(); setTimeout(() => el.classList.add('out'), 3600); setTimeout(() => el.remove(), 4400); }

// ---------------------------------------------------------------- estatísticas (Supabase)
function registrar(escolha, opcao) {
  fetch(`${SUPA.url}/rest/v1/livro_escolhas?on_conflict=sessao,capitulo,escolha`, {
    method: 'POST', headers: { apikey: SUPA.key, 'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify({ capitulo: L.id, escolha, opcao, sessao: st.sessao }),
  }).catch(() => {});
}
async function estatisticas() {
  try {
    const r = await fetch(`${SUPA.url}/rest/v1/rpc/livro_estatisticas`, { method: 'POST', headers: { apikey: SUPA.key, 'Content-Type': 'application/json' }, body: JSON.stringify({ p_capitulo: L.id }) });
    return r.ok ? r.json() : [];
  } catch (e) { return []; }
}

// ---------------------------------------------------------------- render de página
const txt = $('#ptext'), box = $('#choices'), btnNext = $('#next'), btnPrev = $('#prev'), panel = $('#page');
// um parágrafo pode ser: 'texto', { se: st => bool, t: 'texto' } ou st => 'texto' | null
const umPara = (p) => (typeof p === 'string' ? p : typeof p === 'function' ? p(st) : (p && p.se(st) ? p.t : null));
const paras = (list) => [].concat(list || []).map(umPara).flat().filter(Boolean).map(tr);
function pHTML(p, extra = '') { const dlg = p.startsWith('—'); return `<p class="${dlg ? 'dlg' : ''} ${extra}">${linkify(p)}</p>`; }
let timers = [];
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
const later = (fn, ms) => timers.push(setTimeout(fn, ms));
const rotulo = (o) => (o.silencio ? U('silencioR') : tr(typeof o.txt === 'function' ? o.txt(st) : o.txt));

function render(dir = 1) {
  clearTimers(); A.stopNarr(); linkUsados.clear();
  const p = P[st.i]; if (!p) return;
  setFundo(resolveFundo(p));
  if (A.ctx) { A.setZone(p.zona); if (p.som && dir > 0) A.once(p.som, .55); }
  document.body.dataset.zona = p.zona;
  Coracao.set(typeof p.pulso === 'function' ? p.pulso(st) : p.pulso); Coracao.extra(0);
  { let k = st.i; while (k > 0 && !P[k].parte) k--; $('#parte').textContent = U('parte') + ' ' + (P[k].parte || 'I'); }
  const vis = P.filter(visivel), n = vis.indexOf(p) + 1; $('#pnum').textContent = `${n}`;
  $('#prog').style.setProperty('--p', (n / vis.length).toFixed(3));
  panel.classList.remove('in'); void panel.offsetWidth; panel.classList.add('in');
  panel.classList.toggle('cartao', !!p.cartao);
  if (p.cartao) {
    const c = p.cartao;
    txt.innerHTML = `<div class="ct"><p class="ct-num">${U('parte')} ${c.num}</p><h2 class="ct-nome">${esc(tr(c.nome))}</h2><span class="ct-orn">✦</span>
      <blockquote class="ct-epi"><p>${esc(tr(c.epigrafe))}</p><cite>${esc(tr(c.fonte))}</cite></blockquote></div>`;
  } else txt.innerHTML = paras(p.texto).map((t, k) => pHTML(t, k === 0 && p.capitular ? 'cap' : '')).join('');
  box.innerHTML = ''; box.classList.remove('urgente', 'sobPressao');
  [...txt.children].forEach((el, k) => { el.style.animationDelay = (k * .35) + 's'; });
  const extras = $('#extras'); extras.innerHTML = '';
  const narr = narrOf(p);
  const narrTag = p.narracaoLang && p.narracaoLang !== LANG ? ` (${p.narracaoLang.toUpperCase()})` : '';
  if (narr) extras.insertAdjacentHTML('beforeend', `<button class="chip" id="narr"><i class="eq"></i>${U('ouvir')}${narrTag}</button>`);
  if (p.cena) extras.insertAdjacentHTML('beforeend', `<button class="chip" id="cena">${U('cena')}</button>`);
  if (narr) ligaNarr(p, narr);
  if (p.cena) $('#cena').onclick = () => verCena(p.cena);
  if (p.efeito && !st.feitos['ef:' + p.id]) { st.feitos['ef:' + p.id] = 1; const ef = p.efeito; if (ef.flag) st.f[ef.flag] = true; if (ef.peso) later(() => mudaPeso(ef.peso), 1200); }
  if (p.quieto) renderQuieto(p);
  let livre = true;
  if (p.escolha) livre = renderEscolha(p);
  if (p.dialogo) livre = renderDialogo(p);
  if (p.minijogo) livre = renderMinijogo(p);
  setNext(livre);
  btnPrev.disabled = idxVis(st.i, -1) < 0; btnPrev.textContent = U('voltar');
  btnNext.textContent = p.fim ? U('fim') : U('prox');
  st.feitos[p.id] = st.feitos[p.id] || 1; salvar();
  panel.scrollTop = 0;
}
function ligaNarr(p, url) {
  const b = $('#narr'); if (!b) return;
  b.onclick = () => {
    if (A.narr) { A.stopNarr(); b.classList.remove('on'); return; }
    b.classList.add('on'); A.narrate(url, () => b.classList.remove('on')).then((ok) => { if (!ok) b.classList.remove('on'); });
  };
}
function setNext(on) { btnNext.disabled = !on; btnNext.classList.toggle('pulse', on); }
function appendParas(list, cls = '') { paras(list).forEach((t, k) => { txt.insertAdjacentHTML('beforeend', pHTML(t, 'novo ' + cls)); txt.lastElementChild.style.animationDelay = (k * .35) + 's'; }); }
const optHTML = (o, k) => `<button class="opt ${o.silencio ? 'sil' : ''}" data-id="${o.id}"><span class="k">${k + 1}</span>${o.silencio ? `<em>${U('silencio')}</em>` : esc(rotulo(o))}</button>`;
const opcoesVis = (lista) => lista.filter((o) => !o.se || o.se(st));

// ----- quieto: nenhum botão; se o leitor esperar, surge um "…". Pode ser uma fala com resposta ou um gesto.
function renderQuieto(p) {
  const q = p.quieto, ja = st.escolhas[q.id];
  const mostra = (anim) => {
    const c = anim ? 'novo' : '';
    if (q.fala) {
      txt.insertAdjacentHTML('beforeend', `<p class="dlg eu ${c}">— ${esc(tr(q.fala))}</p>`);
      const resp = () => txt.insertAdjacentHTML('beforeend', `<p class="dlg ele ${c}">— ${esc(tr(q.resposta))}</p>`);
      if (anim) later(resp, 900); else resp();
    }
    if (anim) later(() => appendParas(q.depois), q.fala ? 1800 : 200); else appendParas(q.depois);
  };
  if (ja === 'fala') { mostra(false); return; }
  if (ja) { appendParas(q.seCalar); return; }
  later(() => {
    if (P[st.i] !== p || st.escolhas[q.id]) return;
    txt.insertAdjacentHTML('beforeend', '<button class="quieto" aria-label="…">…</button>');
    txt.querySelector('.quieto').onclick = (e) => {
      e.currentTarget.remove(); st.escolhas[q.id] = 'fala'; aplicar({ eixo: q.eixo, flag: q.flag }); registrar(q.id, 'fala'); salvar(); mostra(true);
    };
  }, q.espera * 1000);
}

// ----- escolhas (sem relógio sobre a leitura; o "Decidir" abre uma janela curta, só quando o leitor quer)
function renderEscolha(p) {
  const e = p.escolha, feita = st.escolhas[e.id];
  if (feita) { const o = e.opcoes.find((x) => x.id === feita); if (o) { box.innerHTML = `<p class="feita">${U('escolheu')} ${esc(rotulo(o))}</p>`; appendParas(o.resultado); } return true; }
  if (e.revelar && !p._revelado) {
    box.innerHTML = (e.revelarDica ? `<p class="dica">${esc(tr(e.revelarDica))}</p>` : '') + `<button class="opt decidir" id="revBtn">${U('decidir')}</button>`;
    $('#revBtn').onclick = () => { p._revelado = true; abreEscolha(p); };
    return false;
  }
  abreEscolha(p);
  return false;
}
function abreEscolha(p) {
  const e = p.escolha;
  box.innerHTML = `<p class="eyebrow">${e.urgente ? U('decida') : (e.pergunta ? esc(tr(e.pergunta)) : U('oque'))}</p>` + opcoesVis(e.opcoes).map(optHTML).join('') + (e.janela ? `<div class="tenso" style="--j:${e.janela}s"></div>` : '');
  box.classList.toggle('urgente', !!e.urgente);
  box.querySelectorAll('.opt').forEach((b) => b.onclick = () => escolher(p, b.dataset.id));
  if (e.janela) {
    box.classList.add('sobPressao'); Coracao.extra(1.5);
    if (e.somJanela) A.once(e.somJanela, .7); else A.sfx('passos-guarda', .8, () => { for (let k = 0; k < 5; k++) A.hiss(.25, 300, 1.2, .12, k * .8, 'lowpass'); });
    later(() => { if (!st.escolhas[e.id]) escolher(p, e.padrao); }, e.janela * 1000);
  }
}
function aplicar(o) {
  if (!o) return;
  if (o.eixo) { st.perfil = st.perfil || {}; st.perfil[o.eixo] = (st.perfil[o.eixo] || 0) + 1; }
  if (o.peso) mudaPeso(o.peso);
  if (o.flag) [].concat(o.flag).forEach((f) => { st.f[f] = true; });
  if (o.aviso) later(() => toast(tr(o.aviso)), 500);
}
function escolher(p, id) {
  const e = p.escolha; if (st.escolhas[e.id]) return;
  const o = e.opcoes.find((x) => x.id === id); st.escolhas[e.id] = id;
  if (o.fundo) { (st.fundoPag = st.fundoPag || {})[p.id] = o.fundo; setFundo(o.fundo); }
  box.classList.remove('sobPressao'); Coracao.extra(0);
  const sel = box.querySelector(`.opt[data-id="${id}"]`);
  box.querySelectorAll('.opt').forEach((b) => { b.disabled = true; b.classList.toggle('sel', b.dataset.id === id); });
  if (!sel) box.innerHTML = `<p class="feita">${U('escolheu')} ${esc(rotulo(o))}</p>`;
  if (o.som) A.sfx(o.som, .7);
  if (o.pulso != null) Coracao.extra(o.pulso);
  aplicar(o); A.escolha(); registrar(e.id, id); salvar();
  later(() => { appendParas(o.resultado); setNext(true); }, 450);
}

// ----- diálogo em rodadas: cada opção pode ter a própria resposta; a rodada pode abrir com uma fala do outro
function renderDialogo(p) {
  const d = p.dialogo, feito = st.dialogo[p.id] || [];
  const log = document.createElement('div'); log.className = 'dlog'; txt.appendChild(log);
  const linha = (quem, t, novo) => { log.insertAdjacentHTML('beforeend', `<p class="dlg ${quem} ${novo ? 'novo' : ''}">— ${esc(t)}</p>`); };
  const narra = (t, novo) => { log.insertAdjacentHTML('beforeend', `<p class="nar ${novo ? 'novo' : ''}">${linkify(t)}</p>`); };
  const resp = (r, o) => [].concat(typeof o.resposta === 'function' ? o.resposta(st) : (o.resposta || r.resposta)).filter(Boolean);
  const emite = (lista, novo) => lista.forEach((t) => (t.startsWith('—') ? linha('ele', tr(t).replace(/^—\s*/, ''), novo) : narra(tr(t), novo)));
  feito.forEach(([rid, oid]) => {
    const r = d.rodadas.find((x) => x.id === rid), o = r.opcoes.find((x) => x.id === oid);
    if (r.antes) emite([].concat(r.antes));
    o.silencio ? log.insertAdjacentHTML('beforeend', '<p class="dlg sil">…</p>') : linha('eu', rotulo(o));
    emite(resp(r, o));
  });
  const next = () => {
    const k = (st.dialogo[p.id] || []).length;
    if (k >= d.rodadas.length) { box.innerHTML = ''; appendParas(p.depois); setNext(true); return; }
    const r = d.rodadas[k];
    if (r.antes && !r._dito) { r._dito = true; emite([].concat(r.antes), true); later(next, 1300); return; }
    box.innerHTML = `<p class="eyebrow">${r.pergunta ? esc(tr(r.pergunta)) : U('resp') + ' ' + esc(tr(d.interlocutor))}</p>` + opcoesVis(r.opcoes).map(optHTML).join('');
    box.querySelectorAll('.opt').forEach((b) => b.onclick = () => {
      const o = r.opcoes.find((x) => x.id === b.dataset.id);
      (st.dialogo[p.id] = st.dialogo[p.id] || []).push([r.id, o.id]); st.escolhas[r.id] = o.id;
      aplicar(o); if (o.pulso != null) Coracao.extra(o.pulso); registrar(r.id, o.id); salvar(); A.escolha(); box.innerHTML = '';
      o.silencio ? log.insertAdjacentHTML('beforeend', '<p class="dlg sil novo">…</p>') : linha('eu', rotulo(o), true);
      later(() => { A.tone(196, .4, 'sine', .03); emite(resp(r, o), true); }, 900);
      later(next, 2300);
    });
  };
  d.rodadas.forEach((r) => { r._dito = (st.dialogo[p.id] || []).some(([rid]) => rid === r.id); });
  next();
  return (st.dialogo[p.id] || []).length >= d.rodadas.length;
}

// ----- vídeo em tela cheia
function verCena(src) {
  const m = $('#cenaModal'), v = $('#cenaV'); v.src = vsrc(src); m.classList.add('show'); A.duck(true); v.play().catch(() => {});
  const close = () => { v.pause(); m.classList.remove('show'); A.duck(false); };
  $('#cenaClose').onclick = close; v.onended = close;
}

// ---------------------------------------------------------------- minijogos e momentos de jogo
const overlay = $('#mg');
function abreOverlay(cls) { overlay.className = 'show ' + cls; overlay.innerHTML = ''; document.body.classList.add('mg-on'); return overlay; }
function fechaOverlay() { overlay.className = ''; overlay.innerHTML = ''; document.body.classList.remove('mg-on'); }
function renderMinijogo(p) {
  const tipo = p.minijogo, done = st.feitos['mg:' + p.id];
  if (tipo === 'prece') return MG.prece(p, done);
  if (done) { appendParas(typeof p.depois === 'function' ? p.depois(st) : p.depois); return true; }
  const dica = typeof U('dica')[tipo] === 'function' ? U('dica')[tipo](st) : U('dica')[tipo];
  box.innerHTML = `<p class="eyebrow">${U('momento')}</p><button class="opt jogar" id="mgGo"><span class="k">▶</span>${U('mg')[tipo]}</button><p class="dica">${dica}</p>`;
  $('#mgGo').onclick = () => { box.innerHTML = ''; MG[tipo](p).then(() => { st.feitos['mg:' + p.id] = 1; salvar(); appendParas(typeof p.depois === 'function' ? p.depois(st) : p.depois); setNext(true); }); };
  return false;
}

const MG = {
  // ---------- o olhar: Laura não pode se mexer enquanto o alfaiate mede; só os olhos andam
  olhar(p) {
    return new Promise((resolve) => {
      const ol = p.olhar, o = abreOverlay('explorar olhar');
      const reg = st.olhar[p.id] = st.olhar[p.id] || { vistos: [] };
      const max = ol.olhares;
      o.innerHTML = `<div class="ex-rolo"><div class="ex-caixa" style="--r:${ol.proporcao};background-image:url('${ol.img}')"><div class="ol-foco"></div></div></div>
        <p class="ex-instr"></p>
        <div class="ex-texto"><div class="ex-corpo"></div><div class="ex-acoes"></div></div>`;
      const caixa = o.querySelector('.ex-caixa'), corpo = o.querySelector('.ex-corpo'), acoes = o.querySelector('.ex-acoes'), instr = o.querySelector('.ex-instr'), rolo = o.querySelector('.ex-rolo'), foco = o.querySelector('.ol-foco');
      const mostra = (lista) => { corpo.innerHTML = paras(lista).map((t) => `<p>${linkify(t)}</p>`).join(''); corpo.classList.remove('novo'); void corpo.offsetWidth; corpo.classList.add('novo'); };
      const medida = () => tr(ol.medidas[Math.min(reg.vistos.length, ol.medidas.length - 1)]);
      const atualiza = () => {
        const restam = max - reg.vistos.length;
        instr.textContent = restam > 0 ? `${medida()} · ${U('olhares')(restam)}` : tr(ol.medidas[ol.medidas.length - 1]);
        if (restam <= 0) fim();
      };
      let acabou = false;
      const fim = () => {
        if (acabou) return; acabou = true;
        caixa.classList.add('fechado');
        const botao = () => {
          paras(ol.fecho).forEach((t) => corpo.insertAdjacentHTML('beforeend', `<p class="novo">${linkify(t)}</p>`));
          acoes.innerHTML = `<button class="cta porta">${esc(tr(ol.porta))}</button>`;
          acoes.querySelector('.porta').onclick = () => { fechaOverlay(); resolve(); };
        };
        if (reg.vistos.length && corpo.textContent) setTimeout(botao, 2600); else { mostra([]); botao(); }
      };
      ol.pontos.forEach((pt) => {
        const b = document.createElement('button');
        b.className = 'ex-pt' + (reg.vistos.includes(pt.id) ? ' visto' : '');
        Object.assign(b.style, { left: (pt.x - pt.w / 2) + '%', top: (pt.y - pt.h / 2) + '%', width: pt.w + '%', height: pt.h + '%' });
        b.setAttribute('aria-label', tr(pt.rotulo));
        b.innerHTML = `<i></i><span>${esc(tr(pt.rotulo))}</span>`;
        b.onclick = (e) => {
          e.stopPropagation(); if (acabou || reg.vistos.includes(pt.id)) { if (reg.vistos.includes(pt.id)) mostra(pt.texto); return; }
          reg.vistos.push(pt.id); if (pt.flag) st.f[pt.flag] = true; if (pt.rota) (st.f.rotas = st.f.rotas || []).push(pt.rota);
          b.classList.add('visto'); salvar();
          foco.style.setProperty('--fx', pt.x + '%'); foco.style.setProperty('--fy', pt.y + '%'); foco.classList.add('on');
          A.sfx('tecido', .45, () => A.hiss(.6, 3000, .5, .04));
          mostra(pt.texto);
          const g = ol.gideon[reg.vistos.length - 1];
          if (g) setTimeout(() => { corpo.insertAdjacentHTML('beforeend', `<p class="gid">— ${esc(tr(g))}</p>`); }, 1100);
          atualiza();
        };
        caixa.appendChild(b);
      });
      requestAnimationFrame(() => {
        rolo.scrollLeft = (rolo.scrollWidth - rolo.clientWidth) / 2;
        if (rolo.scrollWidth > rolo.clientWidth + 20) {
          const d = document.createElement('p'); d.className = 'ex-deslize'; d.textContent = '‹  ' + U('deslize') + '  ›'; o.appendChild(d);
          rolo.addEventListener('scroll', () => d.classList.add('some'), { once: true });
        }
      });
      mostra(ol.abertura);
      if (reg.vistos.length >= max) { corpo.innerHTML = ''; fim(); } else atualiza();
    });
  },

  // ---------- a prece: segurar as mãos apertadas. Quanto mais o leitor segura, mais Laura pede, e mais as unhas entram.
  prece(p, done) {
    const pr = p.prece;
    const linhas = paras(pr.linhas);
    if (done) {
      const n = st.f.preceN || 0;
      linhas.slice(0, n).forEach((t) => txt.insertAdjacentHTML('beforeend', pHTML(t, 'prece-l')));
      appendParas(p.depois); return true;
    }
    box.innerHTML = `<p class="eyebrow">${esc(tr(pr.pergunta))}</p><button class="segurar" id="segurar"><span class="anel"><i></i></span><b>${esc(tr(pr.botao))}</b></button><p class="dica">${IS_TOUCH ? U('dica').preceT : U('dica').preceK}</p>`;
    const bt = $('#segurar'); let n = 0, segurando = false, iv = null, acabou = false, prog = 0, raf = null;
    const passo = pr.passo || 1700;
    const total = linhas.length;
    const solta = () => {
      if (!segurando || acabou) return; segurando = false; clearInterval(iv); cancelAnimationFrame(raf); bt.classList.remove('on');
      document.body.classList.remove('aperta'); Coracao.extra(0);
      if (n === 0) { prog = 0; bt.style.setProperty('--prog', 0); return; } // soltou cedo demais: tenta de novo
      encerra();
    };
    const encerra = () => {
      acabou = true; st.f.preceN = n; st.f.preceInteira = n >= total; if (n >= pr.sangraEm) st.f.sangue = true;
      st.feitos['mg:' + p.id] = 1; registrar('prece', String(n)); salvar();
      box.innerHTML = '';
      later(() => { appendParas(p.depois); setNext(true); }, 700);
    };
    const anima = () => { prog = Math.min(1, prog + 1 / (passo / 16.7) / total); bt.style.setProperty('--prog', prog.toFixed(3)); if (segurando) raf = requestAnimationFrame(anima); };
    const aperta = (e) => {
      if (e) e.preventDefault(); if (segurando || acabou) return; segurando = true; bt.classList.add('on'); A.resume();
      document.body.classList.add('aperta');
      anima();
      const uma = () => {
        if (n >= total) { solta(); return; }
        txt.insertAdjacentHTML('beforeend', pHTML(linhas[n], 'novo prece-l')); n++;
        Coracao.extra(clamp(n / total * 3, 0, 3));
        if (n === pr.sangraEm) { document.body.classList.add('sangra'); A.sfx('unhas', .5, () => A.hiss(.5, 1800, 4, .05)); }
        panel.scrollTop = panel.scrollHeight;
      };
      iv = setInterval(uma, passo);
    };
    bt.addEventListener('pointerdown', aperta); addEventListener('pointerup', solta); addEventListener('pointercancel', solta);
    bt.addEventListener('contextmenu', (e) => e.preventDefault());
    const kd = (e) => { if ((e.key === ' ' || e.key === 'Enter') && P[st.i] === p) { e.preventDefault(); e.stopPropagation(); aperta(); } };
    const ku = (e) => { if (e.key === ' ' || e.key === 'Enter') solta(); };
    addEventListener('keydown', kd, true); addEventListener('keyup', ku, true);
    later(() => {}, 0); // (os ouvintes de tecla saem quando a página muda)
    const limpa = () => { removeEventListener('keydown', kd, true); removeEventListener('keyup', ku, true); removeEventListener('pointerup', solta); removeEventListener('pointercancel', solta); };
    MG._limpaPrece = limpa;
    return false;
  },

  // ---------- o duelo com Simon (ver duelo.js)
  duelo(p) {
    const o = abreOverlay('duelo');
    return window.DUELO.start(o, {
      lang: LANG, A, st, tr,
      madeira: !!st.f.arsenalTrancado,
      lenco: st.escolhas.lenco === 'guardar',
      fundo: p.duelo.fundo,
    }).then((res) => {
      st.duelo = res; registrar('duelo', res.resultado); if (res.resultado === 'deixou') mudaPeso(1);
      salvar(); fechaOverlay();
    });
  },
};

// ---------------------------------------------------------------- navegação
function irProxima() {
  const p = P[st.i];
  if (MG._limpaPrece) { MG._limpaPrece(); MG._limpaPrece = null; }
  document.body.classList.remove('aperta', 'sangra');
  if (p && p.quieto && !st.escolhas[p.quieto.id]) { st.escolhas[p.quieto.id] = 'cala'; aplicar({ eixo: p.quieto.eixoCalar || null }); registrar(p.quieto.id, 'cala'); salvar(); }
  if (p && p.fim) return resumo();
  const j = idxVis(st.i, 1); if (j >= P.length) return resumo();
  st.i = j; A.ctx && A.virar(); render(1);
}
function irAnterior() {
  if (MG._limpaPrece) { MG._limpaPrece(); MG._limpaPrece = null; }
  document.body.classList.remove('aperta', 'sangra');
  const j = idxVis(st.i, -1); if (j < 0) return; st.i = j; A.ctx && A.virar(); render(-1);
}
btnNext.onclick = () => { if (!btnNext.disabled) irProxima(); };
btnPrev.onclick = irAnterior;
addEventListener('keydown', (e) => {
  if (document.body.classList.contains('mg-on') || !$('#cover').classList.contains('hide')) return;
  if ($('#codex').classList.contains('show')) { if (e.key === 'Escape') $('#codex').classList.remove('show'); return; }
  if (['ArrowRight', 'Enter', ' '].includes(e.key)) { e.preventDefault(); if (!btnNext.disabled) irProxima(); }
  else if (e.key === 'ArrowLeft') irAnterior();
  else if (/^[1-4]$/.test(e.key)) { const b = box.querySelectorAll('.opt:not(:disabled)')[+e.key - 1]; b && b.click(); }
});
let sx = null, sy = null;
panel.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
panel.addEventListener('touchend', (e) => {
  if (sx == null) return; const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; sx = null;
  if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) { if (dx < 0 && !btnNext.disabled) irProxima(); else if (dx > 0) irAnterior(); }
});

// ---------------------------------------------------------------- resumo final
function guardaEstado() {
  try {
    const todos = JSON.parse(localStorage.getItem('aqv_estado') || '{}');
    todos.v = 1;
    todos.cap2 = L.estadoFinal(st);
    todos.cap2.quando = new Date().toISOString();
    localStorage.setItem('aqv_estado', JSON.stringify(todos));
  } catch (e) {}
}
async function resumo() {
  guardaEstado();
  $('#resumo').classList.add('show');
  const R = L.resumo(st, LANG);
  $('#rsFrase').textContent = R.frase;
  $('#rsRel').innerHTML = R.notas.map((r) => `<li>${esc(r)}</li>`).join('');
  const desenha = (stats) => {
    $('#rsEsc').innerHTML = R.linhas.map((l) => {
      const tot = stats.filter((x) => x.escolha === l.id).reduce((a, b) => a + Number(b.total), 0);
      const mine = stats.find((x) => x.escolha === l.id && x.opcao === l.opcao);
      const pct = tot && mine ? Math.round((Number(mine.total) / tot) * 100) : null;
      return `<li><span class="q">${esc(l.q)}</span><span class="a">${esc(l.a)}</span>${pct != null ? `<span class="pct"><i style="width:${pct}%"></i><b>${U('mesmo')(pct)}</b></span>` : ''}</li>`;
    }).join('');
  };
  desenha([]); desenha(await estatisticas());
}
const reiniciar = () => { st = novoEstado(); salvar(); $('#resumo').classList.remove('show'); document.body.classList.remove('aperta', 'sangra'); render(1); };
$('#rsReler').onclick = () => { if (confirm(U('confirm'))) reiniciar(); };
$('#menuReset').onclick = () => { if (confirm(U('confirm'))) reiniciar(); };

// ---------------------------------------------------------------- idioma
function aplicaIdioma() {
  document.documentElement.lang = LANG === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('.lang').forEach((b) => { b.textContent = LANG === 'pt' ? 'EN' : 'PT'; b.setAttribute('aria-label', LANG === 'pt' ? 'Read in English' : 'Ler em português'); });
  $('#cvEye').textContent = U('coverEye'); $('#cvSub').textContent = LANG === 'en' ? L.subtituloEn : L.subtitulo; $('#cvLede').textContent = U('coverLede');
  $('#cvGo').textContent = salvo && salvo.i > 0 ? U('coverRestart') : U('coverGo'); $('#cvCont').textContent = U('coverCont'); $('#cvHint').textContent = U('coverHint');
  $('.tl .cap').textContent = U('capN'); $('#rhead').textContent = `${L.titulo} · ${LANG === 'en' ? L.subtituloEn : L.subtitulo}`;
  $('#rsEye').textContent = U('fimCap'); $('#rsH').textContent = U('ficou'); $('#rsSuas').textContent = U('suas'); $('#rsReler').textContent = U('reler');
  $('#rsProx').textContent = (LANG === 'en' ? L.proximo.tituloEn : L.proximo.titulo) + ' →';
  document.title = LANG === 'en' ? L.tituloPagEn : L.tituloPag;
}
document.querySelectorAll('.lang').forEach((b) => b.addEventListener('click', () => {
  LANG = LANG === 'pt' ? 'en' : 'pt'; try { localStorage.setItem('livro_lang', LANG); } catch (e) {}
  aplicaIdioma(); if ($('#cover').classList.contains('hide') && !document.body.classList.contains('mg-on')) render(0); if ($('#resumo').classList.contains('show')) resumo();
}));

// ---------------------------------------------------------------- capa / início
$('#cvTitle').textContent = L.titulo; $('#cover').style.setProperty('--capa', `url("${L.capa}")`);
$('#rsProx').href = L.proximo.url;
const salvo = carregar();
if (salvo && salvo.i > 0) $('#cvCont').hidden = false;
aplicaIdioma();
Clima.set('poeira'); document.body.classList.add('na-capa');
const comecar = (continuar) => {
  A.init(); A.resume();
  st = continuar && salvo ? salvo : novoEstado();
  salvar();
  $('#cover').classList.add('hide'); document.body.classList.remove('na-capa'); A.virar(); Coracao.start(); render(1);
};
$('#cvGo').onclick = () => comecar(false);
$('#cvCont').onclick = () => comecar(true);
$('#som').onclick = () => { A.init(); A.setOn(!A.on); $('#som').classList.toggle('off', !A.on); };
window.__LIVRO = { get st() { return st; }, set st(v) { st = v; }, render, irProxima, MG, A, ir: (id) => { st.i = P.findIndex((p) => p.id === id); render(1); } };
})();
