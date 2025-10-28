"use client";

import { RegisterForm } from "@/components/forms/register-form";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex">
      {/* Lado esquerdo - Branding (hidden no mobile) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 relative">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-600/10 via-teal-600/10 to-cyan-600/10"></div>
        <div className="relative z-10">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600 rounded-xl mb-8">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Junte-se a nós
          </h1>
          <p className="text-lg text-slate-300 mb-12 leading-relaxed">
            Crie sua conta gratuita e comece a organizar suas tarefas hoje mesmo.
          </p>

          {/* Benefits minimalistas */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-slate-300">Gratuito e sem limitações</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-teal-600/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <span className="text-slate-300">Configuração rápida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-600 rounded-xl mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Task Manager</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Crie sua conta
            </h2>
            <p className="text-slate-400">
              Ou{" "}
              <a
                href="/login"
                className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                entre na sua conta existente
              </a>
            </p>
          </div>

          {/* Formulário sem card duplo */}
          <div className="space-y-6">
            <Suspense
              fallback={
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              }
            >
              <RegisterForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
