export namespace UserRequests {
    type CreateUserBody = {
        firstName: string
        secondName: string
        email: string
        password: string
    }

    type UpdateUserBody = {
        firstName?: string
        secondName?: string
    }

    type UserLoginBody = {
        email: string
        password: string
    }
}