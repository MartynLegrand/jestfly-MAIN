# 🎨 Configuração da Logo no Header

O header suporta **3 tipos de logo**:

## 📹 1. VÍDEO (Padrão)
```tsx
<GlassHeader
  menuItems={menuItems}
  logoType="video"
  videoSrc="/assets/videos/oculos2.mp4"
/>
```

**Características:**
- Vídeo em loop automático
- Tamanho: 80x80px (desktop), 64x64px (mobile)
- Borda circular com efeito neon
- Hover aumenta brilho e saturação

---

## 🎲 2. MODELO 3D
```tsx
<GlassHeader
  menuItems={menuItems}
  logoType="3d"
  modelSrc="/models/logo-3d.glb"
/>
```

**Características:**
- Carrega modelo GLB/GLTF
- Rotação automática suave
- Hover acelera rotação
- Fallback automático se falhar
- Luzes neon (roxo + cyan)

---

## 💎 3. ÍCONE (Fallback)
```tsx
<GlassHeader
  menuItems={menuItems}
  logoType="icon"
/>
```

**Características:**
- Ícone Diamond do Lucide
- Efeito glow roxo
- Animação pulse
- Mais leve (sem 3D)

---

## ⚙️ Como Trocar

### No `App.tsx` (linha 78):

```tsx
// OPÇÃO 1: Usar vídeo
<GlassHeader
  menuItems={menuItems}
  logoType="video"
  videoSrc="/assets/videos/oculos2.mp4"
/>

// OPÇÃO 2: Usar modelo 3D
<GlassHeader
  menuItems={menuItems}
  logoType="3d"
  modelSrc="/models/logo-3d.glb"
/>

// OPÇÃO 3: Usar ícone simples
<GlassHeader
  menuItems={menuItems}
  logoType="icon"
/>
```

---

## 📁 Arquivos Necessários

### Para Vídeo:
- Coloque seu vídeo em: `/public/assets/videos/`
- Formatos: `.mp4`, `.webm`, `.mov`
- Tamanho recomendado: máximo 5MB
- Resolução: 512x512px

### Para 3D:
- Coloque modelo em: `/public/models/`
- Formato: `.glb` ou `.gltf`
- Tamanho recomendado: máximo 2MB

---

## 🎯 Comportamento Atual

**Configuração Atual:** `logoType="video"`

**Fallbacks Automáticos:**
1. Se vídeo falhar → tenta 3D
2. Se 3D falhar → usa ícone
3. Sempre funciona!

---

## 🚀 Performance

| Tipo | Peso | FPS | Mobile |
|------|------|-----|--------|
| Ícone | 2KB | 60+ | ✅ Perfeito |
| Vídeo | ~3MB | 60 | ✅ Bom |
| 3D | ~500KB | 60 | ✅ Bom |

---

## 💡 Dica Pro

Você pode **detectar o device** e usar vídeo no desktop e ícone no mobile:

```tsx
const logoType = useIsMobile() ? 'icon' : 'video';

<GlassHeader
  menuItems={menuItems}
  logoType={logoType}
  videoSrc="/assets/videos/oculos2.mp4"
/>
```
