// Script de test Supabase pour la console navigateur
// Copiez-collez ce code dans la console de votre navigateur (F12)

(async () => {
  console.log('🔍 Test de configuration Supabase...');
  
  // Vérifier si les variables d'environnement sont définies
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('📊 Variables d\'environnement:');
  console.log('- VITE_SUPABASE_URL:', supabaseUrl ? '✅ Définie' : '❌ Manquante');
  console.log('- VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ Définie' : '❌ Manquante');
  
  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️ Configuration incomplète, test abandonné');
    return;
  }
  
  // Importer le client Supabase
  try {
    const { supabase, testSupabaseConnection } = await import('/src/lib/supabase.ts');
    
    if (!supabase) {
      console.log('❌ Client Supabase non initialisé');
      return;
    }
    
    console.log('✅ Client Supabase initialisé');
    
    // Tester la connexion
    console.log('🔗 Test de connexion...');
    const connectionResult = await testSupabaseConnection();
    
    if (connectionResult.success) {
      console.log('✅ Connexion réussie!');
      console.log(`⚡ Latence: ${connectionResult.latency}ms`);
      
      // Tester les tables
      console.log('📊 Test des tables...');
      
      // Test table users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      console.log('- Table users:', usersError ? '❌ ' + usersError.message : '✅ Accessible');
      
      // Test table bookings
      const { data: bookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('count')
        .limit(1);
      
      console.log('- Table bookings:', bookingsError ? '❌ ' + bookingsError.message : '✅ Accessible');
      
    } else {
      console.log('❌ Erreur de connexion:', connectionResult.error);
    }
    
  } catch (error) {
    console.error('💥 Erreur lors du test:', error);
  }
  
  console.log('🏁 Test terminé');
})();
