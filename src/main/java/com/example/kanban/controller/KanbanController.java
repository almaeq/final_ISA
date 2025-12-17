package com.example.kanban.controller;

import com.example.kanban.model.Task;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.service.TaskService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@Controller
public class KanbanController {
    private final TaskService taskService;

    public KanbanController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/")
    public String index(Model model) {
        Map<TaskStatus, java.util.List<Task>> original = taskService.getTasksGroupedByStatus();
        java.util.Map<String, java.util.List<Task>> stringMap = new java.util.HashMap<>();
        original.forEach((k, v) -> stringMap.put(k.name(), v));

        model.addAttribute("tasksByStatus", stringMap);
        model.addAttribute("newTask", new Task());
        return "index";
    }

    @PostMapping("/addTask")
    public String addTask(@ModelAttribute Task task) {
        taskService.addTask(task);
        return "redirect:/";
    }

    @PostMapping("/updateStatus/{id}")
    public String updateStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        taskService.updateTaskStatus(id, status);
        return "redirect:/"; // For non-HTMX
    }

    // HTMX Endpoint to move tasks
    @PutMapping("/api/tasks/{id}/status")
    @ResponseBody
    public void updateTaskStatusApi(@PathVariable Long id, @RequestParam TaskStatus status) {
        taskService.updateTaskStatus(id, status);
    }

    @DeleteMapping("/deleteTask/{id}")
    @ResponseBody
    public void deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
    }

    @GetMapping("/editTask/{id}")
    public String editTask(@PathVariable Long id, Model model) {
        Task task = taskService.getAllTasks().stream()
                .filter(t -> t.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid task Id:" + id));
        model.addAttribute("task", task);
        return "fragments/task-edit :: editForm(task=${task})";
    }

    @PutMapping("/updateTask/{id}")
    public String updateTask(@PathVariable Long id, @RequestParam String title, @RequestParam String description,
            Model model) {
        taskService.updateTask(id, title, description);
        Task task = taskService.getAllTasks().stream()
                .filter(t -> t.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid task Id:" + id));
        model.addAttribute("task", task);
        return "fragments/task-card :: card(t=${task})";
    }
}
