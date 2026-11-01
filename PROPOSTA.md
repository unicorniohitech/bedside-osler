# Proposta da tela de Evoluções: o que o backend precisaria

O protótipo roda sem backend, com os dados de `src/data/example-data.json` e os mocks de `src/mocks/`. Este documento
lista o que falta na API para a proposta funcionar com dados reais. Os nomes de rotas e campos são sugestões.

## Listagem de pacientes

A listagem hoje devolve `last_note_at` e `last_note_locked_at`, e o front calcula o status de hoje em
`src/lib/noteStatus.ts`.

| Campo novo | Tipo | Para quê |
|---|---|---|
| `today_status` | `draft`, `finished` ou `none` | Evita que cada cliente recalcule a regra e erre o dia por causa do fuso |
| `today_note_id` | `string` ou `null` | Abre direto a nota de hoje, sem carregar todas as notas |
| `today_note_saved_at` | data ou `null` | Hora do chip "Rascunho · salvo HH:MM" |
| `today_note_locked_at` | data ou `null` | Hora do chip "Finalizada às HH:MM" |
| `photo_avatar` | URL ou `null` | Hoje só existe no JSON de exemplo |
| `health_status` | enum | Precisa vir na listagem e no detalhe; no JSON de exemplo o detalhe nem sempre tem o campo |

O dia precisa ser calculado no fuso do hospital. O ideal é a API receber o fuso, ou guardá-lo por unidade.

Contagens para o topo da lista e a coluna "Hoje · X de Y", que hoje saem da lista completa:

```
GET /evolutions/today-summary
{ "todo": 5, "finished": 1, "total": 6, "archived": 1 }
```

## Notas

| Rota | Mudança |
|---|---|
| `POST /evolutions/:id/notes` | Garantir uma nota de rascunho por paciente e dia: repetir "Iniciar" devolve a nota existente, em vez de criar outra |
| `PATCH /evolutions/:id/notes/:noteId` | Devolver erro de conflito por `version` quando dois aparelhos editam a mesma nota |
| `POST /evolutions/:id/notes/:noteId/finish` | Receber a `version` esperada, para não fechar uma nota com alteração ainda não salva |
| `POST /evolutions/:id/notes/:noteId/copied` (opcional) | Registrar que o texto foi copiado para o prontuário do hospital, para auditoria |

O texto puro copiado é gerado no cliente por `src/lib/noteText.ts`. Se o formato precisar ser igual em todos os
clientes, vale a API devolver `plain_text` na nota.

## Inserção no cursor

A seção do cursor ("Insere em Conduta") e a prévia tracejada são resolvidas no editor e não precisam de rota. O
backend entra em dois pontos:

- **Ids de bloco estáveis:** `content[].id` precisa ser preservado ao salvar, porque seções e alertas apontam para eles.
- **Seção de cada inserção:** para sugerir itens pela seção, `GET /evolutions/:id/used-items` devolveria o que já foi
  usado neste paciente.

```
{
  "cid": [{ "code": "J18.0", "last_used_at": "...", "section": "Conduta" }],
  "calculators": [{ "id": "curb65", "last_used_at": "..." }],
  "templates": [{ "id": "soap", "last_used_at": "..." }]
}
```

Hoje o protótipo procura códigos no texto das notas, o que falha quando o código é citado sem ter sido inserido.

## Vínculo entre alerta e trecho da nota

`GET /evolutions/:id/companion` precisa devolver o trecho de origem de cada alerta, além da contagem para o badge
"N alertas":

```
{
  "alert_count": 3,
  "analyzed_note_version": 12,
  "alerts": [
    {
      "level": "warning",
      "title": "SatO2 acima do alvo para DPOC",
      "text": "...",
      "anchor": { "note_id": "n-maria-4", "block_id": "b5", "field": "sat_o2" }
    },
    {
      "level": "info",
      "title": "Azitromicina termina amanhã",
      "text": "...",
      "anchor": { "note_id": "n-maria-4", "block_id": "b2", "quote": "azitromicina 500 mg/dia" }
    }
  ]
}
```

- `field` aponta para um campo de bloco estruturado; `quote` aponta para um trecho de texto.
- Sem `anchor`, ou se o trecho foi editado e não existe mais, o alerta aparece sem o link "Ver na nota".
- `analyzed_note_version` mostra se a análise ficou desatualizada em relação à nota.

No protótipo, os alertas são os mesmos para todos os pacientes, e os trechos são localizados por texto.

## Próximo paciente

A ordem da coluna "Pacientes de hoje" e do link "Próximo paciente" sai da mesma regra da lista: rascunhos, sem evolução
e finalizadas. Se a ordem depender de algo do servidor, como a ronda, `today_order` entra na listagem.

## Arquivar

`POST /evolutions/:id/archive` e `/unarchive` agora são chamados direto do menu ⋮ da lista, além do editor. A resposta
precisa trazer `today-summary` atualizado, ou o cliente refaz a consulta.

## Fora do escopo do protótipo

- **Ditado:** o botão insere o bloco de ditado, sem gravar áudio. Falta a rota de transcrição.
- **LME / APAC:** continua com o mock atual e não abre sistema externo.
