import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  constructor(private taskService: TaskService, private router: Router) { }

  ngOnInit(): void {
  }

  createCategory(title: string) {
    this.taskService.createCategory(title).subscribe((category: Category) => {
      console.log(category);
      //navigate to /categories/category._id
      this.router.navigate([ '/categories', category._id ])
    });
  }

}
