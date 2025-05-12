import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

export default async function getUserFromCookie() {
    const cookieStore = await cookies();
    const theCookie = cookieStore.get("ourhaikuapp")?.value;

    if (theCookie) {
        try {
            const decoded = jwt.verify(theCookie, process.env.JWTSECRET);
            return decoded;
        } catch (err) {
            console.error("JWT verification failed:", err);
            return null;
        }
    }
    return null;
}
