FROM openjdk:25-ea-jdk-slim AS builder

RUN apt-get update && apt-get install -y maven

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:25-ea-jdk-slim AS jre-builder

RUN apt-get update && apt-get install -y binutils

RUN jlink --add-modules java.base,java.sql,java.naming,java.desktop,java.management,java.security.jgss,java.instrument \
    --strip-debug \
    --no-header-files \
    --no-man-pages \
    --compress=2 \
    --output /javaruntime

FROM debian:bookworm-slim

RUN groupadd --system appuser && useradd --system --gid appuser appuser
USER appuser

WORKDIR /app

COPY --from=jre-builder /javaruntime /opt/java/

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["/opt/java/bin/java", "-jar", "app.jar"]
