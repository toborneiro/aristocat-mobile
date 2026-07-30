# Mobile Agent Guide

Para trabalho mobile, leia também:

- `prompts/05-mobile.md`;
- `prompts/07-tdd-and-spikes.md` para código de produção ou spikes;
- `prompts/08-complexity.md`.

Adicione:

- `prompts/06-contracts.md` quando consumir contrato novo;
- `prompts/09-feature-flags.md` quando houver rollout controlado.

## Regras

- Screens devem ser finas.
- Estado remoto pertence ao TanStack Query.
- Não copie dados remotos para Zustand sem justificativa.
- Componentes não devem instanciar cliente HTTP.
- Valide estados de loading, vazio, erro, offline e sessão expirada quando aplicável.
