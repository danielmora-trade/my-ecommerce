#!/bin/bash

# ================================================
# Generate TypeScript types from Supabase
# ================================================

echo "🔧 Generating TypeScript types from Supabase..."

# Check if SUPABASE_PROJECT_REF is set
if [ -z "$SUPABASE_PROJECT_REF" ]; then
    echo "❌ Error: SUPABASE_PROJECT_REF environment variable is not set"
    echo "Please set it with: export SUPABASE_PROJECT_REF=your-project-ref"
    echo "Find your project ref in: Supabase Dashboard > Settings > API > Project URL"
    exit 1
fi

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found"
    echo "Install it with: npm install -g supabase"
    exit 1
fi

echo "📦 Project Ref: $SUPABASE_PROJECT_REF"

# Generate types
echo "🚀 Generating types..."
npx supabase gen types typescript --project-id "$SUPABASE_PROJECT_REF" > src/types/database.types.ts

if [ $? -eq 0 ]; then
    echo "✅ Types generated successfully!"
    echo "📄 File: src/types/database.types.ts"
    
    # Count tables
    table_count=$(grep -c "Tables:" src/types/database.types.ts || echo "0")
    echo "📊 Tables exported: $table_count"
    
    echo ""
    echo "🎉 Done! You can now use the types in your code:"
    echo "   import type { Database } from '@/types/database.types'"
else
    echo "❌ Failed to generate types"
    exit 1
fi

