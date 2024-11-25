import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <div>
      <nav 
        className="flex justify-between items-center mb-6 text-black p-4 shadow-md fixed top-0 left-0 right-0" // Fixed position to attach it to the top and sides
        style={{ backgroundColor: 'hsl(38.71, 39.74%, 69.41%)' }} // Set background color to the specified HSL value
      >
        <NavLink to="/">
          <img 
            alt="Boiler Books Logo" 
            className="h-10 inline" 
            src="https://iili.io/22fNLKu.png"
          />
        </NavLink>
        <div className="flex justify-end gap-4">
        <NavLink 
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-zinc-700 hover:text-white h-9 rounded-md px-3 text-black" // Ensure text is black
          to="/create"
        >
          Add Book
        </NavLink>
        <NavLink 
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-white hover:bg-zinc-700 hover:text-white h-9 rounded-md px-3 text-black" // Ensure text is black
          to="/report"
        >
          Report
        </NavLink>
        </div>
      </nav>
    </div>
  );
}
