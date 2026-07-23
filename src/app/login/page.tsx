"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { signIn, signUp, type AuthFormState } from "./actions";

const initialState: AuthFormState = { error: null };

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-mova-500 focus:outline-none focus:ring-2 focus:ring-mova-500/30";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(signIn, initialState);
  const [signupState, signupAction, signupPending] = useActionState(signUp, initialState);

  const isLogin = mode === "login";
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, var(--color-mova-700) 0%, transparent 70%), radial-gradient(40% 40% at 90% 100%, var(--color-mova-pink) 0%, transparent 60%), radial-gradient(35% 35% at 5% 90%, var(--color-mova-teal) 0%, transparent 60%)",
          opacity: 0.25,
        }}
      />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-white p-8 shadow-2xl shadow-black/40">
        <div className="flex flex-col items-center text-center">
          <Image src="/mova-icon.png" alt="Mova" width={56} height={56} priority className="h-14 w-14" />
          <h1 className="mt-3 text-xl font-semibold text-slate-900">Mova Flow</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin ? "Entre com sua conta da agência." : "Crie sua conta na agência."}
          </p>
        </div>

        <form action={isLogin ? loginAction : signupAction} className="mt-6 space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Nome</label>
              <input name="name" type="text" required className={inputClass} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700">E-mail</label>
            <input name="email" type="email" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Senha</label>
            <input name="password" type="password" required minLength={6} className={inputClass} />
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-mova-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-mova-700 disabled:opacity-60"
          >
            {pending ? "Aguarde..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(isLogin ? "signup" : "login")}
          className="mt-4 w-full text-center text-sm text-mova-600 hover:underline"
        >
          {isLogin ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}
