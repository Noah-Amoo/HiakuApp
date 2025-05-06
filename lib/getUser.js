import React from 'react'
import { cookies } from 'next/headers'

export default function getUserFromCookie() {
    const theCookie = cookies().get("ourhaikuapp")?.value
    if (theCookie) {
        try {
            const decoded = jwt.verify(theCookie, process.env.JWTSECRET)
            return decoded
        } catch (err) {
            return null
        }
    }
}
