'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

// Componente Button interno simples para evitar dependência circular
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = ({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-600",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-600",
    ghost: "hover:bg-gray-100 focus-visible:ring-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Tipos para breadcrumb
type BreadcrumbItem = {
  label: string;
  href?: string;
  active?: boolean;
};

// Props do Header
type HeaderProps = {
  type: 'main' | 'page';
  title?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBackButton?: boolean;
  rightContent?: React.ReactNode;
  onBack?: () => void;
};

export function Header({
  type,
  title,
  subtitle,
  breadcrumbs = [],
  showBackButton = true,
  rightContent,
  onBack,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  // Header tipo "main" - para dashboard
  if (type === 'main') {
    return (
      <header className="backdrop-blur-md bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-xl">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {title || 'Task Manager'}
                </h1>
                <p className="text-sm text-slate-400">
                  {subtitle || 'Dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Informações do usuário */}
              {user && (
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              )}
              
              {/* Conteúdo customizado da direita */}
              {rightContent}
              
              {/* Botão sair */}
              <Button 
                onClick={logout} 
                variant="outline" 
                size="sm" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // Header tipo "page" - para páginas internas
  return (
    <header className="backdrop-blur-md bg-slate-800/50 border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Botão Voltar */}
            {showBackButton && (
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Voltar
              </button>
            )}
            
            {/* Breadcrumb */}
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {index > 0 && (
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    )}
                    {item.href && !item.active ? (
                      <a 
                        href={item.href}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <span className={item.active ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            )}

            {/* Título customizado para páginas sem breadcrumb */}
            {breadcrumbs.length === 0 && title && (
              <div>
                <h1 className="text-xl font-semibold text-white">{title}</h1>
                {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
              </div>
            )}
          </div>

          {/* Conteúdo customizado da direita */}
          {rightContent && (
            <div className="flex items-center space-x-4">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// Componente auxiliar para facilitar a criação de breadcrumbs
export const createBreadcrumbs = (items: Array<{label: string; href?: string}>): BreadcrumbItem[] => {
  return items.map((item, index) => ({
    ...item,
    active: index === items.length - 1, // Último item é sempre ativo
  }));
};