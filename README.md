# Mobile Aristocat

Aplicação Expo/React Native. Esta pasta é uma aplicação pnpm independente e pode ser copiada ou clonada sem o repositório agregador.

## Estado atual

O aplicativo possui fundação visual navegável e uma jornada bancária PF via
Pluggy. A jornada usa `react-native-pluggy-connect`, `react-native-webview` e
TanStack Query para consultar exclusivamente a API Aristocat: Connect Token,
instituições, status da conexão e contas normalizadas. Não chama instituições
financeiras diretamente nem guarda segredo Pluggy.

O login ainda é visual e não entrega uma sessão JWT Aristocat. Por isso a tela
bancária apresenta “Sessão necessária” até que a implementação de autenticação
mobile injete o access token no `BankingSessionProvider`. Não adicione token,
`CLIENT_SECRET` ou `PLUGGY_WEBHOOK_SECRET` ao `.env` público do Expo.

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

`index.js` registra `App.tsx` localmente para funcionar com pnpm em Web, Android e iOS. `metro.config.cjs` fixa a resolução do Zod e do pacote `punycode` completo, necessário ao parser de URL carregado pelo Expo Router.

## Comandos

| Comando          | Finalidade                    |
| ---------------- | ----------------------------- |
| `pnpm start`     | Inicia o Expo bundler.        |
| `pnpm web`       | Abre o destino web.           |
| `pnpm android`   | Abre o destino Android.       |
| `pnpm ios`       | Abre o destino iOS em macOS.  |
| `pnpm lint`      | Executa ESLint.               |
| `pnpm typecheck` | Verifica TypeScript.          |
| `pnpm test`      | Executa testes Jest.          |
| `pnpm validate`  | Executa lint, tipos e testes. |

## Estrutura visual

```text
src/app/                 rotas e layouts Expo Router
src/app/(public)/        splash e acesso visual
src/app/(protected)/     tabs, configurações e perfil
src/app/(modals)/        modal stack
src/components/          design system desacoplado
src/contexts/            contextos sem efeitos externos
src/features/banking/    fluxo Pluggy, polling e cliente HTTP bancário
src/hooks/               hooks de estados visuais
src/presentation/        composição visual das telas
src/theme/               tokens e provider de tema
```

## Ambiente e API

`EXPO_PUBLIC_API_BASE_URL` em `.env` define a URL pública da API. Em dispositivo físico, use um endereço disponível na rede local. Não versione `.env`.

O mobile consome APIs apenas por HTTP/OpenAPI e não importa domínio, serviços ou tipos internos do backend.

O scheme `aristocat` declara o retorno `aristocat://open-finance/callback`, que
restaura a rota bancária. O app faz polling limitado do backend após o widget; o
callback nunca é fonte de verdade.

## Troubleshooting

Se o Expo informar dependências ausentes, execute `pnpm install` nesta pasta. Para limpar o cache, execute `pnpm start -- --clear`.
