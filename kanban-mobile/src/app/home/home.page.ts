import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- Necesario para *ngFor
import { IonicModule } from '@ionic/angular'; // <--- Necesario para todos los componentes ion-*
import { Task, TaskService } from '../services/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, // Indica que es un componente moderno
  imports: [IonicModule, CommonModule] // <--- ¡AQUÍ ESTÁ LA SOLUCIÓN!
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  isOffline: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks(event?: any) {
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks = data;
        if (event) event.target.complete();
      },
      error: (err) => {
        console.log('Error o modo offline', err);
        if (event) event.target.complete();
      }
    });
  }
}