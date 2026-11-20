-- supabase/migrations/202603200001_init_schema.sql
-- Schéma initial Campus Tutor — montants en FCFA entiers, UUID, timestamptz

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Catalogue académique
-- ---------------------------------------------------------------------------

create table public.faculties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.levels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (name)
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  faculty_id uuid not null references public.faculties (id),
  level_id uuid not null references public.levels (id),
  name text not null,
  code text,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (faculty_id, level_id, code),
  unique (faculty_id, level_id, name)
);

create index modules_faculty_level_idx on public.modules (faculty_id, level_id);
create index modules_active_idx on public.modules (is_active);

-- ---------------------------------------------------------------------------
-- Profils et rôles
-- ---------------------------------------------------------------------------

create type public.account_status as enum ('pending', 'active', 'suspended');
create type public.app_role as enum ('student', 'admin');
create type public.tutor_status as enum ('pending', 'approved', 'rejected', 'suspended');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text not null unique,
  phone text,
  student_number text,
  faculty_id uuid references public.faculties (id),
  level_id uuid references public.levels (id),
  avatar_url text,
  account_status public.account_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table public.tutor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  status public.tutor_status not null default 'pending',
  payout_phone text,
  payout_provider text,
  bio text,
  approved_by uuid references public.profiles (id),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Demandes, propositions, réservations
-- ---------------------------------------------------------------------------

create type public.assistance_mode as enum ('online', 'in_person');
create type public.request_status as enum ('open', 'matched', 'closed', 'cancelled', 'expired');
create type public.proposal_status as enum ('pending', 'accepted', 'rejected', 'expired', 'withdrawn');
create type public.booking_status as enum (
  'pending_payment',
  'confirmed',
  'in_progress',
  'awaiting_completion',
  'completed',
  'disputed',
  'cancelled',
  'refunded'
);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id),
  faculty_id uuid not null references public.faculties (id),
  level_id uuid not null references public.levels (id),
  module_id uuid not null references public.modules (id),
  module_name_snapshot text not null,
  description text not null,
  preferred_mode public.assistance_mode not null,
  preferred_date timestamptz,
  preferred_duration_minutes integer not null check (preferred_duration_minutes > 0),
  budget_amount integer check (budget_amount is null or budget_amount >= 0),
  status public.request_status not null default 'open',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index requests_status_idx on public.requests (status);
create index requests_requester_idx on public.requests (requester_id);
create index requests_module_idx on public.requests (module_id);

create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  tutor_id uuid not null references public.tutor_profiles (id),
  proposed_mode public.assistance_mode not null,
  hourly_rate integer not null check (hourly_rate > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  proposed_date timestamptz,
  message text,
  status public.proposal_status not null default 'pending',
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  unique (request_id, tutor_id)
);

create index proposals_request_idx on public.proposals (request_id);
create index proposals_tutor_idx on public.proposals (tutor_id);
create index proposals_status_idx on public.proposals (status);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id),
  proposal_id uuid not null unique references public.proposals (id),
  requester_id uuid not null references public.profiles (id),
  tutor_id uuid not null references public.tutor_profiles (id),
  mode public.assistance_mode not null,
  hourly_rate integer not null check (hourly_rate > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  total_amount integer not null check (total_amount > 0),
  currency text not null default 'XOF',
  platform_commission_rate integer not null default 30 check (platform_commission_rate >= 0 and platform_commission_rate <= 100),
  platform_commission_amount integer not null check (platform_commission_amount >= 0),
  tutor_due_amount integer not null check (tutor_due_amount >= 0),
  scheduled_at timestamptz not null,
  status public.booking_status not null default 'pending_payment',
  requester_confirmed_at timestamptz,
  tutor_confirmed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_commission_sum_check check (
    platform_commission_amount + tutor_due_amount = total_amount
  )
);

-- Une seule réservation active confirmée / en cours par demande (RG-12)
create unique index bookings_one_active_per_request_idx
  on public.bookings (request_id)
  where status in (
    'pending_payment',
    'confirmed',
    'in_progress',
    'awaiting_completion',
    'disputed'
  );

create index bookings_requester_idx on public.bookings (requester_id);
create index bookings_tutor_idx on public.bookings (tutor_id);
create index bookings_status_idx on public.bookings (status);

-- ---------------------------------------------------------------------------
-- Paiements et finance
-- ---------------------------------------------------------------------------

create type public.payment_status as enum (
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded'
);

create type public.ledger_account_type as enum (
  'platform',
  'tutor_payable',
  'provider_fee',
  'refund'
);

create type public.withdrawal_batch_status as enum (
  'draft',
  'reviewed',
  'processing',
  'completed',
  'cancelled'
);

create type public.withdrawal_status as enum (
  'pending',
  'processing',
  'paid',
  'failed',
  'cancelled'
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id),
  provider text not null,
  provider_reference text,
  amount integer not null check (amount > 0),
  currency text not null default 'XOF',
  status public.payment_status not null default 'pending',
  paid_at timestamptz,
  raw_provider_payload jsonb,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_reference)
);

create index payments_booking_idx on public.payments (booking_id);
create index payments_status_idx on public.payments (status);

create table public.financial_ledger (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings (id),
  payment_id uuid references public.payments (id),
  user_id uuid references public.profiles (id),
  entry_type text not null,
  account_type public.ledger_account_type not null,
  amount integer not null,
  currency text not null default 'XOF',
  description text,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  created_by uuid references public.profiles (id)
);

create index financial_ledger_booking_idx on public.financial_ledger (booking_id);
create index financial_ledger_user_idx on public.financial_ledger (user_id);

create table public.tutor_wallets (
  id uuid primary key default gen_random_uuid(),
  tutor_id uuid not null unique references public.tutor_profiles (id) on delete cascade,
  pending_balance integer not null default 0 check (pending_balance >= 0),
  available_balance integer not null default 0 check (available_balance >= 0),
  total_earned integer not null default 0 check (total_earned >= 0),
  total_paid_out integer not null default 0 check (total_paid_out >= 0),
  updated_at timestamptz not null default now()
);

create table public.withdrawal_batches (
  id uuid primary key default gen_random_uuid(),
  period_start timestamptz not null,
  period_end timestamptz not null,
  status public.withdrawal_batch_status not null default 'draft',
  created_by uuid not null references public.profiles (id),
  approved_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  completed_at timestamptz,
  check (period_end > period_start)
);

create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.withdrawal_batches (id) on delete cascade,
  tutor_id uuid not null references public.tutor_profiles (id),
  amount integer not null check (amount > 0),
  currency text not null default 'XOF',
  payout_provider text,
  payout_phone_snapshot text,
  provider_reference text,
  status public.withdrawal_status not null default 'pending',
  proof_url text,
  processed_by uuid references public.profiles (id),
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (batch_id, tutor_id)
);

create index withdrawals_tutor_idx on public.withdrawals (tutor_id);
create index withdrawals_status_idx on public.withdrawals (status);

-- ---------------------------------------------------------------------------
-- Notifications, avis, audit
-- ---------------------------------------------------------------------------

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  message text not null,
  type text not null,
  related_entity_type text,
  related_entity_id uuid,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings (id),
  reviewer_id uuid not null references public.profiles (id),
  reviewed_id uuid not null references public.profiles (id),
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (booking_id, reviewer_id)
);

create table public.admin_audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles (id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index admin_audit_logs_admin_idx on public.admin_audit_logs (admin_id, created_at desc);
