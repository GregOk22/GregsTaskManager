import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';
import { CommonModule } from "@angular/common";
import { BrowserModule } from '@angular/platform-browser'
import { Task } from 'src/app/models/task.model';
import { Category } from 'src/app/models/category.model';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss']
})
export class TaskViewComponent implements OnInit {

  categories: Category[];
  tasks: Task[];

  selectedCategoryId: string;

  constructor(private taskService: TaskService, private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        if (params.categoryId) {
          this.selectedCategoryId = params.categoryId;

          this.taskService.getTasks(params.categoryId).subscribe((tasks: Task[]) => {
            this.tasks = tasks;
          })
        } else {
          this.tasks = undefined;
        }

      }
    )

    this.taskService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories; 
    })

    
    // Refreshes page once this page opens (to ensure all tasks are displayed)
    if( window.localStorage )
    {
      if( !localStorage.getItem('firstLoad') )
      {
        localStorage['firstLoad'] = true;
        window.location.reload();
      }  
      else {
        localStorage.removeItem('firstLoad');
      }
    }


  }


/*
  tasks.sort(function(obj1, obj2) {
    return 
  });
*/

  // Each click actually changes status

  onTaskClick(task: Task) {
    // set task to complete
    this.taskService.complete(task).subscribe(() => {
      console.log("Completion change successful!");
      task.completed = !task.completed;
    })
  }

  onHighPriorityTaskClick(task: Task) {
    // set task to high priority
    this.taskService.setHighPriority(task).subscribe(() => {
      console.log("High Priority change successful!");
      task.highPriority = !task.highPriority;
    })

    // change task completion status back
    this.taskService.complete(task).subscribe(() => {
      console.log("Completion change successful!");
      task.completed = !task.completed;
    })
  }

  onDeleteCategoryClick() {
    this.taskService.deleteCategory(this.selectedCategoryId).subscribe((res: any) => {
      this.router.navigate(['/categories']);
      console.log(res);
    })
  }

  onDeleteTaskClick(id: string) {
    this.taskService.deleteTask(this.selectedCategoryId, id).subscribe((res: any) => {
      this.tasks = this.tasks.filter(val => val._id !== id);
      console.log(res);
    })
  }

  onLogoutClick() {
    this.authService.logout();
  }

  onSortCompletedClick() {
    this.tasks.sort(function(a,b) {
      return (a.completed === b.completed)? 0 : a.completed? -1 : 1;
    });
  }

  onSortPriorityClick() {
    this.tasks.sort(function(a,b) {
      return (a.highPriority === b.highPriority)? 0 : a.highPriority? -1 : 1;
    });
  }
}