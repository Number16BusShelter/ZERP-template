#!/bin/bash

# Check if nvm is installed
if command -v nvm &> /dev/null; then
    nvm use 20.18
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e '\033[1;31mError: pnpm is not installed.\033[0m'
    echo -e 'Please install pnpm by running: npm install -g pnpm'
    exit 1
fi

pnpm install dotenv cross-env \
  snyk@latest depcheck typecheck nodemon \
  rimraf copyfiles turbo --global

#echo -e '\033[1;36mCleanup...\033[0m'
#pnpm run cleanup

echo -e '\033[1;36m> Starting essential installations...\033[0m'
# Installations

pnpm i


# 🔘🟢🔴
echo -e '\033[1;36m> Running security checks...\033[0m'
# Checks

# Ask the user if they want to run security checks
read -p "? Do you want to run security checks (audit, snyk, etc.)? (y/N): " run_security_checks
if [[ $run_security_checks == [yY] || $run_security_checks == [yY][eE][sS] ]]; then
    echo -e '\033[1;36m> Running security checks...\033[0m'
    # Checks
    pnpm audit
    # Uncomment the following line to enable Snyk typecheck etc
    snyk test
    # If you feel real brave
    # semgrep
else
    echo -e "🔘 Skipping security checks"
fi
echo -e "\n"

read -p "? Do you want to copy .env.sample to .env, removing commented lines? \033[1;31mWILL DELETE EXISTING .env!\033[0m (y/N): " confirm
if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
    grep -v '^#' ./cicd/environment/.env.sample | grep -v '^\s*$' > ./cicd/environment/.env
    echo -e "🟢 .env file has been recreated without commented lines"
    echo -e "\033[1;31m🔘 DON'T FORGET TO UPDATE .env !!! See .env.sample for explanation\033[0m"
    echo -e "\n > nano ./cicd/environment/.env\n"
else
    echo -e "🔘 Skipping env file recreation"
fi

echo -e "\n"


# Uncomment the following line to enable tests
# echo -e '\033[1;36mRunning tests...\033[0m'
# pnpm test

echo -e '\033[1;36m> Building projects and containers...\033[0m'
# Build
#pnpm build
pnpm docker:local:build
pnpm docker:local:start

echo -e 'Project dependencies'
pnpm list --recursive --depth -3


echo -e '\033[1;32m✅  Bootstrapping complete! You can now run services:\033[0m\n'\
'\n\033[1;34m🏗 Build options:\033[0m\n'\
'\033[0;33m1.  >  pnpm build\033[0m  # Creates builds in all packages and services\n'\
'\033[0;33m2.  >  pnpm dev\033[0m  # Same but continues\n'\
'\033[0;33m2.  >  pnpm docker:{local | prod}:build\033[0m  # Build containers specified in Docker Compose\n'\
'\n\033[1;34m🚀 Running options:\033[0m\n'\
'\033[0;33m1.  >  pnpm start:all\n'\
'2.  >  pnpm -r run --filter=./service/<name> pnpm start\n'\
'3.  >  pnpm -r run docker:{local | prod}:start\033[0m'\
'\n'

