## Rodar

```bash
pnpm install && pnpm dev
```

Abra `http://localhost:5173`.

| Comando | O que faz |
|---|---|
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |
| `pnpm build` | Checagem de tipos e build de produção |

`pnpm compare` usa o Chrome instalado na máquina e espera a pasta `teste-evolucoes-bedside/` ao lado deste projeto. A
porcentagem de cada imagem é a fração de pixels com diferença acima de 32/255; o resultado completo vai para
`compare/result.txt`.

## Propostas

Foram apresentadas duas propostas, os códigos de cada uma, bem como a do estao original está dividido da seguinte maneira em branches:
| Branch | Proposta |
|---|---|
| `main` | AS IS - O estado inicial do desafio |
| `feat/simple-changes` | Mudanças simples |
| `feat/complex-changes` | Mudanças complexas |

Para mais informações acesse o arquivo **PROPOSTA.md**