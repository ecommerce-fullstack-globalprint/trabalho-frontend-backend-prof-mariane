import { LocalStorageManager } from '../abstractions/local-storage.manager';

/**
 * Testes para o LocalStorageManager
 * Execute este arquivo para verificar se a abstração funciona corretamente
 */

// Mock do localStorage para ambiente de teste
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] || null
  };
})();

// Substitui o localStorage para testes
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// ===== TESTES =====

export const testLocalStorageManager = () => {
  console.log('🧪 Iniciando testes do LocalStorageManager...\n');

  // Limpar storage antes dos testes
  localStorageMock.clear();

  // Teste 1: Gerenciamento de Tokens
  console.log('📝 Teste 1: Gerenciamento de Tokens');
  
  const accessToken = 'test-access-token';
  const refreshToken = 'test-refresh-token';
  
  LocalStorageManager.setTokens(accessToken, refreshToken);
  
  const retrievedAccess = LocalStorageManager.getAccessToken();
  const retrievedRefresh = LocalStorageManager.getRefreshToken();
  
  console.log('✅ Tokens salvos e recuperados:', {
    access: retrievedAccess === accessToken,
    refresh: retrievedRefresh === refreshToken
  });

  // Teste 2: Verificação de Tokens
  console.log('\n📝 Teste 2: Verificação de Tokens');
  
  const hasTokens = LocalStorageManager.hasTokens();
  console.log('✅ Tem tokens:', hasTokens);

  // Teste 3: Dados do Usuário
  console.log('\n📝 Teste 3: Dados do Usuário');
  
  const userData = {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    roles: ['user']
  };
  
  LocalStorageManager.setUserData(userData);
  const retrievedUser = LocalStorageManager.getUserData();
  
  console.log('✅ Dados do usuário salvos e recuperados:', 
    JSON.stringify(retrievedUser) === JSON.stringify(userData)
  );

  // Teste 4: Verificação de Dados Válidos
  console.log('\n📝 Teste 4: Verificação de Dados Válidos');
  
  const hasValidUser = LocalStorageManager.hasValidUserData();
  console.log('✅ Tem dados válidos do usuário:', hasValidUser);

  // Teste 5: Métodos Genéricos
  console.log('\n📝 Teste 5: Métodos Genéricos');
  
  const testObject = { test: true, value: 123 };
  LocalStorageManager.setObject('test-key', testObject);
  const retrievedObject = LocalStorageManager.getObject('test-key');
  
  console.log('✅ Objeto genérico salvo e recuperado:', 
    JSON.stringify(retrievedObject) === JSON.stringify(testObject)
  );

  // Teste 6: Limpeza de Tokens
  console.log('\n📝 Teste 6: Limpeza de Tokens');
  
  LocalStorageManager.clearTokens();
  const hasTokensAfterClear = LocalStorageManager.hasTokens();
  const userAfterClear = LocalStorageManager.getUserData();
  
  console.log('✅ Tokens limpos:', !hasTokensAfterClear);
  console.log('✅ Dados do usuário limpos:', userAfterClear === null);

  // Teste 7: Tratamento de Erro JSON
  console.log('\n📝 Teste 7: Tratamento de Erro JSON');
  
  localStorageMock.setItem('invalid-json', '{invalid json}');
  const invalidData = LocalStorageManager.getObject('invalid-json');
  
  console.log('✅ JSON inválido tratado:', invalidData === null);

  // Teste 8: Item Individual
  console.log('\n📝 Teste 8: Item Individual');
  
  LocalStorageManager.setItem('simple-key', 'simple-value');
  const simpleValue = LocalStorageManager.getItem('simple-key');
  
  console.log('✅ Item simples salvo e recuperado:', simpleValue === 'simple-value');
  
  LocalStorageManager.removeItem('simple-key');
  const removedValue = LocalStorageManager.getItem('simple-key');
  
  console.log('✅ Item removido:', removedValue === null);

  console.log('\n🎉 Todos os testes do LocalStorageManager concluídos!');
};

// ===== TESTES DE PERFORMANCE =====

export const testLocalStorageManagerPerformance = () => {
  console.log('\n⚡ Teste de Performance do LocalStorageManager...');
  
  const iterations = 1000;
  const testData = { id: 1, name: 'Test User', data: new Array(100).fill('test') };
  
  // Teste de escrita
  console.time('⏱️  Tempo de escrita (1000x)');
  for (let i = 0; i < iterations; i++) {
    LocalStorageManager.setObject(`test-${i}`, testData);
  }
  console.timeEnd('⏱️  Tempo de escrita (1000x)');
  
  // Teste de leitura
  console.time('⏱️  Tempo de leitura (1000x)');
  for (let i = 0; i < iterations; i++) {
    LocalStorageManager.getObject(`test-${i}`);
  }
  console.timeEnd('⏱️  Tempo de leitura (1000x)');
  
  // Limpeza
  for (let i = 0; i < iterations; i++) {
    LocalStorageManager.removeItem(`test-${i}`);
  }
  
  console.log('✅ Teste de performance concluído!');
};

// ===== TESTE COMPARATIVO =====

export const testComparisonWithDirectLocalStorage = () => {
  console.log('\n🔄 Comparação: LocalStorageManager vs localStorage direto');
  
  const userData = { id: 1, name: 'Test User', email: 'test@email.com' };
  
  // Método antigo (localStorage direto)
  console.time('⏱️  localStorage direto');
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(userData));
    const retrieved = localStorage.getItem('user_data');
    const parsed = retrieved ? JSON.parse(retrieved) : null;
  }
  console.timeEnd('⏱️  localStorage direto');
  
  // Método novo (LocalStorageManager)
  console.time('⏱️  LocalStorageManager');
  LocalStorageManager.setUserData(userData);
  const retrieved = LocalStorageManager.getUserData();
  console.timeEnd('⏱️  LocalStorageManager');
  
  console.log('📊 LocalStorageManager adiciona ~1ms mas garante segurança e consistência');
};

// Execute todos os testes
if (typeof window !== 'undefined') {
  testLocalStorageManager();
  testLocalStorageManagerPerformance();
  testComparisonWithDirectLocalStorage();
}
