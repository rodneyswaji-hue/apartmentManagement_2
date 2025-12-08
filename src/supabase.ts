import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://oejtmmlscjmyweehrdgc.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lanRtbWxzY2pteXdlZWhyZGdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMjI0MDgsImV4cCI6MjA4MDc5ODQwOH0.PGftwEzbtDUOvyLHVf-oMU5vdgxaTvaW1iN25PZlXZ0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
