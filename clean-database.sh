#!/bin/bash

echo "🧹 Limpiando todos los datos de la base de datos..."

# URL base de la API
BASE_URL="http://localhost:3002/api"

echo "🗑️ Eliminando productos..."
for i in {1..10}; do
  curl -s -X DELETE "$BASE_URL/productos/$i" > /dev/null 2>&1
done

echo "🗑️ Eliminando categorías..."
for i in {1..10}; do
  curl -s -X DELETE "$BASE_URL/categorias/$i" > /dev/null 2>&1
done

echo "🗑️ Eliminando clientes..."
for i in {1..10}; do
  curl -s -X DELETE "$BASE_URL/clientes/$i" > /dev/null 2>&1
done

echo "🗑️ Eliminando usuarios..."
for i in {1..10}; do
  curl -s -X DELETE "$BASE_URL/auth/$i" > /dev/null 2>&1
done

echo "🗑️ Eliminando localidades..."
curl -s -X DELETE "$BASE_URL/localidades/1000" > /dev/null 2>&1
curl -s -X DELETE "$BASE_URL/localidades/1900" > /dev/null 2>&1
curl -s -X DELETE "$BASE_URL/localidades/5000" > /dev/null 2>&1

echo "🗑️ Eliminando provincias..."
curl -s -X DELETE "$BASE_URL/provincias/BA" > /dev/null 2>&1
curl -s -X DELETE "$BASE_URL/provincias/CB" > /dev/null 2>&1

echo "✅ Limpieza completada"
echo "🔍 Verificando estado actual..."

echo "📦 Productos restantes:"
curl -s -X GET "$BASE_URL/productos/" | jq '.count'

echo "📁 Categorías restantes:"
curl -s -X GET "$BASE_URL/categorias/" | jq '.count'
