# ITPCARGO CITT — Backend Ventas (Spring Boot)

API REST para la gestión de órdenes de compra. Desarrollado con Spring Boot 3, Java 17, JPA/Hibernate y MySQL 8.

## Tecnologías

- Java 17
- Spring Boot 3
- Spring Data JPA / Hibernate
- MySQL 8.0
- Docker + Docker Compose
- Amazon ECR (registro de imágenes)
- Amazon EC2 (despliegue en nube)
- GitHub Actions (CI/CD)

## Estructura del proyecto

```
Springboot-API-REST/
├── src/
│   ├── main/
│   │   ├── java/com/citt/
│   │   │   ├── controller/        # VentaController (CRUD completo)
│   │   │   ├── persistence/
│   │   │   │   ├── entity/        # Venta.java
│   │   │   │   ├── repository/    # VentaRepository (JPA)
│   │   │   │   └── services/      # VentaService / VentaServiceImpl
│   │   │   ├── exceptions/        # VentaNotFoundException
│   │   │   └── config/            # Configuración CORS
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/
├── Dockerfile
├── docker-compose.yml
└── pom.xml
```

## Modelo de datos

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `idVenta` | Long (auto) | Identificador único |
| `direccionCompra` | String | Dirección de entrega (obligatorio) |
| `valorCompra` | int | Monto total de la compra |
| `fechaCompra` | LocalDate | Fecha de la compra (formato: YYYY-MM-DD) |
| `despachoGenerado` | Boolean | Indica si ya se generó un despacho |

## Endpoints disponibles

Base URL: `http://<host>:8080/api/v1/ventas`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/ventas` | Listar todas las ventas |
| GET | `/api/v1/ventas/{id}` | Obtener venta por ID |
| POST | `/api/v1/ventas` | Crear nueva venta |
| PUT | `/api/v1/ventas/{id}` | Actualizar venta existente |
| DELETE | `/api/v1/ventas/{id}` | Eliminar venta por ID |

### Ejemplo de request (POST)

```json
{
  "direccionCompra": "Av. Libertador 1234, Santiago",
  "valorCompra": 89990,
  "fechaCompra": "2026-05-17",
  "despachoGenerado": false
}
```

### Ejemplo de response (200 OK)

```json
{
  "idVenta": 1,
  "direccionCompra": "Av. Libertador 1234, Santiago",
  "valorCompra": 89990,
  "fechaCompra": "2026-05-17",
  "despachoGenerado": false
}
```

## Ejecutar localmente

### Requisitos previos

- Java 17+
- Maven 3.8+
- MySQL 8 corriendo en `localhost:3306`

### Variables de entorno necesarias

```properties
DB_ENDPOINT=localhost
DB_PORT=3306
DB_NAME=citt_ventas
DB_USER=citt_user
DB_PASS=C1ttP4ss2026!
```

### Levantar con Maven

```bash
cd Springboot-API-REST
mvn spring-boot:run
```

### Levantar con Docker Compose

```bash
cd Springboot-API-REST
docker compose up -d
```

Esto levanta MySQL 8 y el servicio de ventas en el puerto 8080.

## Despliegue en AWS (CI/CD)

El despliegue automático se realiza vía GitHub Actions al hacer push a la rama `deploy`.

### Pipeline (`.github/workflows/deploy.yml`)

1. Checkout del código
2. Configurar credenciales AWS (secrets de GitHub)
3. Login a Amazon ECR
4. Build de imagen Docker con Maven
5. Push a ECR (`citt-backend-ventas:latest`)
6. SSM send-command a EC2 backend: `docker pull` + `docker run`

### Secrets de GitHub requeridos

| Secret | Descripción |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | Credencial AWS Academy |
| `AWS_SECRET_ACCESS_KEY` | Credencial AWS Academy |
| `AWS_SESSION_TOKEN` | Token de sesión (expira ~4h) |
| `EC2_INSTANCE_ID` | ID de la instancia EC2 (sin IP — usa SSM) |
| `DB_PASS` | Contraseña MySQL |

## Infraestructura AWS

- **EC2:** `citt-ec2-backend` (t2.micro, Amazon Linux 2023)
- **ECR:** `citt-backend-ventas`
- **Puerto:** 8080 (solo accesible desde el SG del frontend — no expuesto a internet)
- **Red Docker:** `citt-backend-net`
- **MySQL:** contenedor `citt-mysql` con volumen `citt-mysql-data`
- **Memoria:** swap de 2 GB + `JAVA_OPTS="-Xms128m -Xmx256m"`

## Notas importantes

- MySQL 8.0 requiere `mysql_native_password`. Si aparece el error `Public Key Retrieval is not allowed`, ejecutar:
  ```sql
  ALTER USER 'citt_user'@'%' IDENTIFIED WITH mysql_native_password BY 'C1ttP4ss2026!';
  FLUSH PRIVILEGES;
  ```
- El `AWS_SESSION_TOKEN` expira cada ~4 horas. Actualizar los 3 secrets AWS antes de hacer push.
