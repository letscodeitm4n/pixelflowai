FROM node:20-slim

# Install native dependencies that sharp needs
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --include=dev

COPY . .

RUN npm run build

EXPOSE 4000

CMD ["node", "dist/index.js"]
