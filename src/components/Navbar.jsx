import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="relative p-2 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="pt-2">
            <Link to="/">
              <p>Logo</p>
            </Link>
          </div>

          <div>
            <Link to="/" className="mr-4 hover:text-blue">Home</Link>
            <Link to="/record" className="hover:text-blue">Record</Link>
          </div>
         
         <button className="py-2 px-4 text-white bg-blue-600 rounded-full baseline hover:bg-blue-400">
            Connect
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar