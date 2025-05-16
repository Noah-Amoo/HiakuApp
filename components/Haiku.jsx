'use client'

import React from 'react'
import Link from 'next/link'
import { deleteHaiku } from '@/actions/haikuController'
import { CldImage } from 'next-cloudinary';

export default function Haiku(props) {
    return (
        <div className='bg-gray-100 p-4 mb-4 rounded-lg'>
            <CldImage
                width="650"
                height="300"
                src={props.haiku.photo}
                sizes="650px"
                alt="Description of my image"
                // Using cloudinary's AI to crop the image
                crop={{
                    type: 'pad',
                    source: 'true'
                }}
                fillBackground
            />
            <p className='text-lg'>{props.haiku.line1}</p>
            <p className='text-lg'>{props.haiku.line2}</p>
            <p className='text-lg'>{props.haiku.line3}</p>
            <Link href={`/edit-haiku/${props.haiku._id.toString()}`}>Edit</Link>
            <form action={deleteHaiku}>
                <input name='id' type="hidden" defaultValue={props.haiku._id.toString()} />
                <button>Delete</button>
            </form>

            <hr className='border-t-2 border-gray-300 mt-4' />
        </div>
    )
}
