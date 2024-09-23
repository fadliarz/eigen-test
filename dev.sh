#!/bin/sh
npx prisma generate
npx prisma db push
npx prisma migrate reset --force
npm run dev