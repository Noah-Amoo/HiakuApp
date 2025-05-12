import React from 'react'
import { ObjectId } from 'mongodb'
import { getCollection } from '@/lib/db'

async function getHaikus(id) {
  const collection = await getCollection("haikus")
  const results = await collection
    .find({ author: ObjectId.createFromHexString(id) })
    .sort()
    .toArray()
  return results
}

export default async function Dashboard(props) {

  const haikus = await getHaikus(props.user.userId)

  return (
    <div>
      <h2 className='text-center text-2xl text-gray-600 mb-5'>Your Haikus</h2>
      {haikus.map((haiku, index) => {
        return (
          <div key={index} className='bg-gray-100 p-4 mb-4 rounded-lg'>
            <p className='text-lg'>{haiku.line1}</p>
            <p className='text-lg'>{haiku.line2}</p>
            <p className='text-lg'>{haiku.line3}</p>
            <hr className='border-t-2 border-gray-300 my-4' />
          </div>
        )
      })}
    </div>
  )
}
