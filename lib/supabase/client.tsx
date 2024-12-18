// utils/supabase-browser.js
'use client';

import { createClient } from '@supabase/supabase-js';

// Environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
