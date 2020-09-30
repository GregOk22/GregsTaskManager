<img src="assets/logo.png" alt="Greg's Task Manager Logo" width="700"/>

#

 Welcome to Greg's Task Manager! This application was created in response to the CLARK Take Home Interview Project. For more information, click [here](https://github.com/Cyber4All/join-the-team).
 
 <img src="assets/frontpage.gif" alt="Greg's Task Manager Logo" width="700"/>
 
## Contents
- [Prerequisites](#Prerequisites)
- [How It Works](#How-It-Works)
- [How To Start](#How-To-Start)

## Prerequisites

This application was create using the MEAN stack (**MongoDB**, **Express**, **Angular**, **Node.js**). Information on installing Node on your machine and starting an instnace of MongoDB through **Docker** can be found [here](https://github.com/Cyber4All/join-the-team/#setup). 

## How It Works

The application first authenticates a user then redirects them to the task manager. The following operations can be performed:
- Create a user
- Authenticate a user
- Maintain sessions through the use of JSON Web Tokens
- Create a task
- Rename a task
- Mark a task as complete
- Delete a task
- Create a category
- Rename a category
- Add a task to a category
- Delete a task from a category

<img src="assets/TaskManagerScreenshot.png" alt="Greg's Task Manager Logo" width="700"/>

The following operations can not be performed yet:
- Sort tasks by the date they were created
- Sort tasks by whether they are completed or not

## How To Start

The application can be used by following these steps:
1. Run the container on Docker Desktop to start a MongoDB instance
2. Run the following command in the api folder to start the api and connect it to MongoDB:
```
nodemon app.js
```
3. Run the following command in the frontend folder to start the Angular app:
```
ng serve
```
4. Open localhost:4200 in a web browser to access Greg's Task Manager

