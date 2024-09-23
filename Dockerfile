ARG NODE_IMAGE=node:18

FROM ${NODE_IMAGE} As base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
WORKDIR /home/node/app
USER node

FROM base As builder
COPY --chown=node:node /package*.json ./
RUN npm install

FROM base As production
ENV NODE_ENV=production
ENV PORT=4001
ENV HOST=0.0.0.0
WORKDIR /home/node/app

FROM base As development
ENV NODE_ENV=development
ENV PORT=8001
ENV HOST=0.0.0.0
WORKDIR /home/node/app
COPY --chown=node:node --from=builder /home/node/app .

EXPOSE 4001
CMD ["./dev.sh"]