import Image from 'next/image'
import React from 'react'

type Props = {
  size?: number
}

const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <div className='h-full w-full flex flex-col items-center justify-center'>
      <Image src='/logo.svg' alt='Loading...' width={size} height={size}  className='animate-pulse duration-700'/>
      <p className='text-black text-4xl text-center mt-3 font-extrabold'>Zezo - App</p>
    </div>
  )
}

export default LoadingLogo
