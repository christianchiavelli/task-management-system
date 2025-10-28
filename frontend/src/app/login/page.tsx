"use client";

import { LoginForm } from "@/components/forms/login-form";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Lado esquerdo - Branding (hidden no mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative">
        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative z-10">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-xl mb-8">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Bem-vindo de volta
          </h1>
          <p className="text-lg text-slate-300 mb-12 leading-relaxed">
            Acesse sua conta e continue organizando suas tarefas com eficiência.
          </p>

          {/* Features minimalistas */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <span className="text-slate-300">Organizaçao inteligente</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <span className="text-slate-300">Dashboard em tempo real</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Entre na sua conta
            </h2>
            <p className="text-slate-400">
              Ou{" "}
              <a
                href="/register"
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                crie uma nova conta
              </a>
            </p>
          </div>

          {/* Formulário sem card duplo */}
          <div className="space-y-6 mb-8">
            <Suspense
              fallback={
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              }
            >
              <LoginForm />
            </Suspense>
          </div>

          {/* Credenciais compactas */}
          <div className="bg-slate-800/40 backdrop-blur rounded-lg p-4 border border-slate-700/30">
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              Credenciais de Teste
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-blue-400 font-medium">Admin</p>
                <p className="text-slate-400">admin@test.com</p>
                <p className="text-slate-400">password123</p>
              </div>
              <div>
                <p className="text-green-400 font-medium">Usuário</p>
                <p className="text-slate-400">user@test.com</p>
                <p className="text-slate-400">password123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
