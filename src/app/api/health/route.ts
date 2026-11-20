// src/app/api/health/route.ts
import { NextResponse } from "next/server";
import { AppConfig } from "@/lib/config";

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: AppConfig.appName,
    currency: AppConfig.currency,
    commissionRate: AppConfig.commissionRate,
    paymentProvider: AppConfig.paymentProvider,
    supabaseConfigured: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  });
}
