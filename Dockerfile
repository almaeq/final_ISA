# --- Etapa 1: Construcción (Build) ---
# Usamos una imagen de Maven con Java 17 para compilar el proyecto
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app

# Copiamos el archivo de configuración y el código fuente
COPY pom.xml .
COPY src ./src

# Empaquetamos la aplicación (saltando los tests para ir más rápido)
RUN mvn clean package -DskipTests

# --- Etapa 2: Ejecución (Run) ---
# Usamos una imagen ligera de Java 17 solo para correr la app
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copiamos el .jar generado en la etapa anterior
# Nota: El nombre 'kanban-0.0.1-SNAPSHOT.jar' viene de tu pom.xml (artifactId + version)
COPY --from=build /app/target/kanban-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto que usa tu app (según application.properties)
EXPOSE 23456

# Comando para iniciar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]