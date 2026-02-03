// This file handles the connection to Supabase (PostgreSQL database)

const { createClient } = require('@supabase/supabase-js');

// Create Supabase client
let supabase = null;

const connectDB = () => {
  try {
    // Check if environment variables are set
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase credentials in .env file');
    }

    // Create Supabase client instance
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
    
    console.log('✅ Supabase Connected Successfully');
    console.log(`📦 Database URL: ${process.env.SUPABASE_URL}`);
    
    return supabase;
  } catch (error) {
    console.error('❌ Supabase Connection Failed:', error.message);
    console.error('\n🔍 Setup Instructions:');
    console.error('1. Go to https://supabase.com and create a free account');
    console.error('2. Create a new project');
    console.error('3. Go to Project Settings > API');
    console.error('4. Copy "Project URL" and "anon/public key"');
    console.error('5. Add them to .env file');
    process.exit(1);
  }
};

// Get Supabase client instance
const getSupabase = () => {
  if (!supabase) {
    throw new Error('Supabase not initialized. Call connectDB() first.');
  }
  return supabase;
};

module.exports = { connectDB, getSupabase };
