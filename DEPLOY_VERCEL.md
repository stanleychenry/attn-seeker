# Get your site online (step-by-step for beginners)

Your site will get a link like **https://attn-seeker.vercel.app** that you can share. Google will **not** list it (that’s already set up).

You’ll do two things: put your code on GitHub, then connect that to Vercel so it builds and hosts the site.

---

## Part 1: Put your code on GitHub

GitHub is where your code lives on the internet. Vercel will use it to build your site.

### Step 1.1 – Create a GitHub account (if you don’t have one)

1. Go to **https://github.com**
2. Click **Sign up**
3. Enter email, password, username. Finish signing up.

### Step 1.2 – Create a new empty repo on GitHub

1. Log in to GitHub.
2. Click the **+** at the top right → **New repository**.
3. **Repository name:** type `attn-seeker` (or any name you like).
4. Leave everything else as default (e.g. **Public**).
5. **Do not** tick “Add a README” or “Add .gitignore”.
6. Click **Create repository**.

### Step 1.3 – Push your project from your computer to GitHub

1. Open **Terminal** (Mac) or **Command Prompt / PowerShell** (Windows).
2. Go to your project folder. For example:
   ```bash
   cd C:\Users\StanleyHenry_d1vym1s\attn-seeker
   ```
   (Use the real path to the folder where your `attn-seeker` code is.)

3. Check if git is already set up:
   ```bash
   git status
   ```
   If it says “not a git repository”, run:
   ```bash
   git init
   ```

4. Add the GitHub repo as “origin” (replace `YOUR_GITHUB_USERNAME` with your GitHub username):
   ```bash
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/attn-seeker.git
   ```

5. Add all files, commit, and push:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git push -u origin main
   ```
   When it asks for your username and password: use your **GitHub username** and a **Personal Access Token** (GitHub no longer accepts your normal password here).

   **To create a token:** GitHub → your profile (top right) → **Settings** → **Developer settings** (left) → **Personal access tokens** → **Tokens (classic)** → **Generate new token**. Give it a name, tick **repo**, then generate and **copy the token**. Use that token as the “password” when you run `git push`.

After this, your code should be on GitHub. You can refresh your repo page and see the files.

---

## Part 2: Put your site on Vercel

Vercel will build your site and give you a link.

### Step 2.1 – Sign up / log in to Vercel

1. Go to **https://vercel.com**
2. Click **Sign Up** (or **Log In** if you have an account).
3. Choose **Continue with GitHub** and allow Vercel to use your GitHub when it asks.

### Step 2.2 – Import your project

1. On Vercel, click **Add New…** (or **Create**) → **Project**.
2. You should see a list of your GitHub repos. Find **attn-seeker** (or whatever you named it) and click **Import** next to it.
3. On the next screen, leave the settings as they are (Vercel will detect Next.js). Don’t click Deploy yet.

### Step 2.3 – Add your “environment variables”

These are the secret keys and settings your site needs (same as in your `.env.local` on your computer).

1. On the same import screen, find the section called **Environment Variables**.
2. For each row below, type the **Name** exactly, then paste the **Value** from your `.env.local` (same value you use locally). Add one at a time, then click **Add** or the next row.

   - **Name:** `WEBFLOW_API_KEY`  
     **Value:** (paste from .env.local)  
     _(You can use `WEBFLOW_API_TOKEN` instead of `WEBFLOW_API_KEY`—the app accepts either.)_

   - **Name:** `NEXT_PUBLIC_MEMBERSTACK_PUBLIC_KEY`  
     **Value:** (paste from .env.local)

   - **Name:** `NEXT_PUBLIC_XANO_BASE_URL`  
     **Value:** (paste from .env.local)

   - **Name:** `NEXT_PUBLIC_ALGOLIA_APP_ID`  
     **Value:** (paste from .env.local)

   - **Name:** `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`  
     **Value:** (paste from .env.local)

   - **Name:** `RESEND_API_KEY`  
     **Value:** (paste from .env.local)

   - **Name:** `CONTACT_TO_EMAIL`  
     **Value:** (paste from .env.local)

3. Leave the environment as **Production** (default) for each.

### Step 2.4 – Deploy

1. Click **Deploy**.
2. Wait a couple of minutes. You’ll see a log of the build. When it finishes, you’ll see **Congratulations** (or similar) and a link like **https://attn-seeker.vercel.app**.
3. Click that link. That’s your live site. Share that URL with anyone you want to show.

---

## What happens next

- **When you change the code:** Push to GitHub again (same as Step 1.3, but you only need `git add .` then `git commit -m "Update"` then `git push`). Vercel will automatically build and update the same link.
- **Google:** The site is set up so search engines don’t index it. You don’t need to do anything extra for that.

If something doesn’t match what you see on screen (e.g. button names or menu items), say what you’re on and we can adjust the steps.

---

## CMS (team, podcasts, events, etc.) shows no data

The site pulls content from **Webflow** via an API. If team, podcasts, events, learn topics, etc. are empty:

1. **Get a Webflow API token**
   - In Webflow: **Account Settings** (profile icon) → **Integrations** → **API Access** (or **Apps & Integrations** → **API**).
   - Create a token with read access to your site’s collections.

2. **Set it where the app runs**
   - **Locally:** In the project folder, create or edit `.env.local` and add:
     ```env
     WEBFLOW_API_KEY=your_token_here
     ```
     (You can use `WEBFLOW_API_TOKEN` instead of `WEBFLOW_API_KEY`; the app accepts either.)
   - **On Vercel:** Project → **Settings** → **Environment Variables** → add `WEBFLOW_API_KEY` (or `WEBFLOW_API_TOKEN`) with the same token. Apply to **Production** (and Preview if you want CMS data in preview deploys).

3. **Redeploy**
   - After adding or changing the variable on Vercel, trigger a new deploy (e.g. **Deployments** → **⋯** on latest → **Redeploy**), or push a small change to GitHub so Vercel rebuilds.

Once the key is set and the project has been redeployed, the next build will fetch collections and pages like team, podcasts, and events will show content.

**If the key is already in Vercel but CMS is still empty:**

- **Confirm the key is visible to the app:** Open **https://your-app.vercel.app/api/debug/env** in a browser. It returns `webflowConfigured: true` or `false`. If `false`, the app doesn’t see the variable (check the exact name: `WEBFLOW_API_KEY` or `WEBFLOW_API_TOKEN`, no typos or extra spaces).
- **Redeploy after adding the variable:** CMS data is fetched during the **build**. If you added the variable after the last deploy, that build ran without it. Redeploy once (Deployments → Redeploy) so the new build has the key.
- **Check Vercel logs:** If `webflowConfigured` is `true` but pages are still empty, the Webflow API may be failing (e.g. wrong token, wrong site). In the Vercel dashboard go to **Deployments** → your deployment → **Building** or **Functions** and look for a log line like `Webflow API request failed [CollectionName]:` — the message after it is the real error (e.g. 401 = bad token).

- **Build shows many "NEXT_NOT_FOUND" or "Failed to fetch podcast/show episode":** The app no longer caches empty Webflow data on API failure, so a single failed request won’t poison the rest of the build. If you still see these errors, check the build logs for `[CMS] getPodcastEpisodeBySlug:` or `[CMS] getShowEpisodeBySlug:` — they log which slug(s) couldn’t be found (e.g. missing podcast/show or episode slug mismatch). Fix or remove that content in Webflow, or ensure the reference field (e.g. podcast/show) is set correctly on each episode.
