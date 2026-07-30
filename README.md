# Mobile Aristocat

Aplicação Expo/React Native. Esta pasta é uma aplicação pnpm independente e pode ser copiada ou clonada sem o repositório agregador.

## Responsabilidade

O mobile é dono da experiência de usuário, navegação, estado local, formulários, acessibilidade e tradução de códigos públicos de erro. Ele consome a API somente por HTTP/OpenAPI.

O mobile não acessa banco de dados, não importa código do backend e não replica entidades ou regras de negócio do servidor.

## Requisitos e instalação

- Node.js 24.16.0;
- pnpm 11.17.0;
- Expo Go, emulador Android ou Xcode no macOS para iOS.

Na própria pasta `mobile/`:

```bash
pnpm install
Copy-Item .env.example .env
```

As dependências, lockfile, ferramentas de lint, TypeScript, Prettier, entrada Expo e configuração Metro pertencem a esta pasta. Nenhum comando requer workspace pnpm, `package.json` ou `node_modules` externo.

## Execução

```bash
pnpm start
pnpm web
pnpm android
pnpm ios
```

`index.js` registra `App.tsx` localmente para funcionar com pnpm em Web, Android e iOS. `metro.config.cjs` fixa a resolução do Zod declarado pelo aplicativo.

## Comandos

| Comando | Finalidade |
| --- | --- |
| `pnpm start` | Inicia o Expo bundler. |
| `pnpm web` | Abre o destino web. |
| `pnpm android` | Abre o destino Android. |
| `pnpm ios` | Abre o destino iOS em macOS. |
| `pnpm lint` | Executa ESLint. |
| `pnpm typecheck` | Verifica TypeScript. |
| `pnpm test` | Executa testes Jest. |
| `pnpm validate` | Executa lint, tipos e testes. |

## Ambiente e API

`EXPO_PUBLIC_API_BASE_URL` em `.env` define a URL pública da API. Em dispositivo físico, use um endereço disponível na rede local. Não versione `.env`.

O mobile consome APIs apenas por HTTP/OpenAPI e não importa domínio, serviços ou tipos internos do backend.

## Troubleshooting

Se o Expo informar dependências ausentes, execute `pnpm install` nesta pasta. Para limpar o cache, execute `pnpm start -- --clear`.
