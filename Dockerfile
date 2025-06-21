# Install dependencies only when needed
FROM node:20-alpine3.19 AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml
RUN corepack enable
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:20-alpine3.19 AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# Production image, copy all the files and run next
FROM  node:20-alpine3.19 AS runner
WORKDIR /app

ENV NODE_ENV=production

# If you use next export, uncomment this:
# ENV NEXT_PUBLIC_BASE_PATH=/

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]