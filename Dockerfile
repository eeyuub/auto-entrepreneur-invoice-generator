FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 9911

# Set default environment variables
ENV PORT=9911
ENV NODE_ENV=production

# Start the server
CMD ["npm", "start"]
