import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import getUserFromCookie from "@/lib/getUser";
import { use } from "react";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
    // Check if the user is authenticated before accessing the route/signature
    const user = await getUserFromCookie();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

    return NextResponse.json({ signature });
}