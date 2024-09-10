/* eslint-disable react/prop-types */
import { EyeSlash, Eye } from "iconsax-react";
import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function InputField({ type, value = '', setValue, children, maxLength, placeholder = '' }) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isTextarea = type === 'textarea';
  return (
    <div className={`flex items-center gap-2 bg-transparent w-full py-2 px-4 text-lg  border-2 border-borderPrimary dark:border-borderSecondary dark:focus-within:border-accent focus-within:border-blAccent  rounded-lg ${isTextarea ? 'flex-col' : ''}`}>

      {children}

      {isTextarea ? (
        <textarea
          rows={maxLength <= 50 ? 1 : 5}
          placeholder={placeholder}
          name={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='outline-none border-none dark:text-textPrimary w-full bg-transparent resize-none overflow-hidden'
          maxLength={maxLength}
        />
      ) : (
        <input
          placeholder={placeholder}
          type={!isPasswordVisible ? type : 'text'}
          name={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className='outline-none border-none dark:text-textPrimary w-full bg-transparent'
        />
      )}
      {isTextarea && (
        <div className="flex justify-end items-center mt-2">
          <span className={`text-[#808998] ${value.length === maxLength ? 'text-red-500' : ''}`}>
            {value.length}/{maxLength}
          </span>
        </div>
      )}
      {type === 'password' && (
        <div className={`flex content-end ml-2 ${isTextarea ? 'mt-2' : ''}`} onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
          {type === 'password' && (!isPasswordVisible ? <EyeSlash className={'dark:text-primary text-darkGrey'} /> : <Eye className={'dark:text-primary text-darkGrey'} />)}
        </div>
      )}
    </div>
  );
}
