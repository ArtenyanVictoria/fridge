import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Modal = ({ children, visible, setVisible }: any) => {


    return (
        <div className={visible ? "visible" : "invisible"}>
            <div className="flex min-h-screen flex-col items-center justify-between p-44 bg-slate-800/30 absolute inset-0" onClick={() => setVisible(false)}>
                <div className=" bg-slate-200  p-8 rounded shadow-md w-96 z-50" onClick={(e) => e.stopPropagation()}>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal