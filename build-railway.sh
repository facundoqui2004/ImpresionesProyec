#!/bin/bash
set -e

echo "🚀 Starting Railway build process..."

# Verificar Node.js version
echo "📍 Node.js version: $(node -v)"
echo "📍 npm version: $(npm -v)"

# Limpiar caché npm
echo "🧹 Cleaning npm cache..."
npm cache clean --force 2>/dev/null || true

# Instalar dependencias
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-fund --no-audit --progress=false

# Verificar que TypeScript esté disponible
echo "🔍 Checking TypeScript..."
npx tsc --version

# Compilar proyecto
echo "🔨 Compiling TypeScript..."
npx tsc --noEmit --skipLibCheck || {
    echo "❌ TypeScript check failed, but continuing..."
}

echo "🏗️ Building project..."
npx tsc

echo "✅ Build completed successfully!"
echo "📁 Checking dist directory:"
ls -la dist/ || echo "⚠️ dist directory not found"
