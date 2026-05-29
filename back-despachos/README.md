# ITPCARGO CITT — Backend Despachos (Spring Boot)

API REST para la gestión de órdenes de despacho. Desarrollado con Spring Boot 3, Java 17, JPA/Hibernate y MySQL 8.

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
Springboot-API-REST-DESPACHO/
├── src/
│   ├── main/
│   │   ├── java/com/citt/
│   │   │   ├── controller/        # DespachoController (CRUD completo)
│   │   │   ├── persistence/
│   │   │   │   ├── entity/        # Despacho.java
│   │   │   │   ├── repository/    # DespachoRepository (JPA)
│   │   │   │   └── services/      # DespachoService / DespachoServiceImpl
│   │   │   └── exceptions/        # DespachoNotFoundException
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
| `idDespacho` | Long (auto) | Identificador único |
| `fechaDespacho` | LocalDate | Fecha del despacho (formato: YYYY-MM-DD) |
| `patenteCamion` | String | Patente del camión asignado |
| `intento` | int | Número de intento de entrega |
| `idCompra` | Long | ID de la venta asociada |
| `direccionCompra` | String | Dirección de entrega |
| `valorCompra` | Long | Monto del pedido |
| `despachado` | boolean | Indica si fue entregado exitosamente |

## Endpoints disponibles

Base URL: `http://<host>:8081/api/v1/despachos`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/v1/despachos` | Listar todos los despachos |
| GET | `/api/v1/despachos/{id}` | Obtener despacho por ID |
| POST | `/api/v1/despachos` | Crear nuevo despacho |
| PUT | `/api/v1/despachos/{id}` | Actualizar despacho existente |
| DELETE | `/api/v1/despachos/{id}` | Eliminar despacho por ID |

### Ejemplo de request (POST)

```json
{
  "fechaDespacho": "2026-05-18",
  "patenteCamion": "AB-CD-12",
  "intento": 1,
  "idCompra": 1,
  "direccionCompra": "Av. Libertador 1234, Santiago",
  "valorCompra": 89990,
  "despachado": false
}
```

### Ejemplo de response (200 OK)

```json
{
  "idDespacho": 1,
  "fechaDespacho": "2026-05-18",
  "patenteCamion": "AB-CD-12",
  "intento": 1,
  "idCompra": 1,
  "direccionCompra": "Av. Libertador 1234, Santiago",
  "valorCompra": 89990,
  "despachado": false
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
DB_NAME=citt_despachos
DB_USER=citt_user
DB_PASS=C1ttP4ss2026!
```

### Levantar con Maven

```bash
cd Springboot-API-REST-DESPACHO
mvn spring-boot:run
```

### Levantar con Docker Compose

```bash
cd Springboot-API-REST-DESPACHO
docker compose up -d
```

Esto levanta MySQL 8 y el servicio de despachos en el puerto 8081. Comparte el contenedor MySQL con el servicio de ventas mediante la red `citt-backend-net`.

## Despliegue en AWS (CI/CD)

El despliegue automático se realiza vía GitHub Actions al hacer push a la rama `deploy`.

### Pipeline (`.github/workflows/deploy.yml`)

1. Checkout del código
2. Configurar credenciales AWS (secrets de GitHub)
3. Login a Amazon ECR
4. Build de imagen Docker con Maven
5. Push a ECR (`citt-backend-despachos:latest`)
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
- **ECR:** `citt-backend-despachos`
- **Puerto:** 8081 (solo accesible desde el SG del frontend — no expuesto a internet)
- **Red Docker:** `citt-backend-net` (compartida con el servicio de ventas)
- **MySQL:** contenedor `citt-mysql` con volumen persistente `citt-mysql-data`
- **Memoria:** swap de 2 GB + `JAVA_OPTS="-Xms128m -Xmx256m"`

## Flujo de trabajo del sistema

```
[Navegador] → [EC2 Frontend nginx :80]
                     ↓ proxy_pass /despachos/
             [EC2 Backend :8081] → [MySQL]
```

El backend no es accesible directamente desde internet. Toda comunicación pasa por el proxy nginx del frontend.

## Notas importantes

- MySQL 8.0 requiere `mysql_native_password`. Si aparece el error `Public Key Retrieval is not allowed`, ejecutar:
  ```sql
  ALTER USER 'citt_user'@'%' IDENTIFIED WITH mysql_native_password BY 'C1ttP4ss2026!';
  FLUSH PRIVILEGES;
  ```
- El `AWS_SESSION_TOKEN` expira cada ~4 horas. Actualizar los 3 secrets AWS antes de hacer push.
- El servicio de despachos depende del servicio de ventas para obtener el `idCompra` de referencia.
