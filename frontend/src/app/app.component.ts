import { Component, OnInit } from '@angular/core';
import { Config } from './models/config.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  configs: Config[];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getConfigs().subscribe((configs: Config[]) => {
      this.configs = configs; 
      
      // When no color code is specified (field is left empty), default is used (specified in main-styles.scss)
      if (this.configs.length > 0 )
      {
        document.body.style.backgroundColor = '' + this.configs[0].colorCode;
      }
    })
  }
}