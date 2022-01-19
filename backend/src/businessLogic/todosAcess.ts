import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// Implement the dataLayer logic
export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE){
    }

    async getAllTodosbyuserId(userId: string): Promise<TodoItem[]> {
        const result = await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()
        
        logger.info(`Todo's for userId ${ userId } retrieve successfully`)
        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()
        
        logger.info('Todo created successfully')
        return todo
    }

    async updateTodo(userId: string, todoId: string, update_todo: TodoUpdate): Promise<TodoUpdate> {
        await this.docClient.update({
            TableName: this.todosTable,
            Key: {
                'todoId': todoId,
                'userId': userId
            },
            UpdateExpression: "set #nm = :n, dueDate=:d, done=:c",
            ExpressionAttributeValues:{
                ":n": update_todo.name,
                ":d": update_todo.dueDate,
                ":c": update_todo.done
            },
            ExpressionAttributeNames: {
                "#nm": "name"
              }
        }).promise()
        logger.info('Todo updated successfully')

        return update_todo
    }

    async deleteTodos(userId: string, todoId: string): Promise<String> {
        await this.docClient.delete({
            TableName: this.todosTable,
            Key: {
                'todoId': todoId,
                'userId': userId
            }
        }).promise()
        
        logger.info('detete todo successfully')
        return ''
    }

    // TODO: S3 stuff
}

function createDynamoDBClient() {
    return new XAWS.DynamoDB.DocumentClient()
}