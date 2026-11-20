// src/app/(auth)/login/page.tsx
import Link from "next/link";
import { LoginForm } from "@/features/auth/components/login-form";
import { AppConfig } from "@/lib/config";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-emerald-700">
            {AppConfig.appName}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-1 text-sm text-slate-600">
            Accède à ton espace étudiant / aidant.
          </p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          Pas encore de compte ?{" "}
          <Link href="/register" className="font-medium text-emerald-700">
            S&apos;inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
