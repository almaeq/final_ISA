import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface Task {
  id?: number;
  title: string;
  description: string;
  status: 'TODO' | 'DOING' | 'DONE';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // URL basada en tu application.properties (puerto 23456) y MobileApiController
  private apiUrl = 'http://localhost:23456/api/mobile/tasks'; 

  // DATOS DE PRUEBA para ver "cómo anda sin conexión" si es la primera vez
  private dummyTasks: Task[] = [
    { title: 'Tarea Offline 1', description: 'Esta tarea se ve sin internet', status: 'TODO' },
    { title: 'Tarea Offline 2', description: 'Datos cacheados localmente', status: 'DOING' },
    { title: 'Finalizar PWA', description: 'Requisito del práctico', status: 'DONE' }
  ];

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl).pipe(
      tap(tasks => {
        // 1. Si hay conexión, guardamos los datos reales en LocalStorage
        console.log('Conexión exitosa, guardando datos...');
        localStorage.setItem('offline_tasks', JSON.stringify(tasks));
      }),
      catchError(error => {
        // 2. Si NO hay conexión, cargamos lo guardado o los datos falsos
        console.log('Sin conexión. Cargando datos offline...');
        const stored = localStorage.getItem('offline_tasks');
        if (stored) {
          return of(JSON.parse(stored));
        }
        // 3. Si no hay nada guardado, devolvemos los datos dummy para mostrar que la UI funciona
        return of(this.dummyTasks);
      })
    );
  }
}