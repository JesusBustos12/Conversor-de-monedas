# CurrencyHub - Portafolio Full-Stack

## Descripción
**CurrencyHub** es una aplicación web full-stack que permite a los usuarios realizar conversiones de divisas y mantener un historial detallado de sus operaciones.  

El proyecto cuenta con un sistema completo de autenticación de usuarios y una interfaz moderna y responsiva. Fue diseñado siguiendo un enfoque monolítico pero modular, separando claramente el frontend y el backend para facilitar su mantenimiento.

Perfecto para demostrar habilidades full-stack reales en un portafolio profesional.

## Objetivo
Como desarrollador autodidacta, creé este proyecto para:

- Mostrar dominio completo de **Node.js + Express** en el backend.
- Implementar una base de datos relacional con **MySQL** para el almacenamiento de usuarios e historial.
- Desarrollar un sistema de autenticación seguro utilizando **JWT (JSON Web Tokens)** y hashing de contraseñas con **bcryptjs**.
- Crear una interfaz interactiva y dinámica utilizando **JavaScript vanilla** (sin frameworks pesados) y **CSS puro**.
- Demostrar habilidades en DevOps mediante la containerización completa del proyecto con **Docker** y **Docker Compose**.
- Aplicar buenas prácticas de seguridad: Headers seguros con **Helmet**, limitación de peticiones con **Rate Limiting** y gestión de variables de entorno.

## Características
- **Autenticación Segura**: Registro e inicio de sesión de usuarios con tokens JWT.
- **Conversión de Divisas**: Cálculo preciso de conversiones monetarias.
- **Historial de Operaciones**: Cada usuario puede ver su historial de conversiones guardado en la base de datos.
- **Diseño Moderno y Responsive**: Interfaz cuidada y adaptable a dispositivos móviles, tablets y escritorio.
- **Seguridad Robusta**: Implementación de Helmet, Rate Limiting para evitar ataques de fuerza bruta y CORS restringido.
- **Dockerizado**: Listo para levantarse con un solo comando incluyendo la base de datos y un proxy inverso (Nginx).

## Tecnologías utilizadas
- **Backend**: Node.js + Express.
- **Base de Datos**: MySQL (manejado con `mysql2`).
- **Frontend**: HTML5, CSS3 puro y JavaScript vanilla (empaquetado con **Vite**).
- **Seguridad**: JWT, bcryptjs, Helmet, Express-rate-limit.
- **DevOps**: Docker, Docker Compose, Nginx.
- **Vercel**: Configuración lista para despliegue en Vercel (opcional).

## Estructura del proyecto
```text
Conversor de monedas/
├── app.js                    # Punto de entrada del servidor Express
├── package.json              # Scripts raíz para gestión del proyecto
├── Dockerfile                # Configuración de Docker para la app
├── docker-compose.yml        # Orquestación de contenedores (App, MySQL, Nginx)
├── setup_mysql_pro.sql       # Script de inicialización de la base de datos
├── vercel.json               # Configuración para despliegue en Vercel
├── frontend/                 # Código del cliente
│   ├── index.html            # Página principal
│   ├── vite.config.js        # Configuración de Vite
│   └── src/
│       ├── css/              # Estilos de la aplicación
│       └── js/               # Lógica (main.js, ui.js, api.js, auth.js)
├── server/                   # Código del servidor
│   └── src/
│       ├── app.js            # Configuración de Express, middlewares y rutas
│       ├── routes/           # Endpoints de API (auth, history, user)
│       └── middleware/       # Middlewares de seguridad y validación
└── Nginx/                    # Configuración del servidor Nginx
```

## Habilidades demostradas
Este proyecto refleja competencias reales de un Junior Full-Stack listo para aportar valor:

- **Backend sólido**: Rutas seguras, manejo de errores estructurado, conexión a base de datos y orquestación de servicios.
- **Seguridad y buenas prácticas**: Uso de JWT, hashing de contraseñas, protección contra ataques comunes y logs estructurados.
- **Frontend limpio**: Manipulación del DOM, comunicación asíncrona con la API (`fetch`), diseño modular sin depender de frameworks complejos.
- **DevOps Inicial**: Uso de Docker para asegurar que la aplicación funcione en cualquier entorno y configuración de Nginx.

## Demo en vivo
*(Próximamente disponible / Enlace a desplegar)*

## Notas para empleadores y Clientes
Este proyecto demuestra mi capacidad para construir una aplicación completa desde cero, preocupándome tanto por la seguridad y la infraestructura en el backend como por la usabilidad y el diseño en el frontend.

Estoy 100% listo para aportar valor real en un equipo como **Junior Full-Stack Developer**.

---

## Contacto
- **GitHub**: [github.com/JesusBustos12](https://github.com/JesusBustos12)
- **LinkedIn**: [linkedin.com/in/jesus-bustos-arizmendi-325329283](https://linkedin.com/in/jesus-bustos-arizmendi-325329283)
- **Correo**: jesusbustosarizmendi0@gmail.com
- **Celular/WhatsApp**: +52 762 119 2732

¡Gracias por revisar mi trabajo! 🚀
