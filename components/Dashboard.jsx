import React from 'react'
import { ObjectId } from 'mongodb'
import { getCollection } from '@/lib/db'

import Haiku from './Haiku'

async function getHaikus(id) {
  const collection = await getCollection("haikus")
  const results = await collection
    .find({ author: ObjectId.createFromHexString(id) })
    .sort({ _id: -1 })
    .toArray()
  // Convert ObjectId fields to strings for serialization
  return results.map(h => ({
    ...h,
    _id: h._id.toString(),
    author: h.author.toString(),
  }))
}

export default async function Dashboard(props) {
  const haikus = await getHaikus(props.user.userId)

  return (
    <div>
      <h2 className='text-center text-2xl text-gray-600 mb-5'>Your Haikus</h2>
      {haikus.map((haiku, index) => {
        return <Haiku haiku={haiku} key={haiku._id} />
      })}
    </div>
  )
}
