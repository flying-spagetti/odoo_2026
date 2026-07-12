TEAMMATE GIT FLOW — AVOID MERGE CONFLICTS

1. Confirm you are on your branch

git branch --show-current
git status

Expected branch:
feature/operations-ui

2. Before starting work, sync with main

git fetch origin
git merge origin/main

If Git reports a conflict, stop and tell Gnan before editing anything.

3. Work only inside your assigned areas

You may edit:

src/components/layout/
src/components/shared/
src/app/dashboard/
src/app/vehicles/
src/app/drivers/
src/app/expenses/

Do not edit:

prisma/schema.prisma
prisma/migrations/
src/modules/trips/
src/modules/maintenance/
authentication files
package.json
package-lock.json
root layout/config files unless agreed with Gnan

Do not install new packages without asking first.

4. Build one small feature at a time

Example order:

- Application shell
- Vehicle interface
- Driver interface
- Dashboard
- Expense interface
- Responsive fixes

5. After each feature, test it

npm run lint
npm run build

Fix errors caused by your changes before committing.

6. Commit small, meaningful changes

git add <only-the-files-you-changed>
git commit -m "feat(layout): add responsive application shell"
git push origin feature/operations-ui

Do not use:

git add .

unless you have checked git status carefully.

7. Push at least once every hour

Before pushing:

git status
git diff --stat
git push origin feature/operations-ui

Suggested commits:

feat(layout): add responsive dashboard shell
feat(vehicles): build vehicle directory interface
feat(drivers): build licence-aware driver directory
feat(dashboard): add fleet KPI overview
feat(expenses): add fuel and expense interface
fix(responsive): improve mobile tables and navigation

8. Before handing work to Gnan, sync with main again

Make sure your working tree is clean:

git status

Then:

git fetch origin
git merge origin/main

Run:

npm install
npm run lint
npm run build

Then push:

git push origin feature/operations-ui

9. Tell Gnan the branch is ready

Send:

- Branch name
- Latest commit hash
- Files changed
- Build status
- Any assumptions or known issues

Do not merge into main yourself unless Gnan asks.