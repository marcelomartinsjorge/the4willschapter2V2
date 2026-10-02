/* As Quatro Vontades · Capítulo II · minijogo "Prender o coração" (o esconderijo atrás da estátua)
   O vídeo roda em loop, com o som dele. O coração de Laura bate alto: o leitor toca no compasso de cada batida
   para acalmá-lo. Quando a luz da tocha chega à estátua, segura o fôlego (segura o mesmo botão) até ela passar.
   Se o coração passar de 150, Simon não aguenta e eles correm. Se a tocha passar, eles passam impunes.
   Teclado: barra de espaço (tocar e segurar). Toque: o coração. */
(() => {
  const TX = {
    pt: {
      titulo: 'Prender o coração', sub: 'Atrás da estátua da Juíza',
      r1: ['O anel se fecha sobre o coração', 'toque no instante da batida'],
      r2: ['Batida certa', 'o coração desacelera'],
      r3: ['Batida perdida ou fora de hora', 'o coração acelera'],
      r4: ['A luz chega à estátua', 'segure até ela passar'],
      regra: 'Se o coração passar de 150, Simon não aguenta.', comecar: 'Encostar na pedra', teclas: 'Barra de espaço ou toque no coração. Para segurar, mantenha pressionado.',
      dica: 'Toque quando o anel encontrar o coração.', luz: 'A luz chega à estátua. Segure!', solta: 'Pode soltar.',
      soltouCedo: 'Simon solta o ar alto demais.', naoSegurou: 'A luz passa por nós e eu esqueço de respirar.',
      firme: 'firme', quase: 'quase', fora: 'fora de hora', perdeu: 'perdida',
      tocha: 'a tocha', bpm: 'batidas por minuto', venceu: 'A tocha passou.', descobertos: 'Simon não aguenta.',
    },
    en: {
      titulo: 'Hold your heart', sub: 'Behind the statue of the Judge',
      r1: ['The ring closes over the heart', 'tap at the moment of the beat'],
      r2: ['A beat on time', 'the heart slows down'],
      r3: ['A missed or mistimed beat', 'the heart speeds up'],
      r4: ['The light reaches the statue', 'hold until it passes'],
      regra: 'If the heart goes past 150, Simon can’t take it.', comecar: 'Press against the stone', teclas: 'Space bar or tap the heart. To hold, keep it pressed.',
      dica: 'Tap when the ring meets the heart.', luz: 'The light reaches the statue. Hold!', solta: 'You can let go.',
      soltouCedo: 'Simon lets his breath out too loud.', naoSegurou: 'The light passes over us and I forget to breathe.',
      firme: 'steady', quase: 'almost', fora: 'off beat', perdeu: 'missed',
      tocha: 'the torch', bpm: 'beats per minute', venceu: 'The torch has passed.', descobertos: 'Simon can’t take it.',
    },
  };
  const DUR = 34, LEAD = 1.0, LIMITE = 150, EVENTOS = [9.5, 19, 27.5], SEGURA = 2.4, JANELA = 1.2;

  function start(o, opts) {
    return new Promise((resolve) => {
      const T = TX[opts.lang] || TX.pt, A = opts.A;
      o.innerHTML = `
        <video class="ez-vid" loop playsinline preload="auto" poster="${opts.img || ''}"></video>
        <div class="ez-veu"></div>
        <div class="ez-top"><span>${T.tocha}</span><div class="ez-trilha"><i class="ez-fogo"></i></div></div>
        <div class="ez-centro">
          <p class="ez-msg"></p>
          <button class="ez-coracao" aria-label="${T.titulo}">
            <span class="ez-anel"></span><span class="ez-fol"></span>
            <svg viewBox="0 0 64 58" aria-hidden="true"><path d="M32 56 C10 40 2 28 2 17 C2 8 9 2 17 2 C24 2 29 6 32 11 C35 6 40 2 47 2 C55 2 62 8 62 17 C62 28 54 40 32 56 Z"/></svg>
          </button>
          <p class="ez-bpm"><b>--</b> <span>${T.bpm}</span></p>
        </div>
        <div class="ez-tela ez-intro">
          <h2>${T.titulo}</h2><p class="ez-subt">${T.sub}</p>
          <ul>${[T.r1, T.r2, T.r3, T.r4].map(([a, b]) => `<li><b>${a}</b><span>${b}</span></li>`).join('')}</ul>
          <p class="ez-regra">${T.regra}</p>
          <button class="cta ez-go">${T.comecar}</button>
          <p class="ez-teclas">${T.teclas}</p>
        </div>`;
      const $ = (q) => o.querySelector(q);
      const vid = $('.ez-vid'), btn = $('.ez-coracao'), anel = $('.ez-anel'), fol = $('.ez-fol'), msg = $('.ez-msg'), bpmEl = $('.ez-bpm b'), fogo = $('.ez-fogo');
      // vídeo: H.264 quando o navegador aceita; senão, webm
      const mp4 = opts.video, webm = opts.video.replace(/\.mp4$/, '.webm');
      vid.src = vid.canPlayType('video/mp4; codecs="avc1.42E01E"') ? mp4 : webm;
      vid.onerror = () => { if (!vid.src.endsWith('.webm')) vid.src = webm; };
      vid.volume = .9;

      const S = { firmes: 0, quase: 0, falhas: 0, fora: 0, holdsOk: 0, holdsFail: 0, bpmMax: 0, bpmFinal: 0, venceu: false };
      let bpm = 88 + Math.min(opts.peso || 0, 4) * 5, t0 = 0, rodando = false, acabou = false, apertado = false, raf = 0;
      let proxBatida = 0; const batidas = [];
      const eventos = EVENTOS.map((t) => ({ t, estado: 'espera', ini: 0 }));
      const agora = () => performance.now() / 1000 - t0;
      const aviso = (t, ms = 1100, cls = '') => { msg.textContent = t; msg.className = 'ez-msg on ' + cls; clearTimeout(aviso.id); aviso.id = setTimeout(() => (msg.className = 'ez-msg'), ms); };
      const batidaSom = () => {
        if (!A || !A.ctx || !A.on) return;
        const f = Math.min(1, (bpm - 70) / 70);
        A.tone(58, .2, 'sine', .22 + f * .25, 0, .6); A.tone(50, .18, 'sine', .15 + f * .2, .16, .6);
      };
      const eventoAtivo = (t) => eventos.find((e) => t >= e.t && (e.estado === 'espera' || e.estado === 'segurando'));
      const muda = (d) => { bpm = Math.max(66, Math.min(LIMITE + 5, bpm + d)); S.bpmMax = Math.max(S.bpmMax, bpm); };

      const toque = () => {
        if (!rodando || acabou) return;
        const t = agora();
        if (eventoAtivo(t)) return; // na hora da luz, tocar não conta: é segurar
        let melhor = null, dmin = 9;
        for (const b of batidas) if (!b.julgada) { const d = Math.abs(t - b.t); if (d < dmin) { dmin = d; melhor = b; } }
        if (melhor && dmin <= .11) { melhor.julgada = 'firme'; S.firmes++; muda(-1.6); fol.textContent = T.firme; fol.className = 'ez-fol on ok'; }
        else if (melhor && dmin <= .2) { melhor.julgada = 'quase'; S.quase++; muda(-.4); fol.textContent = T.quase; fol.className = 'ez-fol on'; }
        else { S.fora++; muda(3); fol.textContent = T.fora; fol.className = 'ez-fol on mal'; }
        clearTimeout(toque.id); toque.id = setTimeout(() => (fol.className = 'ez-fol'), 380);
      };
      const aperta = (e) => { if (e) e.preventDefault(); if (apertado) return; apertado = true; btn.classList.add('apertado'); toque(); };
      const solta = () => { apertado = false; btn.classList.remove('apertado'); };
      btn.addEventListener('pointerdown', aperta);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach((ev) => btn.addEventListener(ev, solta));
      const kd = (e) => { if (e.code === 'Space') { e.preventDefault(); e.stopPropagation(); if (!e.repeat) aperta(); } };
      const ku = (e) => { if (e.code === 'Space') { e.preventDefault(); solta(); } };
      addEventListener('keydown', kd, true); addEventListener('keyup', ku, true);

      const fim = (venceu) => {
        if (acabou) return; acabou = true; rodando = false; cancelAnimationFrame(raf);
        S.venceu = venceu; S.bpmFinal = Math.round(bpm); S.bpmMax = Math.round(S.bpmMax);
        o.classList.toggle('ez-perdeu', !venceu);
        const t = document.createElement('div'); t.className = 'ez-tela ez-fim';
        t.innerHTML = `<h2>${venceu ? T.venceu : T.descobertos}</h2>`; o.appendChild(t);
        if (A && A.duck) A.duck(false);
        setTimeout(() => {
          removeEventListener('keydown', kd, true); removeEventListener('keyup', ku, true);
          try { vid.pause(); } catch (e) {}
          resolve(S);
        }, 2200);
      };

      const passo = () => {
        if (!rodando) return;
        const t = agora();
        // agenda as batidas com antecedência (o anel precisa de tempo para se fechar)
        while (proxBatida - t < LEAD) { batidas.push({ t: proxBatida, julgada: null, soou: false }); proxBatida += 60 / bpm; }
        const ev = eventoAtivo(t);
        for (const b of batidas) {
          if (!b.soou && t >= b.t) {
            b.soou = true; batidaSom(); btn.classList.remove('bate'); void btn.offsetWidth; btn.classList.add('bate');
            muda(.25 + .55 * (t / DUR)); // a tocha chegando: o medo sobe sozinho
          }
          if (!b.julgada && t > b.t + .22) {
            if (ev || eventos.some((e) => b.t >= e.t && b.t <= e.t + SEGURA + JANELA)) b.julgada = 'ignorada';
            else { b.julgada = 'falha'; S.falhas++; muda(4); fol.textContent = T.perdeu; fol.className = 'ez-fol on mal'; clearTimeout(toque.id); toque.id = setTimeout(() => (fol.className = 'ez-fol'), 380); }
          }
        }
        while (batidas.length && batidas[0].julgada && batidas[0].soou && t - batidas[0].t > 1) batidas.shift();
        // o anel da próxima batida
        const prox = batidas.find((b) => !b.julgada && b.t >= t - .05);
        if (prox && !ev) { const k = Math.max(0, (prox.t - t) / LEAD); anel.style.transform = `scale(${1 + k * 2.2})`; anel.style.opacity = String(Math.min(1, (1 - k) * 1.6)); }
        else anel.style.opacity = '0';
        // a luz na estátua: segurar
        for (const e of eventos) {
          if (e.estado === 'espera' && t >= e.t) {
            if (!o.classList.contains('ez-luz')) { o.classList.add('ez-luz'); aviso(T.luz, 1800, 'luz'); }
            if (apertado) { e.estado = 'segurando'; e.ini = t; }
            else if (t > e.t + JANELA) { e.estado = 'falhou'; S.holdsFail++; muda(14); o.classList.remove('ez-luz'); aviso(T.naoSegurou, 1600, 'mal'); }
          } else if (e.estado === 'segurando') {
            const k = Math.min(1, (t - e.ini) / SEGURA); btn.style.setProperty('--seg', k.toFixed(3));
            if (!apertado) { e.estado = 'falhou'; S.holdsFail++; muda(12); o.classList.remove('ez-luz'); btn.style.setProperty('--seg', 0); aviso(T.soltouCedo, 1600, 'mal'); }
            else if (k >= 1) { e.estado = 'ok'; S.holdsOk++; muda(-6); o.classList.remove('ez-luz'); btn.style.setProperty('--seg', 0); aviso(T.solta, 900); }
          }
        }
        // a tocha avança; o coração aparece em número e em cor
        fogo.style.left = `${Math.min(100, (t / DUR) * 100)}%`;
        bpmEl.textContent = Math.round(bpm);
        o.style.setProperty('--medo', Math.max(0, Math.min(1, (bpm - 70) / 80)).toFixed(3));
        o.classList.toggle('ez-panico', bpm >= 130);
        if (bpm >= LIMITE) return fim(false);
        if (t >= DUR) return fim(true);
        raf = requestAnimationFrame(passo);
      };

      window.__ESC = { batidas, eventos, agora: () => agora(), bpm: () => bpm, rodando: () => rodando }; // para testes automáticos
      $('.ez-go').onclick = () => {
        $('.ez-intro').remove();
        if (A && A.duck) A.duck(true);
        vid.play().catch(() => {});
        t0 = performance.now() / 1000; proxBatida = 1.4; rodando = true; S.bpmMax = bpm;
        aviso(T.dica, 3200);
        raf = requestAnimationFrame(passo);
      };
    });
  }
  window.ESCONDERIJO = { start };
})();
