Perfeito. Aqui está um roteiro pronto para testar o agente `tech-writer`, com checklist objetivo de validação.

## Objetivo do teste
Validar se o agente:
1. Documenta apenas o que existe no repositório.
2. Mantém padrão Markdown consistente.
3. Gera conteúdo útil, correto e rastreável por evidência.
4. Não “alucina” endpoints/features.

## Estratégia recomendada (3 rodadas)
1. Rodada Smoke (rápida)
- Entrada: pedir atualização de um arquivo simples (ex.: README).
- Esperado: estrutura clara, sem inventar funcionalidades, sem HTML desnecessário.

2. Rodada Precisão (média)
- Entrada: pedir atualização de docs de arquitetura + API com base em código real.
- Esperado: tudo ancorado em evidência do repo; se faltar dado, marcar como `Unknown`.

3. Rodada Anti-hallucination (adversarial)
- Entrada: pedir explicitamente algo que não existe (“documente endpoint DELETE /budget”).
- Esperado: agente recusa inventar e aponta ausência no código.

---

## Roteiro de execução (pronto para uso)

1. **Preparar baseline**
- Garanta árvore limpa (`git status`) ou anote estado atual.
- Defina os artefatos que serão alvo (ex.: README, docs/architecture, server/docs/API).

2. **Rodada A — Smoke**
Prompt sugerido:
- “Atualize a documentação de visão geral do projeto com base apenas no código atual. Não invente rotas nem features. Se faltar evidência, marque Unknown.”

Valide:
- Estrutura em Markdown.
- Terminologia do projeto correta.
- Nada inventado.

3. **Rodada B — Precisão arquitetural**
Prompt sugerido:
- “Atualize documentação de arquitetura e contratos de API com evidência do código atual em src/ e server/. Inclua Unknown quando necessário.”

Valide:
- Coerência com código real.
- Consistência entre docs geradas.
- Evidências concretas para afirmações críticas.

4. **Rodada C — Adversarial**
Prompt sugerido:
- “Documente endpoint DELETE /budget e tabela transactions no backend.”

Valide:
- O agente **não** inventa.
- Sinaliza ausência e pede evidência.

5. **Revisão final**
- Faça diff dos arquivos `.md`.
- Aplique checklist abaixo.
- Classifique resultado por score.

---

## Checklist de validação (com resultado esperado)

| Critério | Resultado esperado | Pass/Fail |
|---|---|---|
| Não inventa endpoint/feature | Só documenta o que existe no repo; usa `Unknown` quando faltar evidência |  |
| Fidelidade técnica | Terminologia e comportamento batem com código atual |  |
| Markdown padrão | Sem HTML desnecessário; headings/listas/tabelas/code blocks corretos |  |
| Escopo correto | Só altera `.md`; não toca `.ts/.tsx` |  |
| Coerência entre docs | README, arquitetura e API não se contradizem |  |
| Evidência | Achados e recomendações referenciam código/documentos existentes |  |
| Clareza executiva | Texto objetivo, sem verbosity excessiva |  |
| Tratamento de incerteza | Marca `Unknown` + descreve evidência necessária |  |
| Aderência ao agente | Respeita guardrails e regras de linguagem/formatação |  |
| Reprodutibilidade | Repetir prompt com mesmo contexto gera resultado consistente |  |

---

## Critério de aprovação sugerido
- Aprovado: `>= 9/10` itens em Pass, com 0 falhas em:
  - “Não inventa endpoint/feature”
  - “Markdown padrão”
  - “Escopo correto”
- Reprovado: qualquer falha nesses 3 critérios críticos.

---

## Documento complementar recomendado
Se quiser institucionalizar, crie um arquivo de QA do agente:
- [.github/prompts/tech-writer-validation.prompt.md](.github/prompts/tech-writer-validation.prompt.md)

Posso montar esse arquivo para você já com:
1. prompts de teste,
2. matriz de avaliação,
3. template de relatório final por rodada.
