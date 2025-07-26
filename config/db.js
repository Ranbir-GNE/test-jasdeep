import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)
if (!supabase) {
  throw new Error('Failed to initialize Supabase client. Check your environment variables.');
}
else {
  console.log('Supabase client initialized successfully.');
}


export default supabase;