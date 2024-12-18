// utils/supabase-server.js

import { createClient } from '@supabase/supabase-js';

// Environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""; // Server-side only

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
