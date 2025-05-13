import React from 'react'
import HaikuForm from '@/components/HaikuForm'
import { getCollection } from '@/lib/db'
import { ObjectId } from 'mongodb'
import getUserFromCookie from '@/lib/getUser'
import { redirect } from 'next/navigation'

async function getDoc(id) {
    const haikusCollection = await getCollection('haikus')
    const result  = await haikusCollection.findOne({_id: ObjectId.createFromHexString(id)})

    if (!result) {
        redirect('/')
    }

    return {
        ...result,
        _id: result._id.toString(),
        author: result.author.toString()

    }
}

export default async function page(props) {
    const doc = await getDoc(props.params.id)
    const user = await getUserFromCookie()

    // Check if the user is logged in
    if (!user) {
        redirect('/')
    }

    // Prevent user from accessing this page if they are not logged in
    if (user.userId !== doc.author.toString()) {
        redirect('/')
    }

  return (
    <div>
      <h2 className='text-center text-4xl text-gray-600 mb-6'>Edit Post</h2>
      <HaikuForm haiku = {doc} action = "edit" />
    </div>
  )
}
