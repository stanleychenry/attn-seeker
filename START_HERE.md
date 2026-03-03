# Start here – get un-stuck and get your site online

**Where you are right now:**

- Your project **attn-seeker** is on your computer and connected to GitHub (**stanleychenry/attn-seeker**).
- You have **5 commits** on your computer that are **not yet on GitHub**.
- Git is blocking push because the remote might have changes you don’t have yet.

**What we’re going to do:**

1. Sync your computer with GitHub (pull, then push).
2. Make sure Vercel has the latest code so your site is up to date.

Do the steps below **in order**. Don’t skip ahead.

---

## Step 1: Open Terminal in Cursor

1. In Cursor, press **Ctrl+`** (backtick, key above Tab) to open the Terminal.
2. You should see a line like `PS C:\...>` or a path. If the path is **not** your project folder, type this and press Enter:

   ```
   cd C:\Users\StanleyHenry_d1vym1s\attn-seeker
   ```

3. Press Enter. The prompt should now show that folder.

---

## Step 2: Pull from GitHub (get any remote changes)

1. In the same Terminal, type exactly:

   ```
   git pull origin main
   ```

2. Press Enter.

**What might happen:**

- **“Already up to date.”**  
  → Good. Go to **Step 3**.

- **“Merge made…” or “Successfully rebased…”**  
  → Good. Go to **Step 3**.

- **“CONFLICT” or “merge conflict”**  
  → Don’t panic. Type `git merge --abort` and press Enter, then tell someone (or ask in chat) that you have a merge conflict and need help resolving it. Stop here until then.

- **“Permission denied” or “Authentication failed”**  
  → GitHub is not recognising you. You need to log in with a **Personal Access Token** instead of a password. See the section **“If Git asks for a username/password”** at the end of this file.

---

## Step 3: Push to GitHub (send your 5 commits up)

1. In the same Terminal, type:

   ```
   git push origin main
   ```

2. Press Enter.

**What might happen:**

- **“Everything up-to-date” or a line like “5 objects pushed”**  
  → Your code is now on GitHub. Go to **Step 4**.

- **“Permission denied” or “Authentication failed”**  
  → See **“If Git asks for a username/password”** at the end.

- **“Can’t push refs” or “Try running Pull first” again**  
  → Run **Step 2** again, then **Step 3** again. If it still fails, say you’re still getting “Can’t push refs” and paste the exact message.

---

## Step 4: Check Vercel (your live site)

1. Open a browser and go to **https://vercel.com**.
2. Log in (with GitHub if that’s how you signed up).
3. Click your **attn-seeker** project (or “Dashboard” then the project name).
4. You should see either:
   - A **latest deployment** that says “Building” or “Ready”.
   - If you **haven’t** connected Vercel to GitHub yet, you won’t see a project. In that case, follow **DEPLOY_VERCEL.md** from “Part 2: Put your site on Vercel”.

**If the project is already connected to GitHub:**

- After a successful push in Step 3, Vercel usually starts a new build automatically.
- Wait a few minutes. When the latest deployment shows **“Ready”**, click **“Visit”** (or the link shown). That’s your live site.

**If the build fails (red X or “Error”):**

- Click the failed deployment.
- Open the **Build Logs** or **Log** and copy the **last 20–30 lines** (the error part).
- Paste that into a message and ask for help fixing the build; someone can tell you exactly what to change.

---

## You’re done when…

- **Step 2** and **Step 3** run without errors.
- Your code is on GitHub (you can open https://github.com/stanleychenry/attn-seeker and see your latest commits).
- On Vercel, the latest deployment is **Ready** and the **Visit** link opens your site.

If anything doesn’t match that, go back to the step where it went wrong and use the “What might happen” notes above, or ask for help and say which step you’re on and what you see.

---

## If Git asks for a username/password

GitHub no longer accepts your normal account password when you push from the computer. You must use a **Personal Access Token**.

1. In a browser, go to **https://github.com** and log in.
2. Click your **profile picture** (top right) → **Settings**.
3. In the left sidebar, scroll down and click **Developer settings**.
4. Click **Personal access tokens** → **Tokens (classic)**.
5. Click **Generate new token** → **Generate new token (classic)**.
6. **Note:** e.g. `Cursor push`.
7. **Expiration:** pick e.g. 90 days (or “No expiration” if you’re comfortable with that).
8. Under **Scopes**, tick **repo** (full control of private repositories).
9. Click **Generate token**.
10. **Copy the token** (it looks like `ghp_xxxx...`). You won’t see it again.
11. When you run `git push origin main` and Git asks for a password, **paste this token** (don’t type your GitHub password). Username is your GitHub username.

Keep the token private (don’t put it in a file you commit or share).
