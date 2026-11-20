create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null,
  image text not null,
  image_path text,
  images jsonb not null default '[]'::jsonb,
  video_url text not null default '',
  video_path text,
  wholesale numeric(12, 2) not null default 0,
  retail numeric(12, 2) not null default 0,
  wholesale_usd numeric(12, 2) not null default 0,
  retail_usd numeric(12, 2) not null default 0,
  is_best_seller boolean not null default false,
  coming_soon boolean not null default false,
  discount_percent numeric(5, 2) not null default 0 constraint products_discount_percent_valid check (discount_percent between 0 and 90),
  sale_iqd numeric(12, 2) not null default 0 constraint products_sale_iqd_valid check (sale_iqd >= 0 and (sale_iqd = 0 or (retail > 0 and sale_iqd < retail))),
  sale_usd numeric(12, 2) not null default 0 constraint products_sale_usd_valid check (sale_usd >= 0 and (sale_usd = 0 or (retail_usd > 0 and sale_usd < retail_usd))),
  rating numeric(2, 1) not null default 0 constraint products_rating_valid check (rating between 0 and 5),
  review_count integer not null default 0 constraint products_review_count_valid check (review_count >= 0),
  stock integer not null default 0,
  notes text not null default '',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products add column if not exists name text not null default '';
alter table public.products add column if not exists category text not null default '';
alter table public.products add column if not exists image text not null default '';
alter table public.products add column if not exists image_path text;
alter table public.products add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists video_url text not null default '';
alter table public.products add column if not exists video_path text;
alter table public.products add column if not exists wholesale numeric(12, 2) not null default 0;
alter table public.products add column if not exists retail numeric(12, 2) not null default 0;
alter table public.products add column if not exists wholesale_usd numeric(12, 2) not null default 0;
alter table public.products add column if not exists retail_usd numeric(12, 2) not null default 0;
alter table public.products add column if not exists is_best_seller boolean not null default false;
alter table public.products add column if not exists coming_soon boolean not null default false;
alter table public.products add column if not exists discount_percent numeric(5, 2) not null default 0;
alter table public.products add column if not exists sale_iqd numeric(12, 2) not null default 0;
alter table public.products add column if not exists sale_usd numeric(12, 2) not null default 0;
alter table public.products add column if not exists rating numeric(2, 1) not null default 0;
alter table public.products add column if not exists review_count integer not null default 0;
alter table public.products add column if not exists stock integer not null default 0;
alter table public.products add column if not exists notes text not null default '';
alter table public.products add column if not exists created_by uuid references auth.users(id) on delete set null;
alter table public.products add column if not exists created_at timestamptz;
alter table public.products add column if not exists updated_at timestamptz not null default now();

update public.products set updated_at = now() where updated_at is null;
alter table public.products alter column updated_at set default now();
alter table public.products alter column updated_at set not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'products_discount_percent_valid' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_discount_percent_valid check (discount_percent between 0 and 90);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_sale_iqd_valid' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_sale_iqd_valid check (sale_iqd >= 0 and (sale_iqd = 0 or (retail > 0 and sale_iqd < retail)));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_sale_usd_valid' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_sale_usd_valid check (sale_usd >= 0 and (sale_usd = 0 or (retail_usd > 0 and sale_usd < retail_usd)));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_rating_valid' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_rating_valid check (rating between 0 and 5);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'products_review_count_valid' and conrelid = 'public.products'::regclass) then
    alter table public.products add constraint products_review_count_valid check (review_count >= 0);
  end if;
end
$$;

update public.products set created_at = coalesce(updated_at, now()) where created_at is null;
alter table public.products alter column created_at set default now();
alter table public.products alter column created_at set not null;

update public.products
set images = jsonb_build_array(jsonb_build_object('url', image, 'path', coalesce(image_path, '')))
where images = '[]'::jsonb and image <> '';

create table if not exists public.store_settings (
  id text primary key default 'main' check (id = 'main'),
  discount numeric(5, 2) not null default 0 check (discount between 0 and 90),
  fib_account text not null default '+9647728503201',
  instagram_url text not null default 'https://www.instagram.com/ms_gardennn?bqrl=NjJ2b251MGRwMWJy',
  facebook_url text not null default '',
  tiktok_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.store_settings add column if not exists discount numeric(5, 2) not null default 0;
alter table public.store_settings add column if not exists fib_account text not null default '+9647728503201';
alter table public.store_settings add column if not exists instagram_url text not null default 'https://www.instagram.com/ms_gardennn?bqrl=NjJ2b251MGRwMWJy';
alter table public.store_settings add column if not exists facebook_url text not null default '';
alter table public.store_settings add column if not exists tiktok_url text not null default '';
alter table public.store_settings add column if not exists updated_at timestamptz not null default now();

update public.store_settings set updated_at = now() where updated_at is null;
alter table public.store_settings alter column updated_at set default now();
alter table public.store_settings alter column updated_at set not null;

insert into public.store_settings (id) values ('main')
on conflict (id) do nothing;

create table if not exists public.product_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  title text not null default '',
  avatar_url text not null default '',
  phone text not null default '',
  notes text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.admin_profiles add column if not exists full_name text not null default '';
alter table public.admin_profiles add column if not exists title text not null default '';
alter table public.admin_profiles add column if not exists avatar_url text not null default '';
alter table public.admin_profiles add column if not exists phone text not null default '';
alter table public.admin_profiles add column if not exists notes text not null default '';
alter table public.admin_profiles add column if not exists updated_at timestamptz not null default now();

update public.admin_profiles set updated_at = now() where updated_at is null;
alter table public.admin_profiles alter column updated_at set default now();
alter table public.admin_profiles alter column updated_at set not null;

drop view if exists public.admin_public_profiles;
create view public.admin_public_profiles as
  select user_id, full_name, title, avatar_url
  from public.admin_profiles;

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  customer_token text not null default '',
  instruction text not null default '',
  delivery_date date,
  delivery_time text not null default '',
  is_gift boolean not null default false,
  gift_message text not null default '',
  notes text not null default '',
  payment text not null default '',
  card text not null default '',
  receipt text not null default '',
  items jsonb not null default '[]'::jsonb,
  subtotal_iqd numeric(12, 2) not null default 0,
  subtotal_usd numeric(12, 2) not null default 0,
  delivery_fee_iqd numeric(12, 2),
  delivery_fee_usd numeric(12, 2),
  total_iqd numeric(12, 2),
  total_usd numeric(12, 2),
  agreed boolean not null default false,
  status text not null default 'Awaiting delivery price',
  updated_at timestamptz not null default now()
);

alter table public.orders add column if not exists created_at timestamptz;
alter table public.orders add column if not exists customer_name text not null default '';
alter table public.orders add column if not exists customer_phone text not null default '';
alter table public.orders add column if not exists customer_address text not null default '';
alter table public.orders add column if not exists customer_token text not null default '';
alter table public.orders add column if not exists instruction text not null default '';
alter table public.orders add column if not exists delivery_date date;
alter table public.orders add column if not exists delivery_time text not null default '';
alter table public.orders add column if not exists is_gift boolean not null default false;
alter table public.orders add column if not exists gift_message text not null default '';
alter table public.orders add column if not exists notes text not null default '';
alter table public.orders add column if not exists payment text not null default '';
alter table public.orders add column if not exists card text not null default '';
alter table public.orders add column if not exists receipt text not null default '';
alter table public.orders add column if not exists items jsonb not null default '[]'::jsonb;
alter table public.orders add column if not exists subtotal_iqd numeric(12, 2) not null default 0;
alter table public.orders add column if not exists subtotal_usd numeric(12, 2) not null default 0;
alter table public.orders add column if not exists delivery_fee_iqd numeric(12, 2);
alter table public.orders add column if not exists delivery_fee_usd numeric(12, 2);
alter table public.orders add column if not exists total_iqd numeric(12, 2);
alter table public.orders add column if not exists total_usd numeric(12, 2);
alter table public.orders add column if not exists agreed boolean not null default false;
alter table public.orders add column if not exists status text not null default 'Awaiting delivery price';
alter table public.orders add column if not exists updated_at timestamptz not null default now();

update public.orders set updated_at = now() where updated_at is null;
alter table public.orders alter column updated_at set default now();
alter table public.orders alter column updated_at set not null;
update public.orders set created_at = coalesce(updated_at, now()) where created_at is null;
alter table public.orders alter column created_at set default now();
alter table public.orders alter column created_at set not null;

create table if not exists public.admin_activity (
  id bigint generated always as identity primary key,
  admin_id uuid references auth.users(id) on delete set null,
  admin_name text not null default '',
  action text not null,
  target_type text not null,
  target_id text not null default '',
  target_name text not null default '',
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.admin_activity add column if not exists admin_id uuid references auth.users(id) on delete set null;
alter table public.admin_activity add column if not exists admin_name text not null default '';
alter table public.admin_activity add column if not exists action text not null default '';
alter table public.admin_activity add column if not exists target_type text not null default '';
alter table public.admin_activity add column if not exists target_id text not null default '';
alter table public.admin_activity add column if not exists target_name text not null default '';
alter table public.admin_activity add column if not exists details jsonb not null default '{}'::jsonb;
alter table public.admin_activity add column if not exists created_at timestamptz not null default now();

update public.admin_activity set created_at = now() where created_at is null;
alter table public.admin_activity alter column created_at set default now();
alter table public.admin_activity alter column created_at set not null;

create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists admin_activity_created_at_idx on public.admin_activity (created_at desc);

create or replace function public.stamp_product_creator()
returns trigger
language plpgsql
as $$
begin
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
  else
    new.created_by := old.created_by;
  end if;
  return new;
end;
$$;

drop trigger if exists products_stamp_creator on public.products;
create trigger products_stamp_creator
before insert or update on public.products
for each row execute function public.stamp_product_creator();

create or replace function public.stamp_admin_activity_actor()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
begin
  if auth.uid() is not null then
    new.admin_id := auth.uid();
    select full_name into profile_name
    from public.admin_profiles
    where user_id = auth.uid();
    if coalesce(profile_name, '') <> '' then
      new.admin_name := profile_name;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists admin_activity_stamp_actor on public.admin_activity;
create trigger admin_activity_stamp_actor
before insert on public.admin_activity
for each row execute function public.stamp_admin_activity_actor();

create or replace function public.log_product_deletion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
begin
  select full_name into profile_name
  from public.admin_profiles
  where user_id = auth.uid();
  insert into public.admin_activity (admin_id, admin_name, action, target_type, target_id, target_name)
  values (auth.uid(), coalesce(nullif(profile_name, ''), 'Shop admin'), 'activityProductDeleted', 'product', old.id, old.name);
  return old;
end;
$$;

drop trigger if exists products_log_deletion on public.products;
create trigger products_log_deletion
after delete on public.products
for each row execute function public.log_product_deletion();

alter table public.products enable row level security;
alter table public.store_settings enable row level security;
alter table public.product_admins enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.orders enable row level security;
alter table public.admin_activity enable row level security;

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

drop policy if exists "Anyone can read store settings" on public.store_settings;
create policy "Anyone can read store settings"
  on public.store_settings for select
  to anon, authenticated
  using (true);
drop policy if exists "Product admins can manage store settings" on public.store_settings;
create policy "Product admins can manage store settings"
  on public.store_settings for all
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
revoke all on public.store_settings from anon, authenticated;
grant select on public.store_settings to anon, authenticated;
grant insert, update, delete on public.store_settings to authenticated;

drop policy if exists "Admins can manage profiles" on public.admin_profiles;
create policy "Admins can manage profiles"
  on public.admin_profiles for all
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
revoke all on public.admin_profiles from anon, authenticated;
grant select, insert, update, delete on public.admin_profiles to authenticated;
revoke all on public.admin_public_profiles from anon, authenticated;
grant select on public.admin_public_profiles to anon, authenticated;

drop policy if exists "Customers can create orders" on public.orders;
create policy "Customers can create orders"
  on public.orders for insert
  to anon, authenticated
  with check (true);
drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders"
  on public.orders for all
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
grant insert on public.orders to anon, authenticated;
grant select, update, delete on public.orders to authenticated;

create or replace function public.customer_agree_to_order(p_order_id text, p_access_token text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.orders
  set agreed = true, status = 'Awaiting payment', updated_at = now()
  where id = p_order_id
    and customer_token = p_access_token
    and status = 'Awaiting customer agreement'
    and (delivery_fee_iqd is not null or delivery_fee_usd is not null);
  return found;
end;
$$;

create or replace function public.customer_complete_order(
  p_order_id text,
  p_access_token text,
  p_payment text,
  p_card text,
  p_receipt text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_order public.orders%rowtype;
  line jsonb;
  item_id text;
  item_quantity integer;
begin
  select * into target_order
  from public.orders
  where id = p_order_id
    and customer_token = p_access_token
    and status = 'Awaiting payment'
    and agreed = true
  for update;
  if not found or p_payment not in ('FIB', 'QiCard / Mastercard') then
    return false;
  end if;

  for line in select value from jsonb_array_elements(target_order.items)
  loop
    item_id := line->>'id';
    item_quantity := (line->>'quantity')::integer;
    update public.products
    set stock = stock - item_quantity, updated_at = now()
    where id = item_id and stock >= item_quantity;
    if not found then
      raise exception 'Product % is no longer available in the requested quantity.', item_id;
    end if;
  end loop;

  update public.orders
  set payment = p_payment,
      card = p_card,
      receipt = p_receipt,
      status = 'Pending',
      updated_at = now()
  where id = p_order_id;
  return true;
end;
$$;

revoke all on function public.customer_agree_to_order(text, text) from public;
revoke all on function public.customer_complete_order(text, text, text, text, text) from public;
grant execute on function public.customer_agree_to_order(text, text) to anon, authenticated;
grant execute on function public.customer_complete_order(text, text, text, text, text) to anon, authenticated;

drop policy if exists "Admins can read activity" on public.admin_activity;
create policy "Admins can read activity"
  on public.admin_activity for select
  to authenticated
  using (
    exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );
drop policy if exists "Admins can record activity" on public.admin_activity;
create policy "Admins can record activity"
  on public.admin_activity for insert
  to authenticated
  with check (
    admin_id = auth.uid()
    and
    exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );
grant select, insert on public.admin_activity to authenticated;

insert into public.products (id, name, category, image, wholesale, retail, stock, notes, is_best_seller, discount_percent)
values
  ('monstera', 'Monstera Deliciosa', 'Indoor Plants', 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=800&q=80', 18000, 28000, 12, 'A bold, easygoing beauty. Loves bright, indirect light.', true, 0),
  ('olive', 'Little Olive Tree', 'Outdoor Plants', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80', 23000, 36000, 8, 'A sun-loving little tree for patios and bright corners.', false, 0),
  ('pothos', 'Golden Pothos', 'Indoor Plants', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80', 9000, 16000, 18, 'A cheerful trailing plant that is happy in most rooms.', true, 0),
  ('terracotta', 'Terracotta Planter', 'Outdoor Plants', 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=80', 11000, 19000, 10, 'A classic home for your favorite leafy friend.', false, 15),
  ('fertilizer', 'Everyday Plant Food', 'Medicines & Food', 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80', 6000, 11000, 25, 'A gentle feed to keep your growing things happy.', false, 0),
  ('snake', 'Snake Plant', 'Indoor Plants', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80', 14000, 22000, 9, 'Architectural, resilient, and wonderfully low fuss.', false, 0),
  ('lavender', 'Garden Lavender', 'Outdoor Plants', 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?auto=format&fit=crop&w=800&q=80', 12000, 20000, 11, 'Fragrant purple blooms that love a sunny spot.', false, 20),
  ('leaf-care', 'Leaf & Root Care', 'Medicines & Food', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 7000, 13000, 16, 'A handy plant care essential for your home jungle.', false, 0),
  ('peat-moss', 'Peat Moss', 'Peat Moss', 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80', 5000, 8000, 20, 'A moisture-retaining growing medium for garden mixes.', false, 0),
  ('ornamental-olive', 'Ornamental Olive', 'Ornamental Olive', 'https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&w=800&q=80', 30000, 45000, 6, 'A sun-loving ornamental olive for patios and bright spaces.', false, 0)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-videos', 'product-videos', true, 104857600, array['video/mp4', 'video/webm', 'video/quicktime'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

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

drop policy if exists "Anyone can read product videos" on storage.objects;
create policy "Anyone can read product videos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-videos');

drop policy if exists "Product admins can upload product videos" on storage.objects;
create policy "Product admins can upload product videos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-videos'
    and exists (
      select 1 from public.product_admins
      where product_admins.user_id = auth.uid()
    )
  );

drop policy if exists "Product admins can delete product videos" on storage.objects;
create policy "Product admins can delete product videos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-videos'
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
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'store_settings'
  ) then
    alter publication supabase_realtime add table public.store_settings;
  end if;
end
$$;
