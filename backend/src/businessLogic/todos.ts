import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodoBusinessLogic')
const todosAccess = new TodosAccess()

// Get todo func
export async function getTodos(userId: string): Promise<TodoItem[]> {
    logger.info(`Get todo for userId ${ userId }`)
    return await todosAccess.getAllTodosbyuserId(userId)
}

// Create todo func
export async function createTodo(
    createTodoRequest: CreateTodoRequest, userId: string
): Promise<TodoItem> {

    const todoId = uuid.v4()

    const todo: TodoItem = {
        userId: userId,
        todoId: todoId,
        createdAt: new Date().toISOString(),
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        done: false
    }

    logger.info(`Create todo for userId ${ userId }`)
    return await todosAccess.createTodo(todo)
}

// Update todo func
export async function updateTodo(
    userId: string, todoId: string, updateTodoRequest: UpdateTodoRequest
): Promise<TodoUpdate> {
    const updateTodo: TodoUpdate = {
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
    }
    
    logger.info(`UserId ${ userId } update todo with todoId ${ todoId }`)
    return await todosAccess.updateTodo(userId, todoId, updateTodo)
}

// Delete todo func
export async function deleteTodo(userId: string, todoId: string): Promise<String> {
    logger.info(`UserId ${ userId } delete todo with todoId ${ todoId }`)
    return await todosAccess.deleteTodos(userId, todoId)
}

// TODO: S3 stuff