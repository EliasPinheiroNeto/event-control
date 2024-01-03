import 'dotenv/config'
import jwt from 'jsonwebtoken'

// console.log(crypto.randomInt(268435456, 4294967295).toString(16))
// console.log(crypto.createSign("Elias"))

const token = jwt.sign({ userId: 17, eventId: 2 }, process.env.SECRET, {
    algorithm: 'none',
})

// console.log(Buffer.from("302 54" + Math.floor(new Date().getMinutes())).toString("base64url"))
console.log(token)