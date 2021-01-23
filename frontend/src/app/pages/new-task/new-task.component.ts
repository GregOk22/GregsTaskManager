import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private authService: AuthService, private taskService: TaskService, private route: ActivatedRoute, private router: Router) { }

  categoryId: string;

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.categoryId = params[`categoryId`];

        document.forms.namedItem("newTaskForm").action = `http://localhost:3000/categories/${this.categoryId}/tasks`;

        /*
        // set "header" values so that api can catch these values (since no actual header is being sent)
        document.forms.namedItem("x-access-token").nodeValue = this.authService.getAccessToken();
        document.forms.namedItem("x-refresh-token").nodeValue = this.authService.getRefreshToken();
        document.forms.namedItem("user-id").nodeValue = this.authService.getUserId();
        */
      }
    )
  }

  redirectToCategory() {
    /*
    var myHeaders = new Headers();
    myHeaders.set('x-access-token', `${this.authService.getAccessToken}`);
    */

    // set "header" values so that api can catch these values (since no actual header is being sent)
    //document.forms.namedItem("x-access-token").nodeValue = this.authService.getAccessToken();
    //document.forms.namedItem("x-refresh-token").nodeValue = this.authService.getRefreshToken();
    //document.forms.namedItem("user-id").nodeValue = this.authService.getUserId();

    //this.router.navigate(['../'], { relativeTo: this.route });
  }

  createTask(title: string) {
    this.taskService.createTask(title, this.categoryId).subscribe((newTask: Task) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }
}
