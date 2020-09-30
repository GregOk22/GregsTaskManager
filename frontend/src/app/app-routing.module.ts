import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { NewCategoryComponent } from './pages/new-category/new-category.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';

const routes: Routes = [
  {path: '', redirectTo: 'categories', pathMatch: 'full'},
  {path: 'login', component: LoginPageComponent},
  {path: 'signup', component: SignupPageComponent},
  {path: 'new-category', component: NewCategoryComponent},
  {path: 'edit-category/:categoryId', component: EditCategoryComponent},
  {path: 'categories/:categoryId/edit-task/:taskId', component: EditTaskComponent},
  {path: 'categories', component: TaskViewComponent},
  {path: 'categories/:categoryId', component: TaskViewComponent},
  {path: 'categories/:categoryId/new-task', component: NewTaskComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
