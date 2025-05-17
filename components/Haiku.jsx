'use client'

import React from 'react'
import Link from 'next/link'
import { deleteHaiku } from '@/actions/haikuController'
import { CldImage } from 'next-cloudinary';

export default function Haiku(props) {
    return (
        <div className='relative rounded-xl overflow-hidden max-w-[650px] mx-auto mb-7'>
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
                // Implementing text overlay on the image
                overlays={[{
                    position: {
                        x: 34,
                        y: 154,
                        angle: -10,
                        gravity: 'north_west',
                    },
                    text: {
                        color: 'black',
                        fontFamily: 'Source Sans Pro',
                        fontSize: 100,
                        fontWeight: 'bold',
                        text: `${props.haiku.line1}%0A${props.haiku.line2}%0A${props.haiku.line3}`,
                    }
                }, {
                    position: {
                        x: 30,
                        y: 150,
                        angle: -10,
                        gravity: 'north_west',
                    },
                    text: {
                        color: 'white',
                        fontFamily: 'Source Sans Pro',
                        fontSize: 100,
                        fontWeight: 'bold',
                        text: `${props.haiku.line1}%0A${props.haiku.line2}%0A${props.haiku.line3}`,
                    }
                }]}
            />

            <div className='absolute bottom-2 right-2 flex'>
                <Link className='inline-block mr-1 bg-black/40 hover:bg-black/50 p-1 text-white/60 hover:text-white/80 rounded' href={`/edit-haiku/${props.haiku._id.toString()}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clipRule="evenodd" />
                    </svg>

                </Link>
                <form action={deleteHaiku}>
                    <input name='id' type="hidden" defaultValue={props.haiku._id.toString()} />
                    <button>Delete</button>
                </form>
            </div>

        </div>
    )
}
