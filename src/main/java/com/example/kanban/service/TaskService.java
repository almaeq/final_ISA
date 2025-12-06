package com.example.kanban.service;

import com.example.kanban.model.Task;
import com.example.kanban.model.TaskStatus;
import com.example.kanban.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Map<TaskStatus, List<Task>> getTasksGroupedByStatus() {
        Map<TaskStatus, List<Task>> map = taskRepository.findAll().stream()
                .collect(Collectors.groupingBy(Task::getStatus));

        for (TaskStatus status : TaskStatus.values()) {
            map.putIfAbsent(status, new ArrayList<>());
        }
        return map;
    }

    public void addTask(Task task) {
        taskRepository.save(task);
    }

    public void updateTaskStatus(Long id, TaskStatus status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid task Id:" + id));
        task.setStatus(status);
        taskRepository.save(task);
    }

    public void updateTask(Long id, String title, String description) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid task Id:" + id));
        task.setTitle(title);
        task.setDescription(description);
        taskRepository.save(task);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
