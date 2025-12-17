package com.example.kanbann;


import com.example.kanban.KanbanApplication;
import com.example.kanban.controller.KanbanController;
import com.example.kanban.model.Task;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(KanbanController.class)
@ContextConfiguration(classes = KanbanApplication.class)
class KanbanControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskService taskService;

    @Test
    void index_DeberiaCargarPaginaPrincipal() throws Exception {
        // 1. Preparamos el mock del servicio para que no devuelva null
        Map<TaskStatus, List<Task>> mapaVacio = new HashMap<>();
        mapaVacio.put(TaskStatus.TODO, new ArrayList<>());
        when(taskService.getTasksGroupedByStatus()).thenReturn(mapaVacio);

        // 2. Hacemos la petición GET a la raíz "/"
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())             // Esperamos código 200 OK
                .andExpect(view().name("index"))        // Esperamos que cargue la plantilla "index.html"
                .andExpect(model().attributeExists("tasksByStatus")) // Verificamos que se pasaron los datos
                .andExpect(model().attributeExists("newTask"));      // Verificamos que se pasó el objeto para el formulario
    }

    @Test
    void addTask_DeberiaGuardarYRedireccionar() throws Exception {
        // 1. Simulamos el envío de un formulario (POST)
        mockMvc.perform(post("/addTask")
                        .flashAttr("task", new Task())) // @ModelAttribute simula los datos del formulario
                .andExpect(status().is3xxRedirection()) // Esperamos una redirección (302)
                .andExpect(redirectedUrl("/"));         // Esperamos que vuelva al inicio

        // 2. Verificamos que el controlador llamó al servicio
        verify(taskService).addTask(any(Task.class));
    }

    @Test
    void updateStatusApi_DeberiaFuncionarConHTMX() throws Exception {
        // Probamos el endpoint PUT que usa HTMX
        Long taskId = 1L;
        TaskStatus newStatus = TaskStatus.DONE;

        mockMvc.perform(put("/api/tasks/" + taskId + "/status")
                        .param("status", newStatus.name()))
                .andExpect(status().isOk()); // Esperamos 200 OK (sin redirección, porque es API/HTMX)

        // Verificamos que se llamó a updateTaskStatus
        verify(taskService).updateTaskStatus(taskId, newStatus);
    }
}