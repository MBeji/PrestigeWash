// Test de compatibilité cross-browser pour l'application PrestigeWash

// Fonction pour tester les fonctionnalités essentielles
function testBrowserCompatibility() {
  const results = {
    browser: navigator.userAgent,
    timestamp: new Date().toISOString(),
    tests: {} as any
  };

  // Test 1: Support des API essentielles
  results.tests.essentialAPIs = {
    localStorage: typeof Storage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    Promise: typeof Promise !== 'undefined',
    Object_assign: typeof Object.assign !== 'undefined',
    Array_from: typeof Array.from !== 'undefined',
    String_includes: typeof String.prototype.includes !== 'undefined'
  };

  // Test 2: Support CSS
  results.tests.cssSupport = {
    flexbox: CSS.supports('display', 'flex'),
    grid: CSS.supports('display', 'grid'),
    customProperties: CSS.supports('--test', 'test'),
    calc: CSS.supports('width', 'calc(100% - 20px)'),
    viewport: CSS.supports('width', '100vw')
  };

  // Test 3: Support JavaScript moderne
  results.tests.jsFeatures = {
    arrow_functions: (() => true)(),
    const_let: (() => { const test = true; return test; })(),
    template_literals: `test${1}` === 'test1',
    destructuring: (() => { const {test} = {test: true}; return test; })(),
    spread_operator: [...[1, 2]].length === 2
  };

  // Test 4: Support des événements
  results.tests.events = {
    addEventListener: typeof document.addEventListener !== 'undefined',
    customEvent: typeof CustomEvent !== 'undefined',
    touchEvents: 'ontouchstart' in window,
    pointerEvents: 'onpointerdown' in window
  };

  // Test 5: Support des API Web modernes
  results.tests.webAPIs = {
    intersectionObserver: typeof IntersectionObserver !== 'undefined',
    mutationObserver: typeof MutationObserver !== 'undefined',
    requestAnimationFrame: typeof requestAnimationFrame !== 'undefined',
    performance: typeof performance !== 'undefined'
  };

  // Test 6: Support du DOM
  results.tests.domSupport = {
    querySelector: typeof document.querySelector !== 'undefined',
    querySelectorAll: typeof document.querySelectorAll !== 'undefined',
    classList: typeof document.createElement('div').classList !== 'undefined',
    dataset: typeof document.createElement('div').dataset !== 'undefined'
  };

  return results;
}

// Fonction pour afficher les résultats
function displayCompatibilityResults() {
  const results = testBrowserCompatibility();
  
  console.group('🧪 Test de compatibilité cross-browser');
  console.log('Navigateur:', results.browser);
  console.log('Timestamp:', results.timestamp);
  
  Object.entries(results.tests).forEach(([category, tests]) => {
    console.group(`📋 ${category}`);
    Object.entries(tests as any).forEach(([test, result]) => {
      const status = result ? '✅' : '❌';
      console.log(`${status} ${test}:`, result);
    });
    console.groupEnd();
  });
  
  console.groupEnd();
  
  return results;
}

// Fonction pour tester les fonctionnalités spécifiques de l'app
function testAppFeatures() {
  const tests = {
    react_render: document.getElementById('root') !== null,
    auth_components: document.querySelector('.auth-container') !== null || document.querySelector('.app-header') !== null,
    calendar_components: document.querySelector('.calendar-container') !== null,
    css_loading: getComputedStyle(document.body).fontFamily !== '',
    error_boundary: typeof (window as any).ErrorBoundary !== 'undefined'
  };

  console.group('🚗 Test des fonctionnalités PrestigeWash');
  Object.entries(tests).forEach(([test, result]) => {
    const status = result ? '✅' : '❌';
    console.log(`${status} ${test}:`, result);
  });
  console.groupEnd();

  return tests;
}

// Fonction pour tester les performances
function testPerformance() {
  const start = performance.now();
  
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      const end = performance.now();
      const results = {
        render_time: end - start,
        memory_usage: (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 'N/A',
        dom_nodes: document.querySelectorAll('*').length,
        css_rules: Array.from(document.styleSheets).reduce((count, sheet) => {
          try {
            return count + (sheet.cssRules ? sheet.cssRules.length : 0);
          } catch (e) {
            return count;
          }
        }, 0)
      };

      console.group('⚡ Test de performance');
      console.log('Temps de rendu:', results.render_time, 'ms');
      console.log('Utilisation mémoire:', results.memory_usage);
      console.log('Nombre de nœuds DOM:', results.dom_nodes);
      console.log('Nombre de règles CSS:', results.css_rules);
      console.groupEnd();

      resolve(results);
    });
  });
}

// Fonction principale de test
async function runAllTests() {
  console.clear();
  console.log('🔧 PrestigeWash - Test de compatibilité cross-browser');
  console.log('================================================');
  
  const compatibilityResults = displayCompatibilityResults();
  const appResults = testAppFeatures();
  const performanceResults = await testPerformance();
  
  const allResults = {
    compatibility: compatibilityResults,
    app: appResults,
    performance: performanceResults,
    overall: {
      browser_supported: Object.values(compatibilityResults.tests.essentialAPIs).every(Boolean),
      app_functional: Object.values(appResults).filter(Boolean).length >= 2,
      performance_good: (performanceResults as any).render_time < 100
    }
  };

  console.group('📊 Résumé global');
  console.log('Navigateur supporté:', allResults.overall.browser_supported ? '✅' : '❌');
  console.log('Application fonctionnelle:', allResults.overall.app_functional ? '✅' : '❌');
  console.log('Performance acceptable:', allResults.overall.performance_good ? '✅' : '❌');
  console.groupEnd();

  return allResults;
}

// Exporter les fonctions pour utilisation
if (typeof window !== 'undefined') {
  (window as any).testBrowserCompatibility = testBrowserCompatibility;
  (window as any).displayCompatibilityResults = displayCompatibilityResults;
  (window as any).testAppFeatures = testAppFeatures;
  (window as any).testPerformance = testPerformance;
  (window as any).runAllTests = runAllTests;
}

export {
  testBrowserCompatibility,
  displayCompatibilityResults,
  testAppFeatures,
  testPerformance,
  runAllTests
};
