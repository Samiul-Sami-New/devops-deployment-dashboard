# Dependency stage is kept separate so production dependencies are cached until
# package manifests change.
FROM node:24-alpine AS production-dependencies

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

COPY --from=production-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node package.json ./
COPY --chown=node:node src ./src

USER node
EXPOSE 3000

# Use Node for the probe so the runtime image needs no curl or wget package.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD ["node", "-e", "const http=require('http');const request=http.get({host:'127.0.0.1',port:process.env.PORT||3000,path:'/health',timeout:3000},response=>process.exit(response.statusCode===200?0:1));request.on('error',()=>process.exit(1));request.on('timeout',()=>{request.destroy();process.exit(1)});"]

CMD ["node", "src/server.js"]
