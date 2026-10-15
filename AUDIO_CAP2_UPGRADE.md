# Cap. II · Dublagens e sons novos do upgrade (v13)

O código já está pronto. Enquanto um áudio não existe, o capítulo fica sem ele (ou usa um som sintetizado de reserva) e nada quebra. Salve com o **nome exato**. As imagens estão em `MIDIAS_CAP2_UPGRADE.md`.

| Tipo | Pasta | Quantidade |
|---|---|---|
| Vozes da Laura | `assets/audio/voz/` | 15 |
| Sons | `assets/audio/` e `assets/audio/sfx/` | 5 |

---

## 1. Vozes da Laura (15) · `assets/audio/voz/`

São `.mp3`, mono, 24 kHz, 62 kbps é suficiente. A voz é a mesma natural da Laura de 16 anos, em inglês, como todas as outras. As tags entre colchetes são do Voicebox.

| Arquivo | Fala (EN) | Direção | Onde toca |
|---|---|---|---|
| `aula-sorte.mp3` | I got lucky. I already knew the bridge by heart. | modesta, um sorriso na voz | depois de vencer Justine na aula |
| `aula-ganhar.mp3` | Since you started winning. | provocação leve, segura | depois de vencer Justine na aula |
| `aula-sempre.mp3` | Always. You just never noticed. | orgulhosa, um pouco alto demais | depois de vencer Justine na aula |
| `aula-estava.mp3` | I was. | seca, honesta | depois de perder a aula |
| `aula-outra.mp3` | I was looking at something else. | baixo, quase envergonhada | depois de perder a aula |
| `aula-tudo.mp3` | At everything. | sussurro, para si mesma | pensamento dito, depois de vencer |
| `aula-espada.mp3` | If it were swords, you wouldn’t win. | baixo, teimosa | pensamento dito, depois de perder |
| `jantar-lei.mp3` | The law says the best one wins. If you don’t believe in it, you shouldn’t enter. | firme, a voz treme um fio no fim | à mesa, contra Joseph |
| `markus-devota.mp3` | I do. It’s the only thing at this table that isn’t for sale. | convicta, baixa | resposta a Markus |
| `markus-corte.mp3` | I believe you’ll win. Everyone says so. | tom de corte, educado, vazio | resposta a Markus |
| `markus-pergunta.mp3` | And you? Why did you enter? | curiosa, direta | resposta a Markus |
| `jantar-escolher.mp3` | She deserved to choose. [gasp] | escapa quase sem querer, sussurro; o susto no fim | no brinde do noivado |
| `corredor-caminho.mp3` | You’re in my way, sir. | fria, controlada | no corredor, para Joseph |
| `corredor-mes.mp3` | There’s still a month. A lot can happen in a month. | baixo, carregado | para Justine na janela |
| `corredor-bom.mp3` | [sigh] Joseph is a good knight. | mentira, a voz quebra | para Justine na janela |

---

## 2. Sons (5)

Se algum não chegar, o jogo usa um som sintetizado de reserva (menos o ambiente do salão, que fica em silêncio).

| Arquivo | O que é | Prompt (EN) |
|---|---|---|
| `assets/audio/salao-jantar.mp3` | ambiente do jantar, em loop, de 60 a 90 s | medieval castle dining hall ambience at night, two crackling hearth fires, soft clink of silver cutlery and cups, low murmur of a dozen voices without intelligible words, occasional chair scrape on stone, warm and intimate, seamless loop, no music |
| `assets/audio/sfx/sino-tarde.mp3` | o sino do fim do estudo, de 3 a 4 s | single distant castle tower bell strike in the late afternoon, warm bronze tone, long natural decay, light room reverb, no other sounds |
| `assets/audio/sfx/pena-papel.mp3` | pena riscando, ambiente baixo do estudo, uns 55 s | several quills scratching on parchment in a quiet stone room, pages turning now and then, faint afternoon birdsong far outside, no voices, 55 seconds |
| `assets/audio/sfx/brinde.mp3` | taças de prata no brinde, uns 2 s | several silver medieval goblets raised and clinking together at a dinner table, short and bright, small room reverb |
| `assets/audio/sfx/vinho-derrama.mp3` | vinho derramando, uns 2 s | red wine spilling over the rim of a silver cup onto a linen tablecloth, short liquid splash and soft drip, close perspective |

---

## Depois de gerar

1. Salve cada arquivo com o nome exato, na pasta indicada, dentro de `C:\projetos\cap2-livro`.
2. Rode o mesmo comando de sempre (`git add -A`, `git commit`, `git push`).
