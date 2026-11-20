// src/app/(auth)/register/page.tsx
import Link from "next/link";
import { RegisterForm } from "@/features/auth/components/register-form";
import { AppConfig } from "@/lib/config";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-emerald-700">
            {AppConfig.appName}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">
            Créer un compte
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Un seul compte pour demander de l&apos;aide et devenir aidant.
          </p>
        </div>
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà inscrit ?{" "}
          <Link href="/login" className="font-medium text-emerald-700">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
