# ==============================
# Etapa 1: Build da aplicação
# ==============================
FROM maven:3.9-eclipse-temurin-25-alpine AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# ==============================
# Etapa 2: Runtime leve
# ==============================
FROM eclipse-temurin:25-jre-alpine

RUN addgroup -S appuser && adduser -S appuser -G appuser
USER appuser

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
