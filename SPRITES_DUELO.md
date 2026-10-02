# Duelo "Ler Simon" · trocar os bonecos palito por Laura e Simon

## Resposta curta

Dá, e fica muito melhor. O que eu preciso são **imagens paradas** (poses), não vídeos: **19 poses no total, 9 de Laura e 10 de Simon.** O jogo continua exatamente igual (mesma leitura de golpes, mesmas regras); só muda o desenho. Eu faço a transição entre as poses com deslize, balanço, rastro de movimento nos golpes, sombra e poeira. O efeito é de jogo de luta com poses-chave, não de vídeo fluido.

## Por que imagens e não vídeos

O aviso de cada golpe dura entre 0,7 e 1,2 segundo, e o golpe em si, 0,17 s. Os geradores de vídeo entregam clipes de 5 a 10 segundos, difíceis de cortar nesse tempo e com o rosto e a roupa mudando de um clipe para o outro. Com imagens, a Laura é sempre a mesma Laura. Vídeo eu usaria só para o **final** (vitória, derrota, "deixar Simon ganhar"), como cena curta, se você quiser.

## O que gerar

**Referência:** use frames do `laranjal-duelo.mp4` como personagem de referência (Laura de camisa clara e calça, Simon de camisa cinza e calça escura). Gere todas as poses **na mesma conversa/sessão** da ferramenta, para manter o rosto e a roupa.

**Regras para todas as imagens:**
- Corpo inteiro, da cabeça aos pés descalços, com folga em cima e embaixo. Os pés sempre na mesma altura da imagem.
- Câmera de lado, na altura do peito, sem inclinação. Mesma distância em todas as poses.
- Fundo **verde chapado (#00FF00), liso, sem sombra no chão**. Eu recorto o fundo.
- **Laura virada para a direita; Simon virado para a esquerda.** Não espelhe depois (os dois são destros).
- Espada de treino sem fio, de aço. Luz suave, de cima, sem contraluz forte (atrapalha o recorte).
- Fotorrealista, nunca pintura. Proporção 2:3 (vertical), no mínimo 1024 px de largura.
- Nome do arquivo: `laura-<pose>.png` / `simon-<pose>.png`, como na lista abaixo.

### Laura (9 poses)

| Arquivo | Pose |
|---|---|
| `laura-guarda` | Em guarda, pés afastados, joelhos levemente dobrados, espada à frente na altura do peito |
| `laura-recuar` | Dando um passo largo para trás, tronco inclinado para trás, espada recuada |
| `laura-inclinar` | Tronco inclinado para o lado, desviando o corpo da lâmina, espada afastada |
| `laura-aparar` | Espada levantada na diagonal, defendendo acima da cabeça |
| `laura-apara-baixo` | Joelho dobrado, espada apontada para baixo, defendendo as pernas |
| `laura-tocar` | Avançando, braço esticado, ponta da espada na altura da costela do adversário |
| `laura-atingida` | Recuando, recebendo um golpe no ombro, expressão de dor, mas sem sangue |
| `laura-cansada` | Em pé, ombros caídos, espada baixa, respirando fundo |
| `laura-baixa` | Espada abaixada ao lado do corpo, olhando para o chão (a pose de "deixar Simon ganhar") |

### Simon (10 poses)

| Arquivo | Pose |
|---|---|
| `simon-guarda` | Em guarda, espada à frente |
| `simon-aviso-alto` | O pé esquerdo arrastando, a espada levantada atrás da cabeça, preparando o golpe de cima |
| `simon-aviso-estocada` | O ombro direito caído, braço recuado, preparando a estocada reta |
| `simon-aviso-baixo` | Joelhos dobrados de repente, tronco abaixado, espada baixa, mirando as pernas |
| `simon-golpe-alto` | O golpe de cima descendo, o corpo avançando |
| `simon-golpe-estocada` | Estocada reta, braço esticado, corpo avançando |
| `simon-golpe-baixo` | Corte baixo, quase ajoelhado, espada varrendo na altura das pernas |
| `simon-desequilibrado` | Errou o golpe: tronco inclinado demais para a frente, a guarda aberta, a costela exposta |
| `simon-atingido` | Recuando, encolhido, a mão perto da costela |
| `simon-cansado` | Em pé, ofegante, espada baixa |

### Prompt-base (em inglês, copie e troque só a linha da pose)

> Photorealistic full-body photograph of [Laura: a 16-year-old girl with long wavy golden-blonde hair, pale skin, light linen shirt and trousers, barefoot] / [Simon: a 14-year-old boy with short dark hair, grey linen shirt, dark trousers, barefoot], holding a blunt steel training longsword. Side view, camera at chest height, full body visible from head to bare feet with margin above and below. Plain flat solid green background (#00FF00), no floor shadow, soft even top light. POSE: [descrição da pose]. Same character, same face and clothes as the reference image. Vertical 2:3.

## Extras que eu consigo fazer sem nada novo seu

- Espadas de madeira (quando Dolores tranca o arsenal): uso as mesmas poses e troco o som. Se quiser mesmo o visual, mande depois só 3 poses de cada (guarda, aparar, tocar) com espada de madeira.
- A respiração em repouso: faço com um pequeno balanço da própria imagem, sem pose nova.

## O que eu faço quando chegarem

Recorto o fundo, alinho os pés, ajusto a escala entre os dois, ligo as poses ao jogo e deixo os bonecos palito como reserva (se um arquivo faltar, aquela pose cai para o desenho antigo). Testo no PC e no celular.

---

## Feito (versão 4)

As duas folhas funcionaram bem; não precisa mandar uma por uma. O que foi feito com elas:
- Recorte do fundo verde com borda macia e tirada do verde que vaza no cabelo.
- Espelhamento: Simon inteiro; Laura nas poses 3 (inclinar) e 7 (atingida).
- Cada pose alinhada pelo centro dos pés, para a figura não "pular" ao trocar de imagem.
- Pontos marcados à mão nas poses de Simon (o pé que arrasta, o ombro que cai, os joelhos, a costela aberta), para os anéis de dica caírem no lugar certo do corpo.
- Arquivos em `assets/images/duelo/` (19 imagens webp, 330 KB no total).

Se um dia quiser trocar uma pose, basta mandar a imagem nova no mesmo formato (fundo verde, corpo inteiro) com o nome da pose.
