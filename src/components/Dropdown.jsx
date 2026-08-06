import { FaChevronDown } from 'react-icons/fa';
import Link from 'next/link';

const Dropdown = ({ label, dropdownRef, items, openDropdown, toggleDropdown, dropdownKey, toggleMenu, icon, isMobile = false }) => {
  const handleItemClick = (event) => {
    event.stopPropagation();
    toggleDropdown(dropdownKey);
    if (typeof toggleMenu === 'function') {
      toggleMenu();
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${isMobile ? 'w-full' : 'group'}`}>
      <button
        aria-label='Dropdown'
        onClick={(event) => {
          event.stopPropagation();
          toggleDropdown(dropdownKey);
        }}
        className={isMobile
          ? 'flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/70 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:bg-slate-700/70 dark:hover:text-blue-300'
          : 'relative flex items-center text-sm xl:text-base text-slate-700 hover:text-blue-600 transition-all duration-300 ease-in-out font-semibold group px-3 py-2 rounded-lg hover:bg-white/50 dark:text-slate-100 dark:hover:text-blue-300 dark:hover:bg-slate-700/80'}
      >
        <span className="flex items-center gap-3">
          {icon && <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{icon}</span>}
          <span>{label}</span>
        </span>
        <FaChevronDown className={`text-xs transition-transform duration-300 ${openDropdown === dropdownKey ? 'rotate-180' : ''}`} />
        {!isMobile && <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>}
      </button>

      {openDropdown === dropdownKey && (
        <div className={isMobile
          ? 'mt-2 space-y-1 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg dark:border-slate-700 dark:bg-slate-800/90'
          : 'absolute z-50 top-full left-1/2 transform -translate-x-1/2 w-max bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200 rounded-xl mt-2 opacity-100 translate-y-0 transition-all duration-300 overflow-hidden dark:bg-slate-900/95 dark:border-slate-700'}
        >
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={isMobile
                ? 'flex items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-blue-300'
                : 'block px-6 py-3 text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 font-medium first:rounded-t-xl last:rounded-b-xl border-b border-slate-100 last:border-b-0 dark:text-slate-100 dark:hover:text-blue-300 dark:hover:bg-slate-700/70 dark:border-slate-700'}
              onClick={handleItemClick}
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