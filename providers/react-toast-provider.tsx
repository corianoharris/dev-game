'use client'

import React from 'react'
import { ToastContainer, ToastContainerProps, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ToastProviderProps extends ToastContainerProps
{
    children: React.ReactNode
}

export function ToastProvider({ children, ...props }: ToastProviderProps)
{
    return (
        <>
            {children}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                transition={Slide}
                {...props} // Allow customization via props
            />
        </>
    )
}
