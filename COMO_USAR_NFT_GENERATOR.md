# 🎨 Como Usar o NFT Generator - Guia Rápido

## 📍 Onde Está o NFT Generator?

### Passo 1: Acesse o Painel de Admin
```
Navegue para: /admin
ou
Clique no link "Admin" no seu site
```

### Passo 2: Localize a Aba NFT Generator
No painel de administração, você verá uma sidebar (barra lateral) com várias abas:

```
📊 Dashboard
📦 Modelos 3D
🎭 Sketchfab
💧 Material
📐 Elementos
🖥️  Layout
🎨 Cores
✨ NFT Generator  ← CLIQUE AQUI!
⚙️  Config
```

A aba **"NFT Generator"** tem o ícone de **Sparkles (✨)**.

---

## 🎯 Interface do NFT Generator

Quando você clicar na aba "NFT Generator", verá:

### Lado Esquerdo (70% da tela)
**Formulário de Criação** com 4 abas:

#### 📝 1. Basic Info
- **Nome do Produto**: Digite o nome do seu NFT
- **Slug**: URL automática (ex: "meu-nft-especial")
- **Descrição**: Conte sobre o NFT
- **Tipo**:
  - 🔷 Digital (NFT puramente digital)
  - 📦 Physical (item físico + NFT)
  - 🔄 Hybrid (ambos)
- **Raridade**:
  - ⚪ Common (comum)
  - 🟢 Uncommon (incomum)
  - 🔵 Rare (raro)
  - 🟣 Epic (épico)
  - 🟡 Legendary (lendário)
- **Tags**: Adicione tags para busca (ex: music, art, limited)

#### 💰 2. Pricing (Preços)
- **Preço em Jest Coins**: Quanto custa em JC (ex: 500)
- **Preço em Dinheiro**: Quanto custa em $ (ex: 25.00)
- **Método de Pagamento**:
  - 💎 Jest Coin Only (só aceita JC)
  - 💵 Money Only (só aceita dinheiro)
  - 🔄 Hybrid (aceita ambos)

**Controle de Estoque:**
- ♾️ Unlimited Stock (estoque ilimitado) - ON/OFF
- 📦 Stock Quantity (se não for ilimitado)
- 🎫 Limited Edition (edição limitada) - ON/OFF
- 🔢 Edition Size (tamanho da edição se limitada)
- 👤 Max Per User (máximo por usuário)

#### 🖼️ 3. Media (Mídias)
- **Main Image URL**: Cole a URL da imagem principal
  - Exemplo: `https://images.pexels.com/...`

- **Additional Images**: Adicione mais imagens
  - Cole URL e clique no botão +
  - Aparecem como galeria de miniaturas

- **Video URL**: Link do vídeo promocional (opcional)
  - Exemplo: `https://youtube.com/...`

- **3D Model URL**: Link do modelo 3D .glb (opcional)
  - Exemplo: `https://exemplo.com/modelo.glb`

#### ⚙️ 4. Advanced (Avançado)
- Configurações futuras de metadata
- Atributos personalizados

### Lado Direito (30% da tela)
**Lista de Produtos** criados:
- Mostra miniatura de cada produto
- Nome do produto
- Badges de tipo e raridade
- Preços (JC e $)
- Clique em qualquer produto para editar

---

## ✅ Como Criar Seu Primeiro NFT

### Exemplo Prático: Criar um "Exclusive Track NFT"

1. **Acesse**: `/admin` → Aba **NFT Generator**

2. **Aba Basic Info**:
   ```
   Nome: Exclusive Track NFT
   Descrição: Unreleased track from 2024 studio session
   Tipo: Digital
   Raridade: Rare
   Tags: music, exclusive, unreleased
   ```

3. **Aba Pricing**:
   ```
   Jest Coins: 750
   Money: $35.00
   Payment Method: Hybrid

   Unlimited Stock: OFF
   Stock: 100
   Limited Edition: ON
   Edition Size: 100
   Max Per User: 2
   ```

4. **Aba Media**:
   ```
   Main Image: https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg
   ```

5. **Clique em**: 💾 **"Create Product"**

**Pronto!** Seu NFT foi criado e aparece na lista lateral.

---

## 📊 Visualizar NFTs na Loja

Depois de criar NFTs, visualize na loja:

```
Acesse: /nft-store
```

Você verá:
- Grid com todos os produtos
- Filtros na lateral esquerda
- Busca no topo
- Cards bonitos com imagens e preços
- Botão "Add to Cart"

---

## 🎨 Produtos de Exemplo Já Criados

Já criei 6 produtos para você ver funcionando:

1. **Exclusive DJ Set NFT** (500 JC / $25) - Rare 🔵
2. **Golden Vinyl Record** (2000 JC / $99.99) - Legendary 🟡
3. **VIP Backstage Pass** (1500 JC / $75) - Epic 🟣
4. **Digital Art Collection** (300 JC / $15) - Uncommon 🟢
5. **Limited Edition T-Shirt** (800 JC / $45) - Rare 🔵
6. **Music Production Tutorial** (250 JC / $12.99) - Common ⚪

---

## 🔄 Editar um NFT Existente

1. Vá para **NFT Generator**
2. Na lista lateral direita, **clique no produto**
3. Formulário carrega com os dados
4. Faça as alterações
5. Clique em **"Update Product"**

---

## 🗑️ Deletar um NFT

Por enquanto, delete direto no banco de dados ou aguarde futura implementação do botão de delete.

---

## 🎯 Dicas de Uso

### Imagens
Use imagens de alta qualidade:
- **Pexels**: https://pexels.com (gratuitas)
- **Unsplash**: https://unsplash.com (gratuitas)
- Tamanho ideal: 1000x1000px ou maior
- Formato: JPG ou PNG

### Preços
- Jest Coins para economia interna
- Money para monetização real
- Hybrid para dar opções ao usuário

### Raridade
Use estrategicamente:
- **Common**: Produtos comuns, sempre disponíveis
- **Uncommon**: Produtos interessantes
- **Rare**: Edições limitadas
- **Epic**: Muito raros, alto valor
- **Legendary**: Únicos, colecionáveis supremos

### Estoque
- **Unlimited**: Para produtos digitais ilimitados
- **Limited**: Para criar escassez e urgência
- **Max Per User**: Evita acumulação por uma pessoa

---

## 🚀 Próximos Passos

Agora que você sabe usar o NFT Generator:

1. ✅ Crie seus próprios NFTs
2. ✅ Configure preços estratégicos
3. ✅ Use boas imagens
4. ✅ Teste na loja `/nft-store`
5. 🔄 Implemente checkout (próximo passo)
6. 🔄 Configure pagamentos reais
7. 🔄 Lance para seus usuários!

---

## 📞 Resumo Rápido

**Acesso**: `/admin` → Aba "NFT Generator" (ícone ✨)

**Criar NFT**:
1. Preencha Basic Info
2. Configure Pricing
3. Adicione Media
4. Clique "Create Product"

**Ver Loja**: `/nft-store`

**Editar**: Clique no produto na lista lateral

---

## ✨ Sistema 100% Funcional!

O NFT Generator está completamente operacional e pronto para uso. Você pode criar quantos NFTs quiser e gerenciá-los facilmente pelo painel de admin!

**Divirta-se criando NFTs incríveis!** 🎉