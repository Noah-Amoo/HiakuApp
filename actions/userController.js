"use server"

import { getCollection } from "@/lib/db.js"
import bcrypt from "bcrypt"

function isAlphaNumeric(x) {
    const regex = /^[a-zA-Z0-9]*$/
    return regex.test(x)
}

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
    if (ourUser.username == "") errors.username = "You must provide a username"
    if (!isAlphaNumeric(ourUser.username)) errors.username = "Username can only contain letters and numbers"

    if (ourUser.password.length < 12) errors.password = "Password must be at least 12 characters long"
    if (ourUser.password.length > 50) errors.password = "Password cannot be longer than 50 characters"
    if (ourUser.password == "") errors.password = "You must provide a password"

    if (errors.username || errors.password) {
        return {
            errors: errors,
            success: false,
        }
    }

    // Hashing the password before storing it in the database
    const salt = bcrypt.genSaltSync(10)
    ourUser.password = bcrypt.hashSync(ourUser.password, salt)

    // Storing the new user in the database
    const usersCollection = await getCollection("users")
    await usersCollection.insertOne(ourUser)

    // log the user in by giving them a cookie

    return {
        success: true
    }
}