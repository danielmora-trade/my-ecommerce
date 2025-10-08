# Supabase Migrations

This folder contains all database migrations for the e-commerce platform.

## Applied Migrations

All migrations have been successfully applied to your Supabase database:

### 1. `20240101000000_initial_schema.sql` ✅
**Applied as:** `initial_schema` (version: 20251008070249)

Creates the complete database schema including:
- 26 tables (profiles, products, orders, etc.)
- All foreign key relationships
- Indexes for performance
- Triggers for auto-updating timestamps
- Helper functions

### 2. `20240101000001_rls_policies.sql` ✅
**Applied as:** `rls_policies` (version: 20251008070405)

Implements Row Level Security:
- Enables RLS on all tables
- Creates comprehensive security policies
- User-based access control
- Seller and admin policies

### 3. `20240101000002_seed_data.sql` ❌
**Status:** Not applied (requires existing auth.users)

This migration contains sample products and sellers but requires user accounts to exist first. You can apply this manually once you have created user accounts in Supabase Auth.

### 4. `seed_base_data.sql` ✅
**Applied as:** `seed_base_data` (version: 20251008070811)

Seeds base data that doesn't require users:
- 22 categories (6 main + 16 subcategories)
- 4 shipping methods
- 5 active coupons

### 5. `fix_security_search_path_v2.sql` ✅
**Applied as:** `fix_security_search_path_v2` (version: 20251008071038)

Security fix:
- Sets proper search_path for `handle_updated_at()` function
- Resolves security advisor warnings

## Current Database State

- ✅ 26 tables created
- ✅ RLS enabled on all tables
- ✅ Security policies active
- ✅ 22 categories populated
- ✅ 4 shipping methods populated
- ✅ 5 coupons populated
- ✅ No security warnings
- ✅ TypeScript types generated

## Next Steps

1. **Create user accounts** via Supabase Auth
2. **Add sample products** using the SQL from `20240101000002_seed_data.sql`
3. **Start building** your Next.js frontend

## Rollback Instructions

If you need to rollback migrations, you can use the Supabase dashboard or CLI:

```bash
# Rollback last migration
supabase db reset

# Or manually drop tables in reverse order
```

## Adding New Migrations

To add new migrations:

1. Create a new migration file with timestamp
2. Apply it via Supabase MCP or CLI
3. Regenerate TypeScript types
4. Update this README

## Resources

- [Supabase Migrations Documentation](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
