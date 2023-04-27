import * as dotenv from 'dotenv'

dotenv.config()

export const AWS_ACCESS_KEY_LOCAL = process.env.AWS_ACCESS_KEY_LOCAL
export const AWS_ACCESS_KEY_LOCAL_PWD = process.env.AWS_ACCESS_KEY_LOCAL_PWD

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME
export const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION