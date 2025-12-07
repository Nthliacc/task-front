import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface Response {
  content: Task[] | any;
  totalElements: number;
  totalPages: number;
}
interface Task {
  id?: number;
  title: string;
  description: string;
  responsible: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  deadline: string;
  status: 'Em andamento' | 'Concluída';
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private apiUrl = 'http://localhost:8080/api/tasks';
  private usersApiUrl = 'http://localhost:8080/api/auth/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    if (!token) {
      return new HttpHeaders();
    }

    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getTasks(): Observable<Response> {
    const response = this.http.get<Response>(this.apiUrl, { headers: this.getHeaders() });

    return response;
  }

  getResponsiblesTasks(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/users`, {
      headers: this.getHeaders()
    });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}`, task, { headers: this.getHeaders() });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, { headers: this.getHeaders() });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  completeTask(task: Task): Observable<Task> {
    const updatedTask: Task = { ...task, status: 'Concluída' as 'Concluída' };
    return this.updateTask(task.id!, updatedTask);
  }
}
