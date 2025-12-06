#!/bin/bash
# Frontend CI Script
# Runs the complete CI pipeline: lint, typecheck, test, e2e, build
# Exit codes: 0 = success, non-zero = failure

set -e  # Exit on first error

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$(dirname "$SCRIPT_DIR")"

cd "$FRONTEND_DIR"

echo "=========================================="
echo "Frontend CI Pipeline"
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

success() { echo -e "${GREEN}✓ $1${NC}"; }
error() { echo -e "${RED}✗ $1${NC}"; }
step() { echo -e "\n${YELLOW}▶ $1${NC}"; }

FAILED_STEPS=()

run_step() {
    local name="$1"
    local cmd="$2"
    local optional="${3:-false}"
    
    step "$name"
    if eval "$cmd"; then
        success "$name passed"
    else
        if [ "$optional" = "true" ]; then
            echo -e "${YELLOW}⚠ $name failed (optional)${NC}"
        else
            error "$name failed"
            FAILED_STEPS+=("$name")
        fi
    fi
}

# Parse arguments
SKIP_E2E=false
SKIP_GENERATE=false
for arg in "$@"; do
    case $arg in
        --skip-e2e) SKIP_E2E=true ;;
        --skip-generate) SKIP_GENERATE=true ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --skip-e2e       Skip Cypress E2E tests"
            echo "  --skip-generate  Skip API code generation"
            exit 0
            ;;
    esac
done

# Step 1: Install dependencies
run_step "Install dependencies" "npm ci"

# Step 2: Generate API code
if [ "$SKIP_GENERATE" = false ]; then
    run_step "Generate API code" "npm run generate:api"
else
    echo -e "${YELLOW}⚠ Skipping API code generation${NC}"
fi

# Step 3: Lint
run_step "Lint" "npm run lint" true

# Step 4: Type check
run_step "Type check" "npm run typecheck" true

# Step 5: Unit tests
run_step "Unit tests" "npm run test:run"

# Step 6: E2E tests with MSW mocks (no backend required)
if [ "$SKIP_E2E" = false ]; then
    run_step "E2E tests (with mocks)" "npm run e2e:mocks"
else
    echo -e "${YELLOW}⚠ Skipping E2E tests (--skip-e2e flag)${NC}"
fi

# Step 7: Build
run_step "Build" "npm run build"

# Summary
echo ""
echo "=========================================="
if [ ${#FAILED_STEPS[@]} -eq 0 ]; then
    success "CI Pipeline PASSED"
    echo "=========================================="
    exit 0
else
    error "CI Pipeline FAILED"
    echo "Failed steps:"
    for step in "${FAILED_STEPS[@]}"; do
        echo "  - $step"
    done
    echo "=========================================="
    exit 1
fi
