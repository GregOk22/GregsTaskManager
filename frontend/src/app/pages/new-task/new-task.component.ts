import { ThrowStmt } from '@angular/compiler';
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
      }
    )
  }

  submitForm() {
    // add header to request and submit
    var form = document.forms.namedItem("newTaskForm");
    var formData = new FormData(form);
    var request = new XMLHttpRequest();
    const token = this.authService.getAccessToken();
    request.open("POST", `http://localhost:3000/categories/${this.categoryId}/tasks`);
    request.setRequestHeader('x-access-token', token);
    request.send(formData);
    this.router.navigateByUrl(`categories/${this.categoryId}`);
  }

  /* used to send raw JSON data through web request service via task service
  createTask(title: string) {
    this.taskService.createTask(title, this.categoryId).subscribe((newTask: Task) => {
      this.router.navigate(['../'], { relativeTo: this.route });
    })
  }
  */
}
