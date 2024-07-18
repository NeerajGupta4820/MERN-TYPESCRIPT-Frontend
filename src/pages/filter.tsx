import { useState } from "react";
import ProductCard from "../components/product-card";
import { useSearchDataQuery } from "../redux/api/productAPI"; 
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";

const Search = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(100000);
  const [page, setPage] = useState(1);
  const [brand, setBrand] = useState("");
  const [discount, setDiscount] = useState("");
  const [ratings, setRatings] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const dispatch = useDispatch();

  // List of discount options
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


  const {
    isLoading: productLoading,
    data: searchedData,
    isError: productIsError,
    error: productError,
  } = useSearchDataQuery({
    search,
    sort,
    page:page.toString(),
    price: maxPrice.toString(),
    brand,
    discount,
    ratings,
  });

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <button
        className="toggle-filters"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
      <aside className={`sidebar ${showFilters ? "show" : ""}`}>
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
                className={`rating-button ${ratings === option.value ? "active" : ""}`}
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
                className={`discount-button ${discount === option.value ? 'active' : ''}`}
                onClick={() => setDiscount(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </aside>
      <main>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          />
          <h1>Products</h1>

        {productLoading ? (
          <Skeleton length={10} />
        ) : (
          <div className="search-product-list">
            {searchedData?.products.map((i) => (
              <ProductCard
                key={i._id}
                productId={i._id}
                name={i.name}
                price={i.price}
                stock={i.stock}
                handler={addToCartHandler}
                photo={i.photos && i.photos[0]}
                rating={i.ratings}
              />
            ))}
          </div>
        )}

        {searchedData && searchedData.totalPage > 1 && (
          <article>
            <button
              disabled={!isPrevPage}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>
            <span>
              {page} of {4}
            </span>
            <button
              disabled={!isNextPage}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </article>
        )}
      </main>
    </div>
  );
};

export default Search;
