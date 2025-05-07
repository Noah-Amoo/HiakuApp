"use server"

import getUserFromCookie from '@/lib/getUser'
import { redirect } from 'next/navigation'

export default async function createHaiku(prevState, formData) {
    const user = await getUserFromCookie()

    if (!user) {
        return redirect('/')
    }

    return { message: "Congrats!"}
}
