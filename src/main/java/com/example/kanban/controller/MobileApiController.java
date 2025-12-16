package com.example.kanban.controller;

import com.example.kanban.model.Task;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.service.TaskService;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

import java.util.List;

@RestController
@RequestMapping("/api/mobile")
@CrossOrigin(origins = "*") // Importante: Permite que Ionic se conecte
public class MobileApiController {

    private final TaskService taskService;

    public MobileApiController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/tasks")
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @PostMapping("/tasks")
    public Task createTask(@RequestBody Task task) {
        taskService.addTask(task);
        return task;
    }

    @PutMapping("/tasks/{id}/status")
    public void updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        taskService.updateTaskStatus(id, status);
    }

    @DeleteMapping("/tasks/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    // 2. ESTRATEGIA PERFORMANCE (Simulando "Contacts" o Configuracion)
    // Datos que casi nunca cambian. Cacheamos por 7 dias.
    @GetMapping("/config")
    public Map<String, String> getAppConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("version", "1.0.0");
        config.put("theme", "dark");
        config.put("maintenance", "false");
        return config;
    }

    // 3. ESTRATEGIA SIN CACHE (Simulando "Users" o Estado del Servidor)
    // Datos que siempre deben ser reales. Nunca cachear.
    @GetMapping("/status")
    public Map<String, Object> getServerStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("online", true);
        status.put("serverTime", System.currentTimeMillis()); // Cambia cada milisegundo
        return status;
    }
}