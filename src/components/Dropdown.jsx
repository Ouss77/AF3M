import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';

const Dropdown = ({ label, dropdownRef, items, openDropdown, toggleDropdown, dropdownKey, toggleMenu }) => {
  const handleItemClick = (event) => {
    event.stopPropagation(); // Stop event propagation
    toggleDropdown(dropdownKey); // Close the dropdown
    toggleMenu; // Close the burger menu
  };

  return (
    <div ref={dropdownRef} className="relative group">
      <button
        aria-label='Dropdown'
        onClick={(event) => {
          event.stopPropagation(); // Stop event propagation
          toggleDropdown(dropdownKey);
        }}
        className="relative text-sm xl:text-base text-slate-700 hover:text-blue-600 flex items-center transition-all duration-300 ease-in-out font-semibold group px-3 py-2 rounded-lg hover:bg-white/50 dark:text-slate-100 dark:hover:text-blue-300 dark:hover:bg-slate-700/80"
      >
        {label} 
        <FaChevronDown className={`ml-2 text-xs transition-transform duration-300 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`} />
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
      </button>
      {openDropdown === dropdownKey && (
        <div className="absolute z-50 top-full left-1/2 transform -translate-x-1/2 w-max bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-xl mt-2 opacity-100 translate-y-0 transition-all duration-300 overflow-hidden dark:bg-slate-900/95 dark:border-slate-700">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="block px-6 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 font-medium first:rounded-t-xl last:rounded-b-xl border-b border-slate-100 last:border-b-0 dark:text-slate-100 dark:hover:text-blue-300 dark:hover:bg-slate-700/70 dark:border-slate-700"
              onClick={handleItemClick} // Close dropdown and burger menu on item click
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;