import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonBadge,
  IonButton, // <--- Agrega este si quieres botones de prueba
  IonIcon
} from '@ionic/angular/standalone';

import { Task, TaskService } from '../services/task';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,

    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonText,
    IonList,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonButton
  ],
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  isOffline: boolean = false;
  appConfig: any = null;      // Para Performance 
  serverStatus: any = null;   // Para Sin Caché 

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadAllData(event?: any) {
    this.loadTasks();
    this.loadConfig(); // Performance
    this.loadStatus(); // Sin Cache
    if (event) {
      setTimeout(() => event.target.complete(), 1000);
    }
  }

  loadTasks() {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.log('Error tasks', err)
    });
  }

  // 2. PERFORMANCE (Simulando Contacts)
  loadConfig() {
    this.taskService.getAppConfig().subscribe({
      next: (data) => {
        console.log('Config cargada (Performance)');
        this.appConfig = data;
      }
    });
  }

  // 3. SIN CACHE (Simulando Users)
  loadStatus() {
    this.serverStatus = null; // Limpiamos para ver el efecto de carga
    this.taskService.getServerStatus().subscribe({
      next: (data) => {
        console.log('Status fresco de red');
        this.serverStatus = data;
      },
      error: (err) => {
        console.log('Error de red (Status no disponible offline)');
        this.serverStatus = { error: 'Offline' };
      }
    });
  }
}