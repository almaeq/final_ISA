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
  ],
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
      },
    });
  }
}
