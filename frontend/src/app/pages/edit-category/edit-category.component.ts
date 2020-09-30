import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private router: Router) { }

  categoryId: string;

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.categoryId = params.categoryId;
      }
    )
  }

  updateCategory(title: string) {
    this.taskService.updateCategory(this.categoryId, title).subscribe(() => {
      this.router.navigate(['/categories', this.categoryId]);
    })
  }
}
