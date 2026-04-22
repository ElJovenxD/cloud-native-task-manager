# 1. Usar una imagen base ligera de Node.js
FROM node:18-alpine

# 2. Crear un directorio de trabajo dentro del contenedor de app
WORKDIR /usr/src/app

# 3. Copiar los archivos de dependencias
COPY package*.json ./

# 4. Instalar las dependencias
RUN npm install

# 5. Copiar el resto del código fuente
COPY . .

# 6. Exponer el puerto donde correrá la API
EXPOSE 3000

# 7. Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "dev"]