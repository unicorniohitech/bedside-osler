# Proposta da tela de Evoluções do Bedside

Protótipo em React da nova proposta da tela: lista organizada pelo trabalho de hoje, editor em três colunas no
computador, barra fixa no celular e fluxo de copiar e finalizar. O que o backend precisaria está em
[PROPOSTA.md](PROPOSTA.md). No protótipo, "hoje" é 28/10/2026, no horário de São Paulo. Não tem backend: `src/services/api.ts` lê `src/data/example-data.json` e guarda as
alterações em memória, com atraso de 300 a 800 ms. Ao recarregar a página, os dados voltam ao original.

## Rodar

```bash
pnpm install && pnpm dev
```

Abra `http://localhost:5173`.

| Comando | O que faz |
|---|---|
| `pnpm compare` | (Réplica antiga, ver abaixo) Regenera todas as comparações em `compare/` (original, protótipo e diferença) |
| `pnpm compare 13 27-30` | Regenera só essas imagens |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm build` | Checagem de tipos e build de produção |

As imagens de `telas/` mostram a versão anterior da tela, então `pnpm compare` agora serve só como referência do que
mudou. Ele usa o Chrome instalado na máquina e espera a pasta `teste-evolucoes-bedside/` ao lado deste projeto. A
porcentagem de cada imagem é a fração de pixels com diferença acima de 32/255; o resultado completo vai para
`compare/result.txt`.

## Rotas e estados

Os parâmetros servem para chegar direto a cada estado. Telas de celular usam a mesma URL em viewport de 390 px.
Em janelas de 768 a 1199 px, o painel de ferramentas recolhe para uma coluna de ícones.

| Rota | Estado |
|---|---|
| `/evolucoes` | Lista de hoje |
| `?menu=maria` | Menu ⋮ aberto |
| `?summary=maria` | Resumo da IA no card |
| `?archived=1` | Aba Arquivados |
| `?search=Valdemar` | Busca sem resultado |
| `?state=empty` | Primeiro acesso |
| `?state=loading` | Carregando |
| `/evolucoes/novo` | Adicionar paciente; `?sample=1` preenche |
| `/evolucoes/:id` | Editor; `?note=:noteId` abre outra nota |
| `?slash=top`, `?slash=bedside` | Menu do `/` |
| `?simulateError=1` | Erro no salvamento automático |
| `?dialog=delete` | Excluir nota |
| `/evolucoes/luana` | Paciente sem evolução |
| `?panel=history` | Histórico completo |
| `?panel=companion&analyzed=1` | Osler Companion com alertas e trechos destacados |
| `?panel=handoff`, `&generated=1` | Passar caso |
| `?panel=flowchart` | Fluxograma de lab (painel de 480 px) |
| `?panel=cid&search=pneumonia&selected=J18.0,J44` | CID-10 com prévia na nota |
| `?panel=calc`, `&calc=curb65` | Calculadoras |
| `?panel=templates`, `&template=soap` | Templates |
| `?panel=lme` | LME / APAC |
| `?panel=archive` | Arquivar paciente |
| `?pc=scan`, `?pc=confirm` | Abrir no computador do hospital |
| `/bedside-pc` | QR no computador |
| `/bedside-pc/sessao` | Computador conectado |

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
