import { useRouter } from "next/router"
import { EXAMPLES_LIST, useExamples } from "../../hooks/useExamples"
import React, { useEffect, useState } from "react"

const dropdownClasses = "border border-black dark:border-white rounded-lg"
const btnClasses = "btn-ghost"
const contentClasses = "mt-16"
const optionClasses = "self-start border border-black dark:border-white px-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-slate-200 focus:bg-slate-200 dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none"

export const ExampleDropdown = ({ example, setExample }) => {
    const [ open, setOpen ] = useState(false)
    const router = useRouter()

    const clickDropdown = (example) => {
        router.push(example.path)
        setExample(example)
        setOpen(false)
    }


    return (
        <div title="Select App" className={`dropdown dropdown-end ${open && "dropdown-open"} ${dropdownClasses}`}>
            <div tabIndex={0} className={`btn gap-1 normal-case ${btnClasses}`}>

            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-ui-radios-grid" viewBox="0 0 16 16"> <path d="M3.5 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm9-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm0 9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zM16 3.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zm-9 9a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zm5.5 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm-9-11a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 2a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"></path> </svg>    

                <span className="hidden md:inline font-bold p-2">
                    <p className="w-40">
                    { example.name }                    
                    </p>
                </span>

                <svg width="12px" height="12px" className="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z" /></svg>
            
            </div>

            <div className={`dropdown-content bg-base-100 text-base-content rounded-t-box rounded-b-box top-px max-h-32 h-[70vh] w-60 overflow-y-auto shadow-2xl ${contentClasses}`}>
                    <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>

                    {
                        EXAMPLES_LIST.map((ex) => (

                                <button key={ex.path} className={`outline-base-content overflow-hiddentext-left`} onClick={()=>clickDropdown(ex)}>
                                <div className={`bg-base-100 text-base-content w-full cursor-pointer font-sans ${optionClasses}`}>
                                    <div className="grid grid-cols-5 grid-rows-3">
                                    <div className="col-span-5 row-span-3 row-start-1 flex gap-2 py-2 px-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className={`w-3 h-3 ${example && (ex.path != example.path && ex.path && "invisible")}`}><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" /></svg>
                                        <div className="text-left flex-grow text-sm font-bold">
                                        {ex.name}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </button>
                        ))
                    }
                    </div>
                </div>
        </div>
    )
}

