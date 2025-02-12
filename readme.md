# Proyecto Capstone - Admin Controller

Este proyecto es una aplicación web desarrollada con Django y Django REST Framework para la gestión de usuarios y platos. Utiliza PostgreSQL como base de datos y Docker para la contenedorización.

## Índice
1. [Requisitos](#requisitos)
2. [Configuración del entorno](#configuración-del-entorno)
3. [Crear la base de datos con Docker](#crear-la-base-de-datos-con-docker)
4. [Ingreso a base de datos por Docker](#ingreso-a-base-de-datos-por-docker)
5. [Hacer migraciones en la base de datos](#hacer-migraciones-en-la-base-de-datos)
6. [Ejecutar pruebas](#ejecutar-pruebas)
7. [Endpoints](#endpoints)
8. [Datos para solicitudes](#datos-para-solicitudes)

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

Las pruebas se encuentran en el directorio `admincontroller/authAPI/tests.py` y en `admincontroller/dishesAPI/tests.py`.

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
        "dish": [1, 2],
        "desk": 1,
        "date": "2023-10-01",
        "time": "12:00:00",
        "total_price": 20,
        "status": "Pendiente"
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