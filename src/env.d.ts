declare global {
    namespace NodeJS {
        interface ProcessEnv {
            API_PORT: number
            DATABASE_URL: string
            SECRET: string
            ADMIN_SECRET: string
            API_KEY: string
        }
    }
}

export { }