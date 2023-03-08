const NavBar = (props) => {
  const renderDropdown = () => {
    if (props.links.length !== 0)
      return (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <div className="w-10 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="4 4 18 18"
                className="inline-block w-5 h-5 stroke-current scale-150 mt-1 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
          >
            {props.links.map((link) => {
              return (
                <li className="visible">
                  <a
                    href={link.href}
                    data-cy={`navbar-${link.text.toLowerCase()}`}
                    onClick={link.handleClick}
                  >
                    {link.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      );
  };

  return (
    <div className="fixed top-0 navbar w-full h-fit z-50 justify-between items-center">
      <a
        href="/"
        className="btn btn-ghost text-white text-5xl font-bold normal-case h-fit hover:bg-opacity-0 group"
      >
        <span className="material-symbols-outlined mr-2 text-6xl group-hover:animate-spin">
          eco
        </span>{" "}
        <span className="mt-1">Ecoliday</span>
      </a>
      {renderDropdown()}
    </div>
  );
};

export default NavBar;
