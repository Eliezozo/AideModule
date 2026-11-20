-- supabase/migrations/202603200002_helpers_and_rls.sql
-- Fonctions utilitaires + Row Level Security

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = uid
      and role = 'admin'
  );
$$;

create or replace function public.is_approved_tutor(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tutor_profiles
    where user_id = uid
      and status = 'approved'
  );
$$;

create or replace function public.current_tutor_id(uid uuid default auth.uid())
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.tutor_profiles
  where user_id = uid
  limit 1;
$$;

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger modules_updated_at
  before update on public.modules
  for each row execute function public.handle_updated_at();

create trigger requests_updated_at
  before update on public.requests
  for each row execute function public.handle_updated_at();

create trigger bookings_updated_at
  before update on public.bookings
  for each row execute function public.handle_updated_at();

create trigger payments_updated_at
  before update on public.payments
  for each row execute function public.handle_updated_at();

create trigger tutor_profiles_updated_at
  before update on public.tutor_profiles
  for each row execute function public.handle_updated_at();

-- Création automatique du profil + rôle student à l'inscription
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    first_name,
    last_name,
    email,
    phone,
    student_number,
    account_status
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'first_name', 'Étudiant'),
    coalesce(new.raw_user_meta_data->>'last_name', ''),
    new.email,
    nullif(new.raw_user_meta_data->>'phone', ''),
    nullif(new.raw_user_meta_data->>'student_number', ''),
    'active'
  );

  insert into public.user_roles (user_id, role)
  values (new.id, 'student');

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Portefeuille automatique à la création du profil aidant
create or replace function public.handle_new_tutor_wallet()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.tutor_wallets (tutor_id)
  values (new.id)
  on conflict (tutor_id) do nothing;
  return new;
end;
$$;

create trigger on_tutor_profile_created
  after insert on public.tutor_profiles
  for each row execute function public.handle_new_tutor_wallet();

-- ---------------------------------------------------------------------------
-- Activer RLS
-- ---------------------------------------------------------------------------

alter table public.faculties enable row level security;
alter table public.levels enable row level security;
alter table public.modules enable row level security;
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.tutor_profiles enable row level security;
alter table public.requests enable row level security;
alter table public.proposals enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.financial_ledger enable row level security;
alter table public.tutor_wallets enable row level security;
alter table public.withdrawal_batches enable row level security;
alter table public.withdrawals enable row level security;
alter table public.notifications enable row level security;
alter table public.reviews enable row level security;
alter table public.admin_audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- Catalogue : lecture publique auth, écriture admin
-- ---------------------------------------------------------------------------

create policy "faculties_select_authenticated"
  on public.faculties for select to authenticated
  using (is_active = true or public.is_admin());

create policy "faculties_admin_all"
  on public.faculties for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "levels_select_authenticated"
  on public.levels for select to authenticated
  using (is_active = true or public.is_admin());

create policy "levels_admin_all"
  on public.levels for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "modules_select_authenticated"
  on public.modules for select to authenticated
  using (is_active = true or public.is_admin());

create policy "modules_admin_all"
  on public.modules for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Profils / rôles / aidants
-- ---------------------------------------------------------------------------

create policy "profiles_select_own_or_admin"
  on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

create policy "user_roles_select_own_or_admin"
  on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "user_roles_admin_write"
  on public.user_roles for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "tutor_profiles_select"
  on public.tutor_profiles for select to authenticated
  using (
    user_id = auth.uid()
    or public.is_admin()
    or status = 'approved'
  );

create policy "tutor_profiles_insert_own"
  on public.tutor_profiles for insert to authenticated
  with check (user_id = auth.uid());

create policy "tutor_profiles_update_own_or_admin"
  on public.tutor_profiles for update to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Demandes
-- ---------------------------------------------------------------------------

create policy "requests_select"
  on public.requests for select to authenticated
  using (
    requester_id = auth.uid()
    or public.is_admin()
    or (status = 'open' and public.is_approved_tutor())
  );

create policy "requests_insert_own"
  on public.requests for insert to authenticated
  with check (requester_id = auth.uid());

create policy "requests_update_own_or_admin"
  on public.requests for update to authenticated
  using (requester_id = auth.uid() or public.is_admin())
  with check (requester_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- Propositions
-- ---------------------------------------------------------------------------

create policy "proposals_select"
  on public.proposals for select to authenticated
  using (
    public.is_admin()
    or tutor_id = public.current_tutor_id()
    or exists (
      select 1 from public.requests r
      where r.id = request_id and r.requester_id = auth.uid()
    )
  );

create policy "proposals_insert_approved_tutor"
  on public.proposals for insert to authenticated
  with check (
    public.is_approved_tutor()
    and tutor_id = public.current_tutor_id()
  );

create policy "proposals_update_parties_or_admin"
  on public.proposals for update to authenticated
  using (
    public.is_admin()
    or tutor_id = public.current_tutor_id()
    or exists (
      select 1 from public.requests r
      where r.id = request_id and r.requester_id = auth.uid()
    )
  )
  with check (
    public.is_admin()
    or tutor_id = public.current_tutor_id()
    or exists (
      select 1 from public.requests r
      where r.id = request_id and r.requester_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Réservations / paiements
-- ---------------------------------------------------------------------------

create policy "bookings_select"
  on public.bookings for select to authenticated
  using (
    public.is_admin()
    or requester_id = auth.uid()
    or tutor_id = public.current_tutor_id()
  );

create policy "bookings_insert_requester"
  on public.bookings for insert to authenticated
  with check (requester_id = auth.uid() or public.is_admin());

create policy "bookings_update_parties_or_admin"
  on public.bookings for update to authenticated
  using (
    public.is_admin()
    or requester_id = auth.uid()
    or tutor_id = public.current_tutor_id()
  )
  with check (
    public.is_admin()
    or requester_id = auth.uid()
    or tutor_id = public.current_tutor_id()
  );

create policy "payments_select"
  on public.payments for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and (b.requester_id = auth.uid() or b.tutor_id = public.current_tutor_id())
    )
  );

-- Écriture payments uniquement via service role / server (pas de policy insert client)
create policy "payments_admin_select_all"
  on public.payments for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Finance : lecture restreinte, écriture admin/service
-- ---------------------------------------------------------------------------

create policy "ledger_select"
  on public.financial_ledger for select to authenticated
  using (public.is_admin() or user_id = auth.uid());

create policy "ledger_admin_write"
  on public.financial_ledger for insert to authenticated
  with check (public.is_admin());

create policy "wallets_select"
  on public.tutor_wallets for select to authenticated
  using (
    public.is_admin()
    or tutor_id = public.current_tutor_id()
  );

create policy "wallets_admin_update"
  on public.tutor_wallets for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "withdrawal_batches_admin"
  on public.withdrawal_batches for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "withdrawals_select"
  on public.withdrawals for select to authenticated
  using (
    public.is_admin()
    or tutor_id = public.current_tutor_id()
  );

create policy "withdrawals_admin_write"
  on public.withdrawals for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Notifications / reviews / audit
-- ---------------------------------------------------------------------------

create policy "notifications_select_own"
  on public.notifications for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "notifications_update_own"
  on public.notifications for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "notifications_insert_admin_or_self"
  on public.notifications for insert to authenticated
  with check (user_id = auth.uid() or public.is_admin());

create policy "reviews_select_authenticated"
  on public.reviews for select to authenticated
  using (true);

create policy "reviews_insert_own"
  on public.reviews for insert to authenticated
  with check (reviewer_id = auth.uid());

create policy "audit_admin_all"
  on public.admin_audit_logs for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
