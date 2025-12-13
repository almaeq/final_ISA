import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {
  // URL de tu backend (Docker o Local)
  // Si pruebas en el navegador: http://localhost:23456
  // Si pruebas en Android emulador: http://10.0.2.2:23456
  apiUrl = 'http://localhost:23456/api/mobile'; 

  tasks: any[] = [];
  newTaskTitle: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.http.get<any[]>(`${this.apiUrl}/tasks`).subscribe(data => {
      this.tasks = data;
    });
  }

  addTask() {
    if (!this.newTaskTitle) return;
    const task = { title: this.newTaskTitle, description: '', status: 'TODO' };
    this.http.post(`${this.apiUrl}/tasks`, task).subscribe(() => {
      this.newTaskTitle = '';
      this.loadTasks();
    });
  }

  moveTask(task: any) {
    let nextStatus = 'TODO';
    if (task.status === 'TODO') nextStatus = 'DOING';
    else if (task.status === 'DOING') nextStatus = 'DONE';
    else return; // Ya está en DONE

    this.http.put(`${this.apiUrl}/tasks/${task.id}/status?status=${nextStatus}`, {})
      .subscribe(() => this.loadTasks());
  }
}