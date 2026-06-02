<div align="center">

# Portfolio Admin

**Painel administrativo completo para gerenciamento do portfólio pessoal.**  
Construído com Angular 21, PrimeNG 21 e arquitetura feature-based moderna.

[![Angular](https://img.shields.io/badge/Angular-21.2-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![PrimeNG](https://img.shields.io/badge/PrimeNG-21.1-0F67B1?style=for-the-badge&logo=primeng&logoColor=white)](https://primeng.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Reportar Bug](https://github.com/darioreisjr/admin_portfolio_26/issues) · [Solicitar Feature](https://github.com/darioreisjr/admin_portfolio_26/issues)

</div>

---

## Sumário

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Configuração](#instalação-e-configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Autenticação](#autenticação)
- [Rotas da Aplicação](#rotas-da-aplicação)
- [Módulos e Features](#módulos-e-features)
- [API e Serviços](#api-e-serviços)
- [Componentes Compartilhados](#componentes-compartilhados)
- [Padrões e Convenções](#padrões-e-convenções)
- [Testes](#testes)
- [Build e Deploy](#build-e-deploy)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## Visão Geral

O **Portfolio Admin** é um Single Page Application (SPA) para gerenciamento do backend de um portfólio pessoal. Permite criar, editar e remover projetos, categorias e tecnologias que são exibidos publicamente no site de portfólio.

A aplicação consome a [API REST do Portfólio](https://api.portfolio.darioreis.dev/api/v1) e foi construída seguindo padrões modernos do Angular 21: **Standalone Components**, **Signals**, **Zoneless Change Detection** e **Lazy-Loaded Routes**.

### Por que este projeto existe?

Gerenciar conteúdo de portfólio diretamente via banco de dados ou chamadas de API manuais é ineficiente e suscetível a erros. Este painel centraliza e simplifica toda a operação de conteúdo com uma interface visual intuitiva.

---

## Funcionalidades

### Implementadas

- **Autenticação JWT** — Login com token armazenado em `sessionStorage`, guards de rota e interceptor automático
- **Proteção de rotas** — todas as rotas requerem autenticação; redirecionamento automático para `/login`
- **Projetos** — CRUD completo com upload de imagem, multi-select de tecnologias, vinculação de categoria e flag de destaque
- **Categorias** — CRUD com geração automática de slug a partir do nome
- **Tecnologias** — CRUD com preview de ícone em tempo real via URL
- **Busca em tempo real** — debounce de 400ms nas listagens
- **Paginação lazy-load** — 10, 25 ou 50 itens por página
- **Loading global** — barra de progresso no topbar em todas as requisições HTTP
- **Tratamento de erros global** — interceptor que captura erros HTTP e exibe toast; 401 faz logout automático
- **Confirmação de deleção** — dialog de confirmação antes de remover qualquer registro
- **Formulários reativos** — validação em tempo real com Reactive Forms
- **Tema Aura** — suporte nativo a dark mode via classe `.dark-mode`
- **Design responsivo** — layout adaptável com PrimeFlex

### Planejadas (Roadmap)

Veja a seção [Roadmap](#roadmap) para o que vem a seguir.

---

## Stack Tecnológica

| Camada | Tecnologia | Versão | Finalidade |
|---|---|---|---|
| Framework | [Angular](https://angular.dev) | 21.2 | Core da aplicação |
| UI Library | [PrimeNG](https://primeng.org) | 21.1 | Componentes visuais |
| Tema | [@primeng/themes Aura](https://primeng.org/theming) | 21.0 | Design system |
| CSS Utility | [PrimeFlex](https://primeflex.org) | 4.0 | Layout e utilitários |
| Ícones | [PrimeIcons](https://primeng.org/icons) | 7.0 | Ícones da interface |
| HTTP | Angular HttpClient + Interceptors | — | Comunicação com API |
| Estado Reativo | Angular Signals | — | Gerenciamento de estado |
| Formulários | Angular Reactive Forms | — | Formulários com validação |
| Roteamento | Angular Router | — | Navegação SPA |
| Animações | Angular Animations | — | Transições e efeitos |
| Linguagem | TypeScript | 5.9 | Type safety |
| Test Runner | [Vitest](https://vitest.dev) | 4.0 | Testes unitários |
| Formatter | [Prettier](https://prettier.io) | 3.8 | Padronização de código |
| Build | @angular/build (Vite-based) | 21.2 | Compilação e bundling |

---

## Arquitetura

A aplicação segue **Feature-Based Architecture** (arquitetura orientada a funcionalidades), onde cada domínio de negócio é isolado em seu próprio módulo com rotas, serviços, modelos e componentes independentes.

```
┌──────────────────────────────────────────────────────────┐
│                    App Bootstrap                          │
│          (Zoneless Change Detection + Signals)            │
└──────────────────────┬───────────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   App Routes    │  (Lazy Loading)
              └────────┬────────┘
                       │
           ┌───────────▼──────────────┐
           │       /login             │  ← loginGuard (redireciona se já logado)
           │    LoginComponent        │
           └───────────┬──────────────┘
                       │ (autenticado)
       ┌───────────────▼───────────────────┐
       │    authGuard (redireciona se       │
       │    não autenticado → /login)       │
       │         MainLayoutComponent        │
       ├──────────────┬────────────────────┤
       │ SidebarComponent │ TopbarComponent │
       │  [Botão Sair]    │ [Loading Bar]   │
       ├──────────────────┴────────────────┤
       │            Router Outlet           │
       └───────┬──────────────┬────────────┘
               │              │             │
    ┌──────────▼──┐  ┌────────▼───┐  ┌─────▼──────────┐
    │  Projects   │  │ Categories │  │  Technologies  │
    │   Feature   │  │  Feature   │  │   Feature      │
    ├─────────────┤  ├────────────┤  ├────────────────┤
    │  List Page  │  │  List Page │  │   List Page    │
    │  Form Page  │  │  Form Modal│  │   Form Modal   │
    │  Service    │  │  Service   │  │   Service      │
    │  Model      │  │  Model     │  │   Model        │
    └─────────────┘  └────────────┘  └────────────────┘
               │              │             │
    ┌──────────▼──────────────▼─────────────▼──────────┐
    │                   Core Layer                       │
    ├───────────────┬──────────────┬────────────────────┤
    │ ApiBaseService│   Interceptors│ NotificationService│
    │  (HTTP base)  │ Auth/Load/Err │  (Loading Signal)  │
    └───────────────┴──────────────┴────────────────────┘
                       │
              ┌────────▼──────────────────────┐
              │   API REST Portfolio           │
              │ https://api.portfolio.darioreis│
              │          .dev/api/v1           │
              └───────────────────────────────┘
```

### Decisões Arquiteturais

| Decisão | Escolha | Motivo |
|---|---|---|
| Change Detection | Zoneless | Performance — sem overhead do Zone.js |
| Estado | Signals | Native Angular, sem bibliotecas externas |
| Componentes | Standalone | Sem NgModules, tree-shaking otimizado |
| Rotas | Lazy-load por feature | Bundle inicial menor, carregamento sob demanda |
| HTTP | Interceptors funcionais | Sem classes desnecessárias, composição simples |
| Formulários | Reactive Forms | Validação programática, testável |
| Auth token | sessionStorage | Token expira ao fechar a aba; sem persistência entre sessões |
| Auth guard | Guard no shell route | Um único `canActivate` protege todos os filhos sem repetição |

---

## Estrutura de Pastas

```
admin-portfolio/
├── src/
│   ├── app/
│   │   ├── core/                        # Serviços e infraestrutura global
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts            # Redireciona para /login se não autenticado
│   │   │   │   └── login.guard.ts           # Redireciona para /projects se já logado
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts      # Injeta Bearer token em todas as requests
│   │   │   │   ├── error.interceptor.ts     # Captura erros HTTP → toast; 401 → logout
│   │   │   │   └── loading.interceptor.ts   # Controla spinner global
│   │   │   ├── models/
│   │   │   │   └── api-response.model.ts    # PaginatedResponse<T>, PaginationParams
│   │   │   └── services/
│   │   │       ├── api-base.service.ts      # Classe base HTTP com métodos genéricos
│   │   │       └── notification.service.ts  # Signal isLoading + setLoading()
│   │   │
│   │   ├── features/                    # Domínios de negócio (cada um isolado)
│   │   │   ├── auth/
│   │   │   │   ├── models/
│   │   │   │   │   └── auth.model.ts        # LoginPayload, LoginResponse
│   │   │   │   ├── pages/login/
│   │   │   │   │   └── login.component.ts   # Página de login
│   │   │   │   ├── services/
│   │   │   │   │   └── auth.service.ts      # Estado JWT: isAuthenticated, login, logout
│   │   │   │   └── auth.routes.ts
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   ├── models/
│   │   │   │   │   └── category.model.ts    # Category, CreateCategoryPayload
│   │   │   │   ├── pages/
│   │   │   │   │   ├── category-form/       # Componente reutilizável (modal)
│   │   │   │   │   └── category-list/       # Tabela + paginação
│   │   │   │   ├── services/
│   │   │   │   │   └── categories.service.ts
│   │   │   │   └── categories.routes.ts
│   │   │   │
│   │   │   ├── projects/
│   │   │   │   ├── models/
│   │   │   │   │   └── project.model.ts     # Project, CreateProjectPayload
│   │   │   │   ├── pages/
│   │   │   │   │   ├── project-form/        # Página dedicada (create/edit)
│   │   │   │   │   └── project-list/        # Tabela lazy-load com busca
│   │   │   │   ├── services/
│   │   │   │   │   └── projects.service.ts
│   │   │   │   └── projects.routes.ts
│   │   │   │
│   │   │   └── technologies/
│   │   │       ├── models/
│   │   │       │   └── technology.model.ts  # Technology, CreateTechnologyPayload
│   │   │       ├── pages/
│   │   │       │   ├── technology-form/     # Componente reutilizável (modal)
│   │   │       │   └── technology-list/     # Tabela + paginação
│   │   │       ├── services/
│   │   │       │   └── technologies.service.ts
│   │   │       └── technologies.routes.ts
│   │   │
│   │   ├── layout/                      # Shell da aplicação
│   │   │   ├── main-layout/             # Wrapper com sidebar + topbar + outlet
│   │   │   ├── sidebar/                 # Navegação lateral com links ativos
│   │   │   └── topbar/                  # Header com título e loading bar
│   │   │
│   │   ├── shared/                      # Componentes reutilizáveis cross-feature
│   │   │   └── components/
│   │   │       ├── empty-state/         # Ícone + mensagem para listas vazias
│   │   │       └── page-header/         # Título + subtítulo + botão de ação
│   │   │
│   │   ├── app.config.ts                # Providers globais (PrimeNG, Router, HTTP)
│   │   ├── app.routes.ts                # Rotas raiz com lazy-load por feature
│   │   ├── app.html                     # Template raiz (apenas <router-outlet>)
│   │   ├── app.scss                     # Estilos raiz
│   │   └── app.ts                       # Componente raiz bootstrap
│   │
│   ├── environments/
│   │   ├── environment.ts               # Dev: apiBaseUrl
│   │   └── environment.prod.ts          # Prod: apiBaseUrl
│   │
│   ├── index.html                       # HTML raiz (viewport, fontes)
│   ├── main.ts                          # bootstrapApplication()
│   └── styles.scss                      # Estilos globais + PrimeIcons + PrimeFlex
│
├── angular.json                         # CLI config: builders, budgets, assets
├── package.json                         # Dependências e scripts NPM
├── tsconfig.json                        # TypeScript strict mode
├── tsconfig.app.json                    # TS config da aplicação
└── tsconfig.spec.json                   # TS config dos testes
```

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** `>= 20.x` — [nodejs.org](https://nodejs.org)
- **npm** `>= 11.x` — incluído com o Node.js
- **Angular CLI** `>= 21.x`

```bash
# Verificar versões instaladas
node --version   # v20.x.x ou superior
npm --version    # 11.x.x ou superior

# Instalar Angular CLI globalmente (se necessário)
npm install -g @angular/cli@21
```

---

## Instalação e Configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/darioreisjr/admin_portfolio_26.git
cd admin-portfolio
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Edite o arquivo `src/environments/environment.ts` para apontar para sua instância da API:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'https://api.portfolio.darioreis.dev/api/v1'
};
```

> Para produção, edite `src/environments/environment.prod.ts` com a URL da API de produção.

### 4. Iniciar o servidor de desenvolvimento

```bash
npm start
```

Acesse `http://localhost:4200` no navegador. O servidor recarrega automaticamente ao salvar alterações.

---

## Scripts Disponíveis

| Comando | Descrição |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento em `localhost:4200` |
| `npm run build` | Gera o build de produção em `dist/` |
| `npm run watch` | Build em modo desenvolvimento com watch ativo |
| `npm test` | Executa os testes unitários com Vitest |

---

## Variáveis de Ambiente

A aplicação utiliza o sistema nativo de environments do Angular.

| Variável | Descrição | Exemplo |
|---|---|---|
| `production` | Flag de ambiente de produção | `false` \| `true` |
| `apiBaseUrl` | URL base da API REST do portfólio | `https://api.portfolio.darioreis.dev/api/v1` |

**Arquivos:**
- `src/environments/environment.ts` — desenvolvimento
- `src/environments/environment.prod.ts` — produção (usado no `ng build`)

---

## Autenticação

A aplicação usa **JWT Bearer Token** para autenticar todas as requisições à API. Não há área pública — qualquer rota requer login.

### Fluxo de Autenticação

```
1. Usuário acessa qualquer rota
2. authGuard verifica AuthService.isAuthenticated()
3. Se não autenticado → redireciona para /login
4. Usuário preenche e-mail e senha → POST /auth/login
5. API retorna { data: { token } }
6. Token salvo no sessionStorage
7. isAuthenticated signal = true → redireciona para /projects
8. authInterceptor injeta Authorization: Bearer <token> em todas as requests
9. Se a API retornar 401 → ErrorInterceptor chama logout() → redireciona para /login
```

### AuthService

```typescript
authService.isAuthenticated()  // Signal<boolean> — estado reativo
authService.login(payload)     // POST /auth/login → salva token
authService.logout()           // Remove token + navega para /login
authService.getToken()         // Retorna token do sessionStorage
```

### Armazenamento do Token

| Aspecto | Comportamento |
|---|---|
| Storage | `sessionStorage` |
| Escopo | Por aba do navegador |
| Persistência | Perdido ao fechar a aba |
| Segurança | Não persiste entre sessões; protegido por HTTPS em trânsito |

### Credenciais

A conta de administrador é criada diretamente no dashboard do Supabase. Não há endpoint de cadastro.

---

## Rotas da Aplicação

| Path | Componente | Guard | Descrição |
|---|---|---|---|
| `/login` | `LoginComponent` | `loginGuard` | Página de login; redireciona para `/projects` se já autenticado |
| `/` | Redirect | `authGuard` | Redireciona para `/projects` |
| `/projects` | `ProjectListComponent` | `authGuard` (herdado) | Listagem de projetos com busca e paginação |
| `/projects/new` | `ProjectFormComponent` | `authGuard` (herdado) | Formulário de criação de projeto |
| `/projects/:id/edit` | `ProjectFormComponent` | `authGuard` (herdado) | Formulário de edição de projeto |
| `/categories` | `CategoryListComponent` | `authGuard` (herdado) | Listagem e gerenciamento de categorias |
| `/technologies` | `TechnologyListComponent` | `authGuard` (herdado) | Listagem e gerenciamento de tecnologias |
| `**` | Redirect | — | Qualquer rota inválida redireciona para `/` |

Todas as rotas filhas são **lazy-loaded** por feature. O `authGuard` é aplicado no shell route (`MainLayoutComponent`), protegendo todos os filhos com um único guard.

---

## Módulos e Features

### Projects

O módulo mais completo da aplicação. Gerencia os projetos do portfólio.

**`ProjectListComponent`**
- Tabela com paginação server-side (lazy-load)
- Opções de página: 10, 25 ou 50 itens
- Busca com debounce de 400ms
- Colunas: Imagem, Título, Categoria, Destaque, Tecnologias, Data criação, Ações
- Ações: Editar (navega para form) e Deletar (com confirmação)

**`ProjectFormComponent`**
- Modo duplo: criação (`/projects/new`) e edição (`/projects/:id/edit`)
- Campos: Título, Descrição, URL do Projeto, URL do Repositório, Categoria, Tecnologias, Destaque, Imagem
- Upload de imagem com preview
- Multi-select de tecnologias com filtro
- Carrega categorias e tecnologias em paralelo via `forkJoin`
- Envia dados via `FormData` (suporte a arquivo binário)

**`ProjectsService`**

| Método | HTTP | Endpoint | Descrição |
|---|---|---|---|
| `getAll(params?)` | GET | `/projects` | Lista paginada com filtros |
| `getFeatured()` | GET | `/projects?isFeatured=true` | Projetos em destaque |
| `getById(id)` | GET | `/projects/:id` | Detalhes de um projeto |
| `create(payload)` | POST | `/projects` | Cria novo projeto (FormData) |
| `update(id, payload)` | PATCH | `/projects/:id` | Atualiza projeto (FormData) |
| `remove(id)` | DELETE | `/projects/:id` | Remove projeto |

---

### Categories

Gerencia as categorias dos projetos.

**`CategoryListComponent`**
- Tabela com paginação client-side
- Colunas: Nome, Slug, Data criação, Ações
- Dialog modal para criar/editar (sem navegação de rota)
- Reutiliza `CategoryFormComponent` dentro do dialog

**`CategoryFormComponent`** *(reusable)*
- Inputs: `category` (para modo edição), `loading`
- Outputs: `saved`, `cancel`
- Auto-geração de slug a partir do nome (substituição de espaços e acentos)
- Utilizado tanto no dialog quanto pode ser usado standalone

**`CategoriesService`**

| Método | HTTP | Endpoint | Descrição |
|---|---|---|---|
| `getAll(params?)` | GET | `/categories` | Lista paginada |
| `getById(id)` | GET | `/categories/:id` | Detalhes |
| `create(payload)` | POST | `/categories` | Cria categoria |
| `update(id, payload)` | PATCH | `/categories/:id` | Atualiza categoria |
| `remove(id)` | DELETE | `/categories/:id` | Remove categoria |

---

### Technologies

Gerencia as tecnologias associadas aos projetos.

**`TechnologyListComponent`**
- Tabela com paginação client-side
- Colunas: Ícone (preview), Nome, Data criação, Ações
- Dialog modal para criar/editar

**`TechnologyFormComponent`** *(reusable)*
- Inputs: `technology` (para modo edição), `loading`
- Outputs: `saved`, `cancel`
- Preview de ícone em tempo real via URL

**`TechnologiesService`**

| Método | HTTP | Endpoint | Descrição |
|---|---|---|---|
| `getAll(params?)` | GET | `/technologies` | Lista paginada |
| `getById(id)` | GET | `/technologies/:id` | Detalhes |
| `create(payload)` | POST | `/technologies` | Cria tecnologia |
| `update(id, payload)` | PATCH | `/technologies/:id` | Atualiza tecnologia |
| `remove(id)` | DELETE | `/technologies/:id` | Remove tecnologia |

---

## API e Serviços

### ApiBaseService

Classe base que todos os serviços de feature estendem. Fornece métodos HTTP tipados e configuração centralizada.

```typescript
// Todos os serviços estendem ApiBaseService
class ProjectsService extends ApiBaseService {
  readonly basePath = '/projects';
}
```

**Métodos disponíveis:**

| Método | Retorno | Descrição |
|---|---|---|
| `get<T>(path, params?)` | `Observable<T>` | GET simples |
| `getList<T>(path, params?)` | `Observable<PaginatedResponse<T>>` | GET com paginação |
| `post<T>(path, body)` | `Observable<T>` | POST |
| `patch<T>(path, body)` | `Observable<T>` | PATCH |
| `delete<T>(path)` | `Observable<T>` | DELETE |

### Modelos de Resposta

```typescript
interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    timestamp: string;
  };
}

interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: unknown;
}
```

### Interceptors HTTP

A cadeia de interceptors é executada nesta ordem: **auth → loading → error**.

**`AuthInterceptor`**
- Lê o token JWT via `AuthService.getToken()`
- Clona a requisição adicionando `Authorization: Bearer <token>`
- Se não houver token, passa a requisição sem modificação

**`LoadingInterceptor`**
- Incrementa contador de requisições ao iniciar
- Decrementa no `finalize()` (sucesso ou erro)
- Atualiza `NotificationService.isLoading` (Signal)

**`ErrorInterceptor`**
- Captura qualquer erro HTTP
- **401 Unauthorized:** chama `AuthService.logout()` se houver sessão ativa (sem toast)
- Outros erros: exibe `p-toast` de erro com duração de 5 segundos
- Re-lança o erro para tratamento específico nos componentes

### NotificationService

Gerencia o estado global de carregamento via Signal.

```typescript
// Leitura reativa no template
notif.isLoading()  // Signal<boolean>

// Controle (usado pelos interceptors)
notif.setLoading(true)   // incrementa contador
notif.setLoading(false)  // decrementa contador
```

---

## Componentes Compartilhados

### PageHeaderComponent

Cabeçalho padronizado para todas as páginas com título, subtítulo opcional e botão de ação.

```html
<app-page-header
  title="Projetos"
  subtitle="Gerencie os projetos do portfólio"
  actionLabel="Novo Projeto"
  (action)="onCreate()"
/>
```

| Input | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `title` | `string` | Sim | Título da página |
| `subtitle` | `string` | Não | Subtítulo descritivo |
| `actionLabel` | `string` | Não | Texto do botão de ação |

| Output | Tipo | Descrição |
|---|---|---|
| `action` | `EventEmitter` | Dispara ao clicar no botão |

---

### EmptyStateComponent

Estado vazio para tabelas sem dados.

```html
<app-empty-state message="Nenhum projeto encontrado." />
```

| Input | Tipo | Descrição |
|---|---|---|
| `message` | `string` | Mensagem exibida abaixo do ícone |

---

## Padrões e Convenções

### Nomenclatura de Arquivos

| Tipo | Padrão | Exemplo |
|---|---|---|
| Componente | `kebab-case.component.ts` | `project-list.component.ts` |
| Serviço | `kebab-case.service.ts` | `projects.service.ts` |
| Model | `kebab-case.model.ts` | `project.model.ts` |
| Rotas | `feature.routes.ts` | `projects.routes.ts` |
| Interceptor | `kebab-case.interceptor.ts` | `loading.interceptor.ts` |

### Criando uma Nova Feature

Para adicionar um novo domínio de negócio (ex: `testimonials`), siga a estrutura padrão:

```
src/app/features/testimonials/
├── models/
│   └── testimonial.model.ts
├── pages/
│   ├── testimonial-list/
│   │   └── testimonial-list.component.ts
│   └── testimonial-form/
│       └── testimonial-form.component.ts
├── services/
│   └── testimonials.service.ts
└── testimonials.routes.ts
```

Depois registre a rota lazy em `app.routes.ts`:

```typescript
{
  path: 'testimonials',
  loadChildren: () =>
    import('./features/testimonials/testimonials.routes')
      .then(m => m.TESTIMONIALS_ROUTES)
}
```

E adicione o link na `SidebarComponent`.

### Convenções de Código

- **Strict TypeScript** — `strict: true`, sem `any` implícito
- **Templates tipados** — `strictTemplates: true`
- **Standalone Components** — sem NgModules
- **Signals** — preferido sobre RxJS para estado local
- **`inject()`** — uso de injeção de dependência funcional
- **`computed()`** — derivações de estado reativas
- **`effect()`** — efeitos colaterais reativos

---

## Testes

O projeto utiliza [Vitest](https://vitest.dev) como test runner.

```bash
# Executar todos os testes
npm test

# Modo watch (re-executa ao salvar)
npm test -- --watch

# Com cobertura de código
npm test -- --coverage
```

### Estrutura de Testes

Os testes ficam no mesmo diretório dos arquivos que testam, com sufixo `.spec.ts`:

```
src/app/features/projects/
├── pages/
│   └── project-list/
│       ├── project-list.component.ts
│       └── project-list.component.spec.ts   # ← teste aqui
└── services/
    ├── projects.service.ts
    └── projects.service.spec.ts             # ← teste aqui
```

---

## Build e Deploy

### Build de Produção

```bash
npm run build
```

Os artefatos são gerados em `dist/admin-portfolio/browser/`. O build de produção:
- Minifica e otimiza o bundle
- Habilita tree-shaking agressivo
- Gera hashes nos nomes dos arquivos (cache busting)
- Aplica `environment.prod.ts`

### Budgets de Build

| Tipo | Warning | Error |
|---|---|---|
| Bundle inicial | 500 kB | 1 MB |
| Estilos de componente | 4 kB | 8 kB |

### Servindo o Build

```bash
# Com qualquer servidor HTTP estático
npx serve dist/admin-portfolio/browser

# Ou com http-server
npx http-server dist/admin-portfolio/browser -p 8080
```

> **Importante:** Configure o servidor para redirecionar todas as rotas para `index.html` (SPA routing).

---

## Roadmap

Funcionalidades planejadas para as próximas versões:

- [x] **Autenticação** — Login com JWT, guards de rota, interceptor automático de token
- [ ] **Refresh token** — Renovação automática de token expirado sem novo login
- [ ] **Dashboard com métricas** — Contador de projetos, categorias, tecnologias e acessos
- [ ] **Gerenciamento de depoimentos** — CRUD de testimonials para portfólio
- [ ] **Gerenciamento de experiências** — CRUD de experiências profissionais
- [ ] **Gerenciamento de educação** — CRUD de formações acadêmicas
- [ ] **Gerenciamento de habilidades** — CRUD de skills com nível de proficiência
- [ ] **Upload centralizado** — Serviço de media com preview e gerenciamento de arquivos
- [ ] **Configurações do portfólio** — Edição de dados pessoais (nome, bio, redes sociais)
- [ ] **Dark mode toggle** — Botão na topbar para alternar tema
- [ ] **Testes E2E** — Playwright ou Cypress para fluxos críticos
- [ ] **CI/CD** — Pipeline GitHub Actions para build e deploy automático
- [ ] **i18n** — Internacionalização PT-BR / EN

---

## Contribuindo

1. Faça um fork do projeto
2. Crie sua feature branch: `git checkout -b feat/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feat/nova-funcionalidade`
5. Abra um Pull Request

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/pt-br):

| Tipo | Uso |
|---|---|
| `feat` | Nova funcionalidade |
| `fix` | Correção de bug |
| `docs` | Apenas documentação |
| `style` | Formatação, sem mudança de lógica |
| `refactor` | Refatoração sem nova feature ou bugfix |
| `test` | Adição ou correção de testes |
| `chore` | Tarefas de build, CI, dependências |

---

## Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

<div align="center">

Desenvolvido por **Dario Reis** · [darioreis.dev](https://darioreis.dev)

</div>
