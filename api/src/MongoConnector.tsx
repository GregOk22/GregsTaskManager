import { MongoClient, Collection, ObjectID } from "mongodb";

export class MongoDriver {
  tasks: Collection;
  categories: Collection;

  constructor(private client: MongoClient) {
    this.tasks = client.db('task-service').collection('tasks');
    this.categories = client.db('task-service').collection('categories');
  }

  /**
   * Destroy connection to the database
   *
   * @memberof MongoDriver
   */
  disconnect() {
    this.client.close();
  }

  /**
   * Inserts a given task into the database
   *
   * @param {*} task to be inserted into the database
   * @returns
   * @memberof MongoDriver
   */
  async createTask(task) {
    const res = await this.tasks.insertOne(task);
    return res.insertedId.toHexString().toString();
  }

  /**
   * Retrieves a task from the database
   *
   * @param {string} id of the task to retrieve
   * @returns
   * @memberof MongoDriver
   */
  async readTask(id: string) {
    const task = await this.tasks.findOne({ _id: new ObjectID(id) });
    return task;
  }

  /**
   * Modifies a task in the database by overwriting it with the given task
   *
   * @param {*} task the task to modify, must contain an id representing a task that currently exists in the database
   * @memberof MongoDriver
   */
  async updateTask(task) {
    await this.tasks.updateOne({ _id: new ObjectID(task._id) }, { $set: { ...task }});
  }

  /**
   * Lists all tasks in the database
   *
   * @returns
   * @memberof MongoDriver
   */
  async listTasks() {
    const tasks = await this.tasks.find({}).toArray();
    return tasks;
  }

  /**
   * Deletes a task
   *
   * @param {*} id of the task to delete
   * @memberof MongoDriver
   */
  async deleteTask(id) {
    await this.tasks.deleteOne({ _id: new ObjectID(id) });
  }

  /**
   * Crates a new category in the database
   *
   * @param {string} name the name of the new category
   * @returns
   * @memberof MongoDriver
   */
  async createCategory(name: string) {
    const response = await this.categories.insertOne({ name });
    return response.insertedId.toHexString().toString();
  }

  /**
   * Lists all categories in the database
   *
   * @returns
   * @memberof MongoDriver
   */
  async listCategories() {
    const categories = await this.categories.find({}).toArray();
    return categories;
  }

  /**
   * Retrieves a category from the database
   *
   * @param {string} id of the category to retrieve
   * @returns
   * @memberof MongoDriver
   */
  async readCategory(id: string) {
    return await this.categories.findOne({ _id: new ObjectID(id) });
  }

  /**
   * Modifies a category's name in the database
   *
   * @param {string} categoryId the id of the category in the database
   * @param {string} name the new name of the category
   * @memberof MongoDriver
   */
  async updateCategory(categoryId: string, name: string) {
    await this.categories.updateOne({ _id: new ObjectID(categoryId)}, {
      $set: { name }      
    });
  }

  /**
   * Adds a list of existing tasks to an existing category
   *
   * @param {string} categoryId the id of the category in which to add the task
   * @param {string[]} taskList a list of task ids to add to the category
   * @memberof MongoDriver
   */
  async addTasksToCategory(categoryId: string, taskList: string[]) {
    await this.categories.updateOne({ _id: new ObjectID(categoryId) }, { $push: { tasks: { $each: taskList.map(taskId => new ObjectID(taskId)) } } });
  }

  /**
   * Removes a list of existing tasks from an existing category
   *
   * @param {string} categoryId the id of the category from which to remove the tasks
   * @param {string[]} taskList a list of task ids to add to the category
   * @memberof MongoDriver
   */
  async removeTasksFromCategory(categoryId: string, taskList: string[]) {
    await this.categories.updateOne({ _id: new ObjectID(categoryId) }, { $pull: { tasks: { $each: taskList.map(taskId => new ObjectID(taskId)) } } });
  }

  /**
   * Deletes a category from the database
   *
   * @param {string} id of the category to delete
   * @memberof MongoDriver
   */
  async deleteCategory(id: string) {
    await this.categories.deleteOne({ _id: new ObjectID(id) });
  }
}