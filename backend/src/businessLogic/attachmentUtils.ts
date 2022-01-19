import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger'
import { TodosAccess } from './todosAcess'

const todosAccess = new TodosAccess()
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('TodosAccess')

// Implement the fileStogare logic
const s3 = new XAWS.S3({
    signatureVersion: 'v4'
})

const bucketName = process.env.ATTACHMENT_S3_BUCKET
const signedExpiration = process.env.SIGNED_URL_EXPIRATION

export async function generateUploadUrl(userId: string, todoId: string): Promise<String> {
    logger.info('creating url')
    const url = getUploadUrl(todoId, bucketName)
    const attachmentUrl: string = 'https://' + bucketName + '.s3.amazonaws.com/' + todoId

    await todosAccess.updateTodoAttachment(userId, todoId, attachmentUrl)
    logger.info(`Presigned url ${ url } generated successfully`)

    return url;
}


function getUploadUrl(todoId: string, bktName: string): string {
    return s3.getSignedUrl('putObject', 
        {
            Bucket: bktName,
            Key: todoId,
            Expires: parseInt(signedExpiration)
        }
    )
}
