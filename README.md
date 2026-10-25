# Mobile Aristocat

Aplicação Expo/React Native. Esta pasta é uma aplicação pnpm independente e pode ser copiada ou clonada sem o repositório agregador.

## Estado atual

O aplicativo possui fundação visual navegável, autenticação por Google e cadastro manual, além de uma jornada bancária PF via Pluggy. O mobile consome somente a API Aristocat: ele não chama instituições financeiras diretamente nem guarda segredos da Pluggy.

O cadastro manual envia `name`, `email` e `password` para `POST /auth/register`. O Google Sign-In envia o ID Token para o mesmo fluxo de sessão em `POST /auth/google`; o backend encontra ou cria o usuário. Em Android e iOS, o refresh token fica somente no armazenamento seguro do dispositivo. No Web, ele fica em cookie `HttpOnly` e o access token permanece em memória. Senhas não são persistidas nem registradas em log pelo aplicativo.

As telas financeiras não possuem contas, saldos, transações ou investimentos fictícios. Elas exibem estados vazios até receberem dados reais pela API Aristocat; o único fluxo de dados bancários é o da integração Pluggy.

## Responsabilidade

O mobile é dono da experiência de usuário, navegação, estado local, formulários, acessibilidade e tradução de códigos públicos de erro. Ele consome a API somente por HTTP/OpenAPI.

O mobile não acessa banco de dados, não importa código do backend e não replica entidades ou regras de negócio do servidor.

## Requisitos e instalação

- Node.js 24.16.0;
- pnpm 11.17.0;
- emulador Android ou Xcode no macOS para iOS;
- para Google Sign-In, um Development Build (Expo Go nao inclui o modulo nativo).

Na própria pasta `mobile/`:

```powershell
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

| Comando           | Finalidade                                            |
| ----------------- | ----------------------------------------------------- |
| `pnpm start`      | Inicia o Expo bundler.                                |
| `pnpm web`        | Abre o destino web.                                   |
| `pnpm android`    | Abre o destino Android.                               |
| `pnpm ios`        | Abre o destino iOS em macOS.                          |
| `pnpm lint`       | Executa ESLint.                                       |
| `pnpm typecheck`  | Verifica TypeScript.                                  |
| `pnpm test`       | Executa testes Jest.                                  |
| `pnpm expo:check` | Confere se os pacotes Expo e nativos são compatíveis. |
| `pnpm validate`   | Executa lint, tipos e testes.                         |

## Autenticação

As rotas públicas são `/auth`, `/register` e `/register/manual`. A tela de registro oferece cadastro com dados ou Google; a opção Google reutiliza o mesmo componente do login e o endpoint `POST /auth/google`.

O formulário local valida nome, e-mail, confirmação de senha e a política atual do backend: senha entre 12 e 128 caracteres. Um `ERR_AUTH_002` do backend é traduzido para uma mensagem amigável de conta existente. Erros públicos são traduzidos por código, sem apresentar status HTTP, detalhes de biblioteca ou stack trace.

### Google Sign-In nativo

No Android e iOS, o app reutiliza `@react-native-google-signin/google-signin`. No navegador, usa o fluxo OAuth do `expo-auth-session`, que devolve o mesmo ID Token. Em ambos os casos, ele é enviado exclusivamente a `POST /auth/google`. O token do Google não é uma sessão Aristocat e não é persistido. O backend usa os dados verificados do ID Token para sincronizar nome, e-mail e, quando disponível, a foto HTTPS do perfil; o cabeçalho inicial exibe essas informações. No Android e iOS, o `AuthSessionProvider` persiste o refresh token em `expo-secure-store`; no Web, o navegador envia o cookie `HttpOnly` automaticamente para renovar ou encerrar a sessão e o access token fica apenas em memória.

Google Sign-In exige uma build nativa. O perfil `development` em `eas.json` ja declara uma distribuicao interna com development client. Depois de instalar a dependencia nativa e autenticar-se no Expo/EAS, gere uma build Android com:

```bash
pnpm exec expo install expo-dev-client
npx eas-cli@latest build:configure
npx eas-cli@latest build --platform android --profile development
```

Alternativamente, para compilar localmente com Android Studio configurado:

```bash
pnpm exec expo install expo-dev-client
pnpm exec expo prebuild --clean
pnpm exec expo run:android
```

Depois de instalar a build, inicie o bundler com `pnpm start`. Sempre reconstrua o cliente quando alterar uma dependencia nativa ou a configuracao Expo.

## Estrutura visual

```text
src/app/                 rotas e layouts Expo Router
src/app/(public)/        splash, login e registro
src/app/(protected)/     tabs, configurações e perfil
src/app/(modals)/        modal stack
src/components/          design system desacoplado
src/contexts/            contextos sem efeitos externos
src/features/auth/       sessão, API de autenticação e formulários de acesso
src/features/banking/    fluxo Pluggy, polling e cliente HTTP bancário
src/hooks/               hooks de estados visuais
src/presentation/        composição visual das telas
src/theme/               tokens e provider de tema
```

## Ambiente e API

`EXPO_PUBLIC_API_BASE_URL` em `.env` define a URL pública da API. Em dispositivo físico, use um endereço disponível na rede local. Não versione `.env`.

Para habilitar o login Google, preencha estas variáveis no arquivo local `.env`:

| Variável                            |          Obrigatória           | Uso                                                               |
| ----------------------------------- | :----------------------------: | ----------------------------------------------------------------- |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`  |              Sim               | Audience do ID Token solicitado pelo SDK nativo.                  |
| `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`  |       Não (somente iOS)        | Configura o SDK nativo no iOS.                                    |
| `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` | Não (somente iOS sem Firebase) | Reversed client ID aplicado por `app.config.ts` ao plugin nativo. |
| `EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE` | Não | `false` por padrão. Em `development`, permite guardar o refresh token Web em `sessionStorage` para depuração; nunca habilite em produção. |

O Client ID Android é configurado no Google Cloud pela combinação de package e SHA-1; ele não é lido em tempo de execução pelo SDK atual. Para o navegador, `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` deve ser um Client ID do tipo **Web application**, com a origem e a URI de redirecionamento usadas pelo Expo cadastradas no Google Cloud (por exemplo, `http://localhost:8081` em *Authorized JavaScript origins* e *Authorized redirect URIs*). Os valores acima são identificadores públicos, mas nunca substituem a validação do token no backend e nunca devem conter client secrets.

O backend deve listar a origem do Expo em `CORS_ORIGINS`. O modo Web normal depende de `credentials: 'include'` e de um cookie `HttpOnly`; não há token de refresh em `localStorage` ou `sessionStorage`. Para investigar localmente uma integração antiga, defina `EXPO_PUBLIC_ENABLE_WEB_REFRESH_TOKEN_STORAGE=true` somente com `NODE_ENV=development` e reinicie o Expo. O backend aceita esse modo exclusivamente em desenvolvimento.

O mobile consome APIs apenas por HTTP/OpenAPI e não importa domínio, serviços ou tipos internos do backend.

O scheme `aristocat` declara o retorno `aristocat://open-finance/callback`, que restaura a rota bancária. O app faz polling limitado do backend após o widget; o callback nunca é fonte de verdade.

## Testes

Execute todos os testes com:

```bash
pnpm test
```

Os testes de autenticação cobrem a navegação para registro, validação do formulário, criação de sessão, tratamento de e-mail existente e os resultados de Google Sign-In. O setup do Jest usa um mock do ícone nativo para permitir testes de interface sem um development build.

## Troubleshooting

Se o Expo informar dependências ausentes, execute `pnpm install` nesta pasta. Para limpar o cache, execute `pnpm start -- --clear`.

### O mobile não consegue criar conta ou entrar com Google

Verifique se `EXPO_PUBLIC_API_BASE_URL` aponta para uma API acessível pelo navegador, emulador ou dispositivo e se `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` está configurado para o ambiente local. No Web, cadastre a origem e a URI de redirecionamento exibidas pelo Expo no Client ID do tipo **Web application** no Google Cloud. No Android, confirme que a build instalada não é Expo Go, que o package Android é `br.com.aristocat.app` e que a SHA-1 da assinatura desta build está cadastrada no Client ID Android do Google Cloud. Não coloque tokens, senhas ou segredos do backend em variáveis `EXPO_PUBLIC_*`.

Se o `POST /auth/google` retornar `200` mas a tela ainda exibir erro de conexão, atualize o backend e o bundle Web: versões anteriores tentavam usar `expo-secure-store` no navegador, onde esse módulo não implementa armazenamento. O fluxo atual usa o cookie `HttpOnly` por padrão.

### `deleteValueWithKeyAsync is not a function`

Esse erro não é causado pelo token nem pela API. Ele indica que o bundle JavaScript de `expo-secure-store` é mais novo que o módulo nativo instalado no development build. O app não deve continuar usando esse cliente.

1. Pare o bundler e execute `pnpm install` e `pnpm expo:check`.
2. Gere e reinstale um novo development build antes de reiniciar o bundler.
3. Execute `pnpm start -- --clear`.

Sempre execute `pnpm expo:check` depois de alterar `expo`, `expo-*`, React Native ou qualquer biblioteca com código nativo. `pnpm validate` já inclui essa checagem. `expo-secure-store` também está declarado como plugin em `app.json`, para que as configurações nativas sejam aplicadas na próxima geração do binário.
