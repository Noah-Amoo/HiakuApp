"use server"

export const register = async function (prevState, FormData) {
    const errors = {}

    const ourUser = {
        username: FormData.get("username"),
        password: FormData.get("password"),

    }

    if (typeof ourUser.username !== "string") ourUser.username = ""
    if (typeof ourUser.password !== "string") ourUser.password = ""

    ourUser.username = ourUser.username.trim()
    ourUser.password = ourUser.password.trim()

    // Validation
    if (ourUser.username.length < 3) errors.username = "Username must be at least 3 characters long"
    if (ourUser.username.length > 30) errors.username = "Username cannot be longer than 30 characters"

    if (errors.username || errors.password) {
        return {
            errors: errors,
            success: false,
        }
    }

    // Storing the new user in the database

    // log the user in by giving them a cookie

    return {
        success: true
    }
}