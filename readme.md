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
    source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
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

Las pruebas se encuentran en el directorio `admincontroller/tests`.

## Endpoints

### Usuarios
- `POST /users/login/` - Inicia sesión de un usuario
- `POST /users/register/` - Registra un nuevo usuario
- `POST /users/logout/` - Cierra sesión de un usuario