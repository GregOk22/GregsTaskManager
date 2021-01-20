# Dev Log

## Steps Taken and Notes
- Create Directories
- Install dependancies (MEAN , Docker)

- Frontend started
  - basic outline and structure of client app is made

- API started
  - basic routes are made (get, post, patch, delete) (CRUD operations pertaining to tasks)
  - Mongoose is utilized to connect to MongoDB 
    - Nice documentation found here: https://mongoosejs.com/docs/guides.html
  - Preparation on connection to frontend is done
  
- Angular frontend upgraded
  - utilizing Bulma framework
  ```
  npm install bulma
  ```
    - Great documenation with helpful pieces of code found here: https://bulma.io/documentation/

- Frontend and API connection
  - Services begin to be created including a service to handle all web requests

- **When encountering problems, I get help and learn from researching similar errors that other people have handled. Slack Overflow is great for this**

- New pages are created in Anglular frontend that help with getting input from the user
```
ng generate component pages/new-task
```
- Categories being created on the left hand sidebar, tasks being created on the right side of the task manager
- Passing more information about categories and tasks from the frontend, through the api, to MongoDB 
  - ex. completion status
  - Testing using Postman: https://www.postman.com/
- User creation 
  - Authentication using JSON Web Tokens
    - User is created and received an id(like most other objects), the id is given a refresh token, which is used to create access token (which grants a user access to their perticular pages).
- Sessions creation
- Code optimization
  - new files are created to handle specifics (ex. an authentication service)
- CRUD operations are improved
  - utilizes items from the headers (id, task id, category id, etc)
    - some credentials are also hashed in the header (helps with sessions and allowing a user to see only their content)
- Frontend updated
  - includes buttons to edit and delete tasks (which send CRUD operation web requests through the api)
  - includes a dropdown box containing buttons to edit and delete categories (dropdown and other buttons created with the help of Bulma and Font Awesome documentation)
- Categories can be updated and deleted smoothly
- More testing completed through Postman and Angular Frontend
- Research and practice on sorting tasks in progress 
