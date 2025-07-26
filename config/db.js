// db.js
import dotenv from 'dotenv';
dotenv.config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use anon or service role
);

if (!supabase) {
  throw new Error('Failed to initialize Supabase client. Check your environment variables.');
}
else {
  console.log('Supabase client initialized successfully.');
}

module.exports = supabase;
