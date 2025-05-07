"use server"

import getUserFromCookie from '@/lib/getUser'
import { redirect } from 'next/navigation'
import { ObjectId } from 'mongodb'
import { getCollection } from '@/lib/db'

function isAlphaNumericWithBasics(str) {
    return /^[a-zA-Z0-9 .,]*$/.test(str)
}

async function sharedHaikuLogic(formData, user) {
    const errors = {}

    const ourHaiku = {
        line1: formData.get('line1'),
        line2: formData.get('line2'),
        line3: formData.get('line3'),
    }

    // Validate userId
    try {
        ourHaiku.author = new ObjectId(user.userId) // Safely create ObjectId
    } catch (err) {
        errors.userId = 'Invalid user ID'
        return { errors, ourHaiku }
    }

    if (typeof ourHaiku.line1 !== 'string') ourHaiku.line1 = ''
    if (typeof ourHaiku.line2 !== 'string') ourHaiku.line2 = ''
    if (typeof ourHaiku.line3 !== 'string') ourHaiku.line3 = ''

    // Ensuring there are no line breaks in each line
    ourHaiku.line1 = ourHaiku.line1.replace(/(\r\n|\n|\r)/gm, '').trim()
    ourHaiku.line2 = ourHaiku.line2.replace(/(\r\n|\n|\r)/gm, '').trim()
    ourHaiku.line3 = ourHaiku.line3.replace(/(\r\n|\n|\r)/gm, '').trim()

    // Validate line lengths
    if (ourHaiku.line1.length < 5) errors.line1 = 'Line 1 must be at least 5 characters long'
    if (ourHaiku.line1.length > 25) errors.line1 = 'Line 1 must be at most 25 characters long'

    if (ourHaiku.line2.length < 7) errors.line2 = 'Line 2 must be at least 7 characters long'
    if (ourHaiku.line2.length > 35) errors.line2 = 'Line 2 must be at most 35 characters long'

    if (ourHaiku.line3.length < 5) errors.line3 = 'Line 3 must be at least 5 characters long'
    if (ourHaiku.line3.length > 25) errors.line3 = 'Line 3 must be at most 25 characters long'

    // Validate for special characters
    if (!isAlphaNumericWithBasics(ourHaiku.line1)) errors.line1 = 'No special characters allowed in line 1'
    if (!isAlphaNumericWithBasics(ourHaiku.line2)) errors.line2 = 'No special characters allowed in line 2'
    if (!isAlphaNumericWithBasics(ourHaiku.line3)) errors.line3 = 'No special characters allowed in line 3'

    if (ourHaiku.line1.length === 0) errors.line1 = 'This field is required'
    if (ourHaiku.line2.length === 0) errors.line2 = 'This field is required'
    if (ourHaiku.line3.length === 0) errors.line3 = 'This field is required'

    return {
        errors,
        ourHaiku,
    }
}

export default async function createHaiku(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect('/')
    }

    const results = await sharedHaikuLogic(formData, user)

    if (results.errors.line1 || results.errors.line2 || results.errors.line3 || results.errors.userId) {
        return {
            errors: results.errors
        }
    }

    // Save the haiku to the database
    const haikusCollection = await getCollection('haikus')
    const newHaiku = await haikusCollection.insertOne(results.ourHaiku)
    return redirect('/')
}
