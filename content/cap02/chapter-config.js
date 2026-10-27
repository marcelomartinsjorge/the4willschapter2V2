/* Capítulo II (Laura): zonas de som e codex. O codex foi copiado da versão anterior do capítulo (the4willschapter2). */
window.CHAPTER_CONFIG = {
  "zones": {
    "alfaiataria": {
      "pt": "O Aposento do Alfaiate",
      "en": "The Tailor's Room",
      "volume": 0.5,
      "src": "assets/audio/alfaiataria-loop.mp3",
      "oneShot": [
        "assets/audio/tecido-farfalhar.mp3",
        "assets/audio/relogio-alfaiataria.mp3"
      ]
    },
    "castelo": {
      "pt": "A Sala de Aula",
      "en": "The Schoolroom",
      "volume": 0.4,
      "src": "assets/audio/aula-loop.mp3"
    },
    "oratorio": {
      "pt": "O Oratório",
      "en": "The Shrine",
      "volume": 0.38,
      "src": "assets/audio/oratorio-loop.mp3",
      "oneShot": [
        "assets/audio/vela-tremular.mp3"
      ]
    },
    "noite": {
      "pt": "O Jardim, à Noite",
      "en": "The Garden at Night",
      "volume": 0.45,
      "src": "assets/audio/jardim-noite-loop.mp3",
      "oneShot": [
        "assets/audio/passos-terra.mp3"
      ]
    },
    "laranjal": {
      "pt": "O Laranjal",
      "en": "The Orangery",
      "volume": 0.5,
      "src": "assets/audio/laranjal-loop.mp3"
    },
    "quarto": {
      "pt": "O Quarto",
      "en": "The Bedroom",
      "volume": 0.35,
      "src": "assets/audio/quarto-amanhecer-loop.mp3"
    }
  },
  "codex": {
    "torneio-real": {
      "image": "assets/images/codex-torneio-real.webp",
      "accent": "gold",
      "aliasesEn": [
        "Royal Tournament"
      ],
      "aliasesPt": [
        "Torneio Real"
      ],
      "en": {
        "title": "Royal Tournament",
        "eyebrow": "Redom · Succession rite",
        "pages": [
          [
            "The Royal Tournament is the mechanism by which Redom chooses its General-King. There is no hereditary crown on the military throne: when the General-King dies or becomes unfit to lead, the kingdom calls the Tournament, which is usually held a year after being called. Only nobles may enter to compete for the highest office Redom offers."
          ],
          [
            "The competition unfolds in two phases. The first is individual and scored: archery, a mounted circuit, and a general trial of logic, military strategy, and first aid. The four highest scorers advance to the second phase — semifinal and final, direct combat in full armor, with shield and longsword. The winner does not inherit the throne: he conquers it. It is this philosophy — that power must be proven, never received — that sustains the whole system's legitimacy in the eyes of the people."
          ],
          [
            "Beside the winning General-King reigns the Mother-Queen, chosen by lineage and preparation, never by combat. The Tournament, then, decides half the throne; the other half answers to a completely different logic."
          ]
        ]
      },
      "pt": {
        "title": "Torneio Real",
        "eyebrow": "Redom · Rito de sucessão",
        "pages": [
          [
            "O Torneio Real é o mecanismo pelo qual Redom escolhe seu General-Rei. Não existe coroa hereditária no trono militar: quando o General-Rei morre ou fica incapaz de liderar, o reino convoca o Torneio, que costuma acontecer um ano após a convocação. Somente nobres podem se inscrever para disputar o cargo mais alto que Redom oferece."
          ],
          [
            "A disputa se divide em duas fases. Na primeira, individual e por pontuação, os candidatos são avaliados em tiro ao alvo, circuito a cavalo e uma prova geral de lógica, estratégia militar e primeiros socorros. Os quatro mais bem pontuados avançam para a segunda fase: semifinal e final, em combate direto, de armadura completa, com escudo e espada longa. O vencedor não herda o trono. Conquista-o, e é nisso que o povo apoia a legitimidade do cargo."
          ],
          [
            "Ao lado do General-Rei vencedor governa a Mãe-Rainha, escolhida por linhagem e preparo, nunca por combate. O Torneio decide metade do trono; a outra metade segue as regras de sucessão da Mãe-Rainha."
          ]
        ]
      }
    },
    "general-rei": {
      "image": "assets/images/codex-general-rei.webp",
      "accent": "gold",
      "aliasesEn": [
        "General-King"
      ],
      "aliasesPt": [
        "General-Rei"
      ],
      "en": {
        "title": "General-King",
        "eyebrow": "Redom · Military throne",
        "pages": [
          [
            "The General-King is the winner of the Royal Tournament. The title was born in an age when the alliance between humans and the Lúmae sustained human survival against the Grakh."
          ],
          [
            "Originally, the two offices were one — a single couple who reigned together and produced heirs for both roles. Over time, war and administration grew too large for one unified crown to bear, and the two split apart. What survives today as the Lord-Marshal and the High Regent is the fossil echo of that throne that was once whole."
          ]
        ]
      },
      "pt": {
        "title": "General-Rei",
        "eyebrow": "Redom · Trono militar",
        "pages": [
          [
            "O General-Rei é o vencedor do Torneio Real. O título nasceu numa era em que a aliança entre os humanos e os Lúmae sustentava a sobrevivência humana contra os Grakh."
          ],
          [
            "Na origem, os dois cargos eram um só: um casal que reinava junto e gerava herdeiros para os dois ofícios. Com o tempo, a guerra e a administração cresceram demais para uma coroa só, e os dois se separaram. Os cargos de Lorde-Marechal e de Alta Regente vêm dessa divisão."
          ]
        ]
      }
    },
    "mae-rainha": {
      "image": "assets/images/codex-mae-rainha.webp",
      "accent": "gold",
      "aliasesEn": [
        "Mother-Queen"
      ],
      "aliasesPt": [
        "Mãe-Rainha"
      ],
      "en": {
        "title": "Mother-Queen",
        "eyebrow": "Redom · Civil throne",
        "pages": [
          [
            "The Mother-Queen reigns beside the General-King, but reaches the throne by a path opposite to his: she does not fight, does not conquer — she is chosen by lineage and preparation, under the belief that women administer and care for the population with more wisdom than any man."
          ],
          [
            "The rule of succession is not symmetrical. If the General-King dies first, the surviving Mother-Queen chooses her successor by custom — almost always her own daughter, who will marry the Tournament's next winner, with no blood relation to him. But if it is the Mother-Queen who dies first, the still-reigning General-King needs a new wife. In that case, a council of matriarchs and noble houses chooses, among the Candidates — women raised from childhood under the matriarchs' tutelage for exactly this — which one is most fit to govern."
          ]
        ]
      },
      "pt": {
        "title": "Mãe-Rainha",
        "eyebrow": "Redom · Trono civil",
        "pages": [
          [
            "A Mãe-Rainha reina ao lado do General-Rei, mas chega ao trono por outro caminho: não combate. É escolhida por linhagem e preparo, porque Redom acredita que as mulheres administram e cuidam da população com mais sabedoria que os homens."
          ],
          [
            "A regra de sucessão não é simétrica. Se o General-Rei morre primeiro, a Mãe-Rainha sobrevivente escolhe sua sucessora por costume — quase sempre a própria filha, que casará com o próximo vencedor do Torneio, sem qualquer parentesco com ela. Mas se é a Mãe-Rainha quem morre primeiro, o General-Rei ainda no trono precisa de nova esposa. Nesse caso, um conselho de matriarcas e Casas nobres escolhe, entre as Candidatas, a mais adequada para governar. As Candidatas são moças criadas desde cedo sob a tutela das matriarcas para esse fim."
          ]
        ]
      }
    },
    "cavaleiro": {
      "image": "assets/images/codex-cavaleiro.webp",
      "accent": "gold",
      "aliasesEn": [
        "Knight"
      ],
      "aliasesPt": [
        "Cavaleiro"
      ],
      "en": {
        "title": "The Knight",
        "eyebrow": "God of Redom",
        "pages": [
          [
            "The Knight is one of the two gods worshipped in Redom, honored side by side with the Judge. He appears as a warrior in spotless armor — always clean, gleaming — mounted on an imposing white horse, his face forever hidden beneath his helm."
          ],
          [
            "Prayers to Him usually ask for courage, or for penance."
          ]
        ]
      },
      "pt": {
        "title": "O Cavaleiro",
        "eyebrow": "Deus de Redom",
        "pages": [
          [
            "O Cavaleiro é um dos dois deuses cultuados em Redom, adorado lado a lado com a Juíza. Nas estátuas e nos vitrais, aparece como um guerreiro de armadura limpa e reluzente, montado num cavalo branco, com o rosto fechado sob o elmo."
          ],
          [
            "As preces a Ele costumam pedir coragem ou penitência."
          ]
        ]
      }
    },
    "juiza": {
      "image": "assets/images/codex-juiza.webp",
      "accent": "turq",
      "aliasesEn": [
        "Judge"
      ],
      "aliasesPt": [
        "Juíza"
      ],
      "en": {
        "title": "The Judge",
        "eyebrow": "Goddess of Redom",
        "pages": [
          [
            "The Judge is one of the two deities worshipped in Redom."
          ],
          [
            "Where the Knight represents strength, courage, and loyalty, the Judge represents order, discipline, and justice. The faithful kneel before Her to ask for wisdom in their decisions, for divine justice, and for resilience."
          ]
        ]
      },
      "pt": {
        "title": "A Juíza",
        "eyebrow": "Deusa de Redom",
        "pages": [
          [
            "A Juíza é uma das duas divindades cultuadas em Redom."
          ],
          [
            "Onde o Cavaleiro representa força, coragem e lealdade, a Juíza representa ordem, disciplina e justiça. Fiéis se ajoelham diante Dela para pedir sabedoria nas decisões, justiça divina e resiliência."
          ]
        ]
      }
    },
    "guerra-eterna": {
      "image": "assets/images/codex-guerra-eterna.webp",
      "accent": "turq",
      "aliasesEn": [
        "Eternal War"
      ],
      "aliasesPt": [
        "Guerra Eterna"
      ],
      "en": {
        "title": "Eternal War",
        "eyebrow": "Redom · Conflict with the Grakh",
        "pages": [
          [
            "The Eternal War is the name Redom gives to the age-old conflict against the Grakh — a confrontation so old that no one alive remembers a time without it. It began as a dispute over fertile land. Common belief holds that the war is, at last, near its end: the Grakh are no longer considered a serious threat, and now live apart, in the desert. History lessons teach every new generation to read this as a sign that Redom's final victory is close."
          ]
        ]
      },
      "pt": {
        "title": "Guerra Eterna",
        "eyebrow": "Redom · Conflito com os Grakh",
        "pages": [
          [
            "A Guerra Eterna é o nome que Redom dá ao conflito contra os Grakh, mais antigo que o registro mais velho das Casas. Começou como disputa por terras férteis. As aulas de história ensinam que a guerra está perto do fim e que os Grakh, recuados no deserto, já não oferecem perigo real."
          ]
        ]
      }
    },
    "apagar-das-luzes": {
      "image": "assets/images/codex-apagar-das-luzes.webp",
      "accent": "turq",
      "aliasesEn": [
        "Dimming of the Lights"
      ],
      "aliasesPt": [
        "Apagar das Luzes"
      ],
      "en": {
        "title": "The Dimming of the Lights",
        "eyebrow": "Redom · Taught history",
        "pages": [
          [
            "The Dimming of the Lights is the popular name, taught to Redom's children, for the disappearance of the Lúmae. The official account attributes it to a curse: the inevitable result of a people who practiced magic. In every history lesson, the Dimming of the Lights serves as a living reminder of magic's dangers, reinforcing the anti-magic doctrine Redom teaches every generation."
          ]
        ]
      },
      "pt": {
        "title": "Apagar das Luzes",
        "eyebrow": "Redom · História ensinada",
        "pages": [
          [
            "O Apagar das Luzes é o nome que as crianças de Redom aprendem para o desaparecimento dos Lúmae. A versão oficial fala em maldição: um povo que usou magia e foi apagado por ela. A história sustenta a proibição da magia, que vale em todo o reino."
          ]
        ]
      }
    },
    "redom": {
      "image": "assets/images/codex-redom.webp",
      "accent": "gold",
      "aliasesEn": [
        "Redom"
      ],
      "aliasesPt": [
        "Redom"
      ],
      "en": {
        "title": "Redom",
        "eyebrow": "The White Capital · Human empire",
        "pages": [
          [
            "Redom is the greatest human empire in the known world — a web of cities governed from the capital that lends the whole kingdom its name, built in white limestone that blinds at midday. It was not born with a hereditary crown: power is proven, not inherited, and that logic underpins both the Royal Tournament and the people's faith in themselves."
          ],
          [
            "Redom's architecture is all pale stone and straight lines — tall walls, severe angles, no ornament that doesn't serve defense or military glory. Where other peoples decorate, Redom reinforces."
          ],
          [
            "The people of Redom believe themselves the only truly clear-eyed people in the world — the only ones who see reality without the \"crutches\" other peoples lean on. They reject all magic on principle, treating it as weakness and a doorway to madness. They win through discipline, honor, and steel."
          ]
        ]
      },
      "pt": {
        "title": "Redom",
        "eyebrow": "A Capital Branca · Império humano",
        "pages": [
          [
            "Redom é o maior império humano do mundo conhecido: uma rede de cidades governadas a partir da capital, que dá nome ao reino. A capital é de pedra calcária branca e ofusca ao meio-dia. O trono militar não é hereditário: passa pelo Torneio Real."
          ],
          [
            "A arquitetura de Redom é de pedra clara e linhas retas: muralhas altas, ângulos severos, nenhum ornamento que não sirva à defesa ou à glória militar."
          ],
          [
            "O povo de Redom se considera o único lúcido do mundo, o único que enxerga a realidade sem as \"muletas\" que os outros povos usam. Rejeita toda magia por princípio, como fraqueza e porta de entrada para a loucura, e confia na disciplina, na honra e no aço."
          ]
        ]
      }
    },
    "grakh": {
      "image": "assets/images/codex-grakh.webp",
      "accent": "turq",
      "aliasesEn": [
        "Grakh"
      ],
      "aliasesPt": [
        "Grakh"
      ],
      "en": {
        "title": "Grakh",
        "eyebrow": "The Dry Mouth · Desert people",
        "pages": [
          [
            "The Grakh are a people of the great desert south of Redom — far larger than any human, averaging close to 2.10 meters in height. Large and asymmetrical, in perpetual growth: the body never stops changing, bones thicken, muscle reshapes itself over an entire lifetime, without ever storing fat. Their skin is ash-grey. They have two stomachs and eat almost constantly — hunger is nearly constant for them, and the physical strength they carry is immense."
          ],
          [
            "They mature quickly but rarely live past forty winters. They live in tribal structure, organized into moving hordes led by whichever warrior is currently strongest, with no fixed cities. They believe only in strength and appetite, and despise science and magic as the cowardice of those too weak to settle things with their own body. They don't form one single, large army — they come in small, constant waves, generation after generation, never stopping."
          ]
        ]
      },
      "pt": {
        "title": "Grakh",
        "eyebrow": "A Boca Seca · Povo do deserto",
        "pages": [
          [
            "Os Grakh são um povo do grande deserto ao sul de Redom, muito maiores que qualquer humano: um Grakh adulto passa um homem alto por uma cabeça. São assimétricos e crescem a vida toda: os ossos engrossam, os músculos se remodelam, e o corpo não acumula gordura. A pele é acinzentada. Têm dois estômagos, comem quase o tempo todo, e a força física deles é descomunal."
          ],
          [
            "Amadurecem rápido, mas raramente ultrapassam os quarenta invernos. Vivem em estrutura tribal, organizados em hordas móveis lideradas pelo guerreiro mais forte do momento, sem cidades fixas. Creem só na força e no apetite, e desprezam ciência e magia como covardia de quem é fraco demais para resolver as coisas com o próprio corpo. Não formam um exército único: vêm em levas pequenas e constantes, geração após geração."
          ]
        ]
      }
    }
  }
};
