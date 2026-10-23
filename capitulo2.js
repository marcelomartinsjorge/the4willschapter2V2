/* ==========================================================================
   AS QUATRO VONTADES · CAPÍTULO II · LAURA — roteiro interativo (versão 1)
   --------------------------------------------------------------------------
   Cada texto vem em par: T('português', 'english'). O português é a chave;
   o inglês é registrado sozinho em window.LIVRO_EN. Mudou o PT, mude o EN
   na mesma linha.
   Texto do Marcelo (canon) e texto NOVO estão marcados nos comentários.
   Estado da história (st):
     st.peso       quantas mentiras Laura carrega (invisível: vira batida e aperto)
     st.perfil     { mostra, esconde }  quanto ela deixa ver de quem é
     st.f          flags: rotas, registro, viuPorta, arsenalTrancado, sangue,
                   justineDesconfia, levantou, visto, contou, brancarda ...
     st.duelo      resultado do jogo com Simon
   Cada parágrafo pode ser texto, { se: st => bool, t: texto } ou st => texto|null
   ========================================================================== */
window.LIVRO_EN = window.LIVRO_EN || {};
const T = (pt, en) => { if (en != null) window.LIVRO_EN[pt] = en; return pt; };
const se = (cond, t) => ({ se: cond, t });
const rotas = (st) => (st.f.rotas || []);
const antes = () => window.AQV_ANTES || {};
// o que se sabe dos Lúmae depende do que Aheryn fez no Cap. I:
//   relato   = lutou com a espada e matou um caçador com a luz alta: os dois que fugiram levaram a morte a um juiz
//   taverna  = ergueu o gelo: os três caçadores viram a mão acesa e contaram em taverna (o próprio Cap. I diz isso)
//   boato    = a Luz terminou alta, sem testemunha
//   extintos = qualquer outro caso, ou quem não jogou o Cap. I
const lumae = () => { const c1 = antes().cap1; if (!c1) return 'extintos'; if (c1.cacadores === 'lutar' && (c1.luz || 0) >= 45) return 'relato'; if (c1.cacadores === 'gelo') return 'taverna'; if ((c1.luz || 0) >= 60) return 'boato'; return 'extintos'; };
const aulaRes = (st) => ((st.aula && st.aula.venceu) || 'justine');
// o afeto de Justine (escondido): sobe com inteligência e com doçura; cai com mentira e com soberba
const afeto = (st) => st.afeto || 0;
const faixa = (st) => (afeto(st) >= 8 ? 'semnome' : afeto(st) >= 4 ? 'amiga' : 'rival');

window.LIVRO_UI = {
  pt: { pensaEy: 'Na ponta da língua', tacaRegra: 'O vinho balança sozinho. Segure ◀ ou ▶ para inclinar a taça de volta. Mantenha o ponteiro dentro da faixa verde até a vela acabar.', tacaNota: 'Se derramar, a história segue. Só muda o que Justine e minha mãe veem.', tacaGo: 'Pegar a taça', tacaAjuda: 'Segure ◀ ou ▶ (setas, A / D, ou toque nos lados)',  seguirLeitura: 'Seguir', vaiFalar: '{n} vai falar', conversaSegue: 'A conversa segue', dizer: 'Dizer', engolir: 'Engolir', pensaDica: 'A conversa não espera. Se Laura não disser a tempo, alguém fala por cima e ela engole. O que ela engole não some: volta, mais tarde, na hora errada.', voceN: 'Laura', maoJustine: 'A mão de Justine', nome_justine: 'Justine', nome_cecily: 'Cecily', nome_maud: 'Maud', outraSobe: 'A mão de {n} sobe antes de todas.', naoN: 'Não, {n}.', maoSobe1: 'Minha mão sobe antes de eu decidir.', maoSobe: 'Ergo a mão.', errou: 'Erro. A mão de Justine já está no ar.', justinePrimeiro: 'A mão de Justine sobe primeiro.', proxPergunta: 'Próxima pergunta', ptsAula: 'A aula', ptsTaca: 'A taça',
    coracaoTut: 'O coração de Laura', coracaoTut2: 'Quando dispara, as palavras dela começam a tremer.', parte: 'Parte', prox: 'Próxima', fim: 'Encerrar o capítulo', voltar: '← Voltar', ouvir: 'Ouvir Laura', cena: '▶ Ver a cena', oque: 'O que Laura faz?', decida: 'Decida', decidir: 'Decidir', escolheu: 'Você escolheu:', resp: 'Responder a', silencio: 'ficar em silêncio', silencioR: 'Silêncio', momento: 'Momento de jogo',
    mg: { olhar: 'Olhar sem se mexer', duelo: 'Ler Simon', esconderijo: 'Prender o coração', estudo: 'Estudar antes do sino', perguntas: 'Responder antes de Justine', taca: 'Segurar a taça' },
    dica: { estudo: 'Leia o que puder antes de a vela acabar. Não dá tempo para tudo.', perguntas: 'A primeira mão erguida responde. A de Justine já está subindo.', taca: 'Mantenha o vinho na taça.', olhar: 'Gideon está medindo e Laura não pode virar a cabeça. Passe os olhos pela sala: ela tem quatro olhares antes de ele terminar.', duelo: 'Por turnos. No seu, escolha o golpe e acerte o tempo. No dele, leia o corpo de Simon e desvie ou apare na hora. Três toques vencem.', esconderijo: 'O guarda vem pela aleia. O coração de Laura bate alto demais. Acompanhe cada batida para acalmá-lo, e prenda o fôlego quando a luz chegar.', preceT: 'Toque e segure. Solte quando quiser parar de rezar.', preceK: 'Segure o botão ou a barra de espaço. Solte quando quiser parar de rezar.' },
    olhares: (n) => (n === 1 ? 'resta 1 olhar' : `restam ${n} olhares`), deslize: 'Deslize para ver a sala inteira',
    coverEye: 'As Quatro Vontades · Livro I · Capítulo II', coverLede: 'Leia. Decida por Laura. E, no laranjal, lute.', coverGo: 'Entrar na Casa D’Orrose', coverCont: 'Continuar de onde parei', coverRestart: 'Começar do início', coverHint: 'Use fones. Avance com o botão, com a seta → ou deslizando para o lado.',
    confirm: 'Recomeçar o capítulo? Suas escolhas serão apagadas.', capN: 'Capítulo II', fimCap: 'Fim do Capítulo II', ficou: 'O que ficou atrás do peito', suas: 'O que você escolheu', reler: 'Reler e escolher diferente', mesmo: (p) => `${p}% dos leitores fizeram o mesmo`,
    pontos: 'Pontuação do capítulo', jornada: 'Jornada (Capítulos I e II)', posicao: (p, n) => `${p}º de ${n} leitores`, ptsDuelo: 'O duelo', ptsEsconde: 'O esconderijo', ptsCap1: 'Capítulo I (o hino do gelo)', semCap1: 'Jogue o Capítulo I neste navegador para somar a jornada.',
  },
  en: { pensaEy: 'On the tip of her tongue', tacaRegra: 'The wine sways on its own. Hold ◀ or ▶ to tilt the cup back. Keep the marker inside the green band until the candle burns out.', tacaNota: 'If it spills, the story goes on. Only what Justine and my mother see changes.', tacaGo: 'Take the cup', tacaAjuda: 'Hold ◀ or ▶ (arrow keys, A / D, or touch the sides)',  seguirLeitura: 'Continue', vaiFalar: '{n} is about to speak', conversaSegue: 'The conversation moves on', dizer: 'Say it', engolir: 'Swallow it', pensaDica: 'The conversation won’t wait. If Laura doesn’t say it in time, someone talks over her and she swallows it. What she swallows doesn’t go away: it comes back, later, at the wrong moment.', voceN: 'Laura', maoJustine: 'Justine’s hand', nome_justine: 'Justine', nome_cecily: 'Cecily', nome_maud: 'Maud', outraSobe: '{n}’s hand goes up before anyone’s.', naoN: 'No, {n}.', maoSobe1: 'My hand goes up before I decide.', maoSobe: 'I raise my hand.', errou: 'Wrong. Justine’s hand is already up.', justinePrimeiro: 'Justine’s hand goes up first.', proxPergunta: 'Next question', ptsAula: 'The lesson', ptsTaca: 'The cup',
    coracaoTut: 'Laura’s heart', coracaoTut2: 'When it races, her words begin to shake.', parte: 'Part', prox: 'Next', fim: 'Close the chapter', voltar: '← Back', ouvir: 'Listen to Laura', cena: '▶ Watch the scene', oque: 'What does Laura do?', decida: 'Decide', decidir: 'Decide', escolheu: 'You chose:', resp: 'Answer', silencio: 'stay silent', silencioR: 'Silence', momento: 'Moment of play',
    mg: { olhar: 'Look without moving', duelo: 'Read Simon', esconderijo: 'Hold your heart', estudo: 'Study before the bell', perguntas: 'Answer before Justine', taca: 'Hold the cup' },
    dica: { estudo: 'Read what you can before the candle burns down. There isn’t time for everything.', perguntas: 'The first hand raised answers. Justine’s is already rising.', taca: 'Keep the wine in the cup.', olhar: 'Gideon is measuring and Laura can’t turn her head. Let your eyes roam the room: she has four looks before he finishes.', duelo: 'Turn by turn. On yours, pick a move and hit the timing. On his, read Simon’s body and dodge or parry in time. Three touches win.', esconderijo: 'The guard is coming down the path. Laura’s heart is beating too loud. Keep time with every beat to calm it, and hold your breath when the light arrives.', preceT: 'Touch and hold. Let go when you want to stop praying.', preceK: 'Hold the button or the space bar. Let go when you want to stop praying.' },
    olhares: (n) => (n === 1 ? '1 look left' : `${n} looks left`), deslize: 'Swipe to see the whole room',
    coverEye: 'The Four Wills · Book I · Chapter II', coverLede: 'Read. Decide for Laura. And in the orangery, fight.', coverGo: 'Enter House D’Orrose', coverCont: 'Continue where I left off', coverRestart: 'Start from the beginning', coverHint: 'Wear headphones. Move on with the button, the → key, or a swipe.',
    confirm: 'Restart the chapter? Your choices will be erased.', capN: 'Chapter II', fimCap: 'End of Chapter II', ficou: 'What stayed behind her ribs', suas: 'What you chose', reler: 'Read again and choose differently', mesmo: (p) => `${p}% of readers did the same`,
    pontos: 'Chapter score', jornada: 'Journey (Chapters I and II)', posicao: (p, n) => `#${p} of ${n} readers`, ptsDuelo: 'The duel', ptsEsconde: 'The hiding place', ptsCap1: 'Chapter I (the ice hymn)', semCap1: 'Play Chapter I in this browser to add up the journey.',
  },
};

window.LIVRO = {
  id: 'cap02',
  titulo: 'Laura',
  subtitulo: 'Sob a Seda',
  subtituloEn: 'Beneath the Silk',
  tituloPag: 'Laura, Sob a Seda · As Quatro Vontades',
  tituloPagEn: 'Laura, Beneath the Silk · The Four Wills',
  capa: 'assets/images/capa.jpg',
  zonas: { salao: { pt: 'O Salão Pequeno', en: 'The Small Hall', volume: .45, src: 'assets/audio/salao-jantar.mp3' } },
  proximo: { titulo: 'Fechar os olhos · Capítulo III', tituloEn: 'Close your eyes · Chapter III', url: 'https://marcelomartinsjorge.github.io/the4willschapter3V2/' },

  paginas: [

    // ===================================================== I · A FITA
    { id: 'parte-I', parte: 'I', zona: 'alfaiataria', fundo: { img: 'assets/images/capa.jpg', kb: 'in', dim: .62, clima: 'poeira' },
      cartao: { num: 'I', nome: T('A Fita', 'The Tape'), epigrafe: T('Quem herda, veste. Quem conquista, sangra.', 'Who inherits, wears it. Who conquers, bleeds for it.'), fonte: T('ditado dos pátios de armas de Redom', 'saying of the training yards of Redom') } }, // NOVO (epígrafe)

    { id: 'a01', zona: 'alfaiataria', fundo: { img: 'assets/images/alfaiate-gideon.jpg', kb: 'in', foco: '62% 35%', lado: 'dir', clima: 'poeira' },
      narracao: 'assets/audio/narration/line1.mp3', narracaoLang: 'en', capitular: true,
      texto: [
        T('O alfaiate mede cada centímetro do meu corpo pela milésima vez nesta semana, a fita métrica fria contra a pele, os alfinetes presos na boca como espinhos de um animal pequeno. Daqui a um mês acontece o Torneio Real, e minha mãe, a Mãe-Rainha Dolores D’Orrose, parece mais ansiosa do que eu. Quer que eu esteja impecável diante do novo General-Rei.',
          'The tailor measures every inch of my body for the thousandth time this week, the cold tape against my skin, the pins held in his mouth like the spines of some small animal. In a month the Royal Tournament takes place, and my mother, the Mother-Queen Dolores D’Orrose, seems more anxious than I am. She wants me flawless before the new General-King.'),
      ] },

    { id: 'a02', zona: 'alfaiataria', fundo: { img: 'assets/images/alfaiate-olhar.jpg', kb: 'none', foco: '35% 40%', dim: .55, clima: 'poeira' }, pulso: .5, avancaDepois: true,
      texto: [
        T('E de novo estou aqui, desconfortável, a respiração presa, enquanto o senhor alfaiate faz seu trabalho. Não posso virar a cabeça. Os olhos, posso.',
          'And here I am again, uncomfortable, holding my breath, while the tailor does his work. I can’t turn my head. My eyes, I can.'), // NOVO (2ª e 3ª frases)
      ],
      minijogo: 'olhar',
      olhar: {
        img: 'assets/images/alfaiate-olhar.jpg', proporcao: 1916 / 821, olhares: 4,
        medidas: [T('Ombros', 'Shoulders'), T('Braços', 'Arms'), T('Cintura', 'Waist'), T('Quadril', 'Hips'), T('Gideon terminou', 'Gideon is done')],
        abertura: [T('Gideon começa pelos ombros. Tenho até ele chegar à barra do vestido.', 'Gideon starts at the shoulders. I have until he reaches the hem.')], // NOVO
        gideon: [null, T('Os ombros parados, por favor.', 'Shoulders still, please.'), null, T('Pronto. Pode respirar.', 'There. You may breathe.')], // NOVO
        fecho: [T('Gideon enrola a fita no dedo e dá um passo para trás.', 'Gideon winds the tape around his finger and steps back.')], // NOVO
        porta: T('Continuar', 'Continue'),
        pontos: [
          { id: 'janela', rota: 'janela', x: 66.5, y: 32, w: 6, h: 34, rotulo: T('A janela', 'The window'),
            texto: [T('Uns vinte passos rápidos até a janela. O vidro está aberto um palmo, e entra cheiro de chuva.', 'Twenty quick steps or so to the window. The pane is open a hand’s width, and the smell of rain comes in.')] }, // canon (passos) + NOVO (chuva)
          { id: 'telhado', rota: 'telhado', x: 75, y: 50, w: 12, h: 14, rotulo: T('Lá fora', 'Outside'),
            texto: [T('Do parapeito até o telhado da biblioteca, um salto de quatro palmos. As telhas desse lado são novas. Não escorregam.', 'From the sill to the library roof, a jump of four hands’ breadths. The tiles on that side are new. They don’t slip.')] }, // canon + NOVO
          { id: 'vinha', rota: 'vinha', x: 75, y: 18, w: 11, h: 22, rotulo: T('O muro', 'The wall'),
            texto: [T('No muro do outro lado, a vinha-virgem. Os galhos têm a grossura do meu pulso e aguentam meu peso até o chão. Dali é só achar um cavalo.', 'On the far wall, the ivy. The branches are as thick as my wrist and hold my weight to the ground. From there, I only need a horse.')] }, // canon + NOVO
          { id: 'porta', flag: 'viuPorta', x: 5, y: 50, w: 9, h: 56, rotulo: T('A porta', 'The door'),
            texto: [T('A porta do corredor. A dobradiça de baixo range quando a porta abre além da metade. Minha mãe nunca abre só até a metade.', 'The door to the corridor. The lower hinge creaks when it opens past halfway. My mother never opens it only halfway.')] }, // NOVO
          { id: 'vestido', flag: 'viuVestido', x: 93, y: 40, w: 11, h: 46, rotulo: T('O manequim', 'The dress form'),
            texto: [T('No manequim, o vestido com os adornos de esmeralda. Gideon cortou o tecido nas minhas medidas da semana passada. O vestido já tem a minha forma, e eu ainda nem entrei nele.', 'On the dress form, the gown with the emerald trim. Gideon cut it to last week’s measurements. The gown already has my shape, and I haven’t even stepped into it.')] }, // NOVO
          { id: 'mesa', flag: 'registro', x: 76, y: 80, w: 16, h: 16, rotulo: T('A mesa de Gideon', 'Gideon’s table'),
            texto: [T('Na mesa de Gideon, entre as sedas, uma carta aberta com o selo do Registro do Torneio. Encomenda de mantos para os arautos, assinada pelo oficial das inscrições: o homem que eu já sei que vou procurar. Os mantos ficam prontos em nove dias, e ele vem buscá-los aqui, pessoalmente.', 'On Gideon’s table, among the silks, an open letter with the seal of the Tournament Registry. An order of cloaks for the heralds, signed by the officer of the entries: the man I already know I’ll have to find. The cloaks will be ready in nine days, and he’s coming here to collect them himself.')] }, // NOVO (Laura já sabe quem é o oficial; a carta dá a ela o dia e o lugar)
        ],
      },
      depois: [] },

    { id: 'a03', zona: 'alfaiataria', fundo: { video: 'assets/video/alfaiataria-medidas.mp4', img: 'assets/images/laura-rosto.jpg', kb: 'none', foco: '50% 30%', dim: .45, lado: 'dir' }, pulso: 1,
      cena: 'assets/video/alfaiataria-medidas.mp4',
      texto: [
        (st) => (['janela', 'telhado', 'vinha'].every((r) => rotas(st).includes(r))
          ? T('Vinte passos, quatro palmos, a vinha até o chão, um cavalo. Não seria problema desaparecer por Redom, se todo mundo não soubesse quem eu sou. A filha da Mãe-Rainha.', 'Twenty steps, four hands’ breadths, the ivy to the ground, a horse. It wouldn’t be hard to vanish into Redom, if everyone didn’t know exactly who I am. The Mother-Queen’s daughter.')
          : T('O resto do caminho eu sei de cor, mesmo sem olhar. Não seria problema desaparecer por Redom, se todo mundo não soubesse quem eu sou. A filha da Mãe-Rainha.', 'The rest of the way I know by heart, even without looking. It wouldn’t be hard to vanish into Redom, if everyone didn’t know exactly who I am. The Mother-Queen’s daughter.')),
        T('A cada prova de vestido, traço o mesmo plano de fuga. Vou casar e dar filhos ao homem que vencer um Torneio que eu nunca vou poder disputar. Fui preparada a vida inteira para isso, e não estou pronta. Tento me recompor, e os olhos se enchem de lágrimas.',
          'Every fitting, I trace the same escape plan. I’m going to marry and bear children for whichever man wins a Tournament I will never be allowed to fight in. I was raised my whole life for this, and I’m not ready. I try to compose myself, and my eyes fill with tears.'),
      ] },

    { id: 'a04', zona: 'alfaiataria', fundo: { img: 'assets/images/alfaiate-reverencia.jpg', kb: 'out', foco: '40% 40%', dim: .5, lado: 'dir' }, pulso: .8,
      texto: [
        T('— Ah — o alfaiate se afasta e me olha dos pés à cabeça. — A senhora vai ser a Mãe-Rainha mais bela da história. Sem dúvida, o vestido com os adornos de esmeralda é a melhor escolha. Combina com os olhos esverdeados da senhora, e o dourado do cabelo fica ainda mais vivo ao lado dele.',
          '— Ah — the tailor steps back and looks me over, head to foot. — You’ll be the most beautiful Mother-Queen in history. No question, the gown with the emerald trim is the finest choice. It matches your green eyes, and the gold in your hair looks brighter still beside it.'),
        T('Respondo com um bocejo comprido e esfrego os olhos com as costas da mão. Mas complemento:', 'I answer with a long yawn and rub my eyes with the back of my hand. But I add:'),
        T('— Você é muito gentil, senhor Gideon.', '— You’re very kind, Master Gideon.'),
        (st) => (st.f.viuPorta
          ? T('Ele se curva para a frente, a mão no peito, e aproveita o gesto para já se virar, ainda curvado, na direção da porta. A dobradiça de baixo range. Minha mãe acaba de entrar.', 'He bows forward, a hand to his chest, and uses the motion to turn, still bent, toward the door. The lower hinge creaks. My mother has just walked in.')
          : T('Ele se curva para a frente, a mão no peito, e aproveita o gesto para já se virar, ainda curvado, na direção da porta, onde minha mãe acaba de entrar.', 'He bows forward, a hand to his chest, and uses the motion to turn, still bent, toward the door, where my mother has just walked in.')),
      ] },

    { id: 'a05', zona: 'alfaiataria', fundo: { img: 'assets/images/dolores-maos.jpg', kb: 'in', foco: '72% 40%', dim: 0.4 }, pulso: 1.6,
      texto: [
        T('— Laura! — ela grita, atravessando o aposento apressada, quase chutando a mesa de centro no caminho. — Deixe-me ver suas mãos. Agora.', '— Laura! — she calls, crossing the room in a hurry, nearly kicking the low table on her way. — Let me see your hands. Now.'),
        T('Não espera minha resposta.', 'She doesn’t wait for my answer.'),
      ],
      escolha: { id: 'maos', opcoes: [
        { id: 'esconder', eixo: 'esconde', peso: 1, txt: T('Levar as mãos para trás das costas', 'Pull my hands behind my back'),
          resultado: [T('Levo as mãos para trás das costas por puro instinto. Não adianta. Ela pega a direita, ríspida, e vira minha palma para cima.', 'I pull my hands behind my back on pure instinct. It does no good. She takes the right one, sharp, and turns my palm up.')] }, // canon, reescrito
        { id: 'mostrar', eixo: 'mostra', txt: T('Estender as mãos, palmas para cima', 'Hold out my hands, palms up'),
          resultado: [T('Estendo as duas, palmas para cima, antes que ela peça de novo. Ela para no meio do passo, a boca entreaberta. Depois pega a direita, ríspida, e a traz para perto do rosto.', 'I hold out both, palms up, before she can ask again. She stops mid-step, mouth half open. Then she takes the right one, sharp, and brings it close to her face.')] }, // NOVO
      ] } },

    { id: 'a06', zona: 'alfaiataria', fundo: { img: 'assets/images/dolores-maos.jpg', kb: 'out', foco: '72% 40%', dim: 0.45 }, pulso: 1.6,
      texto: [
        T('— Você andou treinando esgrima com seu irmão outra vez? Olhe só, cheia de calos. Laura!', '— Have you been fencing with your brother again? Look at this, covered in calluses. Laura!'),
        T('— Foi só ontem à noite, mãe. Você sabe que a esgrima me acalma, e estou muito nervosa para o Torneio Real.', '— It was only last night, mother. You know fencing calms me, and I’m very nervous about the Royal Tournament.'),
        T('— Você sabe que isso não é justificativa! Tenho certeza de que todas as suas professoras já lhe explicaram muito bem que uma Mãe-Rainha não toca em armas. E não tem calos! Preciso conferir de novo se você não esconde nenhuma cicatriz pelo corpo?', '— You know that’s no excuse! I’m sure every one of your tutors has explained very clearly that a Mother-Queen does not touch weapons. And has no calluses! Do I need to check again that you’re not hiding a single scar on your body?'),
        T('É a deixa que Gideon esperava para sair da sala de fininho, ainda curvado.', 'It’s the cue Gideon has been waiting for, and he slips out of the room, still bowing.'),
        T('— Posso garantir que meu corpo está igual à última vez que você conferiu, mãe. Só treino com Simon, e ele não consegue me acertar.', '— I can promise my body looks exactly like it did the last time you checked, mother. I only train with Simon, and he can never land a hit.'),
        T('— Seu irmão está crescendo. Como homem bem alimentado, fica mais forte a cada dia.', '— Your brother is growing. A well-fed man gets stronger every day.'),
      ] },

    { id: 'a07', zona: 'alfaiataria', fundo: { img: 'assets/images/dolores-maos.jpg', kb: 'in', foco: '72% 40%', dim: 0.5 }, pulso: 2,
      texto: [
        T('Olho por trás de Dolores. O caminho até a janela parece mais curto agora do que quando Gideon ainda estava aqui.', 'I look past Dolores. The way to the window seems shorter now than it did while Gideon was still here.'),
        T('— Você já tem dezesseis anos, Laura, minha querida. Prometa que essa foi a última vez.', '— You’re sixteen already, Laura, my darling. Promise me that was the last time.'),
      ],
      escolha: { id: 'promessa', pergunta: T('A promessa', 'The promise'), opcoes: [
        { id: 'prometer', lagrimas: true, peso: 2, aviso: T('Dolores vai lembrar disso.', 'Dolores will remember that.'),  voz: 'prometo', vozAtraso: 500, txt: T('Prometer', 'Promise'),
          resultado: [
            T('Prometo. Odeio mentir. Pesa atrás do peito, e desta vez as lágrimas finalmente escorrem pelo rosto.', 'I promise. I hate lying. It sits heavy behind my ribs, and this time the tears finally spill down my face.'),
            T('— Você vai ser muito feliz, minha filha. Markus vai vencer o Torneio, com certeza. É um homem honrado. Vocês vão governar melhor do que eu e seu falecido pai.', '— You’ll be very happy, my daughter. Markus will win the Tournament, without question. He’s an honorable man. The two of you will govern better than your late father and I ever did.'),
          ] }, // canon
        { id: 'calar', peso: 1, aviso: T('Dolores vai lembrar disso.', 'Dolores will remember that.'), txt: T('Não dizer nada', 'Say nothing'),
          resultado: [
            T('Não digo nada. Ela segura meu queixo e espera, e o silêncio fica comprido demais para nós duas.', 'I say nothing. She holds my chin and waits, and the silence grows too long for both of us.'),
            T('— Uma Mãe-Rainha também promete calada, Laura. Vou tomar o seu silêncio como palavra.', '— A Mother-Queen can promise in silence too, Laura. I’ll take yours as your word.'),
            T('Engulo em seco. As lágrimas escorrem do mesmo jeito.', 'I swallow hard. The tears come anyway.'),
            T('— Você vai ser muito feliz, minha filha. Markus vai vencer o Torneio, com certeza. É um homem honrado. Vocês vão governar melhor do que eu e seu falecido pai.', '— You’ll be very happy, my daughter. Markus will win the Tournament, without question. He’s an honorable man. The two of you will govern better than your late father and I ever did.'),
          ] }, // NOVO
        { id: 'recusar', aviso: T('Dolores vai lembrar disso.', 'Dolores will remember that.'), eixo: 'mostra', flag: 'arsenalTrancado', pulso: 3, voz: 'nao-posso-prometer', vozAtraso: 500, txt: T('Recusar', 'Refuse'),
          resultado: [
            T('— Não posso prometer isso, mãe.', '— I can’t promise that, mother.'),
            T('Ela solta minha mão de uma vez.', 'She lets go of my hand all at once.'),
            T('— Então não precisa. Hoje mesmo mando trancar o arsenal do Pátio das Armas, e a chave fica comigo até o Torneio.', '— Then you needn’t. Today I’ll have the armory in the Weapons Yard locked, and the key stays with me until the Tournament.'),
            T('Os dedos tremem. Os olhos, desta vez, ficam secos.', 'My fingers shake. My eyes, this time, stay dry.'),
            T('— Você vai ser muito feliz, minha filha — ela diz, já de costas. — Markus vai vencer o Torneio, com certeza. É um homem honrado. Vocês vão governar melhor do que eu e seu falecido pai.', '— You’ll be very happy, my daughter — she says, already turning away. — Markus will win the Tournament, without question. He’s an honorable man. The two of you will govern better than your late father and I ever did.'),
          ] }, // NOVO
      ] } },

    { id: 'a08', zona: 'alfaiataria', fundo: { img: 'assets/images/alfaiate-sala.jpg', kb: 'out', foco: '50% 40%', dim: .66, clima: 'poeira' }, pulso: 1,
      texto: [
        (st) => (st.escolhas.promessa === 'recusar'
          ? T('Ela não ajeita meu cabelo antes de sair, como faz sempre. Vai direto para a porta.', 'She doesn’t tuck my hair back before leaving, the way she always does. She goes straight to the door.')
          : T('Ela ajeita uma mecha do meu cabelo atrás da orelha, o mesmo gesto de quando eu era pequena, e vai até a porta.', 'She tucks a strand of my hair behind my ear, the same gesture as when I was small, and goes to the door.')), // NOVO
      ],
      escolha: { id: 'outro', pergunta: T('Ela está quase na porta.', 'She’s almost at the door.'), opcoes: [
        { id: 'perguntar', eixo: 'mostra', flag: 'perguntouOutro', txt: T('Perguntar: “E se outro vencer?”', 'Ask: “What if someone else wins?”'),
          resultado: [
            T('— Mãe. E se outro vencer?', '— Mother. What if someone else wins?'),
            T('Ela para com a mão na maçaneta.', 'She stops with her hand on the latch.'),
            T('— Então você se casa com outro, minha filha. É assim que Redom continua de pé.', '— Then you marry someone else, my daughter. That’s how Redom stays standing.'),
            (st) => (st.f.viuPorta ? T('A dobradiça de baixo range quando ela sai, como eu sabia que ia ranger.', 'The lower hinge creaks as she leaves, the way I knew it would.') : T('A porta fecha atrás dela.', 'The door closes behind her.')),
          ] },
        { id: 'cala', txt: T('Deixar que ela vá', 'Let her go'),
          resultado: [(st) => (st.f.viuPorta ? T('A dobradiça de baixo range quando ela sai, como eu sabia que ia ranger.', 'The lower hinge creaks as she leaves, the way I knew it would.') : T('A porta fecha atrás dela.', 'The door closes behind her.'))] },
      ] } }, // NOVO (a pergunta agora é escolha visível)

    // ===================================================== II · O ORATÓRIO
    { id: 'parte-II', parte: 'II', zona: 'castelo', fundo: { video: 'assets/video/aula-sala.mp4', img: 'assets/images/aula-sala.jpg', alt: 'assets/images/aula.jpg', kb: 'in', dim: .62, foco: '50% 40%', clima: 'poeira' },
      cartao: { num: 'II', nome: T('A Aula', 'The Lesson'), epigrafe: T('Uma Mãe-Rainha não precisa vencer a discussão. Precisa encerrá-la.', 'A Mother-Queen need not win the argument. She must end it.'), fonte: T('Mestra Hadasa, a todas as alunas, todos os anos', 'Mistress Hadasa, to every pupil, every year') } }, // NOVO

    { id: 'b01', zona: 'castelo', fundo: { img: 'assets/images/aula.jpg', kb: 'in', dim: .5, foco: '58% 40%', lado: 'dir' },
      narracao: 'assets/audio/narration/line2.mp3', narracaoLang: 'en', capitular: true,
      texto: [
        T('Depois da pausa para o alfaiate, tenho uma longa tarde de aulas de história. Não consigo prestar muita atenção. No fim, todas as aulas se parecem. Histórias sobre a Guerra Eterna, que segundo dizem está perto do fim, já que os Grakh não são mais considerados uma ameaça séria; e mais rumores do que fatos sobre o Apagar das Luzes, que serve, todo dia, como novo lembrete dos perigos da magia.',
          'After the pause for the tailor, I have a long afternoon of history lessons. I can’t hold my attention. In the end, every lesson looks the same. Stories of the Eternal War, which they say is nearing its end, now that the Grakh are no longer considered a serious threat; and more rumor than fact about the Dimming of the Lights, which serves, every single day, as a fresh reminder of the dangers of magic.'),
        // eco do Capítulo I: o que se sabe dos Lúmae depende do que Aheryn fez (ver lumae())
        () => ({
          boato: T('A Mestra conta, meio rindo, que algumas décadas atrás correram boatos de luz de Lúmae na Borda do Mundo. Conversa de taverna, ela diz. Ninguém foi conferir. Eu desenho uma janela na margem do caderno.', 'The Mistress tells us, half laughing, that a few decades ago there were rumours of Lúmae light at the Edge of the World. Tavern talk, she says. No one went to check. I draw a window in the margin of my notebook.'),
          taverna: T('A Mestra conta, meio rindo, que décadas atrás três caçadores de Frígia andaram de taverna em taverna jurando ter visto um velho acender a mão na neve, perto da Borda do Mundo. Bebiam de graça com essa história, ela diz. Ninguém foi conferir. Eu desenho uma janela na margem do caderno.', 'The Mistress tells us, half laughing, that decades ago three hunters from Frigia went from tavern to tavern swearing they had seen an old man light up his hand in the snow, near the Edge of the World. They drank for free on that story, she says. No one went to check. I draw a window in the margin of my notebook.'),
          relato: [T('A Mestra não ri quando chega nos Lúmae. Conta que, décadas atrás, dois caçadores de Frígia levaram ao juiz a morte de um companheiro, na Borda do Mundo. Juraram que o velho que o matou tinha luz correndo por baixo da pele. O juiz registrou. O registro está no arquivo da Juíza até hoje.', 'The Mistress doesn’t laugh when she reaches the Lúmae. She tells us that, decades ago, two hunters from Frigia brought a companion’s death before a judge, at the Edge of the World. They swore the old man who killed him had light running under his skin. The judge recorded it. The record is still in the Judge’s archive.'),
            T('— E ninguém foi ver? — Maud pergunta.', '— And no one went to look? — Maud asks.'),
            T('— Ninguém volta da Borda para dizer que foi.', '— No one comes back from the Edge to say they went.')],
        }[lumae()] || T('— Os Lúmae estão extintos — a Mestra repete, batendo o dedo no livro. — Todos eles. A magia cobrou o preço inteiro.', '— The Lúmae are extinct — the Mistress repeats, tapping the book. — Every one of them. Magic took the whole price.')), // NOVO (eco do Cap. I em quatro níveis)
      ] },

    // ===================================================== II · A AULA (NOVO)
    { id: 'b01a', zona: 'castelo', fundo: { video: 'assets/video/aula-sala.mp4', img: 'assets/images/aula-sala.jpg', alt: 'assets/images/aula.jpg', kb: 'in', dim: .5, foco: '40% 40%', clima: 'poeira' }, pulso: .8, quentePulso: true,
      texto: [
        T('A sala de estudos fica no alto da torre leste. À tarde, o sol entra de lado e esquenta o tampo das mesas. Somos quatro.', 'The study room sits at the top of the east tower. In the afternoon the sun comes in sideways and warms the tabletops. There are four of us.'),
        T('Cecily Hollin borda flores nas margens dos livros quando acha que ninguém vê. Maud Varr sabe o nome de todos os cavalos do irmão e de nenhum rei morto. Justine senta na mesa ao lado da minha, como desde que a gente tinha sete anos.', 'Cecily Hollin embroiders flowers in the margins of her books when she thinks no one is looking. Maud Varr knows the name of every one of her brother’s horses and of no dead king. Justine sits at the desk beside mine, as she has since we were seven.'),
        T('Mestra Hadasa fecha o livro da Guerra Eterna com as duas mãos, devagar.', 'Mistress Hadasa closes the book of the Eternal War with both hands, slowly.'),
        T('— Chega de ouvir. Até o sino da tarde, vocês estudam sozinhas o que está na minha mesa. Depois eu pergunto. A primeira mão erguida responde.', '— Enough listening. Until the afternoon bell, you study on your own what’s on my desk. Then I ask. The first hand raised answers.'),
        T('Justine endireita as costas e molha a pena. Olha para mim de lado, um instante, e volta para a frente.', 'Justine straightens her back and dips her quill. She glances at me sideways, for an instant, and looks ahead again.'),
      ] }, // NOVO

    { id: 'b01b', zona: 'castelo', fundo: { img: 'assets/images/mesa-estudos.jpg', alt: 'assets/images/aula.jpg', kb: 'in', dim: .55, foco: '50% 50%' }, pulso: 1.2, avancaDepois: true,
      texto: [T('A Mestra acende a vela das horas e vai sentar perto da janela. Até a chama chegar à marca, a mesa dela é nossa.', 'The Mistress lights the hour candle and goes to sit by the window. Until the flame reaches the mark, her desk is ours.')], // NOVO
      minijogo: 'estudo',
      estudo: {
        img: 'assets/images/mesa-estudos.jpg', alt: 'assets/images/aula.jpg', dur: 55,
        sino: T('O sino bate. Justine pousa a pena no mesmo instante, como se tivesse contado as badaladas antes de elas virem.', 'The bell rings. Justine sets down her quill at the same instant, as if she had counted the strokes before they came.'),
        itens: [
          { id: 'corwin', ico: '♛', nome: T('O retrato de Corwin', 'Corwin’s portrait'),
            texto: T('Corwin, General-Rei. Não chegava ao ombro de nenhum dos rivais. Venceu o Torneio sem que espada alguma o tocasse, e governou trinta e um anos. O povo o chamava de Lâmina. Nos retratos oficiais, os pintores o faziam alto.', 'Corwin, General-King. He came up to no rival’s shoulder. He won the Tournament without a single sword touching him, and ruled for thirty-one years. The people called him the Blade. In the official portraits, the painters made him tall.') },
          { id: 'ponte', ico: '⌒', nome: T('O mapa da Ponte de Andrey', 'The map of Andrey Bridge'),
            texto: T('Ponte de Andrey, ano 211 da Guerra Eterna. Trinta homens de Orrin D’Orrose contra cem Grakh. A ponte tinha três passos de largura: três contra três, de cada vez, por dois dias. Na ponte, o número dos Grakh não serviu de nada.', 'Andrey Bridge, year 211 of the Eternal War. Thirty men under Orrin D’Orrose against a hundred Grakh. The bridge was three paces wide: three against three, at a time, for two days. On the bridge, the Grakh’s numbers counted for nothing.') },
          { id: 'balanca', ico: '⚖', nome: T('A balança da Juíza', 'The Judge’s balance'),
            texto: T('O problema da Juíza. Nove moedas iguais, uma falsa e mais leve. Uma balança de dois pratos. Separe as nove em três montes de três e pese dois montes. Se equilibrarem, a falsa está no terceiro. Pese de novo, uma moeda contra uma. Duas pesagens bastam.', 'The Judge’s problem. Nine identical coins, one false and lighter. A two-pan balance. Split the nine into three piles of three and weigh two piles. If they balance, the false one is in the third. Weigh again, one coin against one. Two weighings are enough.') },
          { id: 'cirurgiao', ico: '✚', nome: T('A prancha do cirurgião', 'The surgeon’s plate'),
            texto: T('Dos cuidados que a Mãe-Rainha deve aos feridos. Corte fundo atrás da coxa, sangue vivo que pulsa: amarrar um garrote acima do corte, entre a ferida e o coração, e apertar até o sangue parar. Anotar a hora. Afrouxar só com o cirurgião.', 'Of the care a Mother-Queen owes the wounded. A deep cut behind the thigh, bright blood that pulses: tie a tourniquet above the cut, between the wound and the heart, and tighten until the bleeding stops. Note the hour. Loosen it only with the surgeon.') },
          { id: 'casas', ico: '❦', nome: T('O Livro das Casas', 'The Book of Houses'), flag: 'viuMerrow',
            texto: T('Casas extintas da Capital Branca. Ashby, a torre partida. Quill, o tinteiro de prata. Merrow, a garça cinza: o último filho morreu sem herdeiros na Ponte de Andrey, e a divisa nunca mais foi bordada.', 'Extinct houses of the White Capital. Ashby, the broken tower. Quill, the silver inkwell. Merrow, the grey heron: its last son died without heirs at Andrey Bridge, and the device was never stitched again.') },
          { id: 'lumae', ico: '✧', nome: T('A Crônica dos Lúmae', 'The Chronicle of the Lúmae'),
            texto: () => [T('Os Lúmae. Extintos desde o Apagar das Luzes. Nenhum avistamento confirmado em mais de um século.', 'The Lúmae. Extinct since the Dimming of the Lights. No confirmed sighting in more than a century.'),
              { boato: T('Na margem, em letra de outra mão: “luz na Borda do Mundo, contado em taverna. Ninguém foi ver.”', 'In the margin, in another hand: “light at the Edge of the World, told in a tavern. No one went to see.”'),
                taverna: T('Na margem, em letra de outra mão: “três caçadores de Frígia, de taverna em taverna, contando de um velho que acendia a mão na neve. Bebiam de graça com a história.”', 'In the margin, in another hand: “three hunters from Frigia, tavern to tavern, telling of an old man who lit up his hand in the snow. They drank for free on the story.”'),
                relato: T('Na margem, em letra de outra mão: “dois caçadores de Frígia, sob juramento, sobre a morte de um terceiro. Ver o arquivo da Juíza.”', 'In the margin, in another hand: “two hunters from Frigia, under oath, about the death of a third. See the Judge’s archive.”') }[lumae()] || null] },
          { id: 'janela', ico: '⚔', lado: true, nome: T('A janela', 'The window'),
            texto: T('Lá embaixo, no Pátio das Armas, Simon repete a mesma estocada para Anthony. Erra o pé de trás. Sempre erra o pé de trás.', 'Down in the Weapons Yard, Simon repeats the same thrust for Anthony. He gets his back foot wrong. He always gets his back foot wrong.') },
          { id: 'justine', ico: '✎', lado: true, lento: true, quente: true, flag: 'olhouJustine', img: 'assets/images/justine-pena.jpg', imgAlt: 'assets/images/oratorio-justine.jpg', nome: T('Justine', 'Justine'),
            texto: T('Justine lê o retrato de Corwin com a ponta da pena entre os dentes. Morde quando decora alguma coisa. Morde agora. Perco a linha que estava lendo.', 'Justine reads Corwin’s portrait with the tip of her quill between her teeth. She bites it when she’s memorising something. She’s biting it now. I lose the line I was reading.') },
        ],
      },
      depois: [] }, // NOVO

    { id: 'b01c', zona: 'castelo', fundo: { video: 'assets/video/aula-sala.mp4', img: 'assets/images/aula-sala.jpg', alt: 'assets/images/aula.jpg', kb: 'out', dim: .55, foco: '50% 40%' }, pulso: 1.6, avancaDepois: true,
      texto: [T('O sino ainda vibra quando a Mestra abre o caderno de perguntas. Justine já está com o cotovelo na mesa.', 'The bell is still humming when the Mistress opens her book of questions. Justine already has her elbow on the desk.')], // NOVO
      minijogo: 'perguntas',
      perguntas: {
        img: 'assets/images/aula-sala.jpg', alt: 'assets/images/aula.jpg',
        lista: [ // a primeira opção é sempre a certa (a tela embaralha)
          { q: T('Quantos golpes Corwin levou no Torneio em que foi coroado?', 'How many blows did Corwin take in the Tournament that crowned him?'), justine: 7,
            ops: [T('Nenhum', 'None'), T('Um, no ombro', 'One, on the shoulder'), T('Três', 'Three')], resposta: T('Nenhum. Nem um arranhão.', 'None. Not a scratch.') },
          { q: T('Por que trinta homens seguraram cem na Ponte de Andrey?', 'Why did thirty men hold a hundred at Andrey Bridge?'), justine: 6,
            ops: [T('A ponte só cabia três de cada vez', 'The bridge only fit three at a time'), T('Os Grakh têm medo de água', 'The Grakh fear water'), T('Choveu os dois dias', 'It rained both days')], resposta: T('Três passos de largura. Numa ponte, cem valem três.', 'Three paces wide. On a bridge, a hundred are worth three.') },
          { q: T('Nove moedas, uma falsa e mais leve, uma balança de dois pratos. Quantas pesagens, no mínimo?', 'Nine coins, one false and lighter, a two-pan balance. How many weighings, at least?'), justine: 8,
            ops: [T('Duas', 'Two'), T('Três', 'Three'), T('Quatro', 'Four')], resposta: T('Duas. Três montes de três, depois uma contra uma.', 'Two. Three piles of three, then one against one.') },
          { q: T('Corte fundo atrás da coxa, sangue que pulsa. Onde vai o garrote?', 'A deep cut behind the thigh, pulsing blood. Where does the tourniquet go?'), justine: 5,
            ops: [T('Acima do corte', 'Above the cut'), T('Em cima do corte', 'On the cut'), T('Abaixo do corte', 'Below the cut')], resposta: T('Acima. Entre a ferida e o coração. Garrote.', 'Above. Between the wound and the heart. Tourniquet.') },
        ],
      },
      depois: [] }, // NOVO

    { id: 'b01d', zona: 'castelo', fundo: { video: 'assets/video/aula-sala.mp4', img: 'assets/images/aula-sala.jpg', alt: 'assets/images/aula.jpg', kb: 'in', dim: .55, foco: '50% 40%', lado: 'dir' }, pulso: 1,
      texto: [
        T('A Mestra fecha o livro com as duas mãos.', 'The Mistress closes the book with both hands.'),
        T('— E não esqueçam a rainha Aldis, que passou três dias em vigília no oratório velho antes do Torneio do marido.', '— And don’t forget Queen Aldis, who kept a three-day vigil in the old oratory before her husband’s Tournament.'),
        T('— Depois da morte do marido, Mestra — diz Justine, sem levantar a mão. — A vigília foi pelo marido morto.', '— After her husband’s death, Mistress — Justine says, without raising her hand. — The vigil was for her dead husband.'),
        T('A Mestra demora um pouco para responder.', 'The Mistress takes a moment to answer.'),
        T('— Pelo morto, sim. Obrigada, Justine.', '— For the dead one, yes. Thank you, Justine.'),
        T('Cecily ri dentro da manga. Escrevo na margem do caderno: morto.', 'Cecily laughs into her sleeve. I write in the margin of my notebook: dead.'),
      ] }, // NOVO

    { id: 'b01e', zona: 'castelo', fundo: { video: 'assets/video/aula-sala.mp4', img: 'assets/images/aula-sala.jpg', alt: 'assets/images/aula.jpg', kb: 'out', dim: .55, foco: '50% 40%', lado: 'dir' }, pulso: (st) => (aulaRes(st) === 'laura' ? 1.2 : 1.8), quente: true,
      texto: [
        (st) => {
          const a = st.aula || {}, r = aulaRes(st);
          if (r === 'laura') return [
            a.laura >= 4 ? T('A Mestra marca o placar no canto da lousa. Quatro perguntas, quatro mãos minhas.', 'The Mistress marks the score in the corner of the slate. Four questions, four of my hands.') : T('A Mestra marca o placar no canto da lousa. Quatro perguntas, três mãos minhas.', 'The Mistress marks the score in the corner of the slate. Four questions, three of my hands.'),
            T('Conto as marcas duas vezes. Maud bate palmas sem som.', 'I count the marks twice. Maud claps without a sound.'),
            T('Justine guarda a pena devagar e me olha de cima a baixo.', 'Justine puts her quill away slowly and looks me up and down.'),
            T('— Desde quando você lê?', '— Since when do you read?')];
          if (r === 'empate') return [
            T('— Empate — diz a Mestra. Justine franze a testa como se a palavra fosse de outra língua.', '— A tie — says the Mistress. Justine frowns as if the word were in another language.'),
            T('— Na próxima, a balança é minha — ela diz, para mim, não para a Mestra.', '— Next time, the balance is mine — she says, to me, not to the Mistress.')];
          return [
            T('A Mestra marca o placar na lousa. A coluna de Justine fica cheia. A minha, quase vazia.', 'The Mistress marks the score on the slate. Justine’s column fills. Mine stays almost empty.'),
            T('— Você estava no Pátio das Armas de novo — Justine diz, baixo. — Com a cabeça.', '— You were in the Weapons Yard again — Justine says, quietly. — In your head.')];
        },
      ],
      seq: [
        { se: (st) => aulaRes(st) !== 'empate', escolha: { id: 'aulaJustine', pergunta: T('Justine', 'Justine'), opcoes: [
          { id: 'meiga', se: (st) => aulaRes(st) === 'laura', afeto: 2, quente: true, voz: 'aula-sorte', txt: T('— Tive sorte. A ponte eu já sabia de cor.', '— I got lucky. I already knew the bridge by heart.'),
            resultado: [T('— Sorte não sabe a balança, Laura.', '— Luck doesn’t know the balance, Laura.'), T('Ela sorri só com um lado da boca.', 'She smiles with one side of her mouth.')] },
          { id: 'afiada', se: (st) => aulaRes(st) === 'laura', afeto: 1, voz: 'aula-ganhar', txt: T('— Desde que você começou a ganhar.', '— Since you started winning.'),
            resultado: [T('— Então você começou tarde.', '— Then you started late.')] },
          { id: 'gabar', se: (st) => aulaRes(st) === 'laura', afeto: -1, voz: 'aula-sempre', txt: T('— Desde sempre. Você é que nunca reparou.', '— Always. You just never noticed.'),
            resultado: [T('— Reparei agora.', '— I’ve noticed now.'), T('Ela vira para a janela.', 'She turns to the window.')] },
          { id: 'honesta', se: (st) => aulaRes(st) === 'justine', voz: 'aula-estava', txt: T('— Estava.', '— I was.'),
            resultado: [T('Ela assente uma vez e volta a arrumar as penas.', 'She nods once and goes back to tidying her quills.')] },
          { id: 'outra', se: (st) => aulaRes(st) === 'justine', afeto: (st) => (st.f.olhouJustine ? 2 : 1), quente: true, voz: 'aula-outra', txt: T('— Estava olhando outra coisa.', '— I was looking at something else.'),
            resultado: (st) => (st.f.olhouJustine ? [T('— Eu sei. Eu vi.', '— I know. I saw.'), T('Ela não olha para mim quando diz isso.', 'She doesn’t look at me when she says it.')] : [T('— Que outra coisa?', '— What something else?'), T('Eu não respondo, e ela não pergunta de novo.', 'I don’t answer, and she doesn’t ask again.')]) },
          { id: 'cala', se: (st) => aulaRes(st) === 'justine', silencio: true,
            resultado: [T('Ela espera uma resposta que não vem e volta a arrumar as penas.', 'She waits for an answer that doesn’t come and goes back to tidying her quills.')] },
        ] } },
        { se: (st) => aulaRes(st) === 'laura', pensa: { id: 'aula', quem: T('Justine', 'Justine'), t: T('Eu podia ganhar dela em tudo.', 'I could beat her at everything.'),
          dizer: { voz: 'aula-tudo', afeto: -1, resultado: [T('— Em tudo — digo, baixo, para mim.', '— At everything — I say, quietly, to myself.'), T('Justine ouve.', 'Justine hears.'), T('— Isso nós vamos ver, Laura.', '— We’ll see about that, Laura.')] },
          engolir: { resultado: [T('Fecho o caderno.', 'I close my notebook.')] } } },
        { se: (st) => aulaRes(st) === 'justine', pensa: { id: 'aula', quem: T('Justine', 'Justine'), t: T('Se fosse com espada, você não ganhava.', 'If it were swords, you wouldn’t win.'),
          dizer: { voz: 'aula-espada', afeto: 1, flag: 'justineDesconfia', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'), resultado: [T('— Se fosse com espada, você não ganhava.', '— If it were swords, you wouldn’t win.'), T('Justine ri baixo, pela primeira vez na tarde.', 'Justine laughs quietly, for the first time all afternoon.'), T('— Com espada? Você é muito estranha, Laura.', '— Swords? You’re very strange, Laura.')] },
          engolir: { resultado: [T('Guardo a pena.', 'I put my quill away.')] } } },
      ] }, // NOVO

    { id: 'parte-III-oratorio', parte: 'III', zona: 'oratorio', fundo: { img: 'assets/images/oratorio-estatuas.jpg', kb: 'in', dim: .6, foco: '50% 20%', retrato: true, clima: 'velas' },
      cartao: { num: 'III', nome: T('O Oratório', 'The Shrine'), epigrafe: T('A Juíza pesa. O Cavaleiro carrega.', 'The Judge weighs. The Knight carries.'), fonte: T('inscrição sobre a porta do oratório da Casa D’Orrose', 'inscription above the shrine door of House D’Orrose') } }, // NOVO (epígrafe)

    { id: 'b02a', zona: 'castelo', fundo: { img: 'assets/images/laura-escada.jpg', alt: 'assets/images/oratorio-estatuas.jpg', kb: 'in', dim: .5, foco: '40% 45%', lado: 'dir', clima: 'poeira' }, pulso: .6,
      texto: [
        T('A Mestra nos dispensa. Cecily e Maud descem a escada de braço dado, já discutindo se Markus é mais bonito de perto.', 'The Mistress dismisses us. Cecily and Maud go down the stairs arm in arm, already arguing over whether Markus is handsomer up close.'),
        T('A mesa de Justine já está vazia, com as penas arrumadas em fila.', 'Justine’s desk is already empty, her quills lined up in a row.'),
        T('Desço sozinha. São setenta e dois degraus da torre leste até o pátio. No meio deles, o cheiro do refeitório sobe pela escada: pão quente, cebola, carne.', 'I go down alone. Seventy-two steps from the east tower to the courtyard. Halfway down, the smell of the dining hall comes up the stairwell: warm bread, onion, meat.'),
      ] }, // v17

    { id: 'b02', zona: 'oratorio', fundo: { video: 'assets/video/maos-prece.mp4', img: 'assets/images/oratorio-maos.jpg', kb: 'none', foco: '50% 55%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: .6,
      narracao: 'assets/audio/voz/oratorio-fome.mp3', narracaoLang: 'en',
      texto: [
        T('Não sinto fome, e por isso desvio o caminho do refeitório para o oratório: um espaço pequeno, ocupado por duas grandes estátuas. O Cavaleiro e a Juíza. Nossos deuses.', 'I’m not hungry, so instead of the dining hall I take the turn toward the shrine: a small space, home to two great statues. The Knight and the Judge. Our gods.'),
        T('Ajoelho aos pés do Cavaleiro e peço coragem, porque vou precisar de muita.', 'I kneel at the Knight’s feet and ask for courage, because I’m going to need a great deal of it.'),
      ],
      minijogo: 'prece',
      prece: {
        pergunta: T('A prece', 'The prayer'), botao: T('Apertar as mãos', 'Press my hands together'), passo: 1800, sangraEm: 5,
        // a voz de Laura: o texto acompanha a fala. i = quais linhas cada trecho cobre; marcas = segundo em que cada linha começa dentro do trecho
        faixas: (st) => [
          { voz: 'prece-1', dur: 7.71, i: [0] },
          st.escolhas.promessa === 'recusar' ? { voz: 'prece-chave-arsenal', dur: 6.84, i: [1] }
            : st.escolhas.promessa === 'prometer' ? { voz: 'prece-promessa', dur: 3.16, i: [1] }
            : { voz: 'prece-silencio', dur: 5.33, i: [1] }, // cada caminho da manhã tem a sua linha de perdão
          { voz: 'prece-resto', dur: 13.01, i: [2, 3, 4, 5], marcas: [0, 3.23, 5.28, 9.13] },
        ],
        linhas: [
          T('Sinto que Ele olha por mim desde que sou muito criança, e que é o único que vai entender o que estou prestes a fazer.', 'I feel He has watched over me since I was very small, and that He’s the only one who will understand what I’m about to do.'),
          (st) => ({
            prometer: T('Peço perdão pela promessa de hoje de manhã.', 'I ask forgiveness for this morning’s promise.'),
            calar: T('Peço perdão pelo silêncio de hoje de manhã, que minha mãe tomou por promessa.', 'I ask forgiveness for this morning’s silence, which my mother took as a promise.'),
            recusar: T('Peço que minha mãe esqueça a chave do arsenal em algum lugar. Peço perdão por pedir isso.', 'I ask that my mother leave the armory key somewhere and forget it. I ask forgiveness for asking.'),
          }[st.escolhas.promessa] || null), // NOVO (a escolha da manhã volta aqui)
          T('Peço desculpas por ter que roubar o que vou roubar,', 'I ask forgiveness for what I’ll have to steal,'),
          T('corromper o homem que vou corromper,', 'the man I’ll have to corrupt,'),
          T('quebrar uma ordem que deveria ser inquebrável.', 'the order I’ll have to break that was never meant to be broken.'),
          T('E peço de novo, mais baixo, coragem.', 'And I ask again, more quietly, for courage.'), // NOVO
        ],
      },
      depois: [
        (st) => (st.f.sangue
          ? T('Abro os olhos e vejo que apertei as mãos com tanta força que as unhas furaram a pele. As duas sangram. Procuro algo para limpá-las e percebo alguém ajoelhada diante da Juíza.', 'I open my eyes and find I’ve clenched my hands so hard my nails have broken the skin. Both are bleeding. I look for something to clean them with and notice someone kneeling before the Judge.')
          : (st.f.preceN || 0) >= 3
            ? T('Abro os olhos. As unhas deixaram marcas fundas nas palmas, vermelhas, sem sangue. Só então percebo alguém ajoelhada diante da Juíza.', 'I open my eyes. My nails have left deep marks in my palms, red, without blood. Only then do I notice someone kneeling before the Judge.')
            : T('Abro os olhos antes de terminar. A prece fica pela metade, e as mãos, abertas no colo. Só então percebo alguém ajoelhada diante da Juíza.', 'I open my eyes before I finish. The prayer stays half said, and my hands lie open in my lap. Only then do I notice someone kneeling before the Judge.')),
        T('Justine. Ela encerra a própria prece assim que olha para mim, e meu coração dispara.', 'Justine. She ends her own prayer the moment she looks at me, and my heart starts racing.'),
      ] },

    { id: 'b03', zona: 'oratorio', fundo: { img: 'assets/images/oratorio-justine.jpg', kb: 'in', foco: '45% 40%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: 2.2, quente: true,
      texto: [
        T('— Laura — fala baixo, mas sem delicadeza nenhuma.', '— Laura — she says, quietly, but without a trace of softness.'),
        T('— Oi, Justine. — Olho para baixo. É difícil encará-la sabendo que o sonho dela é ser a Mãe-Rainha.', '— Hi, Justine. — I look down. It’s hard to face her knowing her dream is to be Mother-Queen.'),
        T('— Veio pedir lealdade para o seu futuro marido?', '— Come to pray for loyalty to your future husband?'),
        T('Ela sorri torto. A luz do fim de tarde entra pela janela e bate nos lábios dela, perfeitos.', 'She gives me a crooked smile. The late-afternoon light comes through the window and falls on her lips, which are perfect.'),
        (st) => { const a = st.aula || {}; return a.venceu === 'laura' ? (a.laura >= 4 ? T('— Quatro a nada, hoje. Não pense que eu esqueci.', '— Four to nothing, today. Don’t think I’ve forgotten.') : T('— Três a uma, hoje. Não pense que eu esqueci.', '— Three to one, today. Don’t think I’ve forgotten.')) : a.venceu === 'justine' ? T('— Você podia pelo menos fingir que estuda.', '— You could at least pretend to study.') : null; }, // NOVO (a aula volta no oratório)
      ],
      dialogo: { interlocutor: T('Justine', 'Justine'), rodadas: [
        { id: 'j1', opcoes: [
          { id: 'naoquero', afeto: 1, voz: 'naoquero', vozNervosa: 'naoquero-nervosa', txt: T('Você sabe que eu não quero isso. Se eu pudesse, convenceria Dolores a escolher você, não a mim.', 'You know I don’t want this. If I could, I’d convince Dolores to choose you, not me.'),
            txtNervoso: T('Eu não... Você sabe que eu não quero isso. Se eu pudesse, eu... convenceria Dolores a escolher você.', 'I don’t... You know I don’t want this. If I could, I’d... I’d convince Dolores to choose you.'), // NOVO (versão com o peito apertado)
            resposta: [T('— O General-Rei morreu antes dela — ela diz, sem deboche nenhum. — Nós estudamos essa regra a vida inteira, Laura.', '— The General-King died before she did — she says, without a trace of mockery. — We studied that rule our whole lives, Laura.')] }, // canon
          { id: 'coragem', eixo: 'mostra', flag: 'justineDesconfia', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'),  pulso: 3, voz: 'coragem', txt: T('Vim pedir coragem.', 'I came to ask for courage.'),
            resposta: [T('Ela inclina a cabeça.', 'She tilts her head.'), T('— Para casar não precisa de coragem, Laura. Precisa de paciência. Coragem é para quem vai fazer alguma coisa.', '— Marriage doesn’t take courage, Laura. It takes patience. Courage is for someone who’s about to do something.')] }, // NOVO
          { id: 'cala1', silencio: true, resposta: [T('— Não precisa responder. Eu também não responderia.', '— You don’t have to answer. I wouldn’t either.')] }, // NOVO
        ] },
        { id: 'j2', antes: [T('— Venho aqui toda tarde. Sei a lei de cor, sei as Casas, sei a balança. Se a Juíza pesa mesmo, Laura, aqui dentro ela pesou errado.', '— I come here every afternoon. I know the law by heart, I know the Houses, I know the balance. If the Judge truly weighs, Laura, in here she weighed wrong.')], // canon
          opcoes: [
            { id: 'melhor', afeto: 1, quente: true, pulso: 3, voz: 'melhor', vozNervosa: 'melhor-nervosa', txt: T('Você seria a melhor. Sempre foi a melhor aluna, em conhecimento, em oratória, e a mais bela também.', 'You would have been the best. You were always the best student, in knowledge, in speech, and the most beautiful too.'),
              txtNervoso: T('Você seria a melhor. Você é... a mais bela também. E a melhor aluna.', 'You’d be the best. You are... the most beautiful, too. And the best student.'), // NOVO (versão com o peito apertado)
              resposta: [T('O canto da boca dela sobe.', 'The corner of her mouth lifts.'), T('— Cuidado, Laura. Uma Mãe-Rainha não elogia a rival em voz alta.', '— Careful, Laura. A Mother-Queen doesn’t praise her rival out loud.')] }, // canon (fala de Laura) + NOVO (resposta)
            { id: 'pesar', flag: 'justineDesconfia', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'),  voz: 'torneio-nem-comecou', txt: T('O Torneio ainda nem começou.', 'The Tournament hasn’t even started.'),
              resposta: [T('Ela me olha por tempo demais.', 'She looks at me for too long.'), T('— Você fala como quem sabe de alguma coisa.', '— You talk like someone who knows something.')] }, // NOVO
            { id: 'casar', se: (st) => st.peso >= 2, tremida: true, flag: 'justineDesconfia', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'),  peso: -1, pulso: 4, voz: 'casar', txt: T('Eu não vou me casar com ele.', 'I’m not going to marry him.'),
              resposta: [T('Ela para de respirar um instante.', 'She stops breathing for a moment.'), T('— Não diga isso aqui, Laura. A Juíza escuta.', '— Don’t say that here, Laura. The Judge is listening.')] }, // NOVO (só aparece com o peito apertado: a verdade escapa)
            { id: 'cala2', silencio: true, resposta: [T('Ela assente devagar e não pergunta mais nada.', 'She nods slowly and asks nothing more.')] }, // NOVO
          ] },
      ] },
      depois: [T('Ela se levanta e vem na minha direção.', 'She stands and comes toward me.')] },

    { id: 'b04', zona: 'oratorio', quente: true, fundo: { img: 'assets/images/oratorio-de-pe.jpg', kb: 'in', foco: '55% 40%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: 3,
      texto: [T('Meu coração acelera ainda mais.', 'My heart races faster still.')],
      escolha: { id: 'perto', pergunta: T('Justine se aproxima.', 'Justine comes closer.'), opcoes: [
        { id: 'ajoelhada', txt: T('Continuar ajoelhada', 'Stay on my knees'),
          fundo: { video: 'assets/video/oratorio-justine.mp4', img: 'assets/images/oratorio-de-pe.jpg', kb: 'none', foco: '55% 40%', dim: .45, lado: 'dir', clima: 'velas' }, // a cena roda no fundo: o lenço passa para as mãos dela
          resultado: [
            (st) => (st.f.sangue
              ? [T('Continuo ajoelhada. Ela pega minhas mãos e me entrega um lenço.', 'I stay on my knees. She takes my hands and presses a handkerchief into them.'), T('— Uma Mãe-Rainha não pode ter as mãos cortadas, Laura.', '— A Mother-Queen can’t have cut-up hands, Laura.')]
              : (st.f.preceN || 0) >= 3
                ? [T('Continuo ajoelhada. Ela pega minhas mãos e vira as palmas para a luz da janela. Passa o polegar pelas meias-luas que as unhas deixaram, uma por uma, e depois pelos calos.', 'I stay on my knees. She takes my hands and turns the palms to the window light. She runs her thumb over the half-moons my nails left, one by one, and then over the calluses.'), T('— Você reza como quem briga, Laura. Uma Mãe-Rainha não pode ter mãos assim.', '— You pray like you’re fighting, Laura. A Mother-Queen can’t have hands like these.'), T('Ela tira um lenço da manga e fecha meus dedos sobre ele.', 'She takes a handkerchief from her sleeve and closes my fingers around it.')]
              : [T('Continuo ajoelhada. Ela pega minhas mãos e vira as palmas para a luz da janela, devagar. Passa o polegar pelos calos, um por um.', 'I stay on my knees. She takes my hands and turns the palms to the window light, slowly. She runs her thumb over the calluses, one by one.'), T('— Uma Mãe-Rainha não pode ter mãos assim, Laura.', '— A Mother-Queen can’t have hands like these, Laura.'), T('Ela tira um lenço da manga e fecha meus dedos sobre ele.', 'She takes a handkerchief from her sleeve and closes my fingers around it.')]),
          ] }, // canon + NOVO (variação sem sangue)
        { id: 'levantar', afeto: 1, quente: true, eixo: 'mostra', flag: 'levantou', pulso: 4, txt: T('Levantar também', 'Stand up too'),
          fundo: { video: 'assets/video/oratorio-justine-de-pe.mp4', img: 'assets/images/oratorio-de-pe.jpg', kb: 'none', foco: '45% 50%', dim: .45, lado: 'dir', clima: 'velas' },
          resultado: [
            T('Levanto antes que ela chegue. De pé, ficamos da mesma altura, perto o bastante para eu ver a luz da janela nos lábios dela. Ela para. Nenhuma das duas se mexe.', 'I stand before she reaches me. On our feet we’re the same height, close enough for me to see the window light on her lips. She stops. Neither of us moves.'),
            (st) => (st.f.sangue
              ? [T('Então ela pega minhas mãos e me entrega um lenço.', 'Then she takes my hands and presses a handkerchief into them.'), T('— Uma Mãe-Rainha não pode ter as mãos cortadas, Laura.', '— A Mother-Queen can’t have cut-up hands, Laura.')]
              : (st.f.preceN || 0) >= 3
                ? [T('Então ela pega minhas mãos e olha as meias-luas vermelhas que as unhas deixaram nas palmas.', 'Then she takes my hands and looks at the red half-moons my nails left in the palms.'), T('— Você reza como quem briga, Laura.', '— You pray like you’re fighting, Laura.'), T('Ela fecha meus dedos sobre um lenço.', 'She closes my fingers around a handkerchief.')]
              : [T('Então ela pega minhas mãos, passa o polegar pelos calos, um por um, e fecha meus dedos sobre um lenço.', 'Then she takes my hands, runs her thumb over the calluses, one by one, and closes my fingers around a handkerchief.'), T('— Uma Mãe-Rainha não pode ter mãos assim, Laura.', '— A Mother-Queen can’t have hands like these, Laura.')]),
          ] }, // NOVO
        { id: 'esconder', eixo: 'esconde', txt: T('Esconder as mãos na saia', 'Hide my hands in my skirt'),
          fundo: { video: 'assets/video/oratorio-justine-lenco-chao.mp4', img: 'assets/images/oratorio-de-pe.jpg', kb: 'none', foco: '50% 50%', dim: .45, lado: 'dir', clima: 'velas' },
          resultado: [
            (st) => (st.f.sangue
              ? T('Escondo as mãos nas dobras da saia. O sangue mancha o tecido antes que eu consiga fechar os punhos. Ela para a um passo de mim, olha para a mancha, depois para o meu rosto.', 'I hide my hands in the folds of my skirt. The blood stains the cloth before I can close my fists. She stops a step away, looks at the stain, then at my face.')
              : T('Escondo as mãos nas dobras da saia. Ela para a um passo de mim, olha para a saia, depois para o meu rosto.', 'I hide my hands in the folds of my skirt. She stops a step away, looks at the skirt, then at my face.')),
            T('— Eu sei o que tem aí, Laura.', '— I know what’s in there, Laura.'),
            T('Ela tira um lenço da manga, deixa no chão, ao lado do meu joelho, e vai para a porta sem tocar em mim.', 'She takes a handkerchief from her sleeve, leaves it on the floor beside my knee, and goes to the door without touching me.'),
          ] }, // NOVO
      ] } },

    { id: 'b05', zona: 'oratorio', quente: true, fundo: { img: 'assets/images/oratorio-lenco.jpg', kb: 'in', foco: '55% 50%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: 1.6,
      texto: [(st) => (st.escolhas.perto === 'esconder'
        ? T('O lenço está no chão, dobrado.', 'The handkerchief lies on the floor, folded.')
        : T('Justine já está na porta. O lenço está na minha mão.', 'Justine is already at the door. The handkerchief is in my hand.'))], // NOVO
      escolha: { id: 'lenco', pergunta: T('O lenço', 'The handkerchief'), opcoes: [
        { id: 'guardar', afeto: 1, aviso: T('O lenço de Justine vai com Laura.', 'Justine’s handkerchief goes with Laura.'), txt: (st) => (st.escolhas.perto === 'esconder' ? T('Pegar o lenço e guardar num bolso interno do vestido', 'Pick it up and tuck it in an inner pocket of my dress') : T('Guardar o lenço num bolso interno do vestido', 'Tuck it in an inner pocket of my dress')),
          resultado: [T('Guardo o lenço no bolso interno do vestido, junto ao peito. Tem um J bordado no canto, em linha branca, e cheiro de cera de vela.', 'I tuck the handkerchief into the inner pocket of my dress, close to my chest. There’s a J embroidered in one corner, in white thread, and it smells of candle wax.')] }, // NOVO (o J bordado é proposta)
        { id: 'devolver', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'), txt: (st) => (st.escolhas.perto === 'esconder' ? T('Deixar o lenço no chão', 'Leave it on the floor') : T('Chamar Justine e devolver', 'Call Justine back and return it')),
          resultado: [(st) => (st.escolhas.perto === 'esconder'
            ? T('Deixo o lenço onde ela pôs. Quando saio, ele ainda está lá, dobrado, ao lado das velas.', 'I leave the handkerchief where she put it. When I go, it’s still there, folded, beside the candles.')
            : [T('— Justine. O seu lenço.', '— Justine. Your handkerchief.'), T('Ela volta, pega o lenço sem encostar nos meus dedos e vai embora.', 'She comes back, takes it without touching my fingers, and leaves.')])] }, // NOVO
      ] } },

    // ===================================================== III · ANTES DA ALVORADA
    // ===================================================== IV · A MESA (NOVO)
    { id: 'parte-IV', parte: 'IV', zona: 'salao', fundo: { img: 'assets/images/jantar-salao.jpg', alt: 'assets/images/dolores-maos.jpg', kb: 'in', dim: .66, foco: '50% 40%', clima: 'velas' },
      cartao: { num: 'IV', nome: T('A Mesa', 'The Table'), epigrafe: T('Quem serve o vinho escuta tudo. Quem bebe escuta o que quer.', 'Whoever pours the wine hears everything. Whoever drinks it hears what they like.'), fonte: T('dito dos copeiros da Capital Branca', 'a saying among the cupbearers of the White Capital') } }, // NOVO

    { id: 'd01', zona: 'salao', fundo: { img: 'assets/images/jantar-salao.jpg', alt: 'assets/images/dolores-maos.jpg', kb: 'in', dim: .5, foco: '50% 45%', clima: 'velas', lado: 'dir' }, pulso: 1.4, frio: true, capitular: true,
      texto: [
        T('Chego ao salão junto com Justine. Entramos pela mesma porta, uma atrás da outra, e as doze cadeiras já estão ocupadas, menos duas.', 'I reach the hall together with Justine. We come in through the same door, one behind the other, and all twelve chairs are taken except two.'),
        T('Minha mãe pousa a colher.', 'My mother sets down her spoon.'),
        T('— A sopa esfriou esperando as duas.', '— The soup has gone cold waiting for the two of you.'),
      ],
      seq: [
        { escolha: { id: 'atraso', pergunta: T('Minha mãe', 'My mother'), opcoes: [
          { id: 'oratorio', afeto: 1, txt: T('— Estávamos no oratório, mãe.', '— We were in the shrine, Mother.'),
            resultado: [T('Minha mãe olha para Justine, depois para mim.', 'My mother looks at Justine, then at me.'),
              T('— No oratório. — Ela demora um pouco. — Então está perdoado. Sentem.', '— In the shrine. — She takes a moment. — Then you’re forgiven. Sit.')] },
          { id: 'culpa', afeto: 2, quente: true, txt: T('— A culpa é minha, mãe.', '— It’s my fault, Mother.'),
            resultado: [T('— Eu sei que é.', '— I know it is.'),
              T('Justine faz uma reverência curta ao meu lado.', 'Beside me, Justine gives a short curtsy.'),
              T('— Estávamos rezando, Mãe-Rainha. Eu e Laura.', '— We were praying, Mother-Queen. Laura and I.'),
              T('Minha mãe olha de uma para a outra e pega a colher de novo.', 'My mother looks from one of us to the other and picks up her spoon again.'),
              T('— Rezando. Então sentem.', '— Praying. Then sit.')] },
          { id: 'cala', silencio: true,
            resultado: [T('Justine responde antes que o silêncio fique comprido.', 'Justine answers before the silence gets too long.'),
              T('— Estávamos no oratório, Mãe-Rainha. Eu pedi que Laura rezasse comigo.', '— We were in the shrine, Mother-Queen. I asked Laura to pray with me.'),
              T('Ela não pediu nada. Não olha para mim quando diz isso.', 'She didn’t ask me anything. She doesn’t look at me when she says it.'),
              T('— Rezar não é atraso — minha mãe diz. — Sentem.', '— Praying is never late — my mother says. — Sit.')] },
        ] } },
        { texto: [
        T('O jantar é no salão pequeno, que minha mãe chama de pequeno: doze lugares, duas lareiras, as tapeçarias da Ponte de Andrey nas paredes.', 'Dinner is in the small hall, which my mother calls small: twelve places, two hearths, the tapestries of Andrey Bridge on the walls.'),
        T('Ela me sentou à direita de Markus. Do outro lado da mesa, Joseph, e ao lado dele, Justine. Lorde Avellan, o pai dela, fica de pé atrás da cadeira da filha, como se o jantar ainda não tivesse começado.', 'She has seated me on Markus’s right. Across the table, Joseph, and beside him, Justine. Lord Avellan, her father, stands behind his daughter’s chair, as if the dinner hadn’t started yet.'),
        T('Mesmo de pé, Lorde Avellan fala de lã com Lady Hollin desde que chegou. Sir Godric, que lutou contra os Grakh quando meu pai ainda era escudeiro, cochila na ponta da mesa. A Madre Ysolde benze o pão em nome da Juíza e come antes de terminar a bênção.', 'Even standing, Lord Avellan has been talking wool with Lady Hollin since he arrived. Sir Godric, who fought the Grakh when my father was still a squire, dozes at the end of the table. Mother Ysolde blesses the bread in the Judge’s name and eats before she finishes the blessing.'),
        T('Simon ficou na outra ponta, ao lado da Madre Ysolde, sentado bem reto, com as mãos no colo.', 'Simon was put at the other end, beside Mother Ysolde, sitting very straight, hands in his lap.'),
        T('Por baixo da mesa, minha mãe encontra a minha mão, vira a palma para cima e passa o polegar pelos calos, um por um. Depois solta, sem olhar para mim, e pede mais vinho.', 'Under the table, my mother finds my hand, turns the palm up and runs her thumb over the calluses, one by one. Then she lets go, without looking at me, and asks for more wine.'),
        ] },
      ] }, // NOVO · v17: chegam atrasadas

    { id: 'd02', zona: 'salao', fundo: { img: 'assets/images/jantar-joseph.jpg', alt: 'assets/images/dolores-maos.jpg', kb: 'in', dim: .5, foco: '62% 40%', clima: 'velas' }, pulso: 1.6, frio: true,
      texto: [
        T('Joseph conta como abriu a linha dos Grakh na Boca Seca, vinte anos atrás. Antes de cada frase, gira a taça no dedo.', 'Joseph is telling how he broke the Grakh line at the Dry Mouth, twenty years ago. Before every sentence, he spins his cup on his finger.'),
        T('— Três deles, com uma lança só. A lança ficou no terceiro. — A taça gira. — Terminei com a faca.', '— Three of them, with a single spear. The spear stayed in the third. — The cup spins. — I finished it with the knife.'),
        T('No segundo prato, Simon já trocou de lugar para ficar perto dele. Esquece de comer.', 'By the second course, Simon has changed seats to be near him. He forgets to eat.'),
        T('— Dois — diz Sir Godric, de olhos ainda meio fechados. — Eu estava lá. Dois, e o segundo já estava morto.', '— Two — says Sir Godric, his eyes still half shut. — I was there. Two, and the second was already dead.'),
        T('Lady Hollin ri dentro do guardanapo. Joseph ri mais alto que ela.', 'Lady Hollin laughs into her napkin. Joseph laughs louder than she does.'),
        T('— Que idade o senhor tinha no seu primeiro Torneio? — Simon pergunta.', '— How old were you at your first Tournament? — Simon asks.'),
        T('— Dezenove. — Joseph mede Simon de cima a baixo. — Mas o Torneio não é para segundos filhos, rapaz. Segundo filho serve na guarda e agradece.', '— Nineteen. — Joseph looks Simon up and down. — But the Tournament isn’t for second sons, boy. A second son serves in the guard and is grateful for it.'),
        T('Simon baixa os olhos para o prato. Corta a carne em pedaços cada vez menores, até não sobrar nada que dê para cortar.', 'Simon lowers his eyes to his plate. He cuts his meat into smaller and smaller pieces, until there’s nothing left to cut.'),
        T('— E o Torneio já não é o que era — Joseph continua, girando a taça. — Hoje vence quem tem o melhor cavalo e o escudeiro mais caro. A lei do mais forte virou a lei do mais rico.', '— And the Tournament isn’t what it was — Joseph goes on, spinning the cup. — These days the winner is whoever has the best horse and the dearest squire. The law of the strongest has become the law of the richest.'),
      ],
      seq: [
        { pensa: { id: 'lei', quem: T('Joseph', 'Joseph'), t: T('A lei não é sua para rir dela.', 'The law isn’t yours to laugh at.'),
          dizer: { voz: 'jantar-lei', peso: 1, pulso: 3, flag: 'defendeuLei', resultado: [
            T('— A lei diz que vence o melhor. Se o senhor não acredita nela, não devia se inscrever.', '— The law says the best one wins. If you don’t believe in it, you shouldn’t enter.'),
            T('O garfo da minha mãe para no ar. Joseph olha para mim pela primeira vez desde a sopa, e o sorriso dele demora a voltar.', 'My mother’s fork stops in the air. Joseph looks at me for the first time since the soup, and his smile takes a while to come back.'),
            T('— A princesinha tem dentes.', '— The little princess has teeth.'),
            T('— Laura — diz minha mãe. Só o nome.', '— Laura — says my mother. Just the name.'),
            T('Ao meu lado, Markus pousa a faca e vira o rosto para mim.', 'Beside me, Markus sets down his knife and turns his face to me.')] },
          engolir: { resultado: [T('Corto um pedaço de carne e mastigo até não ter mais gosto.', 'I cut a piece of meat and chew until it has no taste left.')] } } },
      ] }, // NOVO

    { id: 'd03', zona: 'salao', fundo: { img: 'assets/images/jantar-markus.jpg', alt: 'assets/images/dolores-maos.jpg', kb: 'in', dim: .5, foco: '50% 45%', clima: 'velas' }, pulso: 1.2,
      texto: [
        T('Markus come pouco e devagar. Toda vez que o copeiro enche a taça dele, Markus agradece pelo nome.', 'Markus eats little and slowly. Every time the cupbearer fills his cup, Markus thanks the man by name.'),
        T('— Obrigado, Tobias.', '— Thank you, Tobias.'),
        T('Tobias serve a nossa mesa desde que eu tinha dez anos. Olho para ele. Tem uma cicatriz de queimadura nas costas da mão, do pulso até os nós dos dedos.', 'Tobias has served our table since I was ten. I look at him. He has a burn scar on the back of his hand, from the wrist to the knuckles.'),
        (st) => ((st.pensas || {}).lei === 'disse'
          ? T('— A senhora acredita mesmo nela — Markus diz, baixo. — Na lei.', '— You truly believe in it — Markus says, quietly. — In the law.')
          : T('— A senhora está calada desde a sopa — Markus diz, baixo.', '— You’ve been quiet since the soup — Markus says, quietly.')),
      ],
      seq: [
        { escolha: { id: 'markus', pergunta: T('Markus', 'Markus'), opcoes: [
          { id: 'devota', voz: 'markus-devota', txt: T('— Acredito. É a única coisa nesta mesa que não está à venda.', '— I do. It’s the only thing at this table that isn’t for sale.'),
            resultado: [T('Markus olha para Lorde Avellan, depois de volta para mim, e não sorri.', 'Markus looks at Lord Avellan, then back at me, and doesn’t smile.'), T('— Não deixe ninguém ouvir isso, alteza.', '— Don’t let anyone hear you say that, Highness.')] },
          { id: 'corte', voz: 'markus-corte', txt: T('— Acredito que o senhor vai vencer. Todo mundo diz.', '— I believe you’ll win. Everyone says so.'),
            resultado: [T('— Todo mundo diz muita coisa.', '— Everyone says a great many things.'), T('Ele volta para o prato.', 'He goes back to his plate.')] },
          { id: 'pergunta', voz: 'markus-pergunta', txt: T('— E o senhor? Por que se inscreveu?', '— And you? Why did you enter?'),
            resultado: [T('— Meu pai perdeu a final para o seu, alteza. Faz vinte e dois anos. Ainda pede para eu contar como foi. Eu quero contar outra coisa.', '— My father lost the final to yours, Highness. Twenty-two years ago. He still asks me to tell him how it went. I want to tell him something else.')] },
        ] } },
        { texto: [T('Passo o pão para ele. Os dedos dele param um instante sobre os meus, na altura dos calos. Ele pega o pão e não comenta, nem nessa hora nem no resto do jantar.', 'I pass him the bread. His fingers pause on mine for an instant, right over the calluses. He takes the bread and makes no remark, not then and not for the rest of the dinner.')] },
      ] }, // NOVO

    { id: 'd04', zona: 'salao', fundo: { img: 'assets/images/jantar-brinde.jpg', alt: 'assets/images/oratorio-justine.jpg', kb: 'in', dim: .5, foco: '25% 40%', clima: 'velas', lado: 'dir' }, pulso: 2.6, frio: true, quente: true,
      texto: [
        T('Lorde Avellan se levanta com a taça. Justine tem a testa dele e mais nada.', 'Lord Avellan stands with his cup. Justine has his forehead and nothing else of him.'),
        T('— Ao Torneio. E ao contrato que se assina depois dele. — Ergue a taça para Joseph. — A Casa Avellan dá a mão de Justine a Sir Joseph, depois do Torneio, com a bênção da Mãe-Rainha.', '— To the Tournament. And to the contract to be signed after it. — He raises his cup to Joseph. — House Avellan gives Justine’s hand to Sir Joseph, after the Tournament, with the Mother-Queen’s blessing.'),
        T('As taças sobem. Justine segura a dela junto do peito e não ergue. Olha para o prato.', 'The cups rise. Justine holds hers against her chest and doesn’t lift it. She looks at her plate.'),
        T('Agora eu sei o que ela pedia à Juíza.', 'Now I know what she was asking the Judge for.'),
      ],
      taca: {
        img: 'assets/images/taca.jpg', alt: 'assets/images/dolores-maos.jpg',
        depois: (st) => (st.taca && st.taca.derramou
          ? [T('O vinho escorre pela borda e mancha a toalha branca até o meu prato. Minha mãe vê. Justine levanta os olhos do prato pela primeira vez, e é para mim.', 'The wine runs over the rim and stains the white cloth all the way to my plate. My mother sees. Justine lifts her eyes from her plate for the first time, and it’s to look at me.')]
          : [T('Ergo a taça junto com os outros. O vinho nem se mexe. As minhas mãos estão frias.', 'I raise my cup with the others. The wine doesn’t even move. My hands are cold.')]),
      },
      seq: [
        { mg: 'taca' },
        { pensa: { id: 'noiva', quem: T('Minha mãe', 'My mother'), t: T('Ela não pode.', 'She can’t.'),
          dizer: { voz: 'jantar-escolher', afeto: 2, peso: 1, pulso: 3.2, flag: 'justineDesconfia', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'), resultado: [
            T('— Ela merecia escolher.', '— She deserved to choose.'),
            T('Ninguém ouviu, eu penso. Depois vejo que todos ouviram. Justine me olha como se eu tivesse derrubado alguma coisa dela no chão.', 'No one heard, I think. Then I see that everyone did. Justine looks at me as if I had knocked something of hers onto the floor.'),
            T('— Ninguém nesta mesa escolheu, Laura — diz minha mãe, sem levantar a voz. — Beba.', '— No one at this table chose, Laura — my mother says, without raising her voice. — Drink.')] },
          engolir: { resultado: [T('Bebo. O vinho desce frio.', 'I drink. The wine goes down cold.')] } } },
      ] }, // NOVO

    { id: 'd05a', zona: 'noite', fundo: { img: 'assets/images/joseph-corredor.jpg', alt: 'assets/images/corredor-noite.jpg', kb: 'in', dim: .5, foco: '55% 40%' }, pulso: 2, frio: true,
      texto: [
        T('Depois do jantar, os convidados saem pelo corredor das tapeçarias. Joseph para para eu passar, e não se afasta o bastante. Os olhos dele descem e sobem devagar, sem pressa nenhuma.', 'After dinner, the guests leave through the tapestry corridor. Joseph stops to let me pass, and doesn’t step back far enough. His eyes go down and up again, slowly, in no hurry at all.'),
      ],
      seq: [
        { pensa: { id: 'joseph', quem: T('Joseph', 'Joseph'), t: T('Não me olhe.', 'Don’t look at me.'),
          dizer: { voz: 'corredor-caminho', pulso: 2.6, resultado: [T('— O senhor está no meu caminho.', '— You’re in my way, sir.'), T('Ele sorri e dá um passo para o lado.', 'He smiles and steps aside.'), T('— Por enquanto, alteza.', '— For now, Highness.')] },
          engolir: { resultado: [T('Baixo a cabeça e passo junto da parede. A tapeçaria raspa no meu ombro.', 'I lower my head and pass along the wall. The tapestry scrapes my shoulder.')] } } },
      ] }, // v17: Joseph no corredor ganha página e imagem

    { id: 'd05', zona: 'noite', fundo: { img: 'assets/images/corredor-noite.jpg', alt: 'assets/images/quarto-cadeira.jpg', kb: 'in', dim: .5, foco: '58% 45%' }, pulso: 2, frio: true,
      texto: [
        T('Justine está na janela do fim do corredor, de costas, com a palma encostada no vidro.', 'Justine is at the window at the end of the corridor, her back to me, her palm pressed to the glass.'),
        (st) => ({ rival: T('— Não me olhe assim, Laura. Ninguém perguntou a você também.', '— Don’t look at me like that, Laura. No one asked you either.'),
          amiga: T('— Não me olhe assim. Você também não escolheu nada. Nós duas sabemos.', '— Don’t look at me like that. You didn’t choose anything either. We both know it.'),
          semnome: [T('Ela não se vira.', 'She doesn’t turn around.'), T('— Fique aqui um pouco. Não diga nada. Só fique.', '— Stay here a while. Don’t say anything. Just stay.')] }[faixa(st)]),
      ],
      seq: [
        { escolha: { id: 'corredor', pergunta: T('Justine', 'Justine'), opcoes: [
          { id: 'ficar', afeto: 2, quente: true, fundo: { img: 'assets/images/vidro-maos.jpg', alt: 'assets/images/corredor-noite.jpg', kb: 'in', dim: .45, foco: '62% 45%', lado: 'esq' }, txt: T('Encostar a mão no vidro, ao lado da dela', 'Rest my hand on the glass, beside hers'),
            resultado: [T('Fico. O vidro está frio. Ficamos as duas com a mão nele até a vela do corredor apagar.', 'I stay. The glass is cold. We both keep our hands on it until the corridor candle goes out.')] },
          { id: 'mes', afeto: 1, flag: 'justineDesconfia', aviso: T('Justine vai lembrar disso.', 'Justine will remember that.'), voz: 'corredor-mes', txt: T('— Ainda falta um mês. Muita coisa acontece em um mês.', '— There’s still a month. A lot can happen in a month.'),
            resultado: [T('Ela vira devagar.', 'She turns slowly.'), T('— O que você está fazendo, Laura?', '— What are you doing, Laura?'), T('Eu não respondo.', 'I don’t answer.')] },
          { id: 'bom', afeto: -2, peso: 1, lagrimas: true, voz: 'corredor-bom', travaSe: (st) => faixa(st) === 'semnome', travaTxt: T('Não para ela. Não agora.', 'Not to her. Not now.'),
            txt: T('— Joseph é um bom cavaleiro.', '— Joseph is a good knight.'),
            resultado: [T('Ela tira a mão do vidro.', 'She takes her hand off the glass.'), T('— É. Todo mundo diz.', '— Yes. Everyone says so.'), T('E vai embora.', 'And she leaves.')] },
        ] } },
      ] }, // NOVO

    { id: 'parte-V', parte: 'V', zona: 'noite', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', dim: .66, foco: '50% 40%', clima: 'poeira-azul' },
      cartao: { num: 'V', nome: T('Antes da Alvorada', 'Before Dawn'), epigrafe: T('Espada sem fio também ensina. Só ensina mais devagar.', 'A blunt sword teaches too. It just teaches slower.'), fonte: T('Anthony, Mestre das Armas da Casa D’Orrose', 'Anthony, Master of Arms of House D’Orrose') } }, // NOVO (epígrafe; voz de Anthony a confirmar)

    { id: 'c01', zona: 'noite', fundo: { img: 'assets/images/laranjal-largo.jpg', kb: 'in', foco: '50% 45%', dim: .55, clima: 'poeira-azul' },
      narracao: (st) => (st.f.arsenalTrancado ? 'assets/audio/narration/line3-trancado.mp3' : 'assets/audio/narration/line3.mp3'), narracaoLang: 'en', capitular: true,
      texto: [
        (st) => (st.f.arsenalTrancado
          ? T('Como faço todas as noites, finjo que durmo até bem antes da alvorada, quando desço até o Pátio das Armas. Lá encontro Simon, na penumbra de sempre, segurando duas espadas de madeira em vez das longas. O arsenal está trancado, como minha mãe prometeu. Juntos caminhamos até o laranjal. Nessa época do ano as árvores ficam todas do lado de fora, então o prédio inteiro fica vazio, esquecido, só nosso.', 'Like every night, I pretend to sleep until well before dawn, when I slip down to the Weapons Yard. There I meet Simon, in the usual half-dark, holding two wooden swords instead of the longswords. The armory is locked, as my mother promised. Together we walk to the orangery. This time of year the trees are all moved outdoors, so the whole building sits empty, forgotten, ours.')
          : T('Como faço todas as noites, finjo que durmo até bem antes da alvorada, quando desço até o Pátio das Armas. Lá encontro Simon, na penumbra de sempre, com as espadas longas de sempre. Juntos caminhamos até o laranjal. Nessa época do ano as árvores ficam todas do lado de fora, então o prédio inteiro fica vazio, esquecido, só nosso.', 'Like every night, I pretend to sleep until well before dawn, when I slip down to the Weapons Yard. There I meet Simon, in the usual half-dark, with the usual longswords. Together we walk to the orangery. This time of year the trees are all moved outdoors, so the whole building sits empty, forgotten, ours.')),
      ] },

    { id: 'c02', zona: 'noite', fundo: { img: 'assets/images/jardim-ronda.jpg', kb: 'in', foco: '50% 40%', dim: .55, retrato: true, clima: 'poeira-azul' }, pulso: 1.4,
      texto: [
        T('Cortamos caminho pelo jardim. O cão velho dos estábulos levanta a cabeça quando passamos. Não late. Nunca late para mim.', 'We cut through the garden. The old dog from the stables lifts its head as we pass. It doesn’t bark. It never barks at me.'),
        T('Perto da estátua da Juíza, a luz de uma tocha aparece no fim da aleia. Passos de bota no cascalho. O guarda da ronda vem na nossa direção, e Simon agarra meu braço.', 'Near the statue of the Judge, torchlight appears at the end of the path. Boots on gravel. The night guard is coming our way, and Simon grabs my arm.'),
        T('Puxo Simon para trás da estátua. A pedra da base está fria nas minhas costas. Ponho o dedo nos lábios.', 'I pull Simon behind the statue. The stone of the base is cold against my back. I put a finger to my lips.'), // NOVO
      ],
      minijogo: 'esconderijo', esconderijo: { video: 'assets/video/esconderijo.mp4', img: 'assets/images/esconderijo.jpg' },
      depois: (st) => (st.f.visto
        ? [ // perdeu o minijogo: o coração vence, e eles correm (Dolores vai saber)
          T('O coração bate tão alto que tenho certeza de que ele escuta. Não aguento. Levanto e corro, e puxo Simon comigo.', 'My heart beats so loud I’m sure he can hear it. I can’t hold it. I get up and run, and pull Simon with me.'),
          T('O cascalho estala debaixo dos nossos pés, alto demais.', 'The gravel cracks under our feet, far too loud.'),
          T('— Quem está aí? — a voz do guarda vem atrás de nós, e a luz da tocha varre o muro um instante depois de passarmos.', '— Who’s there? — the guard’s voice comes behind us, and the torchlight sweeps the wall a moment after we pass.'),
          T('Entramos no laranjal sem ar. Simon ri baixinho, nervoso.', 'We reach the orangery out of breath. Simon laughs under his breath, nervous.'),
          T('— Ele viu alguma coisa. Ele vai contar pra mamãe.', '— He saw something. He’s going to tell mother.'),
        ]
        : [ // venceu: passam impunes
          T('A luz da tocha passa pela balança dela, pelo rosto dela, e segue.', 'The torchlight passes over her scales, over her face, and moves on.'),
          T('O guarda passa a três passos de nós. Sinto o cheiro de resina queimada da tocha. Ele não vira a cabeça.', 'The guard passes three steps from us. I can smell the burning pitch of the torch. He doesn’t turn his head.'),
          T('Quando os passos somem, Simon me olha com a boca aberta. Eu conto até vinte e sigo.', 'When the steps are gone, Simon stares at me with his mouth open. I count to twenty and keep going.'),
        ]) }, // NOVO (a ronda: sempre se escondem; o minijogo decide se o guarda vê)

    { id: 'c03', zona: 'laranjal', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', foco: '50% 45%', dim: .5, clima: 'poeira-azul' }, pulso: (st) => (st.escolhas.lenco === 'guardar' ? 2 : .5),
      texto: [
        T('Poeira flutua clara na primeira luz que entra pelos janelões.', 'Dust drifts pale in the first light coming through the tall windows.'),
        se((st) => st.escolhas.lenco === 'guardar', T('Antes de começar, enrolo o lenço de Justine na palma da mão, por cima da bolha que abriu ontem.', 'Before we start, I wrap Justine’s handkerchief around my palm, over the blister that opened yesterday.')), // NOVO
        se((st) => st.escolhas.lenco === 'guardar', T('Simon aponta minha mão com o queixo.', 'Simon nods at my hand.')),
        se((st) => st.escolhas.lenco === 'guardar', T('— Isso na sua mão tem um J bordado. É da Justine?', '— That thing on your hand has a J stitched on it. Is it Justine’s?')),
        se((st) => st.escolhas.lenco === 'guardar', T('Sinto o rosto esquentar e não respondo.', 'I feel my face go hot, and I don’t answer.')),
        (st) => (st.f.arsenalTrancado
          ? T('— Mamãe brigou com você, Laura? Ela trancou o arsenal inteiro — ele pergunta enquanto aquecemos, ainda trocando golpes de propósito, devagar.', '— Did mother fight with you, Laura? She locked the whole armory — he asks while we warm up, still trading slow blows on purpose.')
          : T('— Mamãe brigou com você, Laura? — ele pergunta enquanto aquecemos, ainda trocando golpes de propósito, devagar.', '— Did mother fight with you, Laura? — he asks while we warm up, still trading slow blows on purpose.')),
        T('— Como ela descobriu?', '— How did she find out?'),
        T('— Espada sem fio ainda deixa marca, irmã. E você não tem sido branda comigo.', '— A blunt sword still leaves a mark, sister. And you haven’t been gentle with me.'),
        T('— É o que você quer? — Rio no meio da frase, sem conseguir evitar. — Ela disse que você, como homem bem alimentado, vai ficar mais forte a cada dia.', '— Is that what you want? — I laugh in the middle of the sentence, unable to help it. — She said that you, being a well-fed man, will get stronger every day.'),
        T('— Está me provocando? — Ele acelera o ritmo dos golpes.', '— Are you provoking me? — He speeds up his strikes.'),
      ] },

    { id: 'c03b', zona: 'laranjal', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', foco: '50% 45%', dim: .5, clima: 'poeira-azul' }, pulso: 1.2,
      texto: [T('— Me mostra o que um homem de catorze anos consegue fazer.', '— Show me what a fourteen-year-old man can do.')],
      vozAuto: 'mostra', vozAtraso: 500 }, // a fala e a voz saem juntas, ao virar a página

    { id: 'c04', zona: 'laranjal', fundo: { video: 'assets/video/laranjal-duelo.mp4', img: 'assets/images/laranjal-cruzado.jpg', kb: 'none', foco: '50% 45%', dim: .5, clima: 'poeira-azul' }, pulso: .5,
      cena: 'assets/video/laranjal-duelo.mp4',
      texto: [
        T('Simon gosta de se vangloriar dizendo que Anthony, o Mestre das Armas, sempre o elogia. Chama até de prodígio. Acho estranho, porque para mim é fácil demais. Só lutei com ele a vida inteira, mas prevejo cada movimento seu sem esforço. Ele tem força de verdade, e mesmo assim nunca me acerta.', 'Simon likes to brag that Anthony, the Master of Arms, always praises him, even calls him a prodigy. I find that strange, because for me it’s far too easy. I’ve only ever fought him, my whole life, and yet I predict his every move without effort. He truly has strength, and he still never lands a hit on me.'),
        T('Os pés dele batem no chão de pedra empoeirado do laranjal vazio em passos largos e previsíveis: primeiro o esquerdo, arrastando de leve, depois o direito, que gira o quadril para ganhar impulso. É um movimento que aprendeu com Anthony. O Mestre das Armas já me ensinou muita coisa através de Simon, sem nunca saber disso.', 'His feet strike the dusty stone floor of the empty orangery in wide, predictable steps: left foot first, dragging slightly, then the right, which turns the hip for momentum. It’s a movement he learned from Anthony. The Master of Arms has taught me a great deal, through Simon, without ever knowing it.'),
        T('Quando o pé esquerdo arrasta, ele vai descer de cima. Quando o ombro direito cai, vem uma estocada reta. Quando os joelhos dobram de repente, ele quer as minhas pernas.', 'When the left foot drags, he’s coming down from above. When the right shoulder drops, a straight thrust is coming. When his knees suddenly bend, he wants my legs.'), // NOVO (ensina o jogo)
      ] },

    { id: 'c05', zona: 'laranjal', fundo: { img: 'assets/images/laranjal-cruzado.jpg', kb: 'out', foco: '50% 45%', dim: .6, clima: 'poeira-azul' }, pulso: 1,
      texto: [T('Simon ergue a espada. Eu espero.', 'Simon raises his sword. I wait.')], // NOVO
      minijogo: 'duelo', duelo: { fundo: 'assets/images/laranjal-lua.jpg' },
      depois: (st) => {
        const r = st.duelo && st.duelo.resultado;
        if (r === 'deixou') return [
          T('Baixo a espada. A dele encosta no meu ombro, de leve, e fica ali.', 'I lower my sword. His touches my shoulder, lightly, and stays there.'),
          T('— Você baixou a espada. — Ele joga a espada dele no chão. — Você baixou a espada, Laura!', '— You lowered your sword. — He throws his own on the floor. — You lowered your sword, Laura!'),
          T('— Escorreguei.', '— I slipped.'),
          T('— Não escorregou. Eu vi. Se um dia eu ganhar de você, quero ganhar de verdade.', '— You didn’t slip. I saw. If I ever beat you, I want to beat you for real.'),
          T('Fico olhando para o chão até ele pegar a espada de volta.', 'I keep my eyes on the floor until he picks the sword back up.'),
        ]; // NOVO
        const fim = [
          T('— Eu sei que você nunca acredita — ele fala, exausto. — Mas você é melhor que qualquer aluno, irmã. Até os mais velhos.', '— I know you never believe it — he says, exhausted. — But you’re better than any student, sister. Even the older ones.'),
        ]; // canon (a resposta de Laura vira a página seguinte, com a voz)
        if (r === 'marcas') return [
          T('Ganho. Mas ele me acerta no antebraço, e amanhã vai ter uma marca roxa onde a manga não cobre.', 'I win. But he catches my forearm, and tomorrow there’ll be a purple mark where the sleeve doesn’t reach.'), // NOVO
          T('— Hoje eu te acertei! — Simon ri, sem fôlego.', '— I hit you today! — Simon laughs, out of breath.'), ...fim];
        return [
          T('Inclino o tronco para a esquerda, a lâmina passa rente à minha cintura, e aproveito o movimento para girar o corpo e encostar minha espada na costela exposta dele.', 'I lean my torso to the left, the blade passes close along my waist, and I use the motion to spin and set my own sword against his exposed ribs.'), ...fim]; // canon
      } },

    { id: 'c05b', zona: 'laranjal', se: (st) => !!(st.duelo && st.duelo.resultado && st.duelo.resultado !== 'deixou'),
      fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', foco: '60% 45%', dim: .55, clima: 'poeira-azul' }, pulso: .6,
      texto: [T('— Espero que você esteja certo, irmãozinho. Vou precisar.', '— I hope you’re right, little brother. I’m going to need to be.')],
      vozAuto: 'vou-precisar', vozAtraso: 500 }, // canon

    { id: 'c06', zona: 'laranjal', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', foco: '60% 45%', dim: .55, clima: 'poeira-azul' }, pulso: 1,
      texto: [
        T('Simon senta no chão, as costas na parede, ainda ofegante, e me olha com uma cara que eu conheço.', 'Simon sits on the floor, back against the wall, still panting, and looks at me with a face I know.'),
        T('— Por que você treina tanto, Laura? Rainha não luta.', '— Why do you train so much, Laura? Queens don’t fight.'),
      ], // NOVO
      escolha: { id: 'simon', pergunta: T('A pergunta de Simon', 'Simon’s question'), opcoes: [
        { id: 'verdade', aviso: T('Simon vai lembrar disso.', 'Simon will remember that.'), eixo: 'mostra', flag: 'contou', peso: -1, voz: 'torneio', vozAtraso: 500, txt: T('Contar a verdade', 'Tell him the truth'),
          resultado: [
            T('— Porque daqui a um mês eu vou lutar no Torneio Real.', '— Because in a month I’m going to fight in the Royal Tournament.'),
            T('Ele me olha um tempo. Depois cai na gargalhada, tão alto que eu preciso tapar a boca dele com a mão.', 'He looks at me for a while. Then he bursts out laughing, so loud I have to cover his mouth with my hand.'),
            T('— E eu vou ser a Mãe-Rainha! — ele diz por entre os meus dedos.', '— And I’ll be the Mother-Queen! — he says through my fingers.'),
            T('Rio também. O peito, por dentro, fica leve pela primeira vez no dia.', 'I laugh too. Inside my chest, it goes light for the first time all day.'),
          ] }, // NOVO
        { id: 'mentira', lagrimas: true, aviso: T('Simon vai lembrar disso.', 'Simon will remember that.'), peso: 1, txt: T('Dizer que a esgrima acalma', 'Say that fencing calms me'),
          txtNervoso: T('Dizer que a esgrima acalma, rápido demais', 'Say that fencing calms me, too fast'),
          resultadoNervoso: [
            T('— Me acalma. Já disse. Me acalma.', '— It calms me. I told you. It calms me.'),
            T('Falo rápido demais. Simon franze a testa e fica me olhando, esperando o resto. Viro de costas para guardar as espadas antes que ele pergunte de novo.', 'I say it too fast. Simon frowns and keeps looking at me, waiting for the rest. I turn my back to put the swords away before he can ask again.'),
          ], // NOVO (versão com o peito apertado)
          resultado: [
            T('— Já disse. Me acalma.', '— I told you. It calms me.'),
            T('Ele dá de ombros e não pergunta mais. Viro de costas para guardar as espadas e fico ali mais tempo do que preciso.', 'He shrugs and doesn’t ask again. I turn my back to put the swords away and stay there longer than I need to.'),
          ] }, // NOVO
        { id: 'ataque', aviso: T('Simon vai lembrar disso.', 'Simon will remember that.'), txt: T('Atacar em vez de responder', 'Attack instead of answering'),
          resultado: [
            T('Em vez de responder, ataco. Ele grita, rola para o lado, levanta rindo e se defende.', 'Instead of answering, I attack. He yelps, rolls aside, gets up laughing and defends himself.'),
            T('Não pergunta de novo.', 'He doesn’t ask again.'),
          ] }, // NOVO
      ] } },

    { id: 'c07', zona: 'laranjal', fundo: { video: 'assets/video/brancarda.mp4', img: 'assets/images/brancarda.jpg', kb: 'none', foco: '75% 60%', dim: .45 }, efeito: { flag: 'brancarda' }, pulso: (st) => (st.f.visto ? 2 : .4),
      texto: [
        T('Simon vai na frente, para não chegarmos juntos. Fico para trás guardando as espadas no esconderijo, atrás das prateleiras vazias dos vasos.', 'Simon goes ahead, so we don’t arrive together. I stay behind to hide the swords, behind the empty shelves where the pots go.'), // NOVO
        se((st) => st.f.visto, T('Na porta do laranjal, na poeira, há marcas de bota maiores que as de Simon. Não estavam lá quando chegamos.', 'At the orangery door, in the dust, there are boot prints bigger than Simon’s. They weren’t there when we arrived.')), // NOVO (gancho)
        T('Calço as botas na porta. No primeiro passo, piso em alguma coisa macia entre duas lajes. Recolho o pé.', 'I pull my boots on at the door. On the first step, I tread on something soft between two flagstones. I lift my foot.'),
        T('Uma brancarda, quatro pétalas brancas, brotando direto da pedra. Amassada, e já se levantando de novo. Me abaixo. Tem cheiro de mel fraco e de pedra molhada.', 'A whitebloom, four white petals, growing straight out of the stone. Crushed, and already rising again. I crouch. It smells of faint honey and wet stone.'),
        T('Arranco e guardo no bolso.', 'I pick it and put it in my pocket.'),
      ] }, // NOVO (Brancarda plantada; todo leitor a vê)

    { id: 'c08', zona: 'quarto', fundo: { img: 'assets/images/quarto-cadeira.jpg', kb: 'in', foco: '40% 55%', dim: .5, lado: 'dir' }, fim: true,
      pulso: (st) => (st.duelo && st.duelo.sofridos > 0 ? 2.4 : st.peso >= 3 ? 1.5 : .3), // as marcas do duelo aceleram o coração
      texto: [
        T('Volto para o quarto antes do primeiro sino. A cadeira está virada para a janela, do jeito que sempre fica.', 'I’m back in my room before the first bell. The chair is turned toward the window, the way it always is.'),
        se((st) => st.f.brancarda, T('Ponho a brancarda dentro do livro de etiqueta, entre duas páginas que nunca vou reler.', 'I press the whitebloom inside the etiquette book, between two pages I’ll never read again.')),
        (st) => (st.escolhas.lenco === 'guardar'
          ? T('Desenrolo da mão o lenço de Justine. A bolha abriu por baixo dele: no canto, ao lado do J, uma mancha vermelha.', 'I unwind Justine’s handkerchief from my hand. The blister opened under it: in the corner, beside the J, a red stain.')
          : (st.duelo && st.duelo.maos)
            ? T('A bolha da palma abriu de novo. Lavo a mão na bacia, e a água fica rosada.', 'The blister on my palm has opened again. I wash my hand in the basin, and the water turns pink.')
            : null), // NOVO (o lenço protegeu a mão no duelo; sem ele, a bolha abre)
        (st) => {
          const n = st.duelo ? st.duelo.sofridos || 0 : 0;
          if (n >= 2) return [
            T('Tiro a camisa devagar, perto da vela. No ombro e no antebraço, as marcas de Simon já estão escurecendo.', 'I take my shirt off slowly, near the candle. On my shoulder and my forearm, Simon’s marks are already darkening.'),
            T('Minha mãe confere de novo em três dias. Conto quanto tempo um roxo leva para amarelar, e não dá. O coração dispara, e eu deixo a manga comprida separada em cima da cadeira.', 'My mother checks again in three days. I count how long a bruise takes to turn yellow, and it isn’t enough. My heart races, and I set the long-sleeved dress aside on the chair.'),
          ];
          if (n === 1) return [
            T('Tiro a camisa devagar, perto da vela. No antebraço, a marca de Simon já está escurecendo.', 'I take my shirt off slowly, near the candle. On my forearm, Simon’s mark is already darkening.'),
            T('Uma manga comprida esconde. Se minha mãe não puxar a manga. O coração acelera só de pensar nas mãos dela.', 'A long sleeve hides it. If my mother doesn’t pull the sleeve. My heart speeds up just thinking of her hands.'),
          ];
          return null;
        },
        (st) => (st.f.registro
          ? [T('Conto nos dedos os dias até o oficial do Registro vir buscar os mantos de Gideon. Nove.', 'I count on my fingers the days until the Registry officer comes for Gideon’s cloaks. Nine.'), T('Depois, os dias até o Torneio. Trinta. Conto de novo e dá o mesmo.', 'Then the days to the Tournament. Thirty. I count again and get the same.')]
          : T('Conto nos dedos os dias até o Torneio. Trinta. Conto de novo e dá o mesmo.', 'I count the days to the Tournament on my fingers. Thirty. I count again and get the same.')),
        se((st) => (st.engoliu || []).length >= 2, T('Quando apago a vela, a garganta ainda dói.', 'When I blow out the candle, my throat still aches.')), // NOVO (o que ela engoliu hoje)
        (st) => (st.peso >= 3 || (st.duelo && st.duelo.sofridos >= 2)
          ? T('Deito de lado, depois do outro, depois de costas. Quando o sino bate longe, meus olhos já estão fechando.', 'I lie on one side, then the other, then on my back. When the bell rings far away, my eyes are already closing.')
          : st.peso === 0
            ? T('Deito sem tirar a poeira dos pés e durmo antes de o sino bater.', 'I lie down without brushing the dust off my feet and fall asleep before the bell.')
            : T('Deito de costas e fico olhando o teto até os olhos fecharem sozinhos.', 'I lie on my back and watch the ceiling until my eyes close on their own.')),
      ] }, // NOVO (termina dormindo: o Cap. III é quase um sonho de infância)
  ],

  // ---------------------------------------------------------------- o que este capítulo deixa para os próximos
  estadoFinal: (st) => ({
    peso: st.peso, perfil: st.perfil || {},
    maos: st.escolhas.maos || null, promessa: st.escolhas.promessa || null, perguntouOutro: !!st.f.perguntouOutro,
    rotas: st.f.rotas || [], registro: !!st.f.registro, tentativasDuelo: st.tentativas || 0, nervosas: st.nervosas || {},
    prece: st.f.preceN || 0, sangue: !!st.f.sangue,
    justine: { perto: st.escolhas.perto || null, desconfia: !!st.f.justineDesconfia, lenco: st.escolhas.lenco || null, afeto: afeto(st), faixa: faixa(st), noiva: 'joseph' },
    ronda: st.escolhas.ronda || null, visto: !!st.f.visto, esconderijo: st.esconderijo || null, pontos: st.pontos || null,
    duelo: st.duelo || null, marca: !!(st.duelo && st.duelo.sofridos),
    simon: st.escolhas.simon || null, brancarda: !!st.f.brancarda, arsenalTrancado: !!st.f.arsenalTrancado,
    aula: st.aula ? { venceu: st.aula.venceu || null, laura: st.aula.laura || 0, justine: st.aula.justine || 0, leu: st.aula.leu || [], olhouJustine: !!st.f.olhouJustine } : null,
    lumae: lumae(), viuMerrow: !!st.f.viuMerrow, engoliu: st.engoliu || [],
    jantar: { lei: (st.pensas || {}).lei || null, markus: st.escolhas.markus || null, brinde: (st.pensas || {}).noiva || null, derramou: !!(st.taca && st.taca.derramou), joseph: (st.pensas || {}).joseph || null, corredor: st.escolhas.corredor || null, defendeuLei: !!st.f.defendeuLei },
    escolhas: st.escolhas,
  }),

  // ---------------------------------------------------------------- tela final
  resumo: (st, lang) => {
    const pt = lang !== 'en', L = (a, b) => (pt ? a : b);
    const frase = st.peso <= 0 ? L('Laura dorme antes do sino.', 'Laura is asleep before the bell.')
      : st.peso <= 2 ? L('O peito de Laura demora a soltar.', 'Laura’s chest is slow to loosen.')
        : L('Laura vira na cama até o sino.', 'Laura tosses in bed until the bell.');
    const notas = [];
    const pr = st.escolhas.promessa;
    notas.push(pr === 'recusar' ? L('Dolores trancou o arsenal e guarda a chave.', 'Dolores locked the armory and keeps the key.') : pr === 'calar' ? L('Dolores tomou o silêncio da filha por palavra.', 'Dolores took her daughter’s silence as her word.') : L('Dolores acredita na promessa da filha.', 'Dolores believes her daughter’s promise.'));
    notas.push(st.f.justineDesconfia ? L('Justine desconfia de alguma coisa.', 'Justine suspects something.') : st.escolhas.perto === 'levantar' ? L('Justine ficou perto. Nenhuma das duas disse nada.', 'Justine came close. Neither of them said anything.') : st.escolhas.perto === 'esconder' ? L('Justine saiu sem tocar em Laura.', 'Justine left without touching Laura.') : L('Entre Laura e Justine, tudo como sempre foi.', 'Between Laura and Justine, everything as it always was.'));
    if (st.f.visto) notas.push(L('Um guarda viu duas sombras no jardim.', 'A guard saw two shadows in the garden.'));
    const a = st.aula || {};
    if (a.venceu) notas.push(a.venceu === 'laura' ? L(`Laura venceu Justine na aula, ${a.laura} a ${a.justine}.`, `Laura beat Justine in the lesson, ${a.laura} to ${a.justine}.`) : a.venceu === 'empate' ? L('Empate na aula. Justine não gostou.', 'A tie in the lesson. Justine didn’t like it.') : L('Justine venceu a aula. De novo.', 'Justine won the lesson. Again.'));
    notas.push(L('Justine será dada a Joseph depois do Torneio.', 'Justine is to be given to Joseph after the Tournament.'));
    const pz = st.pensas || {};
    if (pz.lei) notas.push(pz.lei === 'disse' ? L('À mesa, Laura defendeu a lei em voz alta.', 'At the table, Laura defended the law out loud.') : L('À mesa, Laura engoliu o que pensava da lei.', 'At the table, Laura swallowed what she thought of the law.'));
    if (st.escolhas.markus) notas.push(L('Markus viu os calos de Laura e não disse nada.', 'Markus saw Laura’s calluses and said nothing.'));
    if (st.escolhas.corredor) notas.push({ rival: L('Justine ainda vê Laura como rival.', 'Justine still sees Laura as a rival.'), amiga: L('Justine e Laura dividem um segredo que nenhuma das duas disse.', 'Justine and Laura share a secret neither has spoken.'), semnome: L('Ficaram as duas na janela até a vela apagar.', 'The two of them stayed at the window until the candle went out.') }[st.escolhas.corredor === 'ficar' && faixa(st) === 'semnome' ? 'semnome' : faixa(st) === 'semnome' ? 'amiga' : faixa(st)]);
    const eng = (st.engoliu || []).length;
    if (eng) notas.push(eng === 1 ? L('O que Laura engoliu hoje vai sair na hora errada.', 'What Laura swallowed today will come out at the wrong moment.') : L(`Laura engoliu ${eng} coisas hoje. Alguma delas vai sair na hora errada.`, `Laura swallowed ${eng} things today. One of them will come out at the wrong moment.`));
    const d = st.duelo ? st.duelo.resultado : null;
    const linhas = [
      { id: 'promessa', opcao: pr, q: L('A promessa à mãe', 'The promise to her mother'), a: { prometer: L('Prometeu', 'Promised'), calar: L('Ficou calada', 'Kept silent'), recusar: L('Recusou', 'Refused') }[pr] || '—' },
      { id: 'aula', opcao: a.venceu, q: L('A aula', 'The lesson'), a: { laura: L('Venceu Justine', 'Beat Justine'), empate: L('Empatou com Justine', 'Tied with Justine'), justine: L('Justine venceu', 'Justine won') }[a.venceu] || '—' },
      { id: 'lenco', opcao: st.escolhas.lenco, q: L('O lenço de Justine', 'Justine’s handkerchief'), a: st.escolhas.lenco === 'guardar' ? L('Guardou no bolso do vestido', 'Kept it in her dress pocket') : st.escolhas.perto === 'esconder' ? L('Deixou no chão', 'Left it on the floor') : L('Devolveu', 'Gave it back') },
      { id: 'pensa_noiva', opcao: pz.noiva, q: L('O brinde do noivado', 'The betrothal toast'), a: pz.noiva === 'disse' ? L('Disse que Justine merecia escolher', 'Said Justine deserved to choose') : pz.noiva === 'engoliu' ? L('Engoliu e bebeu', 'Swallowed it and drank') : '—' },
      { id: 'corredor', opcao: st.escolhas.corredor, q: L('Justine na janela', 'Justine at the window'), a: { ficar: L('Ficou ao lado dela', 'Stayed beside her'), mes: L('Disse que muita coisa acontece em um mês', 'Said a lot can happen in a month'), bom: L('Disse que Joseph é um bom cavaleiro', 'Said Joseph is a good knight') }[st.escolhas.corredor] || '—' },
      { id: 'ronda', opcao: st.escolhas.ronda, q: L('O guarda da ronda', 'The night guard'), a: st.escolhas.ronda === 'descobertos' ? L('O coração venceu; correram', 'Her heart won; they ran') : L('Passaram sem ser vistos', 'Got past unseen') },
      { id: 'duelo', opcao: d, q: L('O duelo com Simon', 'The duel with Simon'), a: { limpo: L('Venceu sem ser tocada', 'Won without being touched'), marcas: L('Venceu, com uma marca no braço', 'Won, with a mark on her arm'), deixou: L('Deixou Simon ganhar', 'Let Simon win'), perdeu: L('Perdeu', 'Lost') }[d] || '—' },
      { id: 'simon', opcao: st.escolhas.simon, q: L('A pergunta de Simon', 'Simon’s question'), a: { verdade: L('Contou a verdade, e ele riu', 'Told the truth, and he laughed'), mentira: L('Mentiu', 'Lied'), ataque: L('Atacou em vez de responder', 'Attacked instead of answering') }[st.escolhas.simon] || '—' },
    ];
    return { frase, notas, linhas };
  },
};
