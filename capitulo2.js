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

window.LIVRO_UI = {
  pt: { parte: 'Parte', prox: 'Próxima', fim: 'Encerrar o capítulo', voltar: '← Voltar', ouvir: 'Ouvir Laura', cena: '▶ Ver a cena', oque: 'O que Laura faz?', decida: 'Decida', decidir: 'Decidir', escolheu: 'Você escolheu:', resp: 'Responder a', silencio: 'ficar em silêncio', silencioR: 'Silêncio', momento: 'Momento de jogo',
    mg: { olhar: 'Olhar sem se mexer', duelo: 'Ler Simon', esconderijo: 'Prender o coração' },
    dica: { olhar: 'Gideon está medindo e Laura não pode virar a cabeça. Ela tem quatro olhares antes de ele terminar.', duelo: 'Simon avisa com o corpo antes de cada golpe. Leia, desvie, e só toque quando ele errar.', esconderijo: 'O guarda vem pela aleia. O coração de Laura bate alto demais. Acompanhe cada batida para acalmá-lo, e prenda o fôlego quando a luz chegar.', preceT: 'Toque e segure. Solte quando quiser parar de rezar.', preceK: 'Segure o botão ou a barra de espaço. Solte quando quiser parar de rezar.' },
    olhares: (n) => (n === 1 ? 'resta 1 olhar' : `restam ${n} olhares`), deslize: 'Deslize para ver a sala inteira',
    coverEye: 'As Quatro Vontades · Livro I · Capítulo II', coverLede: 'Leia. Decida por Laura. E, no laranjal, lute.', coverGo: 'Entrar na Casa D’Orrose', coverCont: 'Continuar de onde parei', coverRestart: 'Começar do início', coverHint: 'Use fones. Avance com o botão, com a seta → ou deslizando para o lado.',
    confirm: 'Recomeçar o capítulo? Suas escolhas serão apagadas.', capN: 'Capítulo II', fimCap: 'Fim do Capítulo II', ficou: 'O que ficou atrás do peito', suas: 'O que você escolheu', reler: 'Reler e escolher diferente', mesmo: (p) => `${p}% dos leitores fizeram o mesmo`,
    pontos: 'Pontuação do capítulo', jornada: 'Jornada (Capítulos I e II)', posicao: (p, n) => `${p}º de ${n} leitores`, ptsDuelo: 'O duelo', ptsEsconde: 'O esconderijo', ptsCap1: 'Capítulo I (o hino do gelo)', semCap1: 'Jogue o Capítulo I neste navegador para somar a jornada.',
  },
  en: { parte: 'Part', prox: 'Next', fim: 'Close the chapter', voltar: '← Back', ouvir: 'Listen to Laura', cena: '▶ Watch the scene', oque: 'What does Laura do?', decida: 'Decide', decidir: 'Decide', escolheu: 'You chose:', resp: 'Answer', silencio: 'stay silent', silencioR: 'Silence', momento: 'Moment of play',
    mg: { olhar: 'Look without moving', duelo: 'Read Simon', esconderijo: 'Hold your heart' },
    dica: { olhar: 'Gideon is measuring and Laura can’t turn her head. She has four looks before he finishes.', duelo: 'Simon warns you with his body before every strike. Read it, dodge, and only touch him when he misses.', esconderijo: 'The guard is coming down the path. Laura’s heart is beating too loud. Keep time with every beat to calm it, and hold your breath when the light arrives.', preceT: 'Touch and hold. Let go when you want to stop praying.', preceK: 'Hold the button or the space bar. Let go when you want to stop praying.' },
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
  proximo: { titulo: 'Capítulo III · O Cavaleiro', tituloEn: 'Chapter III · The Knight', url: 'https://marcelomartinsjorge.github.io/the4willschapter3V2/' },

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
        T('E pela milésima vez estou aqui, desconfortável, a respiração presa, enquanto o senhor alfaiate faz seu trabalho. Não posso virar a cabeça. Os olhos, posso.',
          'And for the thousandth time I’m here, uncomfortable, holding my breath, while the tailor does his work. I can’t turn my head. My eyes, I can.'), // NOVO (2ª e 3ª frases)
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
            texto: [T('Do parapeito até o telhado da biblioteca, um salto de um metro. As telhas desse lado são novas. Não escorregam.', 'From the sill to the library roof, a one-meter jump. The tiles on that side are new. They don’t slip.')] }, // canon + NOVO
          { id: 'vinha', rota: 'vinha', x: 75, y: 18, w: 11, h: 22, rotulo: T('O muro', 'The wall'),
            texto: [T('No muro do outro lado, a vinha-virgem. Os galhos têm a grossura do meu pulso e aguentam meu peso até o chão. Dali é só achar um cavalo.', 'On the far wall, the ivy. The branches are as thick as my wrist and hold my weight to the ground. From there, I only need a horse.')] }, // canon + NOVO
          { id: 'porta', flag: 'viuPorta', x: 5, y: 50, w: 9, h: 56, rotulo: T('A porta', 'The door'),
            texto: [T('A porta do corredor. A dobradiça de baixo range quando a porta abre além da metade. Minha mãe nunca abre só até a metade.', 'The door to the corridor. The lower hinge creaks when it opens past halfway. My mother never opens it only halfway.')] }, // NOVO
          { id: 'vestido', flag: 'viuVestido', x: 93, y: 40, w: 11, h: 46, rotulo: T('O manequim', 'The dress form'),
            texto: [T('No manequim, o vestido com os adornos de esmeralda. Gideon cortou o tecido nas minhas medidas da semana passada. O vestido já tem a minha forma, e eu ainda nem entrei nele.', 'On the dress form, the gown with the emerald trim. Gideon cut it to last week’s measurements. The gown already has my shape, and I haven’t even stepped into it.')] }, // NOVO
          { id: 'mesa', flag: 'registro', x: 76, y: 80, w: 16, h: 16, rotulo: T('A mesa de Gideon', 'Gideon’s table'),
            texto: [T('Na mesa de Gideon, entre as sedas, uma carta aberta com o selo do Registro do Torneio. Encomenda de mantos para os arautos. Embaixo do selo, o nome do oficial que assina as inscrições. Leio duas vezes.', 'On Gideon’s table, among the silks, an open letter with the seal of the Tournament Registry. An order of cloaks for the heralds. Under the seal, the name of the officer who signs the entries. I read it twice.')] }, // NOVO (o oficial que ela vai subornar)
        ],
      },
      depois: [] },

    { id: 'a03', zona: 'alfaiataria', fundo: { video: 'assets/video/alfaiataria-medidas.mp4', img: 'assets/images/laura-rosto.jpg', kb: 'none', foco: '50% 30%', dim: .45, lado: 'dir' }, pulso: 1,
      cena: 'assets/video/alfaiataria-medidas.mp4',
      texto: [
        (st) => (['janela', 'telhado', 'vinha'].every((r) => rotas(st).includes(r))
          ? T('Vinte passos, um metro, a vinha até o chão, um cavalo. Não seria problema desaparecer por Redom, se todo mundo não soubesse quem eu sou. A filha da Mãe-Rainha.', 'Twenty steps, one meter, the ivy to the ground, a horse. It wouldn’t be hard to vanish into Redom, if everyone didn’t know exactly who I am. The Mother-Queen’s daughter.')
          : T('O resto do caminho eu sei de cor, mesmo sem olhar. Não seria problema desaparecer por Redom, se todo mundo não soubesse quem eu sou. A filha da Mãe-Rainha.', 'The rest of the way I know by heart, even without looking. It wouldn’t be hard to vanish into Redom, if everyone didn’t know exactly who I am. The Mother-Queen’s daughter.')),
        T('É também a milésima vez que traço esse plano de fuga. Casar e dar filhos a um nobre desconhecido é um pesadelo que a cada dia chega mais perto de virar realidade. Fui preparada a vida inteira para este dia, e mesmo assim não estou preparada. Tento me recompor, sinto os olhos se encherem de lágrimas.',
          'It’s also the thousandth time I’ve traced this escape plan. Marrying and bearing children for a nobleman I’ve never met is a nightmare that edges closer to real with every day. I was raised my whole life for this day, and even so I’m not ready. I try to compose myself, and feel my eyes filling with tears.'),
      ] },

    { id: 'a04', zona: 'alfaiataria', fundo: { img: 'assets/images/alfaiate-reverencia.jpg', kb: 'out', foco: '40% 40%', dim: .5, lado: 'dir' }, pulso: .8,
      texto: [
        T('— Ah — o alfaiate se afasta e me olha dos pés à cabeça. — Você vai ser a Mãe-Rainha mais bela da história. Sem dúvida, o vestido com os adornos de esmeralda é a melhor escolha. Combina com seus olhos esverdeados, e o dourado do seu cabelo fica ainda mais vivo ao lado dele.',
          '— Ah — the tailor steps back and looks me over, head to foot. — You’ll be the most beautiful Mother-Queen in history. No question, the gown with the emerald trim is the finest choice. It matches your green eyes, and the gold in your hair looks brighter still beside it.'),
        T('Respondo com um bocejo. Talvez seja instinto, para justificar os olhos marejados. Mas complemento:', 'I answer with a yawn. Maybe it’s instinct, to explain away the wet eyes. But I add:'),
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
        { id: 'prometer', peso: 2, voz: 'prometo', vozAtraso: 500, txt: T('Prometer', 'Promise'),
          resultado: [
            T('Prometo. Odeio mentir. Me faz mal, um peso físico atrás do peito, e desta vez as lágrimas finalmente escorrem pelo rosto.', 'I promise. I hate lying. It costs something physical, a weight behind my ribs, and this time the tears finally spill down my face.'),
            T('— Você vai ser muito feliz, minha filha. Markus vai vencer o Torneio, com certeza. É um homem honrado. Vocês vão governar melhor do que eu e seu falecido pai.', '— You’ll be very happy, my daughter. Markus will win the Tournament, without question. He’s an honorable man. The two of you will govern better than your late father and I ever did.'),
          ] }, // canon
        { id: 'calar', peso: 1, txt: T('Não dizer nada', 'Say nothing'),
          resultado: [
            T('Não digo nada. Ela segura meu queixo e espera, e o silêncio fica comprido demais para nós duas.', 'I say nothing. She holds my chin and waits, and the silence grows too long for both of us.'),
            T('— Uma Mãe-Rainha também promete calada, Laura. Vou tomar o seu silêncio como palavra.', '— A Mother-Queen can promise in silence too, Laura. I’ll take yours as your word.'),
            T('Engulo em seco. As lágrimas escorrem do mesmo jeito.', 'I swallow hard. The tears come anyway.'),
            T('— Você vai ser muito feliz, minha filha. Markus vai vencer o Torneio, com certeza. É um homem honrado. Vocês vão governar melhor do que eu e seu falecido pai.', '— You’ll be very happy, my daughter. Markus will win the Tournament, without question. He’s an honorable man. The two of you will govern better than your late father and I ever did.'),
          ] }, // NOVO
        { id: 'recusar', eixo: 'mostra', flag: 'arsenalTrancado', pulso: 3, voz: 'nao-posso-prometer', vozAtraso: 500, txt: T('Recusar', 'Refuse'),
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
      quieto: { id: 'outro', espera: 4, eixo: 'mostra', flag: 'perguntouOutro',
        fala: T('Mãe. E se outro vencer?', 'Mother. What if someone else wins?'),
        resposta: T('Então você se casa com outro, minha filha. É assim que Redom continua de pé.', 'Then you marry someone else, my daughter. That’s how Redom stays standing.'),
        depois: [(st) => (st.f.viuPorta ? T('A dobradiça de baixo range quando ela sai, como eu sabia que ia ranger.', 'The lower hinge creaks as she leaves, the way I knew it would.') : T('A porta fecha atrás dela.', 'The door closes behind her.'))],
        seCalar: [(st) => (st.f.viuPorta ? T('A dobradiça de baixo range quando ela sai, como eu sabia que ia ranger.', 'The lower hinge creaks as she leaves, the way I knew it would.') : T('A porta fecha atrás dela.', 'The door closes behind her.'))] } }, // NOVO

    // ===================================================== II · O ORATÓRIO
    { id: 'parte-II', parte: 'II', zona: 'oratorio', fundo: { img: 'assets/images/oratorio-estatuas.jpg', kb: 'in', dim: .6, foco: '50% 20%', retrato: true, clima: 'velas' },
      cartao: { num: 'II', nome: T('O Oratório', 'The Shrine'), epigrafe: T('A Juíza pesa. O Cavaleiro carrega.', 'The Judge weighs. The Knight carries.'), fonte: T('inscrição sobre a porta do oratório da Casa D’Orrose', 'inscription above the shrine door of House D’Orrose') } }, // NOVO (epígrafe)

    { id: 'b01', zona: 'castelo', fundo: { img: 'assets/images/aula.jpg', kb: 'in', dim: .5, foco: '58% 40%' },
      narracao: 'assets/audio/narration/line2.mp3', narracaoLang: 'en', capitular: true,
      texto: [
        T('Depois da pausa para o alfaiate, tenho uma longa tarde de aulas de história. Não consigo prestar muita atenção. No fim, todas as aulas se parecem. Histórias sobre a Guerra Eterna, que segundo dizem está perto do fim, já que os Grakh não são mais considerados uma ameaça séria; e mais rumores do que fatos sobre o Apagar das Luzes, que serve, todo dia, como novo lembrete dos perigos da magia.',
          'After the pause for the tailor, I have a long afternoon of history lessons. I can’t hold my attention. In the end, every lesson looks the same. Stories of the Eternal War, which they say is nearing its end, now that the Grakh are no longer considered a serious threat; and more rumor than fact about the Dimming of the Lights, which serves, every single day, as a fresh reminder of the dangers of magic.'),
        // eco do Capítulo I: só para quem jogou o Aheryn neste navegador e deixou a Luz subir
        () => { const c1 = antes().cap1; return c1 && c1.luz >= 60
          ? T('A professora conta, meio rindo, que algumas décadas atrás correram rumores de luz de Lúmae na Borda do Mundo, no fim do norte. Boato de taverna, ela diz. Ninguém nunca foi conferir. Eu desenho uma janela na margem do caderno.', 'The tutor tells us, half laughing, that a few decades ago there were rumors of Lúmae light at the Edge of the World, at the far end of the north. Tavern talk, she says. No one ever went to check. I draw a window in the margin of my notebook.')
          : T('— Os Lúmae estão extintos — a professora repete, batendo o dedo no livro. — Todos eles. A magia cobrou o preço inteiro.', '— The Lúmae are extinct — the tutor repeats, tapping the book. — Every one of them. Magic took the whole price.'); }, // NOVO (eco do Cap. I: Luz alta = boato antigo; senão, extintos)
      ] },

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

    { id: 'b03', zona: 'oratorio', fundo: { img: 'assets/images/oratorio-justine.jpg', kb: 'in', foco: '45% 40%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: 2.2,
      texto: [
        T('— Laura — fala baixo, mas sem delicadeza nenhuma.', '— Laura — she says, quietly, but without a trace of softness.'),
        T('— Oi, Justine. — Olho para baixo. É difícil encará-la sabendo que o sonho dela é ser a Mãe-Rainha.', '— Hi, Justine. — I look down. It’s hard to face her knowing her dream is to be Mother-Queen.'),
        T('— Veio pedir lealdade para o seu futuro marido?', '— Come to pray for loyalty to your future husband?'),
        T('O sorriso dela mistura deboche e tristeza a partes iguais. Reparo porque a luz do fim de tarde entra pela janela e ilumina os lábios dela, perfeitos.', 'Her smile mixes mockery and sadness in equal measure. I notice because the late-afternoon light comes through the window and catches her lips, which are perfect.'),
      ],
      dialogo: { interlocutor: T('Justine', 'Justine'), rodadas: [
        { id: 'j1', opcoes: [
          { id: 'naoquero', voz: 'naoquero', vozNervosa: 'naoquero-nervosa', txt: T('Você sabe que eu não quero isso. Se eu pudesse, convenceria Dolores a escolher você, não a mim.', 'You know I don’t want this. If I could, I’d convince Dolores to choose you, not me.'),
            txtNervoso: T('Eu não... Você sabe que eu não quero isso. Se eu pudesse, eu... convenceria Dolores a escolher você.', 'I don’t... You know I don’t want this. If I could, I’d... I’d convince Dolores to choose you.'), // NOVO (versão com o peito apertado)
            resposta: [T('— Infelizmente o General-Rei se foi antes dela — ela diz, com sinceridade, com pesar. — É como as coisas costumam ser. Depois de tantos anos estudando juntas, sabemos disso melhor do que ninguém.', '— Unfortunately the General-King died before she did — she says, sincerely, with real regret. — It’s how things tend to go. After all these years studying together, we know that better than anyone.')] }, // canon
          { id: 'coragem', eixo: 'mostra', flag: 'justineDesconfia', pulso: 3, voz: 'coragem', txt: T('Vim pedir coragem.', 'I came to ask for courage.'),
            resposta: [T('Ela inclina a cabeça.', 'She tilts her head.'), T('— Para casar não precisa de coragem, Laura. Precisa de paciência. Coragem é para quem vai fazer alguma coisa.', '— Marriage doesn’t take courage, Laura. It takes patience. Courage is for someone who’s about to do something.')] }, // NOVO
          { id: 'cala1', silencio: true, resposta: [T('— Não precisa responder. Eu também não responderia.', '— You don’t have to answer. I wouldn’t either.')] }, // NOVO
        ] },
        { id: 'j2', antes: [T('— Eu não me canso de vir aqui clamar à Juíza. Me preparei, mesmo com chances tão pequenas, para ser a melhor Mãe-Rainha que Redom já teve. Se a justiça é tão importante quanto nos ensinaram, por que ela não é aplicada dentro do nosso próprio castelo?', '— I never tire of coming here to plead with the Judge. I prepared myself, even with chances so slim, to be the best Mother-Queen Redom has ever had. If justice is as important as we were taught, why isn’t it applied inside our own castle walls?')], // canon
          opcoes: [
            { id: 'melhor', pulso: 3, voz: 'melhor', vozNervosa: 'melhor-nervosa', txt: T('Você seria a melhor. Sempre foi a melhor aluna, em conhecimento, em oratória, e a mais bela também.', 'You would have been the best. You were always the best student, in knowledge, in speech, and the most beautiful too.'),
              txtNervoso: T('Você seria a melhor. Você é... a mais bela também. E a melhor aluna.', 'You’d be the best. You are... the most beautiful, too. And the best student.'), // NOVO (versão com o peito apertado)
              resposta: [T('O canto da boca dela sobe.', 'The corner of her mouth lifts.'), T('— Cuidado, Laura. Uma Mãe-Rainha não elogia a rival em voz alta.', '— Careful, Laura. A Mother-Queen doesn’t praise her rival out loud.')] }, // canon (fala de Laura) + NOVO (resposta)
            { id: 'pesar', flag: 'justineDesconfia', voz: 'torneio-nem-comecou', txt: T('O Torneio ainda nem começou.', 'The Tournament hasn’t even started.'),
              resposta: [T('Ela me olha por tempo demais.', 'She looks at me for too long.'), T('— Você fala como quem sabe de alguma coisa.', '— You talk like someone who knows something.')] }, // NOVO
            { id: 'casar', se: (st) => st.peso >= 2, tremida: true, flag: 'justineDesconfia', peso: -1, pulso: 4, voz: 'casar', txt: T('Eu não vou me casar com ele.', 'I’m not going to marry him.'),
              resposta: [T('Ela para de respirar um instante.', 'She stops breathing for a moment.'), T('— Não diga isso aqui, Laura. A Juíza escuta.', '— Don’t say that here, Laura. The Judge is listening.')] }, // NOVO (só aparece com o peito apertado: a verdade escapa)
            { id: 'cala2', silencio: true, resposta: [T('Ela assente devagar e não pergunta mais nada.', 'She nods slowly and asks nothing more.')] }, // NOVO
          ] },
      ] },
      depois: [T('Ela se levanta e vem na minha direção.', 'She stands and comes toward me.')] },

    { id: 'b04', zona: 'oratorio', fundo: { img: 'assets/images/oratorio-de-pe.jpg', kb: 'in', foco: '55% 40%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: 3,
      texto: [T('Meu coração acelera ainda mais.', 'My heart races faster still.')],
      escolha: { id: 'perto', pergunta: T('Justine se aproxima.', 'Justine comes closer.'), opcoes: [
        { id: 'ajoelhada', txt: T('Continuar ajoelhada', 'Stay on my knees'),
          fundo: { video: 'assets/video/oratorio-justine.mp4', img: 'assets/images/oratorio-de-pe.jpg', kb: 'none', foco: '55% 40%', dim: .45, lado: 'dir', clima: 'velas' }, // a cena roda no fundo: o lenço passa para as mãos dela
          resultado: [
            (st) => (st.f.sangue
              ? [T('Continuo ajoelhada. Ela pega minhas mãos e me entrega um lenço.', 'I stay on my knees. She takes my hands and presses a handkerchief into them.'), T('— Uma Mãe-Rainha não pode ter as mãos cortadas, Laura.', '— A Mother-Queen can’t have cut-up hands, Laura.')]
              : [T('Continuo ajoelhada. Ela pega minhas mãos e vira as palmas para a luz da janela, devagar. Passa o polegar pelos calos, um por um.', 'I stay on my knees. She takes my hands and turns the palms to the window light, slowly. She runs her thumb over the calluses, one by one.'), T('— Uma Mãe-Rainha não pode ter mãos assim, Laura.', '— A Mother-Queen can’t have hands like these, Laura.'), T('Ela tira um lenço da manga e fecha meus dedos sobre ele.', 'She takes a handkerchief from her sleeve and closes my fingers around it.')]),
          ] }, // canon + NOVO (variação sem sangue)
        { id: 'levantar', eixo: 'mostra', flag: 'levantou', pulso: 4, txt: T('Levantar também', 'Stand up too'),
          fundo: { video: 'assets/video/oratorio-justine-de-pe.mp4', img: 'assets/images/oratorio-de-pe.jpg', kb: 'none', foco: '45% 50%', dim: .45, lado: 'dir', clima: 'velas' },
          resultado: [
            T('Levanto antes que ela chegue. De pé, ficamos da mesma altura, perto o bastante para eu ver a luz da janela nos lábios dela. Ela para. Nenhuma das duas se mexe.', 'I stand before she reaches me. On our feet we’re the same height, close enough for me to see the window light on her lips. She stops. Neither of us moves.'),
            (st) => (st.f.sangue
              ? [T('Então ela pega minhas mãos e me entrega um lenço.', 'Then she takes my hands and presses a handkerchief into them.'), T('— Uma Mãe-Rainha não pode ter as mãos cortadas, Laura.', '— A Mother-Queen can’t have cut-up hands, Laura.')]
              : [T('Então ela pega minhas mãos, passa o polegar pelos calos, um por um, e fecha meus dedos sobre um lenço.', 'Then she takes my hands, runs her thumb over the calluses, one by one, and closes my fingers around a handkerchief.'), T('— Uma Mãe-Rainha não pode ter mãos assim, Laura.', '— A Mother-Queen can’t have hands like these, Laura.')]),
          ] }, // NOVO
        { id: 'esconder', eixo: 'esconde', txt: T('Esconder as mãos na saia', 'Hide my hands in my skirt'),
          fundo: { video: 'assets/video/oratorio-justine-lenco-chao.mp4', img: 'assets/images/oratorio-de-pe.jpg', kb: 'none', foco: '50% 50%', dim: .45, lado: 'dir', clima: 'velas' },
          resultado: [
            T('Escondo as mãos nas dobras da saia. Ela para a um passo de mim, olha para a saia, depois para o meu rosto.', 'I hide my hands in the folds of my skirt. She stops a step away, looks at the skirt, then at my face.'),
            T('— Eu sei o que tem aí, Laura.', '— I know what’s in there, Laura.'),
            T('Ela tira um lenço da manga, deixa no chão, ao lado do meu joelho, e vai para a porta sem tocar em mim.', 'She takes a handkerchief from her sleeve, leaves it on the floor beside my knee, and goes to the door without touching me.'),
          ] }, // NOVO
      ] } },

    { id: 'b05', zona: 'oratorio', fundo: { img: 'assets/images/oratorio-lenco.jpg', kb: 'in', foco: '55% 50%', dim: .45, lado: 'dir', clima: 'velas' }, pulso: 1.6,
      texto: [(st) => (st.escolhas.perto === 'esconder'
        ? T('O lenço está no chão, dobrado.', 'The handkerchief lies on the floor, folded.')
        : T('Justine já está na porta. O lenço está na minha mão.', 'Justine is already at the door. The handkerchief is in my hand.'))], // NOVO
      escolha: { id: 'lenco', pergunta: T('O lenço', 'The handkerchief'), opcoes: [
        { id: 'guardar', txt: (st) => (st.escolhas.perto === 'esconder' ? T('Pegar o lenço e guardar na manga', 'Pick it up and tuck it in my sleeve') : T('Guardar o lenço na manga', 'Tuck it in my sleeve')),
          resultado: [T('Guardo o lenço na manga. Tem um J bordado no canto, em linha branca, e cheiro de cera de vela.', 'I tuck the handkerchief into my sleeve. There’s a J embroidered in one corner, in white thread, and it smells of candle wax.')] }, // NOVO (o J bordado é proposta)
        { id: 'devolver', txt: (st) => (st.escolhas.perto === 'esconder' ? T('Deixar o lenço no chão', 'Leave it on the floor') : T('Chamar Justine e devolver', 'Call Justine back and return it')),
          resultado: [(st) => (st.escolhas.perto === 'esconder'
            ? T('Deixo o lenço onde ela pôs. Quando saio, ele ainda está lá, dobrado, ao lado das velas.', 'I leave the handkerchief where she put it. When I go, it’s still there, folded, beside the candles.')
            : [T('— Justine. O seu lenço.', '— Justine. Your handkerchief.'), T('Ela volta, pega o lenço sem encostar nos meus dedos e vai embora.', 'She comes back, takes it without touching my fingers, and leaves.')])] }, // NOVO
      ] } },

    // ===================================================== III · ANTES DA ALVORADA
    { id: 'parte-III', parte: 'III', zona: 'noite', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', dim: .66, foco: '50% 40%', clima: 'poeira-azul' },
      cartao: { num: 'III', nome: T('Antes da Alvorada', 'Before Dawn'), epigrafe: T('Espada sem fio também ensina. Só ensina mais devagar.', 'A blunt sword teaches too. It just teaches slower.'), fonte: T('Anthony, Mestre das Armas da Casa D’Orrose', 'Anthony, Master of Arms of House D’Orrose') } }, // NOVO (epígrafe; voz de Anthony a confirmar)

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
          T('O coração bate tão alto que tenho certeza de que ele escuta. Simon não aguenta. Levanta e corre, e me arrasta junto.', 'My heart beats so loud I’m sure he can hear it. Simon can’t take it. He gets up and runs, and drags me with him.'),
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
        se((st) => st.escolhas.lenco === 'guardar', T('Antes de começar, enrolo o lenço de Justine no cabo da espada, por cima da bolha que abriu ontem.', 'Before we start, I wrap Justine’s handkerchief around the grip, over the blister that opened yesterday.')), // NOVO
        (st) => (st.f.arsenalTrancado
          ? T('— Mamãe brigou com você, Laura? Ela trancou o arsenal inteiro — ele pergunta enquanto aquecemos, ainda trocando golpes de propósito, devagar.', '— Did mother fight with you, Laura? She locked the whole armory — he asks while we warm up, still trading slow blows on purpose.')
          : T('— Mamãe brigou com você, Laura? — ele pergunta enquanto aquecemos, ainda trocando golpes de propósito, devagar.', '— Did mother fight with you, Laura? — he asks while we warm up, still trading slow blows on purpose.')),
        T('— Como ela descobriu?', '— How did she find out?'),
        T('— Espada sem fio ainda deixa marca, irmã. E você não tem sido branda comigo.', '— A blunt sword still leaves a mark, sister. And you haven’t been gentle with me.'),
        se((st) => st.escolhas.lenco === 'guardar', T('Ele aponta o cabo da minha espada com o queixo.', 'He nods at my sword’s grip.')),
        se((st) => st.escolhas.lenco === 'guardar', T('— Isso tem um J bordado. É da Justine?', '— That has a J stitched on it. Is it Justine’s?')),
        se((st) => st.escolhas.lenco === 'guardar', T('Sinto o rosto esquentar.', 'I feel my face go hot.')),
        T('— É o que você quer? — Rio no meio da frase, sem conseguir evitar. — Ela disse que você, como homem bem alimentado, vai ficar mais forte a cada dia.', '— Is that what you want? — I laugh in the middle of the sentence, unable to help it. — She said that you, being a well-fed man, will get stronger every day.'),
        T('— Está me provocando? — Ele acelera o ritmo dos golpes.', '— Are you provoking me? — He speeds up his strikes.'),
      ] },

    { id: 'c03b', zona: 'laranjal', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', foco: '50% 45%', dim: .5, clima: 'poeira-azul' }, pulso: 1.2,
      texto: [T('— Me mostra o que um homem de catorze anos consegue fazer.', '— Show me what a fourteen-year-old man can do.')],
      vozAuto: 'mostra', vozAtraso: 500 }, // a fala e a voz saem juntas, ao virar a página

    { id: 'c04', zona: 'laranjal', fundo: { video: 'assets/video/laranjal-duelo.mp4', img: 'assets/images/laranjal-cruzado.jpg', kb: 'none', foco: '50% 45%', dim: .5, clima: 'poeira-azul' }, pulso: .5,
      cena: 'assets/video/laranjal-duelo.mp4',
      texto: [
        T('Simon gosta de se vangloriar dizendo que Anthony, o Mestre das Armas, sempre o elogia. Chama até de prodígio. Acho estranho, porque para mim é fácil demais. Só lutei com ele a vida inteira, mas prevejo cada movimento seu sem esforço. Ele tem força de verdade. Nunca me acerta. E eu nunca deixo.', 'Simon likes to brag that Anthony, the Master of Arms, always praises him, even calls him a prodigy. I find that strange, because for me it’s far too easy. I’ve only ever fought him, my whole life, and yet I predict his every move without effort. He truly has strength. He never manages to hit me. And I never let him.'),
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
      texto: [T('— Espero que você esteja certo, irmãozinho. Vou precisar ser.', '— I hope you’re right, little brother. I’m going to need to be.')],
      vozAuto: 'vou-precisar', vozAtraso: 500 }, // canon

    { id: 'c06', zona: 'laranjal', fundo: { img: 'assets/images/laranjal-lua.jpg', kb: 'in', foco: '60% 45%', dim: .55, clima: 'poeira-azul' }, pulso: 1,
      texto: [
        T('Simon senta no chão, as costas na parede, ainda ofegante, e me olha com uma cara que eu conheço.', 'Simon sits on the floor, back against the wall, still panting, and looks at me with a face I know.'),
        T('— Por que você treina tanto, Laura? Rainha não luta.', '— Why do you train so much, Laura? Queens don’t fight.'),
      ], // NOVO
      escolha: { id: 'simon', pergunta: T('A pergunta de Simon', 'Simon’s question'), opcoes: [
        { id: 'verdade', eixo: 'mostra', flag: 'contou', peso: -1, voz: 'torneio', vozAtraso: 500, txt: T('Contar a verdade', 'Tell him the truth'),
          resultado: [
            T('— Porque daqui a um mês eu vou lutar no Torneio Real.', '— Because in a month I’m going to fight in the Royal Tournament.'),
            T('Ele me olha um tempo. Depois cai na gargalhada, tão alto que eu preciso tapar a boca dele com a mão.', 'He looks at me for a while. Then he bursts out laughing, so loud I have to cover his mouth with my hand.'),
            T('— E eu vou ser a Mãe-Rainha! — ele diz por entre os meus dedos.', '— And I’ll be the Mother-Queen! — he says through my fingers.'),
            T('Rio também. O peito, por dentro, fica leve pela primeira vez no dia.', 'I laugh too. Inside my chest, it goes light for the first time all day.'),
          ] }, // NOVO
        { id: 'mentira', peso: 1, txt: T('Dizer que a esgrima acalma', 'Say that fencing calms me'),
          txtNervoso: T('Dizer que a esgrima acalma, rápido demais', 'Say that fencing calms me, too fast'),
          resultadoNervoso: [
            T('— Me acalma. Já disse. Me acalma.', '— It calms me. I told you. It calms me.'),
            T('Falo rápido demais. Simon franze a testa e fica me olhando, esperando o resto. Viro de costas para guardar as espadas antes que ele pergunte de novo.', 'I say it too fast. Simon frowns and keeps looking at me, waiting for the rest. I turn my back to put the swords away before he can ask again.'),
          ], // NOVO (versão com o peito apertado)
          resultado: [
            T('— Já disse. Me acalma.', '— I told you. It calms me.'),
            T('Ele dá de ombros e acredita, como sempre acredita. Viro de costas para guardar as espadas e fico ali mais tempo do que precisa.', 'He shrugs and believes it, the way he always does. I turn my back to put the swords away and stay there longer than I need to.'),
          ] }, // NOVO
        { id: 'ataque', txt: T('Atacar em vez de responder', 'Attack instead of answering'),
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
        T('Conto nos dedos os dias até o Torneio. Trinta. Conto de novo e dá o mesmo.', 'I count the days to the Tournament on my fingers. Thirty. I count again and get the same.'),
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
    justine: { perto: st.escolhas.perto || null, desconfia: !!st.f.justineDesconfia, lenco: st.escolhas.lenco || null },
    ronda: st.escolhas.ronda || null, visto: !!st.f.visto, esconderijo: st.esconderijo || null, pontos: st.pontos || null,
    duelo: st.duelo || null, marca: !!(st.duelo && st.duelo.sofridos),
    simon: st.escolhas.simon || null, brancarda: !!st.f.brancarda, arsenalTrancado: !!st.f.arsenalTrancado,
    escolhas: st.escolhas,
  }),

  // ---------------------------------------------------------------- tela final
  resumo: (st, lang) => {
    const pt = lang !== 'en', L = (a, b) => (pt ? a : b);
    const frase = st.peso <= 0 ? L('Laura não carrega nenhuma mentira para a cama hoje.', 'Laura carries no lies to bed tonight.')
      : st.peso <= 2 ? L('Laura mentiu pouco, e sentiu cada vez no peito.', 'Laura lied a little, and felt each one in her chest.')
        : L('Laura deita com o peso de cada mentira do dia atrás do peito.', 'Laura lies down with the weight of every lie of the day behind her ribs.');
    const notas = [];
    const pr = st.escolhas.promessa;
    notas.push(pr === 'recusar' ? L('Dolores trancou o arsenal e guarda a chave.', 'Dolores locked the armory and keeps the key.') : pr === 'calar' ? L('Dolores tomou o silêncio da filha por palavra.', 'Dolores took her daughter’s silence as her word.') : L('Dolores acredita na promessa da filha.', 'Dolores believes her daughter’s promise.'));
    notas.push(st.f.justineDesconfia ? L('Justine desconfia de alguma coisa.', 'Justine suspects something.') : st.escolhas.perto === 'levantar' ? L('Justine ficou perto. Nenhuma das duas disse nada.', 'Justine came close. Neither of them said anything.') : st.escolhas.perto === 'esconder' ? L('Justine saiu sem tocar em Laura.', 'Justine left without touching Laura.') : L('Entre Laura e Justine, tudo como sempre foi.', 'Between Laura and Justine, everything as it always was.'));
    if (st.f.visto) notas.push(L('Um guarda viu duas sombras no jardim.', 'A guard saw two shadows in the garden.'));
    const d = st.duelo ? st.duelo.resultado : null;
    const linhas = [
      { id: 'promessa', opcao: pr, q: L('A promessa à mãe', 'The promise to her mother'), a: { prometer: L('Prometeu', 'Promised'), calar: L('Ficou calada', 'Kept silent'), recusar: L('Recusou', 'Refused') }[pr] || '—' },
      { id: 'lenco', opcao: st.escolhas.lenco, q: L('O lenço de Justine', 'Justine’s handkerchief'), a: st.escolhas.lenco === 'guardar' ? L('Guardou na manga', 'Kept it in her sleeve') : st.escolhas.perto === 'esconder' ? L('Deixou no chão', 'Left it on the floor') : L('Devolveu', 'Gave it back') },
      { id: 'ronda', opcao: st.escolhas.ronda, q: L('O guarda da ronda', 'The night guard'), a: st.escolhas.ronda === 'descobertos' ? L('O coração venceu; correram', 'Her heart won; they ran') : L('Passaram sem ser vistos', 'Got past unseen') },
      { id: 'duelo', opcao: d, q: L('O duelo com Simon', 'The duel with Simon'), a: { limpo: L('Venceu sem ser tocada', 'Won without being touched'), marcas: L('Venceu, com uma marca no braço', 'Won, with a mark on her arm'), deixou: L('Deixou Simon ganhar', 'Let Simon win'), perdeu: L('Perdeu', 'Lost') }[d] || '—' },
      { id: 'simon', opcao: st.escolhas.simon, q: L('A pergunta de Simon', 'Simon’s question'), a: { verdade: L('Contou a verdade, e ele riu', 'Told the truth, and he laughed'), mentira: L('Mentiu', 'Lied'), ataque: L('Atacou em vez de responder', 'Attacked instead of answering') }[st.escolhas.simon] || '—' },
    ];
    return { frase, notas, linhas };
  },
};
