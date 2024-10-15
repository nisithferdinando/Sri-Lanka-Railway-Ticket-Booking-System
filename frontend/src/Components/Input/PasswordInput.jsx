import React, { useState } from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6';

const PasswordInput = ({value, onChange, placeholder}) => {

    const [isShowPassword, setIshowPassword]=useState(false);

    const toggleShowPassword=()=>{
        setIshowPassword(!isShowPassword);
    }

  return (
    <div>
        <div className='flex items-center bg-white border-[1px] rounded-md px-5 mb-3'>
            <input value={value}
            onChange={onChange}
            type={isShowPassword ? "text" : "password"}
            placeholder={placeholder|| "Password"}
            className='w-full text-sm bg-white py-3 mr-3 rounded outline-none'
            />
            {isShowPassword ?(
                <FaRegEye 
                size={22}
                className='text-blue-600 cursor-pointer'
                onClick={()=>{toggleShowPassword()}}
                />
            ):
            (
                <FaRegEyeSlash 
                size={22}
                className='text-slate-400 cursor-pointer'
                onClick={()=>{toggleShowPassword()}}
                />
            )
            }
        </div>
    </div>
  )
}

export default PasswordInput