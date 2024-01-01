import { z } from "zod";

const dataSchema = z.object({
    date: z.coerce.date().min(new Date()).optional()
})

try {
    console.log(dataSchema.parse({
        date: "01/01/2024"
    }))
} catch (err) {
    console.log("erro")
}