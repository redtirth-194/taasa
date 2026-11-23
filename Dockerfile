FROM node:20-alpine

WORKDIR /app

# Copy entire repository first so all scripts, configs, and prisma files exist
COPY . .

# Install dependencies across root, CMS, and SERVER
RUN npm run install:all

# Build frontend (CMS/dist) and generate Prisma client
RUN npm run build

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production
ENV DATABASE_URL="file:./dev.db"

CMD ["npm", "start"]
