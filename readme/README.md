# JESTFLY — FULL BUNDLE (LEAN)
Data: 2025-11-14

Tudo consolidado em **uma pasta**: código, migrações, assets essenciais, scripts e fontes (placeholders).

## Estrutura
- packages/  → pacotes de código (Admin, Pass, Card Creator, Intro, Community, etc.)
- migrations/ → SQL (core + v2)
- assets_source/ → arquivos essenciais (logo.mp4, oculos2.mov, logo 3d.fbx, giro.zip, pdf/ai)
- scripts/ → conversão (vídeo/3D) + ingestão
- fonts/ → folha de estilos & README
- presskit/ → presskit.sample.json

## Para gerar MP4/WEBM/GLB
1) `node scripts/ingest-assets.mjs`
2) `bash scripts/convert_all.sh`  (ou `pwsh -f scripts/convert_all.ps1` no Windows)
3) `blender -b -P scripts/convert_fbx_to_glb.py -- public/storage/3d/'logo 3d.fbx' public/storage/3d/logo-3d.glb`
4) `node scripts/ingest-assets.mjs` (atualiza presskit)

## Checklist
✅ PASS + Landing + Coleta
✅ Card Creator (glimmer + tilt 3D)
✅ Admin Creative (design, agenda CSV, kanban, demos, integrações)
✅ Intro/Splash com logo em vídeo
✅ Community (starfield/penumbra)
✅ Migrações (core + v2)
✅ Scripts (ffmpeg/blender/ingestor)
⏳ Conectores reais (Discord/Figma/IG), Store/Coins, Mint (wagmi), RBAC, Notificações
