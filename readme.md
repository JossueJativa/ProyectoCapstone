# Proyecto Capstone - Admin Controller

Este proyecto es una aplicación web desarrollada con Django y Django REST Framework para la gestión de usuarios, platos, mesas, alérgenos, ingredientes y pedidos. Utiliza PostgreSQL como base de datos y Docker para la contenedorización.

## Índice
1. [Requisitos](#requisitos)
2. [Configuración del entorno](#configuración-del-entorno)
3. [Crear la base de datos con Docker](#crear-la-base-de-datos-con-docker)
4. [Ingreso a base de datos por Docker](#ingreso-a-base-de-datos-por-docker)
5. [Hacer migraciones en la base de datos](#hacer-migraciones-en-la-base-de-datos)
6. [Ejecutar pruebas](#ejecutar-pruebas)
7. [Endpoints](#endpoints)
8. [Datos para solicitudes](#datos-para-solicitudes)
9. [WebSockets](#websockets)

## Requisitos

- Docker
- Docker Compose
- Python 3.12
- Django 5.1.6

## Configuración del entorno

1. Clona el repositorio:
    ```bash
    git clone https://github.com/JossueJativa/ProyectoCapstone.git
    cd ProyectoCapstone
    ```

2. Crea un entorno virtual e instálalo:
    ```bash
    python -m venv venv
    source env/bin/activate  # En Windows usa `env\Scripts\activate`
    pip install -r requirements.txt
    ```

3. Crea un archivo `.env` en la raíz del proyecto y añade las siguientes variables de entorno:
    ```env
    SECRET_KEY=<tu_secret_key>
    NAME_DB=admincontroller
    USER_DB=postgres
    PASSWORD_DB=admincontroller
    HOST_DB=localhost
    PORT_DB=5432
    ```

## Crear la base de datos con Docker

Para iniciar una instancia de PostgreSQL en Docker, ejecuta el siguiente comando:
```
docker-compose up
```

Esta base de datos va a iniciar en el puerto `5432` donde el mismo se podrá referenciar, también si se ejecuta en el mismo servicio que el el host va a ser `localhost`

Para bajar la base de datos y desactivarla se debe ejecutar el siguiente comando:
```
docker-compose down
```

Y asi se bajaría el servicio de la base de datos relacional para este proyecto.

## Ingreso a base de datos por Docker
Para ingresar a la base de datos de manera visual, se pudra usar el adminer que igual se ejecuta con el `docker-compose` donde se necesita ingresar con las credenciales de la base de datos del PostgreSQL donde se tendrá que iniciar scion en la siguiente URL [localhost](http://localhost:8080)

Recuerde poner lo siguiente:
```
Motor de base de datos: PostgreSQL
servidor: db
Usuario: postgres
Contraseña: Contraseña de la base de datos
Base de datos: Nombre de la base de datos
```

## Hacer migraciones en la base de datos
Para realizar la migración de la base de datos, hay que realizar lo siguiente:
1. Se abre la terminal del proyecto
2. Se ingresa al `root` del proyecto `admincontroller`
3. Se ingresa el comando `python manage.py makemigrations`
4. Si sale la respuesta: `No changes detected` puede realizar el siguiente paso
5. Se ingresa el comando `python manage.py migrate`
6. Ahi estaría ya completas las migraciones de la base de datos en nuestro docker con PostreSQL

## Ejecutar pruebas

Para ejecutar las pruebas, sigue estos pasos:
1. Asegúrate de que el entorno virtual esté activado.
2. Navega al directorio raíz del proyecto.
3. Ejecuta el siguiente comando:
    ```bash
    python manage.py test
    ```

Las pruebas se encuentran en el directorio `admincontroller/authAPI/tests.py`, `admincontroller/dishesAPI/tests.py`, `admincontroller/desksAPI/tests.py`, `admincontroller/allergensAPI/tests.py`, `admincontroller/ingredientsAPI/tests.py` y `admincontroller/ordersAPI/tests.py`.

## Endpoints

### Autenticación
- `POST /api/token/` - Obtiene un token de acceso
- `POST /api/token/refresh/` - Refresca el token de acceso

### Usuarios
- `POST /users/login/` - Inicia sesión de un usuario
- `POST /users/register/` - Registra un nuevo usuario
- `POST /users/logout/` - Cierra sesión de un usuario
- `GET /users/` - Obtiene la lista de usuarios (requiere autenticación)
- `GET /users/{id}/` - Obtiene los detalles de un usuario específico (requiere autenticación)
- `PUT /users/{id}/` - Actualiza la información de un usuario (requiere autenticación)
- `DELETE /users/{id}/` - Elimina un usuario (requiere autenticación)

### Platos
- `GET /dishes/` - Obtiene la lista de platos (requiere autenticación)
- `GET /dishes/{id}/` - Obtiene los detalles de un plato específico (requiere autenticación)
- `POST /dishes/` - Crea un nuevo plato (requiere autenticación)
- `PUT /dishes/{id}/` - Actualiza la información de un plato (requiere autenticación)
- `DELETE /dishes/{id}/` - Elimina un plato (requiere autenticación)

### Mesas
- `GET /desks/` - Obtiene la lista de mesas (requiere autenticación)
- `GET /desks/{id}/` - Obtiene los detalles de una mesa específica (requiere autenticación)
- `POST /desks/` - Crea una nueva mesa (requiere autenticación)
- `PUT /desks/{id}/` - Actualiza la información de una mesa (requiere autenticación)
- `DELETE /desks/{id}/` - Elimina una mesa (requiere autenticación)

### Alérgenos
- `GET /allergens/` - Obtiene la lista de alérgenos (requiere autenticación)
- `GET /allergens/{id}/` - Obtiene los detalles de un alérgeno específico (requiere autenticación)
- `POST /allergens/` - Crea un nuevo alérgeno (requiere autenticación)
- `PUT /allergens/{id}/` - Actualiza la información de un alérgeno (requiere autenticación)
- `DELETE /allergens/{id}/` - Elimina un alérgeno (requiere autenticación)

### Ingredientes
- `GET /ingredients/` - Obtiene la lista de ingredientes (requiere autenticación)
- `GET /ingredients/{id}/` - Obtiene los detalles de un ingrediente específico (requiere autenticación)
- `POST /ingredients/` - Crea un nuevo ingrediente (requiere autenticación)
- `PUT /ingredients/{id}/` - Actualiza la información de un ingrediente (requiere autenticación)
- `DELETE /ingredients/{id}/` - Elimina un ingrediente (requiere autenticación)

### Pedidos
- `GET /orders/` - Obtiene la lista de pedidos (requiere autenticación)
- `GET /orders/{id}/` - Obtiene los detalles de un pedido específico (requiere autenticación)
- `POST /orders/` - Crea un nuevo pedido (requiere autenticación)
- `PUT /orders/{id}/` - Actualiza la información de un pedido (requiere autenticación)
- `DELETE /orders/{id}/` - Elimina un pedido (requiere autenticación)

## Datos para solicitudes

### Usuarios
- **Registro**:
    ```json
    {
        "username": "usuario",
        "password": "contraseña",
        "email": "correo@ejemplo.com"
    }
    ```
- **Inicio de sesión**:
    ```json
    {
        "username": "usuario",
        "password": "contraseña"
    }
    ```

### Platos
- **Crear/Actualizar plato**:
    ```json
    {
        "dish_name": "Nombre del plato",
        "description": "Descripción del plato",
        "time_elaboration": "00:30:00",
        "price": 10,
        "ingredient": [1, 2],
        "link_ar": "http://example.com",
        "category": 1
    }
    ```

### Mesas
- **Crear/Actualizar mesa**:
    ```json
    {
        "desk_number": 1,
        "capacity": 4
    }
    ```

### Alérgenos
- **Crear/Actualizar alérgeno**:
    ```json
    {
        "allergen_name": "Gluten"
    }
    ```

### Ingredientes
- **Crear/Actualizar ingrediente**:
    ```json
    {
        "ingredient_name": "Tomate",
        "quantity": 10,
        "allergen": [1]
    }
    ```

### Pedidos
- **Crear/Actualizar pedido**:
    ```json
    {
        "desk": 1,
        "date": "2023-10-01",
        "time": "12:00:00",
        "total_price": 20,
        "status": "Pendiente",
        "order_dish": [
            {
                "dish": 1,
                "quantity": 2
            },
            {
                "dish": 2,
                "quantity": 1
            }
        ]
    }
    ```

## Autenticación

Para los endpoints que requieren autenticación, es necesario enviar el token de acceso en el encabezado de la solicitud. Aquí hay un ejemplo de cómo hacerlo:

### Encabezado de Autenticación

```http
Authorization: Bearer <tu_token_de_acceso>
```

### Ejemplo de Solicitud Autenticada

```bash
curl -X GET "http://localhost:8000/api/dishes/" -H "Authorization: Bearer <tu_token_de_acceso>"
```

## WebSockets

### Configuración del Servidor

El servidor de WebSockets está configurado utilizando TypeScript y la biblioteca `socket.io`. La configuración del servidor se encuentra en la carpeta `websocket`.

### Endpoints

El servidor de WebSockets escucha en el puerto `3000` y permite conexiones desde cualquier origen.

### Comunicación

Para comunicarse con el servidor de WebSockets, puedes utilizar la biblioteca `socket.io-client` en el lado del cliente. Aquí hay un ejemplo de cómo conectarse y enviar/recibir mensajes:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
    transports: ["websocket"]
});

socket.on("connect", () => {
    console.log("Conectado al servidor de WebSockets");

    // Enviar un mensaje
    socket.emit("mensaje", { data: "Hola, servidor!" });

    // Escuchar un mensaje
    socket.on("respuesta", (data) => {
        console.log("Respuesta del servidor:", data);
    });
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor de WebSockets");
});
```

### Datos para Enviar

Para enviar datos al servidor de WebSockets, utiliza el método `emit` del socket. Aquí hay un ejemplo de cómo enviar un mensaje:

```javascript
socket.emit("mensaje", { data: "Hola, servidor!" });
```

### Datos para Recibir

Para recibir datos del servidor de WebSockets, utiliza el método `on` del socket. Aquí hay un ejemplo de cómo escuchar un mensaje:

```javascript
socket.on("respuesta", (data) => {
    console.log("Respuesta del servidor:", data);
});
```

## Puntos de Conexión

### Base de Datos
- **Host**: localhost
- **Puerto**: 5432
- **Nombre de la Base de Datos**: admincontroller
- **Usuario**: postgres
- **Contraseña**: admincontroller

### Servidor de Aplicaciones
- **Host**: localhost
- **Puerto**: 8000

### Servidor de WebSockets
- **Host**: localhost
- **Puerto**: 3000

### Eventos de WebSocket
- **order:create**: Crear una nueva orden.
- **order:detail:create**: Crear un nuevo detalle de orden.
- **order:detail:delete**: Eliminar un detalle de orden.
- **order:detail:update**: Actualizar un detalle de orden.
- **order:status:update**: Actualizar el estado de una orden.
- **order:delete**: Eliminar una orden.