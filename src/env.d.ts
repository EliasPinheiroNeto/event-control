declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_PORT: number
            DATABASE_URL: string
            SECRET: string
        }
    }
}

export { }