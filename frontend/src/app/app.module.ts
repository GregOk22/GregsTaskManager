import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './pages/task-view/task-view.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NewCategoryComponent } from './pages/new-category/new-category.component';
import { NewTaskComponent } from './pages/new-task/new-task.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { WebReqInterceptor } from './web-req.interceptor';
import { SignupPageComponent } from './pages/signup-page/signup-page.component';
import { EditCategoryComponent } from './pages/edit-category/edit-category.component';
import { EditTaskComponent } from './pages/edit-task/edit-task.component';
import { EditConfigComponent } from './pages/edit-config/edit-config.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    NewCategoryComponent,
    NewTaskComponent,
    LoginPageComponent,
    SignupPageComponent,
    EditCategoryComponent,
    EditTaskComponent,
    EditConfigComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: WebReqInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
