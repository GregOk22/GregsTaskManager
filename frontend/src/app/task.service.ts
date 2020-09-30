import { Injectable } from '@angular/core';
import { Task } from './models/task.model';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private webReqService: WebRequestService) { }


  // Sends web requests for CRUD operations
  // Categories
  getCategories() {
    return this.webReqService.get('categories');
  }

  createCategory(title: string ) {
    return this.webReqService.post('categories', { title }); 
  }

  updateCategory(id: string, title: string ) {
    return this.webReqService.patch(`categories/${id}`, { title }); 
  }

  deleteCategory(id: string ) {
    return this.webReqService.delete(`categories/${id}`);
  }


  // Tasks
  getTasks(categoryId: string) {
    return this.webReqService.get(`categories/${categoryId}/tasks`)
  }

  createTask(title: string, categoryId: string ) {
    return this.webReqService.post(`categories/${categoryId}/tasks`, { title }); 
  }

  updateTask(categoryId: string, taskId: string, title: string ) {
    return this.webReqService.patch(`categories/${categoryId}/tasks/${taskId}`, { title }); 
  }

  deleteTask(categoryId: string, taskId: string ) {
    return this.webReqService.delete(`categories/${categoryId}/tasks/${taskId}`);
  }


  complete(task: Task) {
    return this.webReqService.patch(`categories/${task._categoryId}/tasks/${task._id}`, {
      completed: !task.completed
    });
  }

}
