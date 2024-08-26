import React from 'react'

export const OrderTile = ({ productName, quantity }) => {
    return (
        <div className='card flex justify-between bg-[#FB8171] rounded-lg m-2' style={{ minWidth: '150px'}}>
            <div className='text-white text-xl p-2'>{productName}</div>
            <div className='flex justify-end'>
                <div className='w-9 text-white bg-[#39a3ee] rounded-t-lg p-1'>x {quantity}</div>
            </div>
        </div>

    )

}