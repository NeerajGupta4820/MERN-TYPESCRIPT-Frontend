import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/loader";
import ProductCard from "../components/product-card";
import { useLatestProdcutsQuery, useProductCategoryQuery } from "../redux/api/productAPI";
import { useGetAllCategoriesQuery } from "../redux/api/categoryAPI";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartItem, Category, Product } from "../types/types";
import logo from '../assets/svg.png';
import image1 from '../assets/image1.webp';
import image2 from '../assets/image2.webp';
import image3 from '../assets/image3.webp';
import image4 from '../assets/image4.webp';
import image5 from '../assets/image5.webp';
import image6 from '../assets/image6.webp';
import image7 from '../assets/image7.webp';
import image8 from '../assets/image8.webp';

const Home = () => {
  const { data: latestProductsData, isLoading: latestProductsLoading, isError: latestProductsError } = useLatestProdcutsQuery("");
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useGetAllCategoriesQuery();
  
  const dispatch = useDispatch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [image1, image2, image3, image4, image5, image6, image7, image8];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productsToShowDesktop = 4;
  const productsToShowMobile = 2; 

  useEffect(() => {
    if (!latestProductsData?.products) return;
    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % latestProductsData.products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [latestProductsData?.products]);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (latestProductsError || categoriesError) toast.error("Cannot Fetch the Products");

  const getProductsToShow = () => {
    if (!latestProductsData?.products || !Array.isArray(latestProductsData.products)) return [];

    const numProductsToShow = window.innerWidth >= 768 ? productsToShowDesktop : productsToShowMobile;
    
    const slicedProducts = [];
    for (let i = currentProductIndex; i < currentProductIndex + numProductsToShow; i++) {
      const index = i % latestProductsData.products.length;
      slicedProducts.push(latestProductsData.products[index]);
    }
    return slicedProducts;
  };

  const handlePrevClick = () => {
    if (!latestProductsData?.products || !Array.isArray(latestProductsData.products)) return;
    setCurrentProductIndex((prevIndex) => (prevIndex - 1 + latestProductsData.products.length) % latestProductsData.products.length);
  };

  const handleNextClick = () => {
    if (!latestProductsData?.products || !Array.isArray(latestProductsData.products)) return;
    setCurrentProductIndex((prevIndex) => (prevIndex + 1) % latestProductsData.products.length);
  };

  return (
    <div className="home">
      <section className="header-section">
        <div className="header-images">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Slide ${index + 1}`}
              className={`header-image ${index === currentImageIndex ? "active" : ""}`}
            />
          ))}
        </div>
      </section>
      <h1>
        Latest Products
        <Link to="/filter" className="findmore">
          More
        </Link>
      </h1>

      <main className="product-slider">
        {latestProductsLoading ? (
          <Skeleton width="80vw" />
        ) : (
          <div className="slider-container">
            <button className="slider-button prev" onClick={handlePrevClick}>&lt;</button>
            <div className="slider-track">
              { getProductsToShow().map((product: Product) => (
                <ProductCard
                  key={product._id}
                  productId={product._id}
                  name={product.name}
                  price={product.price}
                  stock={product.stock}
                  handler={addToCartHandler}
                  photo={product.photos && product.photos[0]}
                  rating={product.ratings}
                />
              ))}
            </div>
            <button className="slider-button next" onClick={handleNextClick}>&gt;</button>
          </div>
        )}
      </main>
      <section className="banner2">
        <div className="content">
          <button className="action-button">Click Me</button>
          <h2>Dummy Text on the Left Side</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam ultricies enim at nulla gravida, sit amet placerat nunc viverra.</p>
        </div>
        <img src={logo} alt="Logo" className="logo" />
      </section> 

      <section className="categories">
        <h2>All Categories</h2>
        {categoriesLoading ? (
          <Skeleton width="80vw" />
        ) : (
          <ul>
            {categoriesData?.categories?.slice(0, 2).map((category: Category) => (
              <li key={category._id}>
                <h2>{category.name}</h2>
                <ProductCategorySection categorySlug={category.slug} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

const ProductCategorySection: React.FC<{ categorySlug: string }> = ({ categorySlug }) => {
  const { data: categoryProductsData, isLoading: categoryProductsLoading, isError: categoryProductsError } = useProductCategoryQuery(categorySlug);

  const dispatch = useDispatch();

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productsToShowDesktop = 4;
  const productsToShowMobile = 2;

  useEffect(() => {
    if (!categoryProductsData?.products) return;

    const interval = setInterval(() => {
      setCurrentProductIndex((prevIndex) => (prevIndex + 1) % categoryProductsData.products.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [categoryProductsData?.products]);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  if (categoryProductsError) {
    toast.error(`Cannot Fetch Products for Category: ${categorySlug}`);
    return null; // Render nothing if there's an error
  }

  const getCategoryProductsToShow = () => {
    if (!categoryProductsData?.products || !Array.isArray(categoryProductsData.products)) {
      return [];
    }

    const numProductsToShow = window.innerWidth >= 768 ? productsToShowDesktop : productsToShowMobile;
  
    const slicedProducts = [];
    for (let i = currentProductIndex; i < currentProductIndex + numProductsToShow; i++) {
      const index = i % categoryProductsData.products.length;
      const product = categoryProductsData.products[index];
      if (product) {
        slicedProducts.push(product);
      }
    }
    return slicedProducts;
  };

  const handlePrevClick = () => {
    if (!categoryProductsData?.products || !Array.isArray(categoryProductsData.products)) return;
    setCurrentProductIndex((prevIndex) => (prevIndex - 1 + categoryProductsData.products.length) % categoryProductsData.products.length);
  };

  const handleNextClick = () => {
    if (!categoryProductsData?.products || !Array.isArray(categoryProductsData.products)) return;
    setCurrentProductIndex((prevIndex) => (prevIndex + 1) % categoryProductsData.products.length);
  };

  return (
    <div className="category-products">
      {categoryProductsLoading ? (
        <Skeleton width="80vw" />
      ) : (
        <div className="slider-container">
          <button className="slider-button prev" onClick={handlePrevClick}>&lt;</button>
          <div className="slider-track">
            {getCategoryProductsToShow().map((product: Product) => (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                price={product.price}
                stock={product.stock}
                handler={addToCartHandler}
                photo={product.photos && product.photos[0]}
                rating={product.ratings}
              />
            ))}
          </div>
          <button className="slider-button next" onClick={handleNextClick}>&gt;</button>
        </div>
      )}
    </div>
  );
};

export default Home;
