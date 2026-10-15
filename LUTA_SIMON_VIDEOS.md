# Luta contra Simon · vídeos dos movimentos (sprites)

## Como funciona

Cada vídeo mostra **um movimento só**: o personagem começa em guarda, faz o golpe e volta exatamente para a mesma guarda. Eu corto o trecho do golpe, recorto o fundo verde e transformo em sequência de quadros. Como todos começam e terminam na mesma pose, um golpe emenda no outro sem pulo.

Os mesmos vídeos servem para os três estilos. A decisão do estilo fica para depois de ver o resultado:
- **fotorrealista:** os quadros recortados como estão;
- **silhueta:** eu pinto a figura de preto, com uma borda de luz da alvorada;
- **pixel art:** eu reduzo e simplifico as cores.

## Regras para todos os vídeos

- **Image-to-video.** O primeiro quadro é a imagem de guarda que você já tem (`laura-guarda` / `simon-guarda`, a versão com fundo verde).
- **Último quadro igual ao primeiro.** Se a ferramenta deixar escolher o quadro final (Kling, Luma, Runway e outras têm "end frame"), use a mesma imagem de guarda. Se não deixar, o prompt já pede a volta.
- **5 segundos**, 24 quadros por segundo ou mais, sem áudio.
- **Câmera travada:** de lado, na altura do peito, sem zoom, sem movimento.
- Corpo inteiro no quadro o tempo todo, com folga em cima, embaixo e dos lados. Se um pé ou a espada sair do quadro, o vídeo não serve.
- Fundo verde chapado do começo ao fim, sem sombra no chão.
- A direção não importa (eu espelho), mas mantenha a mesma em todos os vídeos do mesmo personagem.
- Nome do arquivo: `luta-laura-<movimento>.mp4` / `luta-simon-<movimento>.mp4`.

## Prompt-base (copie e troque só a linha ACTION)

> Image-to-video. Locked-off static camera, side view at chest height, no zoom, no camera movement. The full body stays inside the frame at all times, head to bare feet, with the sword always visible. Plain flat solid green background (#00FF00) for the whole video, no floor shadow, soft even light. Crisp image, fast shutter, no motion blur. The character starts in the exact pose of the reference image and ends in the exact same pose, same spot, same sword position. ACTION: [ação]. The action happens once, in the middle of the clip, then the character returns to the starting guard and holds still.

## Laura (9 vídeos)

| Arquivo | ACTION |
|---|---|
| `luta-laura-guarda` | she holds her guard and only breathes slowly, shoulders rising and falling, a small shift of weight from one foot to the other, nothing else moves |
| `luta-laura-avancar` | she advances two short fencing steps forward, front foot first, back foot following, sword held steady in guard, then steps back to her starting spot with two short steps |
| `luta-laura-recuar` | she retreats two short fencing steps backward, back foot first, sword held steady in guard, then returns to her starting spot with two short steps |
| `luta-laura-estocada` | a fast straight thrust: she lunges forward on the front foot, arm fully extended, sword point at chest height, holds for a split second, then recovers back into guard |
| `luta-laura-corte` | a slower, heavy diagonal cut: she raises the sword above her right shoulder and brings it down diagonally across the body with a step forward, then recovers back into guard |
| `luta-laura-aparar` | a quick parry: she snaps the sword up diagonally above her head to block a blow from the front, the blade jolts as if struck, then she lowers it back into guard |
| `luta-laura-esquiva` | a quick dodge: she leans her torso back and to the side as if a blade passes in front of her chest, feet stay planted, then returns upright into guard |
| `luta-laura-atingida` | she is hit on the shoulder by an unseen blunt blade: she flinches, turns her shoulder away and stumbles half a step back, grimaces, then straightens and returns into guard |
| `luta-laura-baixar` | **(não volta à guarda)** she slowly lowers the sword to her side, her shoulders drop, she looks down at the ground and stays like that |

## Simon (9 vídeos)

| Arquivo | ACTION |
|---|---|
| `luta-simon-guarda` | he holds his guard and only breathes, slightly impatient, bouncing a little on his toes, nothing else moves |
| `luta-simon-avancar` | he advances two short fencing steps forward, sword held in guard, then steps back to his starting spot |
| `luta-simon-recuar` | he retreats two short fencing steps backward, sword held in guard, then returns to his starting spot |
| `luta-simon-estocada` | **the tell matters:** first his back foot slides outward on the ground, clearly visible, then he makes a straight thrust, arm fully extended, then recovers back into guard |
| `luta-simon-corte` | he lifts the sword high behind his head and brings it down in a strong vertical cut with a step forward, then recovers back into guard |
| `luta-simon-aparar` | he raises the sword diagonally to block a blow from the front, the blade jolts as if struck, then lowers it back into guard |
| `luta-simon-desequilibrado` | his attack misses: he overcommits, his torso pitches too far forward, arms wide, guard open, he stumbles one step and catches himself, then scrambles back into guard |
| `luta-simon-atingido` | he is touched on the ribs by an unseen blunt blade: he curls around the side, hand near his ribs, takes half a step back, then straightens angrily back into guard |
| `luta-simon-furia` | three fast, wild attacks in a row, a thrust, a cut, another thrust, sloppy and angry, then he returns to his guard breathing hard |

## Fim da luta (opcionais, não voltam à guarda)

| Arquivo | ACTION |
|---|---|
| `luta-simon-derrota` | he lowers his sword, breathing hard, looks down and kicks the dirt once |
| `luta-simon-vitoria` | he raises his sword with a surprised, proud grin, then looks at her as if unsure he really won |

## Se der errado

- **Mudou o rosto ou a roupa no meio do clipe:** gere de novo. Para silhueta isso não importa.
- **A câmera mexeu:** gere de novo com "tripod shot, the camera does not move at all" no começo do prompt.
- **O golpe ficou lento ou mole:** acrescente "sharp, fast, athletic motion, real fencing technique".
- **Fez o golpe duas vezes:** sem problema, eu uso só o primeiro.
