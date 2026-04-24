# Rotina — App de Gestão de Rotina para Empresas

> Este arquivo é lido automaticamente pelo Claude Code ao abrir o projeto.
> Mantém o contexto das decisões de produto, arquitetura e design.

---

## 📱 Sobre o projeto

App mobile de **gestão de rotina e tarefas para empresas**, com diferenciação clara entre administradores e colaboradores.

**Stack:**

- React Native + TypeScript
- Expo (template Default com Expo Router — navegação file-based)
- Dark mode forçado (sem toggle de tema)

---

## 👥 Papéis e permissões

### Administrador

- CRUD completo de **projetos**, **tarefas** e **usuários**
- **Aprova tarefas** criadas por colaboradores e define o **peso** (Baixa / Média / Alta / Crítica)
- Pode **elevar privilégio** de colaboradores a admin
- Acesso à fila de aprovação

### Colaborador

- **Cria tarefas** (ficam pendentes de aprovação até admin aprovar + atribuir peso)
- Atualiza % de cumprimento das próprias tarefas
- Visualiza projetos dos quais participa
- **Não pode** editar/apagar projetos, tarefas de terceiros ou usuários

### Líder de projeto

- **No MVP, não existe como papel separado** — é equivalente a admin.
- Papel próprio (com permissões intermediárias) fica pra v1.1.

---

## 🧮 Regras de negócio críticas

### Fluxo de aprovação de tarefa

1. Colaborador cria tarefa → status `pendente`
2. Admin recebe na fila → aprova (define peso) ou rejeita
3. Se aprovada → status `aprovada`, peso definido
4. Colaborador atualiza % de cumprimento ao longo do tempo
5. Tarefa concluída → entra no cálculo do projeto

### Cálculo de cumprimento do projeto (PONDERADO POR PESO)

```text
% projeto = Σ(peso_tarefa × %_cumprimento_tarefa) / Σ(peso_tarefa)
```

`%_cumprimento_tarefa` é um valor de 0 a 100 (percentual), e o resultado do projeto também é 0 a 100.

**Pesos padrão:**

- Baixa = 1 pt
- Média = 2 pt
- Alta = 3 pt
- Crítica = 4 pt

Uma tarefa crítica 100% concluída contribui 4x mais que uma baixa 100% concluída.

### Estados de tarefa

`rascunho` → `pendente` → `aprovada` / `rejeitada` → `em_andamento` → `concluida`

---

## 📂 Arquitetura de pastas (Expo Router)

```text
app/
  _layout.tsx              ← root layout (tema + fontes + dark mode)
  index.tsx                ← splash/redirect baseado em sessão e papel
  (auth)/
    _layout.tsx            ← stack de autenticação
    login.tsx
    cadastro.tsx           ← onboarding do primeiro admin da empresa
    esqueci-senha.tsx
  (admin)/
    _layout.tsx            ← tab navigator do admin
    dashboard.tsx
    projetos.tsx           ← listagem + CTA criar projeto
    tarefas.tsx            ← listagem global de tarefas
    aprovacoes.tsx         ← fila de aprovação
    usuarios.tsx
    criar-usuario.tsx
    perfil.tsx             ← acessível via header do dashboard
  (colaborador)/
    _layout.tsx            ← tab navigator do colaborador
    dashboard.tsx
    minhas-tarefas.tsx
    projetos.tsx           ← projetos que participo (read-only)
    criar-tarefa.tsx
    perfil.tsx             ← acessível via header do dashboard
  projeto/
    [id].tsx               ← detalhe dinâmico
  tarefa/
    [id].tsx               ← detalhe dinâmico
```

**Convenção:** grupos `(auth)`, `(admin)`, `(colaborador)` isolam contextos de navegação e permissão. Redirecionamento pós-login vai pra `(admin)` ou `(colaborador)` conforme o papel.

**Tabs do tab navigator:**

- **Admin** (5 tabs): Dashboard · Projetos · Tarefas · Aprovações · Usuários
- **Colaborador** (4 tabs): Dashboard · Minhas Tarefas · Projetos · Criar

`perfil.tsx` fica fora das tabs em ambos os papéis — acessado via ícone no header do dashboard.

---

## 🎨 Design system

### Filosofia visual

**Minimalista, funcional, estilo Notion/Obsidian.** Cada iteração anterior (bento grid, gradientes pesados, glassmorphism) foi descartada em favor de um visual leve que prioriza conteúdo.

**Princípios:**

- Fundos sólidos (Pitch Black), sem gradientes como elementos estruturais
- **Gradientes só como acento** em CTAs principais e badges de prioridade
- **Bordas sutis** com `rgba(255,255,255,0.06)` a `rgba(255,255,255,0.12)` separando seções
- **Separadores horizontais** em vez de cards aninhados
- **Tipografia faz o trabalho pesado** — números grandes (até 44px), labels em uppercase 10-11px com letter-spacing 0.5px
- Muito espaço em branco (preto) — respiro generoso entre seções
- **Propriedades estilo Notion** no detalhe de entidades (label à esquerda 70px, valor à direita, separador fino)
- **Listas como linhas**, não como cards
- **Notificações como timeline** com barrinha colorida de 4px à esquerda
- **Emojis sutis** como ícones de projetos (🚀 📱 ✨)
- **Checkboxes vazios** em tarefas (estilo Obsidian)

### Paleta de cores

| Nome            | Hex       | Uso                                                          |
|-----------------|-----------|--------------------------------------------------------------|
| Racing Red      | `#FF1F29` | CTAs principais, alerta crítico, acento de ação              |
| Raspberry Plum  | `#BA459F` | Acento secundário, prioridade média, estados intermediários  |
| Midnight Violet | `#361F27` | Avatares, prioridade média, hover                            |
| Pitch Black     | `#0D090A` | Fundo principal de todas as telas                            |
| White           | `#FFFFFF` | Texto principal                                              |

**Variações de white para hierarquia:**

- `rgba(255,255,255,1)` — texto principal
- `rgba(255,255,255,0.75)` — texto secundário
- `rgba(255,255,255,0.55)` — labels, metadados
- `rgba(255,255,255,0.45)` — placeholders, helper text
- `rgba(255,255,255,0.12)` — bordas fortes (inputs)
- `rgba(255,255,255,0.06)` — separadores entre seções

### Gradientes (usar com parcimônia)

- **CTA principal**: `linear-gradient(135deg, #FF1F29, #BA459F)` — só em botão Entrar, Criar, Aprovar
- **Hero de progresso** (card de resumo): `linear-gradient(135deg, #FF1F29, #BA459F)` com sombra `0 8px 32px rgba(255,31,41,0.2)`

### Tokens sugeridos para `theme.ts`

```ts
spacing: { xs: 4, sm: 8, md: 14, lg: 20, xl: 28, xxl: 48 }
radius:  { sm: 6, md: 8, lg: 14, xl: 20 }
fontSize:{ xs: 10, sm: 11, base: 13, md: 14, lg: 22, xl: 26, xxl: 44 }
fontWeight: { regular: '400', medium: '500' }
letterSpacing: { tight: -0.8, normal: 0, wide: 0.5 }
```

### Componentes base a criar

- `<Screen>` — wrapper com fundo Pitch Black e safe area
- `<PropertyRow label value />` — linha estilo Notion (label 70px à esquerda, valor à direita)
- `<ListItem>` — item de lista com separador inferior
- `<Divider>` — linha `rgba(255,255,255,0.06)`
- `<Label>` — uppercase 11px `rgba(255,255,255,0.45)` letter-spacing 0.5
- `<Title>` — 22-26px weight 500 letter-spacing -0.6
- `<GradientButton>` — CTA com gradiente Racing Red → Raspberry Plum
- `<PriorityDot>` — bolinha colorida (Crítica=Racing Red `#FF1F29`, Alta=Raspberry Plum `#BA459F`, Média=Midnight Violet `#361F27`, Baixa=`rgba(255,255,255,0.3)`)
- `<Avatar initials color size>` — quadrado arredondado (radius 6) com iniciais
- `<ProgressBar value color />` — altura 2-3px, background `rgba(255,255,255,0.08)`

---

## 🗺️ Fluxograma de navegação

O fluxo completo (autenticação + bifurcação por papel + ações CRUD) foi desenhado no **FigJam** durante o planejamento. Estrutura em alto nível:

Link para o FigJam: <https://www.figma.com/board/v5rMZlJTOg7wYFlcwFJEBt/RoutineApp---Fluxo-de-Navega%C3%A7%C3%A3o-e-Permiss%C3%B5es?node-id=0-1&t=k6w5YKHyQYcfuSJr-1>

```text
Login → [escolha por papel]
  ├─ Admin    → Dashboard · Projetos · Tarefas · Aprovações · Usuários
  └─ Colab    → Dashboard · Minhas Tarefas · Projetos · Criar Tarefa (→ fila admin)
```

Colaborador que cria tarefa NÃO consegue usá-la até admin aprovar e atribuir peso. Esse é o gate central do produto.

**Divergências conscientes vs. o FigJam:**

- Aba "Notificações" (presente no FigJam em ambos papéis) foi **adiada pra v1.1** — sem backend, seria placeholder vazio.
- "Definir peso da tarefa" não vira tela dedicada — acontece dentro do fluxo de aprovação (admin aprova e define peso no mesmo passo); ajustes posteriores saem do detalhe da tarefa.

---

## ✅ Estado atual do desenvolvimento

### Concluído

- [x] Planejamento de requisitos e regras de negócio
- [x] Fluxograma de navegação no FigJam
- [x] Iteração de design (5 versões até chegar no estilo Notion minimalista)
- [x] Definição da paleta final
- [x] Escolha do template Expo (Default com Expo Router)
- [x] Criação do projeto `rotina-undb`
- [x] Limpeza do boilerplate (via `npm run reset-project`)
- [x] Criação da estrutura de pastas `(auth)`, `(admin)`, `(colaborador)`, `projeto`, `tarefa`
- [x] Theme tokens + componentes base (`Screen`, `GradientButton`, `TextField`, `Label`, `Title`, `Divider`)
- [x] Telas de autenticação (login, cadastro, esqueci-senha) com mock de redirecionamento por papel

---

### Decisões pendentes (discutir quando chegar a hora)

- **Backend**: Supabase? Firebase? Node+Prisma próprio? (MVP pode rodar com mock)
- **Gerenciamento de estado**: Zustand? Context+Reducer? React Query pra server state?
- **Autenticação real**: JWT + refresh token
- **Notificações push**: Expo Notifications

---

## 🎯 Prioridades do MVP

1. Autenticação funcional (login, cadastro do primeiro admin, recuperar senha)
2. Dashboards por papel
3. CRUD de projetos (admin)
4. CRUD de tarefas com fluxo de aprovação
5. Cálculo de cumprimento ponderado
6. Gestão de usuários + elevação de privilégio

Notificações, perfil/configurações e features sociais ficam pra v1.1.

---

## 📝 Convenções de código

- **Idioma dos identificadores**: inglês (`Task`, `User`, `Project`, `approveTask()`)
- **Idioma da UI**: português brasileiro
- **Imports absolutos** via `@/` (configurado no `tsconfig.json` do template)
- **Componentes** em PascalCase, hooks `use*`, utilitários camelCase
- **Tipos** em `types/` por domínio (`types/task.ts`, `types/user.ts`)
