import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService } from '../tasks.service';
import { AuthService } from '../auth.service';

interface Task {
  id?: number;
  title: string;
  description: string;
  responsible: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  deadline: string;
  status: 'Em andamento' | 'Concluída';
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  filters = {
    id: '',
    title: '',
    responsible: '',
    status: ''
  };

  isModalOpen = false;

  isAnyFilterActive= false;

  editingTask = false;

  clearFilters(): void {
    this.filters = {
      id: '',
      title: '',
      responsible: '',
      status: ''
    };
    this.applyFilters();
  }

  currentTask: Task = {
    title: '',
    description: '',
    responsible: '',
    priority: 'Baixa',
    deadline: '',
    status: 'Em andamento'
  };

  responsibles: String[] = [];

  isDropdownOpen = false;

  priorityOptions = [
    { label: 'ALTA' },
    {  label: 'MÉDIA' },
    { label: 'BAIXA' }
  ];

  errorMessage: string | null = null;
  pageSize = 10;
  limit = 10;
  totalItems = 0;
  totalPages = 0;
  currentPage: number = 1;

  constructor(
    private tasksService: TasksService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTasks();
    this.tasksService.getResponsiblesTasks().subscribe({
      next: (responsibles) => {
        console.log(responsibles)
        this.responsibles = responsibles;
      },
      error: (err) => console.error('Erro ao carregar responsáveis', err)
    });
  }

  loadTasks(): void {
    this.tasksService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.content;
        this.totalItems = tasks.totalElements;
        this.totalPages = tasks.totalPages;

        this.applyFilters();
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        if (err.status === 0) {
          // Erro de CORS ou conexão
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
        } else {
          this.errorMessage = 'Erro ao carregar tarefas.';
        }
      }
    });
  }

  applyFilters(): void {
    let filtered = this.tasks;

    if (this.filters.id) {
      filtered = filtered.filter(task => task.id?.toString() === this.filters.id);
    }
    if (this.filters.title) {
      const lowerCaseFilter = this.filters.title.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(lowerCaseFilter) ||
        task.description.toLowerCase().includes(lowerCaseFilter)
      );
    }
    if (this.filters.responsible) {
      filtered = filtered.filter(task => task.responsible === this.filters.responsible);
    }
    if (this.filters.status) {
      filtered = filtered.filter(task => task.status === this.filters.status);
    }
    this.isAnyFilterActive = !!(this.filters.id || this.filters.title || this.filters.responsible || this.filters.status);

    this.filteredTasks = filtered;
  }

  openCreateTaskModal(): void {
    this.isModalOpen = true;
    this.editingTask = false;
    // Garanta que os valores padrão estejam corretos
    this.currentTask = { title: '', description: '', responsible: '', priority: 'Média', deadline: '', status: 'Em andamento' };
  }

  openEditTaskModal(task: Task): void {
    this.isModalOpen = true;
    this.editingTask = true;
    this.currentTask = { ...task };
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  saveTask(): void {
    const priority = this.currentTask.priority.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase() as 'Alta' | 'Média' | 'Baixa';

    const formattedTask: Task = {
      ...this.currentTask,
      priority: priority
    };
    if (this.editingTask) {
      this.tasksService.updateTask(this.currentTask.id!, formattedTask).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao editar a tarefa', err)
      });
    } else {
      if (!formattedTask.status) {
        formattedTask.status = 'Em andamento';
      }
      this.tasksService.createTask(formattedTask).subscribe({
        next: () => {
          this.loadTasks();
          this.closeModal();
        },
        error: (err) => console.error('Erro ao criar a tarefa', err)
      });
    }
  }

  deleteTask(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.tasksService.deleteTask(id).subscribe({
        next: () => this.loadTasks(),
        error: (err) => console.error('Erro ao excluir a tarefa', err)
      });
    }
  }

  completeTask(task: Task): void {
    const updatedTask = { ...task, status: 'Concluída' as 'Concluída' };
    this.tasksService.updateTask(task.id!, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erro ao concluir a tarefa', err)
    });
  }

  reopenTask(task: Task): void {
    const updatedTask = { ...task, status: 'Em andamento' as 'Em andamento' };
    this.tasksService.updateTask(task.id!, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Erro ao reabrir a tarefa', err)
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: any) {
    this.currentTask.priority = option.label;
    this.isDropdownOpen = false;
  }

  getPriorityClass(priority: string) {
    switch (priority) {
      case 'ALTA':
        return 'dot-high';
      case 'MÉDIA':
        return 'dot-medium';
      case 'BAIXA':
        return 'dot-low';
      default:
        return '';
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadTasks();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadTasks();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEsc(event: Event) {
    const keyEvent = event as KeyboardEvent;

    if (keyEvent.key === 'Escape') {
      this.closeModal();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const dropdown = document.querySelector('.custom-select');

    if (this.isDropdownOpen && dropdown && !dropdown.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }
}

