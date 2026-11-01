# Réplica da tela de Evoluções do Bedside

Protótipo em React que reproduz a versão atual da tela, conforme as 54 imagens de
`../teste-evolucoes-bedside/telas/`. Não tem backend: `src/services/api.ts` lê `src/data/example-data.json` e guarda as
alterações em memória, com atraso de 300 a 800 ms. Ao recarregar a página, os dados voltam ao original.

## Rodar

```bash
pnpm install && pnpm dev
```

Abra `http://localhost:5173`.

| Comando | O que faz |
|---|---|
| `pnpm compare` | Regenera todas as comparações em `compare/` (original, protótipo e diferença) |
| `pnpm compare 13 27-30` | Regenera só essas imagens |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm build` | Checagem de tipos e build de produção |

`pnpm compare` usa o Chrome instalado na máquina e espera a pasta `teste-evolucoes-bedside/` ao lado deste projeto. A
porcentagem de cada imagem é a fração de pixels com diferença acima de 32/255; o resultado completo vai para
`compare/result.txt`.

## Rotas e estados

Os parâmetros servem para chegar direto a cada estado. Telas de celular usam a mesma URL em viewport de 390 px.
`scripts/scenes.ts` tem a lista completa, imagem por imagem.

| Rota | Estado | Imagens |
|---|---|---|
| `/evolucoes` | Lista | 01, 02 |
| `?menu=maria` | Menu ⋮ aberto | 03, 04 |
| `?summary=maria` | Resumo da IA no card | 05 |
| `?archived=1&menu=roberto` | Arquivados ligado, com menu | 06 |
| `?search=Valdemar` | Busca sem resultado | 07 |
| `?state=empty` | Primeiro acesso | 08 |
| `?state=loading` | Carregando | 09 |
| `/evolucoes/novo` | Adicionar paciente; `?sample=1` preenche | 10, 11, 12 |
| `/evolucoes/:id` | Editor; `?note=:noteId` abre outra nota | 13, 14, 20, 21 |
| `?rail=open` | Faixa de ferramentas aberta | 15 |
| `?slash=top`, `?slash=bedside` | Menu do `/`, no início e no fim | 16, 17, 18 |
| `?simulateError=1` | Erro no salvamento automático | 19 |
| `?dialog=finish`, `?dialog=delete` | Diálogos | 22, 23, 24 |
| `/evolucoes/luana` | Paciente sem evolução | 25, 26 |
| `?panel=history` | Histórico | 27, 28 |
| `?panel=companion`, `&analisado=1`, `&aba=pontos` | Osler Companion | 29 a 32 |
| `?panel=handoff`, `&gerado=1` | Passar caso | 33, 34, 35 |
| `?panel=flowchart` | Fluxograma de lab | 36, 37 |
| `?panel=cid&search=pneumonia&selected=J18.9,J44.1` | CID-10 | 38, 39 |
| `?panel=calc`, `&calc=curb65` | Calculadoras | 40, 41, 42 |
| `?panel=templates`, `&template=soap` | Templates | 43, 44, 45 |
| `?panel=lme` | LME / APAC | 46, 47 |
| `?panel=archive` | Arquivar paciente | 48, 49 |
| `?pc=scan`, `?pc=confirm` | Abrir no computador | 50, 51, 52 |
| `/bedside-pc` | QR no computador | 53 |
| `/bedside-pc/sessao` | Computador conectado | 54 |

`?capture=1` zera os atrasos da API e esconde o botão "Simular leitura". É o que `pnpm compare` usa.

## Decisões

**Fonte:** Plus Jakarta Sans. A fonte das telas parece ser a Garet, citada no `index.html` do pacote, mas os arquivos não
vieram no pacote. Entre as quatro candidatas, a Plus Jakarta foi a mais próxima na largura do texto. Ajustes de
`letter-spacing` compensam a diferença e aproximam as quebras de linha das imagens.

**Quando a imagem diverge do pedido, vale a imagem:**

- A tela de carregando (09) é só um texto, sem skeleton.
- O computador conectado (54) mantém a faixa de ferramentas e o Excluir.
- O header tem 60 px só na lista e no cadastro.
- Excluir e Copiar tudo são apenas ícones.

**Defeitos mantidos de propósito:** `Buscar formulário...` literal, "Incluir arquivados" no texto de arquivar contra
"Mostrar arquivados" no switch, rótulos cortados no segmentado do celular, e a faixa vazia de 60 px à direita.

**Conteúdo que as imagens não mostram:**

- **CURB-65:** só os critérios C e U, os únicos visíveis. A pontuação vai de 0 a 2, e "Inserir resultado" grava apenas
  `Pontuação: N`. **Não use como calculadora clínica.**
- **Calculadoras:** só os nomes legíveis existem, e só o CURB-65 abre. O contador `FARMACOLOGIA · 19` é o da imagem, embora
  a lista tenha 11 itens. O grupo `PNEUMOLOGIA · 1` não aparece nas telas e foi criado para dar acesso ao CURB-65.
- **Menu do `/`:** o trecho entre `Lista` e `Tabela` não aparece. `Lista numerada`, `Tabela` e `Imagem` foram incluídos a
  partir do pedido e da legenda.
- **Templates:** o conteúdo usa os títulos de seção dos dados de exemplo, e SOAP usa os nomes da própria descrição. O grupo
  de templates do médico só aparece se houver algum, e o mock vem vazio.
- **Aba Resumo do Companion:** repete o resumo da tela 05.
- **CID-10:** as descrições cortadas nas imagens foram completadas com os nomes da CID-10; cada código é inserido como
  `J18.9 - Pneumonia não especificada`.
- **Fluxograma:** o texto "Atualizar na evolução" e o estado de data desmarcada não aparecem nas imagens.

**Detalhes sem imagem, resolvidos da forma mais discreta:** hover, foco e seleção usam fundos neutros e o contorno de foco
padrão do projeto; as janelas abrem sem animação e com o foco no próprio conteúdo; o editor não mostra alça de arrastar nem
barra de formatação.

**Fluxos simulados:** na tela 50, tocar no quadro da câmera simula a leitura do QR. Em `/bedside-pc`, o botão "Simular
leitura", que não existe nas imagens, abre a sessão. O relógio fica fixo em 28/10/2026, 11:53, para bater com as telas.

**Marca d'água e painel vermelho:** a marca d'água é um SVG traçado do logo da tela 53 (`scripts/extract-assets.ts` e
`scripts/build-watermark.ts`). O painel vermelho é um recorte dessa mesma imagem. O conteúdo do QR foi lido da imagem.
