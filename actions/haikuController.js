"use server"

import getUserFromCookie from '@/lib/getUser'
import { redirect } from 'next/navigation'
import { ObjectId } from 'mongodb'
import { getCollection } from '@/lib/db'
import cloudinary from 'cloudinary'

// Cloudinary configuration
const cloudinaryConfig = cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function isAlphaNumericWithBasics(str) {
    return /^[a-zA-Z0-9 .,]*$/.test(str)
}

async function sharedHaikuLogic(formData, user) {
    console.log(formData.get('signature'))
    console.log(formData.get('public_id'))
    console.log(formData.get('version'))

    const errors = {}

    const ourHaiku = {
        line1: formData.get('line1'),
        line2: formData.get('line2'),
        line3: formData.get('line3'),
        author: ObjectId.createFromHexString(user.userId)
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

    // Verify signature
    const expectedSignature = cloudinary.utils.api_sign_request(
        {
            public_id: formData.get("public_id"),
            version: formData.get("version")
        },
        cloudinaryConfig.api_secret
    )

    if (expectedSignature === formData.get("signature")) {
        ourHaiku.photo = formData.get("public_id")
    }  

    return {
        errors,
        ourHaiku,
    }
}

export async function createHaiku(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect('/')
    }

    const results = await sharedHaikuLogic(formData, user)

    if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
        return {
            errors: results.errors
        }
    }

    // Save the haiku to the database
    const haikusCollection = await getCollection('haikus')
    const newHaiku = await haikusCollection.insertOne(results.ourHaiku)
    return redirect('/')
}

// Delete Haiku
export async function deleteHaiku(formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect('/')
    }

    const haikusCollection = await getCollection('haikus')
    let haikuId = formData.get("id")
    if (typeof haikuId !== 'string') haikuId = ''

    // Ensure you are the author of this post, otherwise have operation fail
    const haikuInQuestion = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) })

    if (haikuInQuestion.author.toString() !== user.userId) {
        return redirect('/')
    }

    await haikusCollection.deleteOne({ _id: ObjectId.createFromHexString(haikuId) })

    return redirect('/')
}


// Edit/Update Haiku
export async function editHaiku(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect('/')
    }

    const results = await sharedHaikuLogic(formData, user)

    if (results.errors.line1 || results.errors.line2 || results.errors.line3) {
        return {
            errors: results.errors
        }
    }

    // Update haiku to the database
    const haikusCollection = await getCollection('haikus')
    let haikuId = formData.get("haikuId")
    if (typeof haikuId !== 'string') haikuId = ''

    // Ensure you are the author of this post, otherwise have operation fail
    const haikuInQuestion = await haikusCollection.findOne({ _id: ObjectId.createFromHexString(haikuId) })

    if (haikuInQuestion.author.toString() !== user.userId) {
        return redirect('/')
    }

    await haikusCollection.findOneAndUpdate({ _id: ObjectId.createFromHexString(haikuId) }, { $set: results.ourHaiku })

    return redirect('/')
}
