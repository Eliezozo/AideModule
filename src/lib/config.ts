// src/lib/config.ts
export const AppConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "Campus Tutor",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  currency: "XOF" as const,
  timezone: "Africa/Lome" as const,
  commissionRate: Number(process.env.PLATFORM_COMMISSION_RATE ?? 30),
  tutorShareRate: 70,
  paymentProvider: process.env.PAYMENT_PROVIDER ?? "simulated",
} as const;
