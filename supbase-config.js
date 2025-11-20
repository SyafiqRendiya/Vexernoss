// ==========================================
// SUPABASE CONFIG - GRATIS & NO BILLING!
// ==========================================

// Ganti dengan config dari Supabase nanti
const supabaseConfig = {
    url: "https://eabhpznktrytcwvrjagu.supabase.co",
    anonKey: "sb_publishable_8Ybi0EtrP9b2BE00xfVQbQ_EWpNhhM5"
};

// Initialize Supabase
const supabase = supabaseClient.createClient(supabaseConfig.url, supabaseConfig.anonKey);

console.log("Supabase initialized successfully!");
