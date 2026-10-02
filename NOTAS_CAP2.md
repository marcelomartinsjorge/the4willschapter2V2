# Capítulo 2 (Laura) · Notas

## Versão 9

- **A prece está toda dublada, nos três caminhos.** A linha de perdão da manhã agora tem voz para quem prometeu (`prece-promessa`), para quem ficou calada (`prece-silencio`) e para quem recusou (`prece-chave-arsenal`). O resto é igual em todos: `prece-1` no começo e `prece-resto` no fim.
- Duração segurando a prece inteira: **uns 25 s** (prometeu), **uns 27 s** (calada) e **uns 29 s** (recusou). O sangue chega na linha "quebrar uma ordem inquebrável", uns 7 s antes do fim.
- Não resta nenhuma fala de Laura sem dublagem.


## Versão 8

- **A prece agora é falada.** Segurando o botão, Laura reza em voz alta (em inglês, como as outras falas dela) e **cada linha de texto aparece no instante em que ela a diz**, em vez de a cada 1,8 s:
  - `prece-1` ("I feel He has watched over me since I was very small...") com a primeira linha;
  - `prece-chave-arsenal` ("I ask that my mother leave the armory key somewhere and forget it...") com a segunda, **só no caminho em que ela recusou a promessa**;
  - `prece-resto` (13 s) cobre as quatro últimas, e cada uma entra no ponto certo da fala: *steal* aos 0 s, *corrupt* aos 3,2 s, *break* aos 5,3 s, *courage* aos 9,1 s.
- Soltar o botão corta a voz e encerra a prece, como antes. Com o som desligado, a prece volta ao ritmo antigo (uma linha a cada 1,8 s), sem esperar pela fala.
- **A prece inteira agora leva uns 29 s segurando** (antes, 11 s). O sangue (a linha "quebrar uma ordem inquebrável") chega aos 21 s.
- (Pendência resolvida na v9: as duas linhas de perdão da manhã foram gravadas.)


## Versão 7

- **As duas últimas dublagens de Laura:** `naoquero` ("You know I don't want this. If I could, I'd convince Dolores to choose you, not me.") toca com o peito calmo, e `melhor-nervosa` ("You'd be the best. You are... the most beautiful, too. And the best student.") toca com o peito apertado. Agora **todas as falas de Laura com versão calma e tremida têm voz** nas duas versões.
- **Limpeza:** removidos 3 arquivos sem uso (`espadas-metal.mp3`, `respiracao-justine.mp3`, `oratorio-perfil.jpg`). Todo o resto está em uso (inclusive os `.webm` de cada vídeo, que o navegador usa quando não toca H.264).
- **Decididos:** a trilha sintetizada do duelo fica; espadas de madeira em imagem não valem o trabalho (o texto e o som continuam de madeira no caminho do arsenal trancado).


## Versão 6

- **Correção de um erro meu na v3:** quem **não** trancou o arsenal ouvia a `line3v1`, que fala de espadas de madeira, enquanto o texto na tela dizia "as espadas longas de sempre". Agora a narração da noite é: `line3longswordsinsteadofwood` (espadas longas) quando o arsenal está aberto, e `line3v2` (madeira, "The armory is locked") quando Dolores o trancou. A `line3v1` não é mais usada.
- **Cinco falas de Laura dubladas, cada uma no seu lugar:**
  - "I can't promise that, mother." → ao escolher **Recusar** (a promessa).
  - "You would have been the best..." → resposta a Justine, **só com o peito calmo**.
  - "The Tournament hasn't even started." → resposta a Justine.
  - "I don't... You know I don't want this. If I could, I'd..." → **só com o peito apertado** (é a versão tremida de "Você sabe que eu não quero isso").
- Falas ainda **sem dublagem** (tocam mudas hoje): a versão calma de "You know I don't want this. If I could, I'd convince Dolores to choose you, not me." e a versão tremida de "You'd be the best. You are... the most beautiful, too. And the best student."


## Versão 5

- **A ronda vira minijogo, "Prender o coração".** Laura e Simon sempre se escondem atrás da estátua. O vídeo roda em loop com o som dele, por cima das batidas do coração. Um anel se fecha sobre o coração e o leitor toca no instante da batida (barra de espaço ou toque). No compasso, o coração desacelera; errando, acelera; com a tocha mais perto, o medo sobe sozinho. Três vezes a luz chega à estátua e é preciso segurar o mesmo botão até ela passar. Se o coração passar de 150, Simon não aguenta e eles correm (o guarda vê, e isso fica gravado para Dolores). Se a tocha passar, passam impunes. O peso das mentiras faz o coração começar mais rápido.
- **Som:** os ambientes vieram baixíssimos (laranjal em −50 dB, aula em −66 dB). Todos foram normalizados para uma faixa audível. O duelo ganhou uma trilha de tambores graves com um zumbido de fundo, sintetizada, que acelera a cada fase e baixa no último golpe.
- **Brancarda:** Laura calça as botas na porta, pisa na flor, recolhe o pé e a encontra se levantando de novo.
- **Fim do capítulo:** se Simon acertou Laura, ela vê as marcas escurecendo, pensa nas mãos da mãe, e o coração acelera. A última linha é sempre ela adormecendo.
- **Pontuação escondida:** aparece só na tela final. Duelo: leituras, toques, fintas lidas, sequência; perde por golpes sofridos, aparos e tentativas; bônus por vencer sem ser tocada. Esconderijo: batidas firmes, fôlegos segurados, coração calmo no fim; bônus por passar sem ser visto. A tela mostra o total do capítulo, cada minijogo, o hino do gelo do Cap. 1 (lido do mesmo navegador) e o total da jornada com a posição entre os leitores.

### Supabase (já aplicado no seu projeto)
- `livro_escolhas` ganhou uma regra de leitura. Sem ela, toda gravação de escolha voltava 401 (inclusive do Cap. 1), e as estatísticas "X% fizeram o mesmo" nunca apareciam. Corrigido no servidor; o Cap. 1 não precisa de nova publicação.
- Nova tabela `livro_pontuacao` (leitor, capítulo, pontos, detalhes) e a função `livro_salva_pontos`, que guarda a melhor pontuação de cada capítulo e devolve o total da jornada e a posição. A tabela não é lida nem escrita diretamente pelo site, só pela função.
- O leitor é identificado por um código aleatório guardado no navegador (`aqv_jogador`); se ele jogou o Cap. 1 no mesmo navegador, usa o código daquela sessão.


## Versão 4

- **O duelo com Laura e Simon de verdade.** As 19 poses das suas duas folhas foram recortadas (fundo verde removido, bordas limpas), espelhadas onde precisava (Simon inteiro; Laura nas poses 3 e 7) e alinhadas pelos pés. O jogo troca de imagem a cada movimento, com o deslize da pose, um véu azul de madrugada e contraluz. Se alguma imagem não carregar, aquele lutador volta a ser o boneco antigo. As regras do jogo não mudaram.
- **Justine:** cada escolha agora tem seu vídeo de fundo. "Continuar ajoelhada" usa o vídeo original; "Levantar também" usa `oratorio-justine-de-pe`; "Esconder as mãos" usa `oratorio-justine-lenco-chao`.
- **"I'm not going to marry him"** está no lugar do `casar.mp3` (e agora vai dentro do pacote).
- **Brancarda:** todo leitor a vê. Ela entra no texto da página do esconderijo, com o vídeo no fundo.
- **O "…" de quem espera** (ainda existe em "E se outro vencer?", com Dolores) agora pulsa devagar em dourado, para ser notado.
- **Espadas de madeira** (quando Dolores tranca o arsenal): as imagens mostram espadas de aço; o texto e o som são de madeira. Decidido que não compensa trocar o visual.


## Versão 3

- **Narração do oratório:** o áudio `oratorio-fome` toca sozinho na página da prece (o parágrafo "Não sinto fome..."), com botão para repetir.
- **Narração do laranjal:** a `line3v1` toca normalmente; a `line3v2` ("The armory is locked") toca quando Dolores trancou o arsenal.
- **`casar.mp3`:** ligado à fala "Eu não vou me casar com ele." (a que escapa quando o peito está apertado).
- **Justine ajoelhada:** o vídeo agora roda no fundo no instante em que o leitor escolhe "Continuar ajoelhada", junto com o texto do lenço. Antes, ele estava só atrás de um botão na página seguinte, por erro meu. Em "Levantar" e "Esconder" continua a imagem parada (o vídeo mostra Laura ajoelhada).
- **"Me mostra o que um homem de catorze anos consegue fazer"** e **"Espero que você esteja certo, irmãozinho. Vou precisar ser."** agora têm página própria: a frase aparece junto com a voz quando o leitor aperta Próxima, e o leitor avança de novo.
- **Brancarda:** só aparece se o leitor esperar na página do esconderijo; o "…" surge depois de 3 segundos (antes, 5) e, ao tocar nele, o vídeo passa a rodar no fundo.


## Versão 2 (suas considerações + mídias)

**Correções**
- As narrações e todas as falas dubladas tocam sozinhas ao abrir a página (com o som ligado). O botão "Ouvir" continua lá para repetir ou parar.
- Depois do minijogo do alfaiate, o livro avança direto para a página seguinte.
- O vídeo roda no fundo, junto com o texto, em: os olhos marejados (alfaiate), a prece (mãos), a página antes do duelo (laranjal) e a Brancarda (quando o leitor a encontra). O botão "Ver a cena" continua onde havia.
- Justine: a cena do lenço só aparece quando ela de fato entrega o lenço na mão de Laura. Se Laura escondeu as mãos, Justine deixa o lenço no chão, e não há vídeo.
- "Talvez a Juíza ainda não tenha terminado de pesar" virou **"O Torneio ainda nem começou."** (a resposta de Justine continua: "Você fala como quem sabe de alguma coisa").
- Lanterna virou **tocha** (a luz, o cheiro de resina queimada).
- Eco do Cap. 1, reescrito no tempo certo: se o Aheryn terminou com Luz alta (60 ou mais), a professora conta que **algumas décadas atrás** correram rumores de luz de Lúmae na Borda do Mundo, boato que ninguém foi conferir. Em qualquer outro caso (Luz baixa, ou quem não jogou o Cap. 1), ela repete que **os Lúmae estão extintos**. Fica tudo aqui no Cap. 2; não precisa mexer no Cap. 1.

**O duelo**
- Vencer é obrigatório. Se Simon vencer, aparece "Não pode ser assim. Falta um mês." e o botão **Tentar de novo**.
- Vencendo, no último golpe o jogo congela: **Tocar a costela** ou **Deixar Simon ganhar**.

**O coração agora mexe na jogabilidade**
O peso das mentiras sobe quando Laura promete à mãe (+2), fica calada (+1), esconde as mãos (+1) ou mente a Simon (+1), e desce quando ela fala a verdade. A partir de 2:
- Algumas falas de Laura **saem tremidas**: o botão treme e o texto muda (gaguejo, frase pela metade). Isso acontece com Justine e com Simon.
- Com Justine aparece uma opção que não existe com o peito calmo: **"Eu não vou me casar com ele."** A verdade escapa. Justine responde: "Não diga isso aqui, Laura. A Juíza escuta."
- Na ronda do guarda, o tempo para decidir cai de 5 para 3,5 segundos.
- No duelo, cada abertura dura menos (até 32% menos), e a tela de regras avisa na voz dela: "O coração não para quieto hoje."

**Canon (suas respostas)**
- O "homem que vou corromper" é **um oficial do Registro do Torneio**; Laura vai se inscrever como Laus, de uma casa pequena e desconhecida. No minijogo do alfaiate, o gibão saiu: na mesa de Gideon agora há uma carta com o selo do Registro do Torneio, uma encomenda de mantos para os arautos, e embaixo do selo **o nome do oficial que assina as inscrições**. Laura lê duas vezes. Isso fica gravado para o Cap. 4 (`registro`).
- Laura é apaixonada por Justine; Justine "desconfia" fica gravado para o Cap. 4.

**Para você decidir (o que sobrou)**
1. O nome do oficial do Registro: hoje o texto não diz. Quer que eu invente um, ou você define?
2. Dolores trancando o arsenal (se Laura recusa a promessa). Canon novo pequeno.
3. O guarda que viu duas sombras: gancho solto. Volta no Cap. 4 ou morre aqui?
4. A epígrafe da Parte III atribuída a Anthony.
5. Brancarda em inglês: "whitebloom".

---

# Versão 1


## Arquivos

- `index.html`: a casca (capa, página, minijogo, codex, tela final).
- `livro.js`: o motor, copiado do Cap. 1 e limpo do que era só do Aheryn (Luz, hino, goles, cabana). Ganhou: o coração (a variável invisível), o "Olhar sem se mexer", a prece de segurar, diálogo com resposta por opção, silêncio com gesto.
- `duelo.js`: o minijogo "Ler Simon", desenhado em canvas (silhuetas, sem arquivos de imagem).
- `capitulo2.js`: o roteiro. **Cada texto vem em par: `T('português', 'english')`.** Mudou o português, mude o inglês na mesma linha. Os comentários marcam `canon` (seu texto) e `NOVO`.
- `content/cap02/chapter-config.js`: zonas de som e codex (copiado da versão antiga do capítulo).
- `content/cap02/tema.css`: as cores de Redom (branco, vermelho, dourado) e a fonte Cormorant Garamond.

## O mapa do capítulo

**Parte I · A Fita** (o alfaiate)
1. Gideon mede. Texto canon.
2. **Minijogo "Olhar sem se mexer".** 4 olhares, 6 lugares: a janela, o telhado, a vinha (a rota de fuga), a porta (a dobradiça que range), o manequim, a mesa de Gideon (a carta do Registro do Torneio).
3. Os olhos marejam. Se ela olhou a rota inteira, o texto conta os passos; senão, diz que sabe de cor.
4. O bocejo. Se ela olhou a porta, ouve a dobradiça quando a mãe entra.
5. **Escolha:** esconder as mãos ou estender, palmas para cima.
6. A bronca. Texto canon.
7. **Escolha, a promessa:** prometer (mentira), calar (meia mentira), recusar (Dolores manda trancar o arsenal; o duelo vira com espadas de madeira).
8. **Silêncio:** quem espera, ouve "Mãe. E se outro vencer?".

**Parte II · O Oratório**
1. A aula. Eco do Cap. 1: se o leitor jogou o Aheryn neste navegador com Luz alta, a professora conta o boato da luz na Borda do Mundo.
2. **A prece (segurar).** Quanto mais o leitor segura, mais Laura pede. A promessa da manhã volta dentro da prece. Até o fim, as unhas furam a pele.
3. **Justine, diálogo em duas rodadas.** "Vim pedir coragem" e "Talvez a Juíza ainda não tenha terminado de pesar" fazem Justine desconfiar.
4. **Escolha:** continuar ajoelhada (canon), levantar também, esconder as mãos.
5. **Escolha:** guardar ou devolver o lenço.

**Parte III · Antes da Alvorada**
1. A descida até o pátio.
2. **A ronda.** Botão "Decidir", janela de 5 segundos: correr (o guarda vê), esconder atrás da estátua da Juíza, ou ficar imóvel (quem não decide, fica imóvel; o silêncio como escolha).
3. O aquecimento com Simon. Se ela guardou o lenço, ele está enrolado no cabo da espada, e Simon vê o J.
4. Laura lê Simon. Texto canon + a regra do jogo dita na voz dela.
5. **Minijogo "Ler Simon".** No final, o jogo congela: tocar a costela ou baixar a espada.
6. **Escolha, a pergunta de Simon:** contar a verdade (ele ri), mentir, atacar em vez de responder.
7. **Silêncio:** a Brancarda. Se o guarda viu, há marcas de bota na porta.
8. O quarto. A cadeira virada para a janela (eco do Cap. 3). "Trinta."

## A variável de Laura

`st.peso`: quantas mentiras ela carrega. Sem nome e sem barra. Cada mentira faz o coração bater mais rápido, aperta as bordas da tela, e um ponto vermelho pulsa no topo. Contar a verdade alivia. A última página muda conforme o peso (dorme, não dorme).

## O duelo "Ler Simon"

- Simon avisa cada golpe com o corpo: o pé esquerdo arrasta (golpe alto, recuar), o ombro cai (estocada, inclinar), os joelhos dobram (corte baixo, aparar). Quando ele erra, a costela abre (tocar).
- Atacar antes de ele errar é punido. Aparar funciona, mas não abre a costela.
- Laura tem 3 de guarda; Simon, 5 de fôlego. Três fases, mais rápidas, com fintas.
- Resultados gravados: limpo, com marca, baixou a espada, perdeu.
- Isso ensina ao leitor a mesma leitura que Laus usa contra Joseph no Cap. 4 (esperar o erro, o passo lateral).

## O que o capítulo grava para os próximos

Em `localStorage['aqv_estado'].cap2`: peso, perfil (mostra/esconde), mãos, promessa, rota, registro (o nome do oficial), falas tremidas, tentativas no duelo, prece, sangue, Justine (perto, desconfia, lenço), ronda, visto, duelo, pergunta de Simon, Brancarda, arsenal trancado.

## Para você decidir

1. ~~O gibão de soldado na mesa de Gideon.~~ Resolvido na versão 2 (o oficial do Registro).
2. **O J bordado no lenço e a desconfiança de Justine.** Proposta: é por isso que, no Cap. 4, ela é a única de pé.
3. **Dolores trancando o arsenal** (se Laura recusa). É canon novo pequeno.
4. **O guarda da ronda e as marcas de bota.** Gancho solto, de propósito. Quem viu? Pode voltar no Cap. 4 ou morrer aqui.
5. **A epígrafe da Parte III atribuída a Anthony.** É a primeira fala dele no livro. Confirma a voz?
6. **Brancarda em inglês:** usei "whitebloom".
7. **"Trinta" dias no fim.** O Torneio é "daqui a um mês"; conferir se bate com o Cap. 4.

## O Capítulo 3

Recomendo **não misturar**. O Cap. 3 é outro ponto de vista (o Cavaleiro) e funciona melhor como intervalo curto e sublime, quase sem interação. Uma ideia: uma única interação, o leitor, como o Cavaleiro, corrige a postura da menina com a mão no ombro. O Cap. 2 já planta o que o 3 revela (a cadeira virada para a janela, o cão que não late, a estátua da Juíza).

## Pendências técnicas

- Testado em Chromium (PC 1366×800 e celular 390×844), PT e EN, quatro caminhos diferentes, sem erro de código.
- Os únicos arquivos que dão 404 são os da lista `MIDIAS_PENDENTES.md`. É esperado.
- Estatísticas ("X% fizeram o mesmo") usam o mesmo Supabase do Cap. 1, com `capitulo = 'cap02'`. O sandbox não acessa o Supabase; esse teste é seu.
- Quando o Cap. 2 novo estiver no ar, atualize o link de "próximo capítulo" no Cap. 1 (hoje aponta para `the4willschapter2`).
