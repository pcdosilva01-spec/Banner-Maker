import dotenv from 'dotenv';
dotenv.config();

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;

console.log('\n=== TESTANDO CHAVE NVIDIA API ===\n');

if (!NVIDIA_API_KEY || NVIDIA_API_KEY === 'sua_chave_nvidia_aqui') {
  console.log('❌ ERRO: Chave NVIDIA não configurada no arquivo .env');
  console.log('\nPor favor:');
  console.log('1. Acesse: https://build.nvidia.com');
  console.log('2. Faça login e obtenha sua chave API');
  console.log('3. Edite o arquivo .env');
  console.log('4. Cole a chave em NVIDIA_API_KEY=sua_chave_aqui\n');
  process.exit(1);
}

console.log('✓ Chave encontrada no .env');
console.log('✓ Testando conexão com NVIDIA API...\n');

// Testar modelos disponíveis
const modelsToTest = [
  'meta/llama-3.1-8b-instruct',
  'meta/llama-3.1-70b-instruct', 
  'mistralai/mistral-7b-instruct-v0.3',
  'google/gemma-2b',
  'microsoft/phi-3-mini-128k-instruct'
];

async function testModel(model) {
  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: 'user', content: 'Olá' }],
        max_tokens: 10
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ${model} - FUNCIONANDO`);
      return true;
    } else {
      console.log(`❌ ${model} - Erro ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${model} - ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('Testando modelos disponíveis:\n');
  
  let workingModel = null;
  
  for (const model of modelsToTest) {
    const works = await testModel(model);
    if (works && !workingModel) {
      workingModel = model;
    }
  }
  
  console.log('\n=================================');
  
  if (workingModel) {
    console.log(`\n✅ SUCESSO! Use este modelo no .env:`);
    console.log(`NVIDIA_MODEL=${workingModel}\n`);
  } else {
    console.log('\n❌ ERRO: Nenhum modelo funcionou');
    console.log('\nPossíveis causas:');
    console.log('1. Chave API inválida ou expirada');
    console.log('2. Sem conexão com internet');
    console.log('3. Precisa validar a conta em build.nvidia.com\n');
    console.log('Verifique em: https://build.nvidia.com/\n');
  }
}

runTests();
