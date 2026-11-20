# Supabase product sync setup

The storefront works without Supabase using browser storage. In this mode, changes remain on that browser only. To sync products across devices:

1. Create a Supabase project.
2. Open **SQL Editor**, paste in `supabase-setup.sql`, and run it. It is safe to rerun: existing `products` rows are preserved, legacy single-image values are backfilled into the gallery field, and missing columns on existing product, admin-profile, order, and activity tables are added before dependent views and functions are created. The public admin-profile view is recreated after the profile columns are present. Existing products receive a creation-time fallback from `updated_at` rather than all being marked new during migration. The script also creates the `store_settings` table, admin-membership table, storage buckets, row-level security policies, Realtime publication entries, and starter products. Agricultural Tools remain catalog rows in `public.products`.
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

6. Deploy the updated site over HTTPS and reload it. Public visitors can read products; use the hidden logo trigger and the admin user's email/password to manage the catalog. The site subscribes to `public.products` and `public.store_settings`. Product galleries accept multiple uploaded images and HTTPS image URLs; uploads are compressed and stored in `product-images`. Product video uploads (MP4, WebM, MOV; up to 100 MB) use the separate `product-videos` bucket and load with `preload="none"` in product details. USD prices are entered independently from IQD, so admins can set either or both values without an implicit exchange rate.
   The product editor includes best-seller and coming-soon flags, percentage and manual IQD/USD sale prices, and optional rating/count fields. New Arrivals are selected from products created in the last 30 days. The hero carousel links to the official Instagram page by default; social links and the storewide discount/payment account are saved to `public.store_settings` for shared display. Admin changes to these settings require the SQL migration and an authorized product-admin account. Location selection and each visitor's “Notify me” toggle are saved in that visitor's browser; no contact information or notification subscription is sent to the store.
   The app-download landing page is available at `/share` and `/download`. `window.GULNAR_APP_URL` in `supabase-config.js` sets the canonical app link (currently `https://gulzhin.vercel.app`); the storefront uses it for sharing and its **Get the app** link, while the landing page displays it with native-share and copy actions. To link the iPhone and Android buttons to custom app-store pages or installers, set the corresponding HTTPS URLs in `window.GULNAR_DOWNLOAD_URLS`; leave a value blank to show the built-in PWA install guidance.
7. Orders are inserted at checkout and are visible to admins in **Orders** with customer/contact details, item/quantity price snapshots, both currency totals, and status controls. Customers can review/agree to delivery pricing and complete payment from their order list. Anonymous order reads/updates are not enabled: random per-order access tokens are used only by restricted database functions for customer agreement/payment transitions, while admins can read and manage orders. The admin **Profile** tab saves each signed-in admin's name, role, avatar, phone, and private notes; product creator badges use only public profile fields. **Activity** records product edits/additions/deletions and order/profile changes with admin identity and time. The no-Supabase demo keeps its orders, profile, and activity in that browser only.
8. Confirm the storefront status says the catalog is connected. If it reports local demo mode, the deployed `supabase-config.js` still has empty credentials; if it reports an error, check the project URL/key, SQL policies, required storage buckets, and that `public.products`, `public.store_settings`, and `public.orders` are in the `supabase_realtime` publication.

Only use the public anon/publishable key in this browser app. Never put a Supabase service-role key here. The SQL policies restrict catalog/media writes, profile access, order management, and activity access to users listed in `product_admins`; public profile badges expose only name, title, and avatar.

The no-Supabase demo admin password is client-side and is not secure. Configure Supabase before using the public site for real catalog management.

The SQL script is the migration path for an existing installation; rerun it in the Supabase SQL Editor before deploying this app version. The starter `store_settings` row is inserted only when one does not already exist, so rerunning the setup does not overwrite social links, discount, or payment settings. Keep `supabase-config.js` available when deploying the static site.

The install banner uses the web app manifest and service worker. The service worker uses network-first behavior for navigation and core app files, retaining the last successful shell only for offline fallback. It does not cache database/API requests, and Supabase GETs use `cache: "no-store"`. When an updated service worker is detected, it activates automatically and the page reloads. The app checks for worker updates on each load and bypasses the browser HTTP cache for the worker script. Vercel response headers revalidate the HTML, JavaScript, CSS, config, and manifest. The shell cache version was bumped for this UI release; for future shell changes, bump `CACHE_NAME` in `service-worker.js` and deploy that file with the app.

The PWA requires HTTPS in production (localhost is also supported). On iPhone and iPad, the install banner gives Safari users the Share → Add to Home Screen steps and prompts users in other browsers or in-app webviews to open the link in Safari first. The banner is hidden when the app is running in standalone mode.
