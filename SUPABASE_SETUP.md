# Supabase product sync setup

The storefront works without Supabase using browser storage. In this mode, changes remain on that browser only. To sync products across devices:

1. Create a Supabase project.
2. Open **SQL Editor**, paste in `supabase-setup.sql`, and run it. This creates the shared product catalog, admin-membership table, image bucket, row-level security policies, Realtime publication entry, and starter products. Agricultural Tools are catalog rows in `public.products` with category `Agricultural Tools`, so product and tool changes use the same secured, live catalog.
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

6. Deploy the updated site over HTTPS and reload it. Public visitors read the shared catalog; use the hidden logo trigger and the admin user's email/password to manage it. The site subscribes to `public.products` before its initial catalog fetch, then refreshes connected storefronts after inserts, edits, and deletes. Uploaded product images are compressed before being stored in the `product-images` bucket.
7. Confirm the storefront status says the catalog is connected. If it reports local demo mode, the deployed `supabase-config.js` still has empty credentials; if it reports an error, check the project URL/key, SQL policies, and that `public.products` is in the `supabase_realtime` publication.

Only use the public anon/publishable key in this browser app. Never put a Supabase service-role key here. The SQL policies restrict catalog and image writes to users listed in `product_admins`.

The no-Supabase demo admin password is client-side and is not secure. Configure Supabase before using the public site for real catalog management.

Orders and customer checkout data remain browser-local in this prototype; this setup synchronizes the product catalog only. Keep `supabase-config.js` available when deploying the static site.

The install banner uses the web app manifest and service worker. It requires HTTPS in production (localhost is also supported); iPhone/iPad users receive the Share → Add to Home Screen instructions because iOS does not expose the browser install prompt event.
