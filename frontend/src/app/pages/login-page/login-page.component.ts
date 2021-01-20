import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { TaskService } from 'src/app/task.service';
import { Config } from 'src/app/models/config.model';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  configs: Config[];

  constructor(private taskService: TaskService, private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.taskService.getConfigs().subscribe((configs: Config[]) => {
      this.configs = configs; 
      
      if (this.configs.length > 0 )
      {
        document.getElementById("pageTitle").innerHTML = '' + this.configs[0].displayName;
        document.getElementById("newToTaskManagerText").innerHTML = '' + this.configs[0].displayName;
      } else {
        document.getElementById("pageTitle").innerHTML = "Task Manager";
      }
    })
  }

  onLoginButtonClicked(email: string, password: string) {
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        // Log in successful. Go to task manager page
        this.router.navigate(['/categories']);
      }
      
      console.log(res);
    })
  }
  
}
