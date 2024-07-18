import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaSignInAlt, FaUser, FaSignOutAlt, FaSearch, FaBars } from "react-icons/fa";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { useGetAllCategoriesQuery } from "../redux/api/categoryAPI";
import { User } from "../types/types";

interface PropsType {
  user: User | null;
}

const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const { data: categoriesData } = useGetAllCategoriesQuery();
  const navigate = useNavigate();
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryRef]);

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Sign Out Successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Sign Out Fail");
    }
  };

  const searchHandler = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${search}`);
    setSearch("");
  };

  return (
    <nav className="header">
      <div className="logo">
        <h1>LOGO</h1>
      </div>
      <div className="search-bar">
        <form onSubmit={searchHandler} className="search-form">
          <input
            type="text"
            placeholder="Search for products ...."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">
            <FaSearch />
          </button>
        </form>
      </div>
      <div className={`header-center ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link onClick={() => setIsMobileMenuOpen(false)} to={"/"}>
          HOME
        </Link>
        <div className="dropdown" ref={categoryRef}>
          <button onClick={() => setIsCategoryOpen((prev) => !prev)}>
            CATEGORIES
          </button>
          {isCategoryOpen && (
            <div className="dropdown-menu">
              {categoriesData?.categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/search?query=${category.name}`}
                  onClick={() => setIsCategoryOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
        <Link onClick={() => setIsMobileMenuOpen(false)} to={"/about"}>
          ABOUT
        </Link>
        <Link onClick={() => setIsMobileMenuOpen(false)} to={"/contact"}>
          CONTACT
        </Link>
        <Link onClick={() => setIsMobileMenuOpen(false)} to={"/filter"}>
          FILTER
        </Link>
      </div>

      <div className="header-right">
        <Link onClick={() => setIsMobileMenuOpen(false)} to={"/cart"}>
          <FaShoppingBag />
        </Link>

        {user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
            <dialog open={isOpen} className={`user-menu ${isMobileMenuOpen ? 'mobile-menu-dialog' : ''}`}>
              <div>
                {user.role === "admin" && (
                  <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                    Admin
                  </Link>
                )}

                <Link onClick={() => setIsOpen(false)} to="/orders">
                  Orders
                </Link>
                <button onClick={logoutHandler}>
                  <FaSignOutAlt />
                </button>
              </div>
            </dialog>
          </>
        ) : (
          <Link to={"/login"}>
            <FaSignInAlt />
          </Link>
        )}
        <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

export default Header;
