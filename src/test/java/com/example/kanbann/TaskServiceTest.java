package com.example.kanbann;

import com.example.kanban.model.Task;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.repository.TaskRepository;
import com.example.kanban.service.TaskService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void getTasksGroupedByStatus_DeberiaAgruparCorrectamente() {
        // 1. Preparar datos de prueba (Mocks)
        Task t1 = new Task(); t1.setId(1L); t1.setStatus(TaskStatus.TODO);
        Task t2 = new Task(); t2.setId(2L); t2.setStatus(TaskStatus.DOING);
        // Nota: No creamos ninguna tarea DONE para probar que se crea la lista vacía

        when(taskRepository.findAll()).thenReturn(Arrays.asList(t1, t2));

        // 2. Ejecutar el método a probar
        Map<TaskStatus, List<Task>> result = taskService.getTasksGroupedByStatus();

        // 3. Verificaciones (Asserts)
        assertNotNull(result);

        // Debe contener las 3 llaves del Enum, aunque una esté vacía
        assertTrue(result.containsKey(TaskStatus.TODO));
        assertTrue(result.containsKey(TaskStatus.DOING));
        assertTrue(result.containsKey(TaskStatus.DONE));

        // Verificar contenidos
        assertEquals(1, result.get(TaskStatus.TODO).size());
        assertEquals(1, result.get(TaskStatus.DOING).size());
        assertEquals(0, result.get(TaskStatus.DONE).size(), "La lista DONE debería estar vacía pero existir");
    }
}