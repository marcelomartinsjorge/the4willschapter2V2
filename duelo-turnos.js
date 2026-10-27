/* ==========================================================================
   O DUELO DO LARANJAL · por turnos (Capítulo II; base para o Laus do Cap. IV)
   Laura vence na tática, não na força. Cada turno ela escolhe um golpe num
   menu (estocada, corte, finta, respirar); o golpe só entra se ela acertar o
   tempo. No turno de Simon, ele avisa com o corpo e ela responde na hora:
   desviar (janela larga) ou aparar (janela estreita, devolve o golpe).
   O coração dela é o recurso: quanto mais alto, mais estreitas as janelas.
   Quebrar a guarda de Simon abre a costela: tocar. Três toques vencem.
   No último, o jogo congela: tocar a costela, ou baixar a espada.
   Sprites: assets/images/duelo/<quem>-<pose>.webp (os mesmos do duelo antigo).
   API igual à antiga: window.DUELO.start(root, opts) → Promise<resultado>.
   ========================================================================== */
(() => {
'use strict';
const ANTIGO = window.DUELO || null; // o duelo antigo fica disponível (e empresta a trilha)
const TX = {
  pt: {
    titulo: 'O Laranjal', sub: 'Antes da alvorada. Três toques vencem.',
    regras: [
      ['Seu turno', 'escolha o golpe e acerte o tempo quando o anel fechar'],
      ['Turno dele', 'Simon avisa com o corpo. Desviar é mais fácil; aparar devolve o golpe'],
      ['O coração', 'quanto mais alto, menos tempo para responder. Respirar acalma'],
    ],
    comecar: 'Em guarda', teclas: 'Teclado: 1 a 4 escolhem · Espaço golpeia · ↑ apara · ↓ desvia.',
    fala0: '— Você vai ver, irmã.',
    pergunta: 'O que Laura faz?',
    golpes: {
      estocada: ['Estocada', 'Rápida. Um tempo.'],
      corte: ['Corte', 'Pesado. Dois tempos. Acelera o coração.'],
      finta: ['Finta', 'Ele morde a isca e mostra o próximo golpe.'],
      respirar: ['Respirar', 'Acalma o coração. Ele recupera a guarda.'],
    },
    agora: 'Agora', desviar: 'Desviar', aparar: 'Aparar',
    perfeito: 'Perfeito', bom: 'Entrou', errou: 'Ele defende', cedo: 'Cedo demais', tarde: 'Tarde demais',
    desviou: 'Desviou', aparou: 'Aparado', contra: 'Aparado. Ele perde o pé.', acertou: 'Simon acerta', pernas: 'Não dá para aparar nas pernas',
    simonVem: 'Simon ataca.', furia: 'Simon perde a paciência.', mordeu: 'Ele morde a finta.',
    intencao: { alto: 'Ele vai vir por cima.', estocada: 'Ele vai estocar.', baixo: 'Ele vai buscar as pernas.' },
    peDeTras: 'O pé de trás.', sinal: { alto: 'O pé arrasta: vem de cima.', estocada: 'O ombro cai: vem a estocada.', baixo: 'Os joelhos dobram: só desviar.' }, respirou: 'Laura respira. O coração desce.',
    quebrou: 'A guarda dele cede. A costela abre.', toque: 'Toque', escapou: 'Ele se recupera a tempo.',
    congela: 'A costela dele, aberta.', tocar: 'Tocar a costela', baixar: 'Baixar a espada',
    guarda: 'Guarda', toques: 'Toques', coracao: 'Coração', marcas: 'Marcas',
    venceu: 'Você venceu Simon.', marcasFim: 'Você venceu Simon, mas ele te acertou.', deixou: 'Você deixou Simon ganhar.', perdeu: 'Simon venceu.',
    perdeuSub: 'Não pode ser assim. Falta um mês.', seguir: 'Continuar', denovo: 'Tentar de novo',
    nervo: 'O coração já chega acelerado. As janelas começam mais estreitas.',
  },
  en: {
    titulo: 'The Orangery', sub: 'Before dawn. Three touches win.',
    regras: [
      ['Your turn', 'pick a move and hit the timing when the ring closes'],
      ['His turn', 'Simon warns you with his body. Dodging is easier; parrying strikes back'],
      ['Your heart', 'the higher it runs, the less time you have. Breathing calms it'],
    ],
    comecar: 'En garde', teclas: 'Keyboard: 1 to 4 choose · Space strikes · ↑ parries · ↓ dodges.',
    fala0: '— Show me what a fourteen-year-old man can do.',
    pergunta: 'What does Laura do?',
    golpes: {
      estocada: ['Thrust', 'Fast. One beat.'],
      corte: ['Cut', 'Heavy. Two beats. Speeds up the heart.'],
      finta: ['Feint', 'He takes the bait and shows his next strike.'],
      respirar: ['Breathe', 'Calms the heart. He gets his guard back.'],
    },
    agora: 'Now', desviar: 'Dodge', aparar: 'Parry',
    perfeito: 'Perfect', bom: 'It lands', errou: 'He blocks it', cedo: 'Too soon', tarde: 'Too late',
    desviou: 'Dodged', aparou: 'Parried', contra: 'Parried. He loses his footing.', acertou: 'Simon lands it', pernas: 'You can’t parry at the legs',
    simonVem: 'Simon attacks.', furia: 'Simon loses his patience.', mordeu: 'He bites on the feint.',
    intencao: { alto: 'He’ll come from above.', estocada: 'He’ll thrust.', baixo: 'He’ll go for the legs.' },
    peDeTras: 'The back foot.', sinal: { alto: 'His foot drags: from above.', estocada: 'His shoulder drops: the thrust.', baixo: 'His knees bend: dodge only.' }, respirou: 'Laura breathes. Her heart slows.',
    quebrou: 'His guard gives. His ribs open.', toque: 'Touch', escapou: 'He recovers in time.',
    congela: 'His ribs, wide open.', tocar: 'Touch his ribs', baixar: 'Lower the sword',
    guarda: 'Guard', toques: 'Touches', coracao: 'Heart', marcas: 'Marks',
    venceu: 'You beat Simon.', marcasFim: 'You beat Simon, but he landed a hit.', deixou: 'You let Simon win.', perdeu: 'Simon won.',
    perdeuSub: 'It can’t go like this. A month left.', seguir: 'Continue', denovo: 'Try again',
    nervo: 'Her heart is already racing. The windows start narrower.',
  },
};

// ---- sprites (metadados do recorte: largura, altura, linha dos pés, eixo dos pés, altura do corpo)
const META = {"laura":{"guarda":{"w":352,"h":397,"base":392,"ax":120.5},"recuar":{"w":332,"h":395,"base":390,"ax":149.5},"inclinar":{"w":296,"h":375,"base":370,"ax":147.5},"aparar":{"w":289,"h":473,"base":468,"ax":144.0},"apara-baixo":{"w":298,"h":383,"base":377,"ax":132.0},"tocar":{"w":441,"h":386,"base":380,"ax":141.5},"atingida":{"w":299,"h":384,"base":378,"ax":149.5},"baixa":{"w":181,"h":406,"base":400,"ax":89.5},"cansada":{"w":181,"h":406,"base":400,"ax":89.5}},"simon":{"guarda":{"w":295,"h":338,"base":333,"ax":180.5},"aviso-alto":{"w":266,"h":399,"base":394,"ax":142.1},"aviso-estocada":{"w":287,"h":324,"base":319,"ax":121.8},"aviso-baixo":{"w":286,"h":259,"base":254,"ax":149.2},"golpe-alto":{"w":233,"h":409,"base":404,"ax":85.7},"golpe-estocada":{"w":381,"h":295,"base":290,"ax":187.0},"golpe-baixo":{"w":292,"h":237,"base":232,"ax":104.0},"desequilibrado":{"w":314,"h":279,"base":274,"ax":121.7},"atingido":{"w":165,"h":312,"base":307,"ax":95.5},"cansado":{"w":155,"h":366,"base":361,"ax":74.1}}};
const ALT_REF = 395; // Laura em pé: a escala é a mesma para os dois (Simon é mais baixo)
const ATAQUES = {
  alto: { aviso: 'aviso-alto', golpe: 'golpe-alto', dur: 1050, pontoDica: [.84, .95] },
  estocada: { aviso: 'aviso-estocada', golpe: 'golpe-estocada', dur: 820, pontoDica: [.5, .24] },
  baixo: { aviso: 'aviso-baixo', golpe: 'golpe-baixo', dur: 920, pontoDica: [.32, .62] },
};
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

function start(root, opts) {
  const T = TX[opts.lang] || TX.en, A = opts.A;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const bpm0 = clamp(76 + (opts.peso || 0) * 5 - (opts.lenco ? 6 : 0), 70, 112);
  return new Promise((resolve) => {
    root.innerHTML = `
      <div class="dl-bg" style="background-image:url('${opts.fundo}')"></div>
      <div class="dt-palco">
        <div class="dt-chao"></div>
        <div class="dt-fig dt-simon"><img alt=""></div>
        <div class="dt-fig dt-laura"><img alt=""></div>
        <div class="dt-anel" hidden><i></i><b></b></div>
        <div class="dt-pop"></div>
      </div>
      <div class="dt-info dt-info-s"><p class="dt-nome">Simon <span class="dt-dots" data-k="toques"></span></p>
        <div class="dt-barra"><i></i></div><p class="dt-rot">${T.guarda}</p></div>
      <div class="dt-info dt-info-l"><p class="dt-nome">Laura <span class="dt-dots dt-marcas" data-k="marcas"></span></p>
        <div class="dt-barra dt-cor"><i></i></div><p class="dt-rot">${T.coracao} <b class="dt-bpm"></b></p></div>
      <div class="dt-baixo">
        <div class="dt-msg"><p></p></div>
        <div class="dt-cmd"></div>
      </div>
      <div class="dl-tela on dt-intro">
        <h2>${T.titulo}</h2><p class="dl-sub">${T.sub}</p>
        <ul class="dt-regras">${T.regras.map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ul>
        ${bpm0 >= 96 ? `<p class="dt-nervo">${T.nervo}</p>` : ''}
        <button class="cta dl-go">${T.comecar}</button>
        <p class="dt-teclas">${T.teclas}</p>
      </div>`;
    const $ = (s) => root.querySelector(s);
    const palco = $('.dt-palco'), figL = $('.dt-laura'), figS = $('.dt-simon'), anel = $('.dt-anel'), pop = $('.dt-pop');
    const msgP = $('.dt-msg p'), cmd = $('.dt-cmd');

    // ---- estado
    const S = { toques: 0, sofridos: 0, leituras: 0, maxCombo: 0, combo: 0, aparos: 0, fintasLidas: 0, maos: 0, perfeitos: 0 };
    let guarda = 100, bpm = bpm0, fase = 1, intencao = null, acabou = false; const sinaisVistos = new Set(); let derrotas = opts.derrotas || 0;
    let musica = null, entrada = null, ultimoAlvo = 0, ultimoTipo = ''; // entrada: o que o jogo espera agora (função que recebe 'golpe' | 'aparar' | 'desviar')

    // ---- sprites
    const pre = {};
    for (const q of ['laura', 'simon']) for (const n of Object.keys(META[q])) { const im = new Image(); im.src = `assets/images/duelo/${q}-${n}.webp`; pre[q + n] = im; }
    const escala = () => ((innerWidth < 700 ? Math.min(palco.clientHeight * .27, innerWidth * .62) : palco.clientHeight * .44)) / ALT_REF;
    const pose = (quem, n, dx = 0) => {
      const fig = quem === 'laura' ? figL : figS, m = META[quem][n] || META[quem].guarda, k = escala(), im = fig.firstChild;
      if (im.dataset.p !== n) { im.src = `assets/images/duelo/${quem}-${n}.webp`; im.dataset.p = n; }
      im.style.width = m.w * k + 'px'; im.style.height = m.h * k + 'px';
      im.style.left = -m.ax * k + 'px'; im.style.top = -m.base * k + 'px';
      fig.style.setProperty('--dx', dx + 'px');
      fig.dataset.pose = n;
    };
    const parado = () => { pose('laura', 'guarda'); pose('simon', 'guarda'); };
    addEventListener('resize', parado);

    // ---- HUD
    const hud = () => {
      $('.dt-info-s .dt-barra i').style.width = clamp(guarda, 0, 100) + '%';
      $('.dt-info-s .dt-barra').classList.toggle('baixa', guarda < 30);
      $('.dt-info-l .dt-barra i').style.width = clamp((bpm - 60) / 1.1, 0, 100) + '%';
      $('.dt-info-l .dt-barra').classList.toggle('alto', bpm >= 130);
      $('.dt-bpm').textContent = Math.round(bpm);
      $('[data-k="toques"]').innerHTML = [0, 1, 2].map((i) => `<i class="${i < S.toques ? 'on' : ''}"></i>`).join('');
      $('[data-k="marcas"]').innerHTML = [0, 1, 2].map((i) => `<i class="${i < S.sofridos ? 'on' : ''}"></i>`).join('');
    };
    const msg = (t) => { msgP.textContent = t; msgP.classList.remove('nova'); void msgP.offsetWidth; msgP.classList.add('nova'); };
    const mostra = (t, cls = '') => { pop.textContent = t; pop.className = 'dt-pop on ' + cls; clearTimeout(mostra.t); mostra.t = setTimeout(() => (pop.className = 'dt-pop'), 900); };
    const treme = (el) => { if (reduz) return; el.classList.remove('treme'); void el.offsetWidth; el.classList.add('treme'); };
    const clarao = (cor) => { const f = document.createElement('div'); f.className = 'dt-clarao ' + cor; palco.appendChild(f); setTimeout(() => f.remove(), 420); };

    // ---- som
    const som = {
      aco() { A && A.sfx && A.sfx(opts.madeira ? 'espada-madeira' : 'espada-aco', .55, () => A.tone && A.tone(opts.madeira ? 320 : 1900, .25, 'triangle', .05)); },
      toque() { A && A.sfx && A.sfx('toque', .6, () => A.tone && A.tone(520, .4, 'sine', .06)); },
      dor() { A && A.sfx && A.sfx('golpe-recebido', .6, () => A.tone && A.tone(120, .3, 'square', .05)); },
      passo() { A && A.sfx && A.sfx('passo-pedra', .3); },
      tic() { A && A.tone && A.tone(880, .08, 'sine', .03); },
      sino() { A && A.tone && [196, 392].forEach((f, k) => A.tone(f, 2.2 - k * .5, 'sine', [.07, .03][k])); },
    };

    // ---- janelas de tempo (o coração as estreita)
    const janela = () => {
      const x = clamp((bpm - 76) / 70, 0, 1);
      return { aparar: 125 - 60 * x, desviar: 240 - 95 * x, perfeito: 85 - 30 * x, bom: 185 - 55 * x };
    };

    // ---- o anel: fecha sobre um ponto; a resposta é medida contra o instante em que ele fecha
    const anelEm = (fig, fx, fy, dur, cls) => {
      const r = fig.getBoundingClientRect(), pr = palco.getBoundingClientRect(), im = fig.firstChild.getBoundingClientRect();
      anel.style.left = (im.left - pr.left + im.width * fx) + 'px';
      anel.style.top = (im.top - pr.top + im.height * fy) + 'px';
      anel.className = 'dt-anel ' + (cls || ''); anel.hidden = false;
      const i = anel.firstChild; i.style.animation = 'none'; void i.offsetWidth; i.style.animation = `dtFecha ${dur}ms linear forwards`;
      ultimoAlvo = performance.now() + dur; ultimoTipo = cls; return ultimoAlvo;
    };
    const someAnel = () => { anel.hidden = true; };

    // espera uma entrada até o limite; devolve { tipo, dt } (dt = ms em relação ao alvo; negativo = cedo)
    const aguarda = (alvo, limite, aceita) => new Promise((res) => {
      let fim = false;
      const t = setTimeout(() => { if (fim) return; fim = true; entrada = null; res({ tipo: null, dt: Infinity }); }, Math.max(0, alvo + limite - performance.now()));
      entrada = (tipo) => { if (fim || !aceita.includes(tipo)) return; fim = true; clearTimeout(t); entrada = null; res({ tipo, dt: performance.now() - alvo }); };
    });

    // ---- botões de ação
    const botoesAcao = (lista) => {
      cmd.className = 'dt-cmd acao';
      cmd.innerHTML = lista.map(([id, rot, k]) => `<button class="dt-bt ${id}" data-a="${id}"><span>${rot}</span><kbd>${k}</kbd></button>`).join('');
      cmd.querySelectorAll('button').forEach((b) => b.addEventListener('pointerdown', (e) => { e.preventDefault(); entrada && entrada(b.dataset.a); }));
    };
    const limpaCmd = () => { cmd.className = 'dt-cmd'; cmd.innerHTML = ''; };

    // ---- o menu de golpes (estilo Pokémon)
    const menu = () => new Promise((res) => {
      msg(intencao ? T.pergunta + ' ' + T.intencao[intencao] : T.pergunta);
      cmd.className = 'dt-cmd menu';
      const ids = ['estocada', 'corte', 'finta', 'respirar'];
      cmd.innerHTML = ids.map((id, i) => `<button class="dt-gl" data-g="${id}"><b><kbd>${i + 1}</kbd>${T.golpes[id][0]}</b><span>${T.golpes[id][1]}</span></button>`).join('');
      const escolhe = (id) => { entradaMenu = null; limpaCmd(); som.tic(); res(id); };
      cmd.querySelectorAll('.dt-gl').forEach((b) => (b.onclick = () => escolhe(b.dataset.g)));
      entradaMenu = (n) => { if (ids[n]) escolhe(ids[n]); };
    });
    let entradaMenu = null;

    // ---- turno de Laura
    const golpeLaura = async (beats) => {
      let total = 0;
      for (let b = 0; b < beats.length; b++) {
        const [dur, dano] = beats[b];
        pose('laura', b === 0 && beats.length > 1 ? 'aparar' : 'guarda', 6);
        botoesAcao([['golpe', T.agora, 'Espaço']]);
        const alvo = anelEm(figS, .55, .38, dur, 'atq');
        const j = janela(); const r = await aguarda(alvo, j.bom, ['golpe']); someAnel(); limpaCmd();
        const d = Math.abs(r.dt);
        if (r.tipo && d <= j.perfeito) { pose('laura', beats.length > 1 && b === 0 ? 'apara-baixo' : 'tocar', 70); pose('simon', 'atingido', -8); som.aco(); mostra(T.perfeito, 'ouro'); clarao('ouro'); total += dano; S.perfeitos++; }
        else if (r.tipo && d <= j.bom) { pose('laura', beats.length > 1 && b === 0 ? 'apara-baixo' : 'tocar', 60); pose('simon', 'guarda', -6); som.aco(); mostra(T.bom); total += Math.round(dano * .55); }
        else { pose('laura', 'tocar', 40); pose('simon', 'guarda', 6); som.aco(); mostra(r.tipo && r.dt < 0 ? T.cedo : T.errou, 'ruim'); bpm += 6; await espera(420); parado(); break; }
        await espera(380); parado(); await espera(160);
      }
      return total;
    };
    const turnoLaura = async () => {
      const g = await menu();
      if (g === 'respirar') {
        msg(T.respirou); pose('laura', 'cansada'); bpm = Math.max(68, bpm - 28); guarda = Math.min(100, guarda + 8); hud(); await espera(1100); parado(); return;
      }
      if (g === 'finta') {
        pose('laura', 'tocar', 20); await espera(220); pose('simon', 'aviso-baixo', -6); som.passo();
        intencao = ['alto', 'estocada', 'baixo'][Math.floor(Math.random() * 3)];
        guarda -= 10; bpm += 4; S.fintasLidas++; hud(); msg(T.mordeu + ' ' + T.intencao[intencao]); mostra(T.mordeu);
        await espera(900); parado(); return;
      }
      const dano = g === 'estocada' ? await golpeLaura([[700, 26]]) : await golpeLaura([[760, 22], [520, 22]]);
      bpm += g === 'corte' ? 14 : 6; guarda -= dano; hud();
    };

    // ---- a costela aberta: tocar
    const abertura = async () => {
      pose('simon', 'desequilibrado', 10); msg(T.quebrou); som.passo(); await espera(500);
      if (S.toques >= 2) return 'final';
      botoesAcao([['golpe', T.toque, 'Espaço']]);
      const alvo = anelEm(figS, .56, .32, 640, 'atq costela'); const j = janela();
      const r = await aguarda(alvo, j.bom + 40, ['golpe']); someAnel(); limpaCmd();
      if (r.tipo && Math.abs(r.dt) <= j.bom + 40) {
        pose('laura', 'tocar', 80); pose('simon', 'atingido', -12); som.toque(); clarao('ouro'); S.toques++; mostra(T.toque, 'ouro grande'); hud();
        await espera(900); guarda = 100; fase = Math.min(3, fase + 1); musica && musica.fase(fase); parado(); hud(); return 'toque';
      }
      mostra(T.escapou, 'ruim'); guarda = 34; hud(); await espera(500); parado(); return 'escapou';
    };

    // ---- turno de Simon: avisa com o corpo, e Laura responde na hora
    const umAtaque = async (tipo, pressa, i0) => {
      const at = ATAQUES[tipo];
      let dur = at.dur * [1, .88, .78][fase - 1] * pressa * (intencao === tipo ? 1.25 : 1);
      pose('simon', at.aviso, -4); som.passo();
      // o aviso do corpo: na primeira vez de cada um, a palavra acompanha a pose (e dá um respiro). Quem leu a janela no estudo vê a palavra a luta inteira.
      if (!sinaisVistos.has(tipo) || opts.janela) { mostra(T.sinal[tipo], 'dica'); if (!sinaisVistos.has(tipo)) dur += 200; sinaisVistos.add(tipo); }
      if (derrotas >= 2 && i0) dur *= 1.1; // a partir da terceira tentativa, o primeiro golpe do turno vem um pouco mais devagar
      botoesAcao([['desviar', T.desviar, '↓'], ['aparar', T.aparar, '↑']]);
      const alvo = anelEm(figL, .55, .4, dur, 'def ' + tipo);
      const j = janela();
      const r = await aguarda(alvo, j.desviar, ['desviar', 'aparar']); someAnel(); limpaCmd();
      pose('simon', at.golpe, -70);
      const d = Math.abs(r.dt);
      const cedo = r.tipo && r.dt < -(r.tipo === 'aparar' ? j.aparar : j.desviar);
      if (r.tipo === 'aparar' && tipo === 'baixo' && !cedo) { pose('laura', 'atingida', -14); som.dor(); mostra(T.pernas, 'ruim'); return 'hit'; }
      if (r.tipo === 'aparar' && !cedo && d <= j.aparar) {
        pose('laura', 'aparar', 4); som.aco(); clarao('azul');
        const c = tipo === 'alto' ? 36 : 18; guarda -= c; S.aparos++; S.leituras++; bpm = Math.max(68, bpm - 4);
        mostra(tipo === 'alto' ? T.contra : T.aparou, 'azul'); treme(figS); return 'ok';
      }
      if (r.tipo === 'desviar' && !cedo && d <= j.desviar) {
        pose('laura', tipo === 'estocada' ? 'inclinar' : 'recuar', -30); som.passo(); S.leituras++; mostra(T.desviou); return 'ok';
      }
      pose('laura', 'atingida', -16); som.dor(); clarao('vermelho'); treme(figL); mostra(cedo ? T.cedo : (r.tipo ? T.tarde : T.acertou), 'ruim'); return 'hit';
    };
    const turnoSimon = async () => {
      const n = fase === 3 ? 3 : fase === 2 && Math.random() < .55 ? 2 : 1;
      msg(n === 3 ? T.furia : T.simonVem); if (n === 3) mostra(T.furia, 'ruim');
      await espera(650);
      for (let i = 0; i < n; i++) {
        const tipo = i === 0 && intencao ? intencao : ['alto', 'estocada', 'baixo'][Math.floor(Math.random() * 3)];
        const r = await umAtaque(tipo, i === 0 ? 1 : .82, i === 0);
        intencao = null;
        if (r === 'hit') { S.sofridos++; S.combo = 0; bpm += 16; hud(); await espera(700); parado(); if (S.sofridos >= 3) return 'perdeu'; break; }
        S.combo++; S.maxCombo = Math.max(S.maxCombo, S.combo); hud();
        await espera(420); parado(); await espera(160);
        if (guarda <= 0) break;
      }
      intencao = null; return 'segue';
    };

    // ---- o fim congelado
    const escolhaFinal = () => new Promise((res) => {
      msg(T.congela); palco.classList.add('congela'); musica && musica.corta && musica.corta();
      cmd.className = 'dt-cmd final';
      cmd.innerHTML = `<button class="dt-gl" data-f="tocar"><b>${T.tocar}</b></button><button class="dt-gl" data-f="baixar"><b>${T.baixar}</b></button>`;
      cmd.querySelectorAll('button').forEach((b) => (b.onclick = () => { limpaCmd(); palco.classList.remove('congela'); res(b.dataset.f); }));
    });

    const fim = (resultado) => {
      if (acabou) return; acabou = true; musica && musica.para && musica.para(); som.sino();
      if (resultado === 'perdeu') { pose('laura', 'cansada'); pose('simon', 'guarda'); }
      else if (resultado === 'deixou') { pose('laura', 'baixa'); pose('simon', 'guarda'); }
      else { pose('laura', 'guarda'); pose('simon', 'cansado'); }
      setTimeout(() => {
        const t = document.createElement('div'); t.className = 'dl-tela on fim';
        const tit = { limpo: T.venceu, marcas: T.marcasFim, deixou: T.deixou, perdeu: T.perdeu }[resultado];
        t.innerHTML = `<h2>${tit}</h2>` + (resultado === 'perdeu' ? `<p class="dl-sub">${T.perdeuSub}</p><button class="cta dl-seguir">${T.denovo}</button>` : `<button class="cta dl-seguir">${T.seguir}</button>`);
        root.appendChild(t);
        t.querySelector('.dl-seguir').onclick = () => {
          removeEventListener('keydown', kd, true); removeEventListener('resize', parado);
          resolve({ resultado, toques: S.toques, sofridos: S.sofridos, leituras: S.leituras, maxCombo: S.maxCombo, aparos: S.aparos, maos: S.maos, fintasLidas: S.fintasLidas, perfeitos: S.perfeitos, modo: 'turnos' });
        };
      }, 1300);
    };

    // ---- laço
    const luta = async () => {
      while (!acabou) {
        await turnoLaura();
        if (guarda <= 0) {
          const a = await abertura();
          if (a === 'final') {
            const f = await escolhaFinal();
            if (f === 'baixar') return fim('deixou');
            pose('laura', 'tocar', 80); pose('simon', 'atingido', -12); som.toque(); clarao('ouro'); S.toques++; hud(); mostra(T.toque, 'ouro grande');
            await espera(1000); return fim(S.sofridos ? 'marcas' : 'limpo');
          }
          if (a === 'toque') continue; // depois de um toque, Laura recomeça
        }
        const r = await turnoSimon();
        if (r === 'perdeu') return fim('perdeu');
        if (guarda <= 0) {
          const a = await abertura();
          if (a === 'final') {
            const f = await escolhaFinal();
            if (f === 'baixar') return fim('deixou');
            pose('laura', 'tocar', 80); pose('simon', 'atingido', -12); som.toque(); clarao('ouro'); S.toques++; hud(); mostra(T.toque, 'ouro grande');
            await espera(1000); return fim(S.sofridos ? 'marcas' : 'limpo');
          }
        }
      }
    };

    // ---- teclado
    const kd = (e) => {
      if (e.repeat) return;
      const k = e.key;
      if (entradaMenu && /^[1-4]$/.test(k)) { e.preventDefault(); entradaMenu(+k - 1); return; }
      if (!entrada) return;
      if (k === ' ' || k === 'Enter') { e.preventDefault(); entrada('golpe'); }
      else if (k === 'ArrowUp' || k === 'w' || k === 'W') { e.preventDefault(); entrada('aparar'); }
      else if (k === 'ArrowDown' || k === 's' || k === 'S') { e.preventDefault(); entrada('desviar'); }
    };
    addEventListener('keydown', kd, true);
    // tocar no palco também golpeia (no celular é o gesto natural)
    palco.addEventListener('pointerdown', () => { entrada && entrada('golpe'); });

    parado(); hud();
    $('.dl-go').onclick = async () => {
      $('.dt-intro').classList.remove('on');
      msg(T.fala0); som.sino();
      musica = ANTIGO && ANTIGO.trilha ? ANTIGO.trilha(A) : null; musica && musica.fase && musica.fase(1);
      await espera(1800);
      luta();
    };
    window.__DUELO = { S, get guarda() { return guarda; }, set guarda(v) { guarda = v; hud(); }, get bpm() { return bpm; }, get entrada() { return entrada; }, get menu() { return entradaMenu; }, get alvo() { return ultimoAlvo; }, get tipo() { return ultimoTipo; }, get acabou() { return acabou; } };
  });
}
window.DUELO = { start, modo: 'turnos', antigo: ANTIGO };
})();
