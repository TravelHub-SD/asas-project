# syntax=docker/dockerfile:1
#
# صورة إنتاج للموقع (Next.js 14 · App Router · صفحات ثابتة).
# ثلاث مراحل حتى لا تحمل الصورة النهائية node_modules ولا مصدر المشروع.
# البناء يعتمد output: "standalone" المفعَّل بـ DOCKER_BUILD=1 في next.config.mjs.

# ---------- 1) الاعتماديات ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---------- 2) البناء ----------
FROM node:22-alpine AS builder
WORKDIR /app

# مهم: NEXT_PUBLIC_SITE_URL يُخبز وقت البناء لأنه يدخل canonical و og:url
# و sitemap.xml. مرِّره بـ --build-arg وإلا سقط الأمر إلى الدومين الاحتياطي
# في lib/config.ts.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV DOCKER_BUILD=1
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- 3) التشغيل ----------
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# standalone لا يتضمّن public ولا .next/static — تُنسخان يدويًا.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}/" >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
