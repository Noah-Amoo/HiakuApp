import React from 'react'
import Link from 'next/link'

export default function page() {
  return (
    <div>
      <h1>Hello</h1>
      <Link href='/login'>Login Page</Link>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt expedita quod officiis recusandae voluptatem pariatur vero esse ullam, quasi eveniet!</p>
    </div>
  )
}
