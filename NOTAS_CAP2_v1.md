# Capítulo 2 (Laura) · Notas da versão 1

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
2. **Minijogo "Olhar sem se mexer".** 4 olhares, 6 lugares: a janela, o telhado, a vinha (a rota de fuga), a porta (a dobradiça que range), o manequim, a mesa de Gideon (o molde de gibão).
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

Em `localStorage['aqv_estado'].cap2`: peso, perfil (mostra/esconde), mãos, promessa, rota, gibão, prece, sangue, Justine (perto, desconfia, lenço), ronda, visto, duelo, pergunta de Simon, Brancarda, arsenal trancado.

## Para você decidir

1. **O gibão de soldado na mesa de Gideon.** Proposta: é Gideon o "homem que vou corromper". Ele já tem as medidas dela e sabe fazer um gibão que esconda o corpo. Liga com a fivela do peitoral que cede no Cap. 4.
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
