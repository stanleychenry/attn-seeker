Create a detailed implementation plan for changes or additions to the attn-seeker website.

Usage: /create-plan [describe what you want to build or change]

Steps:
1. Re-read CLAUDE.md and context/current-data.md to understand current state
2. Read all files in context\ and .claude\commands\ to understand what already exists
3. Decide if this change needs a plan:
   - If the change is isolated (e.g. text update, copy change, single-component tweak, colour adjustment) — just do it, no plan needed
   - If the change could affect other parts of the site (navbar, routing, data flow, auth, search, shared components, Xano API, Memberstack, Algolia) — write a plan first
4. Write a detailed implementation plan covering:
   - What the change is and why it matters
   - Current state (what exists now)
   - Goal (what it should do after)
   - Prerequisites (anything Stanley needs to do manually first)
   - Specific files to create, modify, or delete
   - Step-by-step implementation tasks in checklist format [ ]
   - Anything that could go wrong or needs a decision from Stanley first
   - Before/after comparison if helpful
5. Save the plan to T:\Kevan Hedwig\attn-seeker\plans\[YYYY-MM-DD]-[plan-name].md
6. Present a summary and ask: "Does this look right? Ready to implement?"

Never start implementing until Stanley confirms the plan. Then run /implement.
