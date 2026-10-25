# Changelog — Mobile

Todas as mudanças relevantes do mobile serão documentadas neste arquivo.

## [Unreleased]

### Added

- Fundação Expo e React Native com navegação e providers.
- TanStack Query, Zustand para estado local, React Hook Form e Zod.
- i18n de códigos estáticos de erro e fallback para código desconhecido.
- Testes de renderização, navegação, formulário e traduções.

### Fixed

- Google Sign-In no Web agora usa o fluxo OAuth compatível com navegador e
  envia o ID Token ao endpoint de sessão existente.
- Configuração Jest ajustada para Expo, React Native e instalação pnpm local.
- A recuperação de sessão não deixa uma falha de limpeza do SecureStore gerar
  uma rejeição não tratada; o procedimento para sincronizar o cliente nativo
  com o SDK Expo está documentado.
