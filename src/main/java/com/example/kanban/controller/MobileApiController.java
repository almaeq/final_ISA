package com.example.kanban.controller;

import com.example.kanban.model.Task;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.service.TaskService;
import org.springframework.web.bind.annotation.*;

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
}