import * as crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import ApiError from './ApiError'
import ApiResponse from './ApiResponse'
import asyncHandler from './asyncHandler'
import getMongoosePaginationOptions from './get-pagination-options'

export function divideHundred(n: number) {
  if (n <= 0) return []
  const base = Math.floor(100 / n)
  const remainder = 100 % n
  const result = Array(n).fill(base)
  result[n - 1] += remainder
  return result
}

export function generateSecretKey(cryptoLength: number = 16): string {
  const randomBytes = crypto.randomBytes(cryptoLength).toString('hex')
  const uuid = uuidv4().replace(/-/g, '')
  return `sk-${randomBytes}-${uuid}`
}

export { ApiError, ApiResponse, asyncHandler, getMongoosePaginationOptions }
