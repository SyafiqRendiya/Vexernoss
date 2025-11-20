// ==========================================
// SUPABASE CONFIG - GRATIS & NO BILLING!
// ==========================================

// Ganti dengan config dari Supabase nanti
const supabaseConfig = {
    url: "GANTI-DENGAN-SUPABASE-URL-KAMU",
    anonKey: "GANTI-DENGAN-SUPABASE-ANON-KEY-KAMU"
};

// Initialize Supabase
const supabase = supabaseClient.createClient(supabaseConfig.url, supabaseConfig.anonKey);

console.log("Supabase initialized successfully!");
