# WebAR Studio (Next.js + MindAR)

Plataforma WebAR estilo Stories AR para criação de experiências com image tracking.

## Stack
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui (componentes base)
- React Hook Form + Zod
- Axios
- MindAR + Three.js
- Cloudinary (storage)
- JSON local para persistência temporária

## Como rodar
1. Instale dependências:
   ```bash
   npm install
   ```
2. Configure variáveis:
   ```bash
   cp .env.example .env.local
   ```
3. Preencha dados do Cloudinary em `.env.local`.
4. Rode o projeto:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`.

## Fluxo
- Crie projeto enviando nome + imagem + vídeo MP4
- API valida formatos e tamanho do vídeo (até 15MB)
- Upload para Cloudinary
- Geração de slug público em `/ar/[slug]`
- Geração de QR Code automática

## APIs
- `POST /api/create`
- `GET /api/project/[slug]`

## Observações de AR
- Página AR exige clique em **Start AR** (compatibilidade iOS Safari)
- Vídeo inicia ao detectar target e pausa ao perder tracking
- `muted` + `playsInline` para autoplay mobile
