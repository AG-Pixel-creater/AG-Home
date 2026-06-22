#!/bin/bash
# GitHub Pages Deployment Script - AG-Home
# This script automates the deployment process

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     AG-Home GitHub Pages Deployment Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Verify prerequisites
echo -e "${BLUE}[Step 1/5]${NC} Checking prerequisites..."
if ! command -v git &> /dev/null; then
    echo -e "${RED}✗ Git not found${NC}"
    exit 1
fi
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Step 2: Verify GitHub Secrets
echo -e "${BLUE}[Step 2/5]${NC} Verifying GitHub Secrets setup..."
echo "Required secrets:"
echo "  - VITE_FIREBASE_API_KEY"
echo "  - VITE_FIREBASE_AUTH_DOMAIN"
echo "  - VITE_FIREBASE_PROJECT_ID"
echo "  - VITE_FIREBASE_STORAGE_BUCKET"
echo "  - VITE_FIREBASE_MESSAGING_SENDER_ID"
echo "  - VITE_FIREBASE_APP_ID"
echo "  - VITE_FIREBASE_MEASUREMENT_ID"
echo "  - VITE_FIREBASE_VAPID_KEY"
echo "  - VITE_ADMIN_EMAIL"
echo "  - VITE_ENVIRONMENT"
echo "  - VITE_FUNCTIONS_REGION"
echo ""
echo "To configure secrets, run:"
echo "  gh secret set <SECRET_NAME> -b \"<SECRET_VALUE>\""
echo ""

# Step 3: Verify files
echo -e "${BLUE}[Step 3/5]${NC} Verifying required files..."
FILES=(
    ".env.example"
    ".github/workflows/deploy.yml"
    ".nojekyll"
    "public/404.html"
    "src/manifest.json"
    "src/privacy.html"
    "src/js/fcm-manager.js"
    "vite.config.js"
)

MISSING=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "  ${GREEN}✓${NC} $file"
    else
        echo -e "  ${RED}✗${NC} $file"
        MISSING=$((MISSING + 1))
    fi
done

if [ $MISSING -eq 0 ]; then
    echo -e "${GREEN}✓ All required files present${NC}"
else
    echo -e "${RED}✗ $MISSING files missing${NC}"
    exit 1
fi
echo ""

# Step 4: Commit and push
echo -e "${BLUE}[Step 4/5]${NC} Preparing deployment..."
echo "Current branch:"
git branch --show-current
echo ""
echo "Uncommitted changes:"
git status --short
echo ""

read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Staging files..."
    git add .
    
    echo "Committing changes..."
    git commit -m "chore: deploy to GitHub Pages

- Configured for GitHub Pages deployment
- All Firebase environment variables from GitHub Secrets
- Service worker paths updated for /AG-Home/ base path
- 404.html for direct page access
- Manifest and privacy links corrected

Deployment URL: https://ag-pixel-creater.github.io/AG-Home/"
    
    echo "Pushing to master..."
    git push origin master
    
    echo -e "${GREEN}✓ Changes pushed${NC}"
else
    echo "Deployment cancelled."
    exit 1
fi
echo ""

# Step 5: Monitor deployment
echo -e "${BLUE}[Step 5/5]${NC} Monitoring GitHub Actions deployment..."
echo ""
echo "GitHub Actions will automatically:"
echo "  1. Build the project with Vite"
echo "  2. Load secrets from GitHub Repository Secrets"
echo "  3. Deploy to GitHub Pages"
echo "  4. Verify deployment"
echo ""
echo "Monitor progress at:"
echo "  https://github.com/AG-Pixel-creater/AG-Home/actions"
echo ""
echo "After deployment, verify at:"
echo "  https://ag-pixel-creater.github.io/AG-Home/"
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Deployment Initiated!                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
