const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

// Configuração
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8001';
const TEST_USER_ID = process.env.TEST_USER_ID || '1';
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.jpg');

async function testImageUpload() {
    console.log('🧪 Testando upload de imagem de perfil...\n');

    try {
        // Verificar se a imagem de teste existe
        if (!fs.existsSync(TEST_IMAGE_PATH)) {
            console.log('📝 Criando imagem de teste...');
            // Criar uma imagem de teste simples (1x1 pixel JPEG)
            const testImageBuffer = Buffer.from([
                0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
                0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xFF, 0xDB, 0x00, 0x43,
                0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
                0x09, 0x08, 0x0A, 0x0C, 0x14, 0x0D, 0x0C, 0x0B, 0x0B, 0x0C, 0x19, 0x12,
                0x13, 0x0F, 0x14, 0x1D, 0x1A, 0x1F, 0x1E, 0x1D, 0x1A, 0x1C, 0x1C, 0x20,
                0x24, 0x2E, 0x27, 0x20, 0x22, 0x2C, 0x23, 0x1C, 0x1C, 0x28, 0x37, 0x29,
                0x2C, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1F, 0x27, 0x39, 0x3D, 0x38, 0x32,
                0x3C, 0x2E, 0x33, 0x34, 0x32, 0xFF, 0xC0, 0x00, 0x11, 0x08, 0x00, 0x01,
                0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0x02, 0x11, 0x01, 0x03, 0x11, 0x01,
                0xFF, 0xC4, 0x00, 0x14, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x08, 0xFF, 0xC4,
                0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
                0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xDA, 0x00, 0x0C,
                0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00, 0x8A, 0x00,
                0x07, 0xFF, 0xD9
            ]);
            fs.writeFileSync(TEST_IMAGE_PATH, testImageBuffer);
        }

        // Criar FormData
        const formData = new FormData();
        formData.append('profileImage', fs.createReadStream(TEST_IMAGE_PATH));

        console.log(`📤 Fazendo upload para: ${API_BASE_URL}/users/${TEST_USER_ID}/profile-image`);

        // Fazer upload
        const response = await fetch(`${API_BASE_URL}/users/${TEST_USER_ID}/profile-image`, {
            method: 'PATCH',
            body: formData,
            headers: {
                ...formData.getHeaders(),
                // Adicione aqui headers de autenticação se necessário
                // 'Authorization': 'Bearer YOUR_TOKEN'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        
        console.log('✅ Upload realizado com sucesso!');
        console.log('📋 Resposta:', JSON.stringify(result, null, 2));

        // Testar acesso à imagem
        if (result.imageUrl) {
            console.log('\n🔗 Testando acesso à imagem...');
            const imageResponse = await fetch(result.imageUrl);
            
            if (imageResponse.ok) {
                console.log('✅ Imagem acessível via URL pública!');
                console.log(`📊 Tamanho da imagem: ${imageResponse.headers.get('content-length')} bytes`);
                console.log(`🎨 Tipo: ${imageResponse.headers.get('content-type')}`);
            } else {
                console.log('❌ Erro ao acessar imagem:', imageResponse.status);
            }
        }

        // Verificar se a pasta uploads foi criada
        const uploadsDir = path.join(process.cwd(), 'uploads', 'profile-images');
        if (fs.existsSync(uploadsDir)) {
            const files = fs.readdirSync(uploadsDir);
            console.log(`\n📁 Arquivos na pasta uploads: ${files.length}`);
            files.forEach(file => {
                const filePath = path.join(uploadsDir, file);
                const stats = fs.statSync(filePath);
                console.log(`   - ${file} (${stats.size} bytes)`);
            });
        }

    } catch (error) {
        console.error('❌ Erro no teste:', error.message);
        
        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Dica: Certifique-se de que o servidor está rodando em', API_BASE_URL);
        }
        
        process.exit(1);
    }
}

// Executar teste
testImageUpload(); 