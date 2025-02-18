# Use Bun as the base image
FROM oven/bun:latest AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and bun.lock first to cache dependencies
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js application (optional, but improves performance)
RUN bun run build

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Run the application
CMD ["bun", "run", "start"]
