# Supabase product sync setup

The storefront works without Supabase using browser storage. To sync products across devices:

1. Create a Supabase project.
2. Open **SQL Editor**, paste in `supabase-setup.sql`, and run it. This creates the public product catalog, admin-membership table, image bucket, row-level security policies, Realtime publication entry, and starter products.
3. In **Authentication → Users**, create an admin user with an email and password. Copy that user's UUID.
4. Add the user as a product admin by running this in the SQL Editor, replacing the example UUID:

   ```sql
   insert into public.product_admins (user_id)
   values ('00000000-0000-0000-0000-000000000000');
   ```

5. In **Project Settings → API**, copy the Project URL and the public anon/publishable key into `supabase-config.js`:

   ```js
   window.VERDANT_SUPABASE_CONFIG = {
     url: "https://your-project.supabase.co",
     anonKey: "your-public-anon-key"
   };
   ```

6. Reload the site. Public visitors read the shared catalog; use the hidden logo trigger and the admin user's email/password to manage it. Product changes are broadcast to connected storefronts, and uploaded product images are compressed before being stored in the `product-images` bucket.

Only use the public anon/publishable key in this browser app. Never put a Supabase service-role key here. The SQL policies restrict catalog and image writes to users listed in `product_admins`.

The no-Supabase demo admin password is client-side and is not secure. Configure Supabase before using the public site for real catalog management.

Orders and customer checkout data remain browser-local in this prototype; this setup synchronizes the product catalog only. Keep `supabase-config.js` available when deploying the static site.
