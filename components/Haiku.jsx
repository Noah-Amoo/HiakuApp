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
                <Link href={`/edit-haiku/${props.haiku._id.toString()}`}>Edit</Link>
                <form action={deleteHaiku}>
                    <input name='id' type="hidden" defaultValue={props.haiku._id.toString()} />
                    <button>Delete</button>
                </form>
            </div>

        </div>
    )
}
