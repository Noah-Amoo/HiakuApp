"use server"

import { getCollection } from "@/lib/db.js"
import bcrypt from "bcrypt"
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { redirect } from "next/navigation"

function isAlphaNumeric(x) {
    const regex = /^[a-zA-Z0-9]*$/
    return regex.test(x)
}

export const login = async function (prevState, formData) {
    const failObject = {
        success: false,
        message: "Username or password is incorrect",
    }

    const ourUser = {
        username: formData.get("username"),
        password: formData.get("password"),
    }

    if (typeof ourUser.username !== "string") ourUser.username = ""
    if (typeof ourUser.password !== "string") ourUser.password = ""

    const collection = await getCollection("users")
    const user = await collection.findOne({ username: ourUser.username })
    if (!user) {
        return failObject
    }

    const marchOrNot = bcrypt.compareSync(ourUser.password, user.password)

    if (!marchOrNot) {
        return failObject
    }

    // Creating a JWT token for the user
    const ourTokenValue = jwt.sign(
        { userId: user._id.toString(), exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 }, // Include userId in the payload
        process.env.JWTSECRET
    )

    console.log("Generated JWT:", ourTokenValue);
    console.log("Decoded JWT:", jwt.verify(ourTokenValue, process.env.JWTSECRET));

    // log the user in by giving them a cookie
    cookies().set("ourhaikuapp", ourTokenValue, {
        httpOnly: true, // Only the server can read this cookie
        sameSite: "strict", // CSRF protection
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: true, // Only send this cookie over HTTPS
    })

    return redirect("/")

}

export const logout = async function () {
    (await cookies()).delete("ourhaikuapp")
    redirect("/")
}

export const register = async function (prevState, FormData) {
    const errors = {};

    const ourUser = {
        username: FormData.get("username"),
        password: FormData.get("password"),
    };

    if (typeof ourUser.username !== "string") ourUser.username = "";
    if (typeof ourUser.password !== "string") ourUser.password = "";

    ourUser.username = ourUser.username.trim();
    ourUser.password = ourUser.password.trim();

    // Validation
    if (ourUser.username.length < 3) errors.username = "Username must be at least 3 characters long";
    if (ourUser.username.length > 30) errors.username = "Username cannot be longer than 30 characters";
    if (ourUser.username === "") errors.username = "You must provide a username";
    if (!isAlphaNumeric(ourUser.username)) errors.username = "Username can only contain letters and numbers";

    // Check if the username already exists in the database
    const usersCollection = await getCollection("users");
    const usernameInQuestion = await usersCollection.findOne({ username: ourUser.username });

    if (usernameInQuestion) {
        errors.username = "Username already exists";
    }

    if (ourUser.password.length < 12) errors.password = "Password must be at least 12 characters long";
    if (ourUser.password.length > 50) errors.password = "Password cannot be longer than 50 characters";
    if (ourUser.password === "") errors.password = "You must provide a password";

    if (errors.username || errors.password) {
        return {
            errors: errors,
            success: false,
        };
    }

    // Hashing the password before storing it in the database
    const salt = bcrypt.genSaltSync(10);
    ourUser.password = bcrypt.hashSync(ourUser.password, salt);

    // Storing the new user in the database
    const newUser = await usersCollection.insertOne({ourUser});
    const userId = newUser.insertedId.toString();

    // Creating a JWT token for the user
    const ourTokenValue = jwt.sign(
        { userId: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 },
        process.env.JWTSECRET
    );

    // Log the user in by giving them a cookie
    cookies().set("ourhaikuapp", ourTokenValue, {
        httpOnly: true, // Only the server can read this cookie
        sameSite: "strict", // CSRF protection
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        secure: true, // Only send this cookie over HTTPS
    });

    return {
        success: true,
    };
};