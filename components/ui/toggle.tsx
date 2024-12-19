import React, { useState } from 'react'

const Toggle = ({
  id,
  key,
  isSelected,
  onToggle,
  label
}: {
  id: string,
  key: string,
  isSelected: boolean,  
  onToggle?: (toggled: boolean) => void,
  label?: string
}) => {
  const [toggled, setToggled] = useState(isSelected)

  const handleToggle = () => {
    const newState = !toggled
    setToggled(newState)
    if (onToggle) {
      onToggle(newState)
    }
  }

  return (
    <div className="flex items-center">
      <div
        id={id}
        key={key}      
        className={
          'relative cursor-pointer h-[25px] w-[45px] translate-x-1 translate-y-1 cursor-pointer  rounded-full bg-[#222222]'
        }
        onClick={handleToggle}
      >
        <span
          className={`flex h-full w-full items-center justify-center rounded-full border-[2px]  border-[#222222] ${toggled ? 'translate-x-[3px] translate-y-[-3px] bg-[#ff527a]' : ' bg-gray-300'} p-[2px] transition-all duration-300`}
        >
          <span
            className={`aspect-square h-full transform rounded-full border-[2px] border-[#222222] bg-white shadow-lg ${toggled ? 'translate-x-[10px]' : 'translate-x-[-10px]'} transition-all duration-300`}
          />
        </span>
      </div>
      <div className="ml-4">{label}</div>
    </div>
  )
}

export default Toggle
