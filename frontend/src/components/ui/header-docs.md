# Componente Header Reutilizável

Este componente Header foi criado para padronizar os cabeçalhos em todas as páginas do sistema, mantendo a mesma identidade visual.

## Tipos Disponíveis

### 1. Header Principal (`type="main"`)
Para páginas principais como Dashboard. Inclui:
- Logo do sistema
- Título e subtítulo
- Informações do usuário
- Botão de logout
- Conteúdo customizável à direita

### 2. Header de Página (`type="page"`)
Para páginas internas. Inclui:
- Botão voltar
- Breadcrumb de navegação
- Título customizável
- Conteúdo customizável à direita

## Como Usar

### Header Principal (Dashboard)

```tsx
import { Header } from "@/components/ui";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header type="main" />
      {/* Resto do conteúdo */}
    </div>
  );
}
```

### Header de Página com Breadcrumb

```tsx
import { Header, createBreadcrumbs } from "@/components/ui";

export default function UsersPage() {
  const breadcrumbs = createBreadcrumbs([
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Admin', href: '/admin' },
    { label: 'Gerenciar Usuários' }, // Último item é sempre ativo
  ]);

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        type="page" 
        breadcrumbs={breadcrumbs}
      />
      {/* Resto do conteúdo */}
    </div>
  );
}
```

### Header de Página com Conteúdo Customizado

```tsx
import { Header, Button } from "@/components/ui";

export default function ProductsPage() {
  const rightContent = (
    <Button className="bg-green-600 hover:bg-green-700">
      Novo Produto
    </Button>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      <Header 
        type="page" 
        title="Produtos"
        subtitle="Gerencie seus produtos"
        rightContent={rightContent}
        showBackButton={false} // Desabilita o botão voltar
      />
      {/* Resto do conteúdo */}
    </div>
  );
}
```

## Props Disponíveis

### HeaderProps

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| `type` | `'main' \| 'page'` | - | **Obrigatório.** Tipo do header |
| `title` | `string` | `'Task Manager'` | Título customizado |
| `subtitle` | `string` | `'Dashboard'` | Subtítulo customizado |
| `breadcrumbs` | `BreadcrumbItem[]` | `[]` | Array de itens do breadcrumb |
| `showBackButton` | `boolean` | `true` | Mostra/oculta botão voltar |
| `rightContent` | `React.ReactNode` | - | Conteúdo customizado à direita |
| `onBack` | `() => void` | `router.back()` | Função customizada para voltar |

### BreadcrumbItem

| Prop | Tipo | Descrição |
|------|------|-----------|
| `label` | `string` | Texto do breadcrumb |
| `href` | `string?` | Link opcional |
| `active` | `boolean?` | Se é o item ativo (usado automaticamente) |

## Função Auxiliar

### `createBreadcrumbs(items)`

Cria automaticamente um array de breadcrumbs onde o último item é sempre marcado como ativo.

```tsx
const breadcrumbs = createBreadcrumbs([
  { label: 'Home', href: '/' },
  { label: 'Produtos', href: '/products' },
  { label: 'Novo Produto' }, // Será automaticamente ativo
]);
```

## Benefícios

✅ **Consistência Visual**: Mesmo padrão em todas as páginas
✅ **Reutilização**: Um componente para todos os headers
✅ **Customização**: Flexível para diferentes necessidades
✅ **Responsivo**: Se adapta a diferentes tamanhos de tela
✅ **Acessibilidade**: Botões e navegação adequados
✅ **Manutenibilidade**: Mudanças centralizadas

## Implementação Atual

Já implementado nas seguintes páginas:
- `/dashboard` - Header principal
- `/admin/users` - Header de página com breadcrumb
- `/profile` - Header de página com breadcrumb
- `/tasks/new` - Header de página com breadcrumb

## Próximos Passos

Para implementar em outras páginas:
1. Importe o componente: `import { Header, createBreadcrumbs } from "@/components/ui"`
2. Substitua o header existente pelo novo componente
3. Configure as props conforme necessário
4. Teste a navegação e aparência