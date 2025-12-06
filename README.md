# Kanban Board con Spring Boot & HTMX

Una aplicación web de gestión de tareas estilo Kanban, simple y eficiente.  
Permite organizar tareas en columnas de estado (Por hacer, En progreso, Hecho) con funcionalidad de arrastrar y soltar (Drag & Drop), todo gestionado con Java en el backend y renderizado con Thymeleaf y HTMX.

---

## Características

- **Tablero visual:** Tres columnas principales: TODO (Por hacer), DOING (En progreso), DONE (Hecho).
- **Drag & Drop:** Permite mover tareas entre columnas sin recargar la página.
- **Gestión de tareas:**
  - Crear nuevas tareas.
  - Editar título y descripción (edición en línea).
  - Eliminar tareas.
- **Interfaz reactiva:** HTMX permite actualizar solo partes de la vista sin recargar completamente la página.
- **Base de datos en memoria:** Uso de H2 para pruebas y desarrollo rápidos.

---

## Tecnologías Utilizadas

### Backend
- Java 17  
- Spring Boot 3.3.0  
  - Spring Web  
  - Spring Data JPA  
  - Thymeleaf  
- H2 Database (en memoria)  
- Maven  

### Frontend
- Thymeleaf (motor de plantillas)  
- HTMX 1.9.10  
- SortableJS (para Drag & Drop)  
- CSS3  

---

## Instalación y Ejecución

### Prerrequisitos
- Java 17 o superior  
- Maven instalado (o usar `mvnw`)

### Pasos para ejecutar

1. Clonar el repositorio:

```bash
git clone https://github.com/almaeq/final_ISA.git
cd final
```

2. Ejecutar la aplicación:

```bash
./mvnw spring-boot:run
```

3. Acceder a la aplicación:

Abre tu navegador y ve a `http://localhost:23456`.

### Estructura del proyecto

El proyecto está organizado de la siguiente manera:

```bash
src/
├── main/
│   ├── java/com/example/kanban/
│   │   ├── controller/      # Controladores Web (KanbanController)
│   │   ├── model/           # Entidades JPA (Task, TaskStatus)
│   │   ├── repository/      # Interfaces de acceso a datos (TaskRepository)
│   │   ├── service/         # Lógica de negocio (TaskService)
│   │   └── KanbanApplication.java
│   └── resources/
│       ├── static/
│       │   └── style.css    # Estilos CSS
│       ├── templates/
│       │   ├── fragments/   # Componentes reutilizables (tarjetas, formularios)
│       │   └── index.html   # Página principal
│       └── application.properties # Configuración (Puerto, DB H2)
└── pom.xml                  # Dependencias Maven
```

### Endpoints disponibles

| Método | Endpoint                 | Descripción                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | /                         | Página principal                              |
| POST   | /addTask                  | Crear nueva tarea                             |
| PUT    | /api/tasks/{id}/status    | Actualiza el estado al mover una tarjeta      |
| GET    | /editTask/{id}            | Obtiene el formulario de edición (HTMX)       |
| PUT    | /updateTask/{id}          | Guarda los cambios de una tarea               |
| DELETE | /deleteTask/{id}          | Elimina una tarea                             |


#### Notas sobre Persistencia

La aplicación utiliza H2 en modo memoria (mem:testdb).
Esto significa que los datos se perderán al reiniciar la aplicación.

Para habilitar persistencia real, puede configurarse una base de datos como:

H2 en archivo

MySQL

PostgreSQL

Modificando el archivo application.properties.