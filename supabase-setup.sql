create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  image text not null,
  image_path text,
  wholesale numeric(12, 2) not null default 0,
  retail numeric(12, 2) not null default 0,
  stock integer not null default 0,
  notes text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.product_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

alter table public.products enable row level security;
alter table public.product_admins enable row level security;

drop policy if exists "Anyone can read products" on public.products;
create policy "Anyone can read products"
  on public.products for select
  to anon, authenticated
  using (true);

drop policy if exists "Product admins can manage products" on public.products;
create policy "Product admins can manage products"
  on public.products for all
  to authenticated
  using (
    exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );

drop policy if exists "Users can read their own admin membership" on public.product_admins;
create policy "Users can read their own admin membership"
  on public.product_admins for select
  to authenticated
  using (user_id = auth.uid());

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.product_admins to authenticated;

insert into public.products (id, name, category, image, wholesale, retail, stock, notes)
values
  ('monstera', 'Monstera Deliciosa', 'Indoor Plants', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80', 18000, 28000, 12, 'A bold, easygoing beauty. Loves bright, indirect light.'),
  ('olive', 'Little Olive Tree', 'Outdoor Plants', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80', 23000, 36000, 8, 'A sun-loving little tree for patios and bright corners.'),
  ('pothos', 'Golden Pothos', 'Indoor Plants', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80', 9000, 16000, 18, 'A cheerful trailing plant that is happy in most rooms.'),
  ('terracotta', 'Terracotta Planter', 'Outdoor Plants', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', 11000, 19000, 10, 'A classic home for your favorite leafy friend.'),
  ('fertilizer', 'Everyday Plant Food', 'Medicines & Food', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80', 6000, 11000, 25, 'A gentle feed to keep your growing things happy.'),
  ('snake', 'Snake Plant', 'Indoor Plants', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80', 14000, 22000, 9, 'Architectural, resilient, and wonderfully low fuss.'),
  ('lavender', 'Garden Lavender', 'Outdoor Plants', 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=800&q=80', 12000, 20000, 11, 'Fragrant purple blooms that love a sunny spot.'),
  ('leaf-care', 'Leaf & Root Care', 'Medicines & Food', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 7000, 13000, 16, 'A handy plant care essential for your home jungle.'),
  ('peat-moss', 'Peat Moss', 'Peat Moss', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 5000, 8000, 20, 'A moisture-retaining growing medium for garden mixes.'),
  ('ornamental-olive', 'Ornamental Olive', 'Ornamental Olive', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80', 30000, 45000, 6, 'A sun-loving ornamental olive for patios and bright spaces.')
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Anyone can read product images" on storage.objects;
create policy "Anyone can read product images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "Product admins can upload product images" on storage.objects;
create policy "Product admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );

drop policy if exists "Product admins can update product images" on storage.objects;
create policy "Product admins can update product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );

drop policy if exists "Product admins can delete product images" on storage.objects;
create policy "Product admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );

do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'products'
  ) then
    alter publication supabase_realtime add table public.products;
  end if;
end
$$;
