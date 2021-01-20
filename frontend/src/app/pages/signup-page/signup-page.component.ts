import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Config } from 'src/app/models/config.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {

  configs: Config[];

  constructor(private taskService: TaskService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.taskService.getConfigs().subscribe((configs: Config[]) => {
      this.configs = configs; 
      
      if (this.configs.length > 0 )
      {
        document.getElementById("pageTitle").innerHTML = '' + this.configs[0].displayName;
      } else {
        document.getElementById("pageTitle").innerHTML = "Task Manager";
      }
    })
  }

  onSignupButtonClicked(email: string, password: string) {
    this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {
      if (res.status === 200) {
        // Signup successful. Go to login page
        this.router.navigate(['/login']);
      }
      
      console.log(res);
    })
  }
}
