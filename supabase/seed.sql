-- supabase/seed.sql
-- Catalogue de démonstration (à remplacer par le catalogue officiel de l'école)

insert into public.faculties (id, name, code) values
  ('11111111-1111-1111-1111-111111111101', 'Informatique', 'INFO'),
  ('11111111-1111-1111-1111-111111111102', 'Gestion', 'GEST'),
  ('11111111-1111-1111-1111-111111111103', 'Droit', 'DROIT')
on conflict (code) do nothing;

insert into public.levels (id, name, sort_order) values
  ('22222222-2222-2222-2222-222222222201', 'Licence 1', 1),
  ('22222222-2222-2222-2222-222222222202', 'Licence 2', 2),
  ('22222222-2222-2222-2222-222222222203', 'Licence 3', 3),
  ('22222222-2222-2222-2222-222222222204', 'Master 1', 4),
  ('22222222-2222-2222-2222-222222222205', 'Master 2', 5)
on conflict (name) do nothing;

insert into public.modules (faculty_id, level_id, name, code, description) values
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Algorithmique', 'INFO-L1-ALG', 'Bases de l''algorithmique'),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Mathématiques générales', 'INFO-L1-MATH', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'Introduction à la programmation', 'INFO-L1-PROG', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'Programmation orientée objet', 'INFO-L2-POO', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'Bases de données', 'INFO-L2-BDD', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'Réseaux informatiques', 'INFO-L2-RES', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'Génie logiciel', 'INFO-L3-GL', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'Développement mobile', 'INFO-L3-MOB', null),
  ('11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'Sécurité informatique', 'INFO-L3-SEC', null),
  ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222201', 'Comptabilité générale', 'GEST-L1-COMPTA', null),
  ('11111111-1111-1111-1111-111111111102', '22222222-2222-2222-2222-222222222201', 'Économie générale', 'GEST-L1-ECO', null),
  ('11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222201', 'Introduction au droit', 'DROIT-L1-INTRO', null)
on conflict do nothing;
