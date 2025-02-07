# Crear la base de datos por Docker
Para poder iniciar una instancia de PostgreSQL en el Docker, se debe ejecutar el siguiente comando:
```
docker-compose up
```

Esta base de datos va a iniciar en el puerto `5432` donde el mismo se podrá referenciar, también si se ejecuta en el mismo servicio que el el host va a ser `localhost`

Para bajar la base de datos y desactivarla se debe ejecutar el siguiente comando:
```
docker-compose down
```

Y asi se bajaría el servicio de la base de datos relacional para este proyecto.

# Ingreso a base de datos por Docker
Para ingresar a la base de datos de manera visual, se pudra usar el adminer que igual se ejecuta con el `docker-compose` donde se necesita ingresar con las credenciales de la base de datos del PostgreSQL donde se tendrá que iniciar scion en la siguiente URL [localhost](http://localhost:8080)

Recuerde poner lo siguiente:
```
Motor de base de datos: PostgreSQL
servidor: db
Usuario: postgres
Contraseña: Contraseña de la base de datos
Base de datos: Nombre de la base de datos
```

# Hacer migraciones en la base de datos
Para realizar la migración de la base de datos, hay que realizar lo siguiente:
1. Se abre la terminal del proyecto
2. Se ingresa al `root` del proyecto `admincontroller`
3. Se ingresa el comando `python manage.py makemigrations`
4. Si sale la respuesta: `No changes detected` puede realizar el siguiente paso
5. Se ingresa el comando `python manage.py migrate`
6. Ahi estaría ya completas las migraciones de la base de datos en nuestro docker con PostreSQL