import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-config',
  templateUrl: './edit-config.component.html',
  styleUrls: ['./edit-config.component.scss']
})
export class EditConfigComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  displayName: string;
  colorCode: string;

  ngOnInit(): void {
  }

  updateConfig(displayName: string, colorCode: string) {
    this.taskService.updateConfig(displayName, colorCode).subscribe(() => {
      this.router.navigate(['/configs']);
    })
  }

}
