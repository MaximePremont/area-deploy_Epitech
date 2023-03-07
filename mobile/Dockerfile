# Utilisation de l'image de base Node.js
FROM node:14.17.6-alpine

# Installation de Java
RUN apk add --no-cache openjdk8

# Définition de la variable JAVA_HOME
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers de configuration package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie des fichiers de l'application
COPY . .

# Installation de React Native
RUN npm install -g react-native-cli

# Build de l'application
RUN react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Création de l'APK
RUN cd android && ./gradlew assembleRelease

# Copie de l'APK dans le répertoire de travail
RUN cp android/app/build/outputs/apk/release/app-release.apk .

# Exposition du port 8081
EXPOSE 8081

# Commande par défaut pour lancer l'application
CMD [ "npm", "start" ]
