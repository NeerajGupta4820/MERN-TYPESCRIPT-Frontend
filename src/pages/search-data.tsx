import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { useSearchproductQuery } from "../redux/api/productAPI";
import { server } from "../redux/store";
import { FaPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { Product } from "../types/types";

const SearchResults = () => {
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("");
  const [ratings, setRatings] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const dispatch = useDispatch();

  const { data, error, isLoading } = useSearchproductQuery(query);

  const addToCartHandler = (product: Product) => {
    const cartItem = {
      productId: product._id,
      photo: product.photos[0],
      name: product.name,
      price: product.price,
      quantity: 1,
      stock: product.stock,
    };
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="star-icon" />
        ))}
        {halfStar && <FaStarHalfAlt className="star-icon" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="star-icon" />
        ))}
      </>
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 600) {
        setShowFilters(true); 
      } else {
        setShowFilters(false); 
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error-message">Error: No Product Found</div>;

  const discountOptions = [
    { label: "None", value: "" },
    { label: "10% or more", value: "10" },
    { label: "20% or more", value: "20" },
    { label: "30% or more", value: "30" },
    { label: "40% or more", value: "40" },
    { label: "50% or more", value: "50" },
  ];

  const ratingOptions = [
    { label: "None", value: "" },
    { label: "1 star & up", value: "1" },
    { label: "2 stars & up", value: "2" },
    { label: "3 stars & up", value: "3" },
    { label: "4 stars & up", value: "4" },
    { label: "5 stars", value: "5" },
  ];

  return (
    <div className="search-results">
      <button
        className="toggle-filters"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      <div className={`sidebar ${showFilters ? "show" : ""}`}>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input
            type="range"
            min={100}
            max={100000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <h4>Brand</h4>
          <input
            type="text"
            value={brand}
            placeholder="Enter brand name..."
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <div>
          <h4>Ratings</h4>
          <div className="ratings-options">
            {ratingOptions.map((option) => (
              <button
                key={option.value}
                className={`rating-button ${
                  ratings === option.value ? "active" : ""
                }`}
                onClick={() => setRatings(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4>Discount</h4>
          <div className="discount-options">
            {discountOptions.map((option) => (
              <button
                key={option.value}
                className={`discount-button ${
                  discount === option.value ? "active" : ""
                }`}
                onClick={() => setDiscount(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="product-list">
        <h1>Search Results for {query}</h1>
        {data?.products.length === 0 ? (
          <div>No products found</div>
        ) : (
          <>
            {data?.products.map((product: Product) => (
              <div className="search-data" key={product._id}>
                <div className="searchdata-image">
                  <Link to={`/product/${product._id}`} className="searchdata-image">
                    <img src={`${server}/${product.photos[0]}`} alt={product.name} />
                  </Link>
                </div>
                <div className="searchdata-details">
                  <Link to={`/product/${product._id}`} className="searchdata-image">
                    <h2>{product.name}</h2>
                    <p className="price">Price: Rs.{product.price}</p>
                    <p className="stock">Stock: {product.stock}</p>
                    <p className="brand">Brand: {product.brand}</p>
                    <div className="product-rating">
                      {renderStars(product.ratings)}
                    </div>
                    <p>NumOfReviews: {product.numOfReviews}</p>
                  </Link>
                  <button
                    className="AddToCart"
                    onClick={() => addToCartHandler(product)}
                  >
                    <FaPlus /> Add to cart
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
