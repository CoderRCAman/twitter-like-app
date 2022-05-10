import React from 'react'
import Navbar from '../components/Navbar'
import SearchUser from '../components/SearchUser'
import { ArrowLeftOutlined } from '@ant-design/icons'
export default function Notifications() {
  return (
    <div className='min-h-screen  bg-black flex'> 
      <Navbar/>
      <div className='md:border-x-[1px] md:border-x-gray-700 max-h-screen overflow-scroll w-full py-2  '>
        <div >

        <div className='px-4 flex items-center space-x-3'>
            <ArrowLeftOutlined className='text-gray-500'/>
            <h1 className='text-white font-bold font-[Roboto] text-xl'>Notifications</h1>
        </div>
        <div className='text-white  w-full border-b-[1px] border-b-gray-800 '>
            <button className='w-[50%] hover:bg-[#181818] py-3 font-bold '>All</button>
            <button className='w-[50%] hover:bg-[#181818] py-3 font-bold'>Mentions</button>
        </div>
        </div>
      </div>
        <SearchUser/>
    </div>
  )
}
