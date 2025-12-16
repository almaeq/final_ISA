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
  // Simplemente hacemos la petición.
  // Si el Service Worker funciona, él interceptará esto cuando estés offline
  // y devolverá los datos guardados en SU propia base de datos (Cache Storage/IndexedDB).
  return this.http.get<Task[]>(this.apiUrl); 
  
  /* COMENTA TODO ESTO TEMPORALMENTE:
  .pipe(
    tap(tasks => {
      localStorage.setItem('offline_tasks', JSON.stringify(tasks));
    }),
    catchError(error => {
      const stored = localStorage.getItem('offline_tasks');
      if (stored) {
        return of(JSON.parse(stored));
      }
      return of(this.dummyTasks);
    })
  );
  */
}
  getAppConfig() {
  // Estrategia Performance: Debería cargar instantáneo la segunda vez, incluso sin red
  return this.http.get('http://localhost:23456/api/mobile/config');
}

getServerStatus() {
  // Estrategia Sin Caché: Siempre debería fallar si no hay red
  return this.http.get('http://localhost:23456/api/mobile/status');
}
}