import 'dotenv/config'
import bcrypt from 'bcrypt'
import crypto from 'node:crypto'

const token = bcrypt.hashSync("15, 4", 1)
console.log(token)

const otherToken = crypto.randomBytes(32).toString("hex")
console.log(otherToken)