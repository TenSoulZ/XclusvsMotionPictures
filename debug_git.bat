@echo off
echo "--- GIT CONFIG ---" > git_debug_log.txt
git config user.email "deploy@debug.com"
git config user.name "Debug Bot"

echo "--- GIT STATUS (PRE) ---" >> git_debug_log.txt
git status >> git_debug_log.txt 2>&1

echo "--- GIT CHECK IGNORE ---" >> git_debug_log.txt
git check-ignore -v render.yaml >> git_debug_log.txt 2>&1

echo "--- GIT ADD ---" >> git_debug_log.txt
git add render.yaml build.sh >> git_debug_log.txt 2>&1

echo "--- GIT COMMIT ---" >> git_debug_log.txt
git commit -m "Auto-commit deployment files" >> git_debug_log.txt 2>&1

echo "--- GIT STATUS (POST) ---" >> git_debug_log.txt
git status >> git_debug_log.txt 2>&1
