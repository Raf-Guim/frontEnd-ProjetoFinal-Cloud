# Stage 1: Building the code
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Run the built code
FROM node:18-alpine AS runner

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy necessary files from builder
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Don't run as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]
