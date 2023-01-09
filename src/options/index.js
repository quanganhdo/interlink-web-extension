import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

const container = document.getElementById("interlink-app");
const root = createRoot(container)
root.render(<OptionPage />);


export default function OptionPage() {
   const inputRef = useRef()

   useEffect(() => {
      const api = chrome.storage.local.get('api').then(value => {
         inputRef.current.value = value.api
      })
   }, [])

   const handleSaveAPIKey = (e) => {
      chrome.storage.local.set({ api: inputRef.current.value }).then(() => {});
   }

   return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-xl flex flex-col h-64 justify-center">
            <div className="rounded-md border border-gray-300 px-3 py-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
               <label htmlFor="name" className="block text-xs font-medium text-gray-600">
                  API Key
               </label>
               <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm h-12 rounded-md"
                  placeholder="xxxx"
                  ref={inputRef}
               />

            </div>
            <button
               type="button"
               className="mt-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full text-center"
               onClick={handleSaveAPIKey}
            >
               Save
            </button>
         </div>
      </div>
   )
}
