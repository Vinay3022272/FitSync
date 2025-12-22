import React from 'react'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-8 p-4">
      
      {/* SECTION 1: DaisyUI Hero Component */}
      {/* Checks if DaisyUI styles are loading properly */}
      <div className="hero bg-base-100 rounded-box shadow-xl p-8 max-w-2xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold text-primary">Hello there!</h1>
            <p className="py-6">
              If you can see this styled card and the blue button below, 
              <strong> DaisyUI</strong> and <strong>Tailwind CSS</strong> are fully working!
            </p>
            
            {/* Checks React Router Link */}
            <Link to="/login" className="btn btn-primary">
              Go to Login Page
            </Link>
          </div>
        </div>
      </div>

      {/* SECTION 2: Tailwind Flex & Gap Test */}
      {/* Checks if standard Tailwind utility classes are working */}
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold">Component Test</h2>
        
        {/* Horizontal Gap Test */}
        <div className="flex gap-4">
          <div className="badge badge-secondary p-4">Item A</div>
          <div className="badge badge-accent p-4">Item B</div>
          <div className="badge badge-ghost p-4">Item C</div>
        </div>
      </div>

    </div>
  )
}

export default HomePage


