import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetailsQuery, useRelatedProductsQuery, useAllReviewsOfProductsQuery, useNewReviewMutation } from '../redux/api/productAPI'; 
import { Skeleton } from '../components/loader';
import { FaPlus, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import toast from "react-hot-toast";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/reducer/cartReducer';
import ProductCard from '../components/product-card';
import { RootState, server } from '../redux/store';
import { Product } from '../types/types';
import { Review } from '../types/types';
import { CartItem } from '../types/types';

const ProductDetails = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { data: productData, isLoading, isError } = useProductDetailsQuery(id!);
  const { data: relatedProductsData } = useRelatedProductsQuery(id!);
  const { data: reviewsData } = useAllReviewsOfProductsQuery(id!); 
  const [mainImage, setMainImage] = useState<string>('');
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentRelatedProductIndex, setCurrentRelatedProductIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  const [submitReviewMutation] = useNewReviewMutation();

  useEffect(() => {
    if (productData && productData.product.photos.length > 0) {
      setMainImage(productData.product.photos[0]);
    }
  }, [productData]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) return <Skeleton  />;
  if (isError || !productData) return <div>Product not found</div>;

  const { product } = productData;

  const addToCartHandler = (product:Product) => {
    const cartItem:CartItem= {
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

  const handleThumbnailClick = (photo:string) => {
    setMainImage(photo);
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handlePrevRelatedClick = () => {
    setCurrentRelatedProductIndex((prevIndex) => (prevIndex - 1 + relatedProductsData!.products.length) % relatedProductsData!.products.length);
  };

  const handleNextRelatedClick = () => {
    setCurrentRelatedProductIndex((prevIndex) => (prevIndex + 1) % relatedProductsData!.products.length);
  };

  const getProductsToShow = () => {
    if (!relatedProductsData?.products || relatedProductsData.products.length === 0) {
      return [];
    }
    const productsToShow = windowWidth < 769 ? 2 : 4;
    const slicedProducts = [];
    for (let i = currentRelatedProductIndex; i < currentRelatedProductIndex + productsToShow; i++) {
      const index = i % relatedProductsData.products.length;
      const product = relatedProductsData.products[index];
      if (product) {
        slicedProducts.push(product);
      }
    }
    return slicedProducts;
  };

  const submitReview = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      console.error("Product ID is undefined");
      return;
    }
    try {
      const result = await submitReviewMutation({
        productId: id,
        userId: user?._id,
        comment,
        rating,
      });

      if (result && result.data && result.data.success) {
        toast.success(result.data.message);
        setComment('');
        setRating(0);
        window.scrollTo(0, 0);
      } else {
        toast.error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      toast.error("Failed to add review");
    }
  };

  const renderStars = (rating:number) => {
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

  return (
    <div className='product-details-main'>
      <div className="product-details">
        <div className='product-details-img'>
          <div className="product-thumbs">
          {Array.isArray(product.photos) && product.photos.map((photo: string, index: number) => (
              <img
                key={index}
                src={`${server}/${photo}`}
                alt={`${product.name} - ${index + 1}`}
                className='product-thumb-img'
                onClick={() => handleThumbnailClick(photo)}
              />
            ))}
          </div>
          <img
            src={`${server}/${mainImage}`}
            alt={`${product.name} - main`}
            className='product-main-img'
          />
        </div>
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <h3>Price: ₹{product.price}</h3>
          <h4>Stock: {product.stock}</h4>
          <p>Brand: {product.brand}</p>
          <button className="AddToCart" onClick={() => addToCartHandler(product)}>
            <FaPlus /> Add to cart
          </button>
          <p>Dealer Name: {product.dealer}</p>
          {showFullDescription ? (
            <p>{product.description}</p>
          ) : (
            <p>{product.description.slice(0, 400)}...</p>
          )}
          {product.description.length > 400 && (
            <button onClick={toggleDescription}>
              {showFullDescription ? 'View less' : 'View more'}
            </button>
          )}
          <p>Number of Reviews: {product.numOfReviews}</p>
          <div className="product-rating">{renderStars(product.ratings)}</div>
        </div>
      </div>
      <h2>Related Products</h2>
      <main className="product-slider">
        {relatedProductsData && (
          <div className="slider-container">
            <button className="slider-button prev" onClick={handlePrevRelatedClick}>&lt;</button>
            <div className="slider-track">
              {getProductsToShow().map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  productId={relatedProduct._id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  stock={relatedProduct.stock}
                  handler={() => addToCartHandler(relatedProduct)}
                  photo={relatedProduct.photos[0]}
                  rating={relatedProduct.ratings}
                />
              ))}
            </div>
            <button className="slider-button next" onClick={handleNextRelatedClick}>&gt;</button>
          </div>
        )}
      </main>
      <div className="product-reviews">
        <h2>Customer Reviews</h2>
        <div className="reviews-list">
          {reviewsData && reviewsData.reviews.map((review:Review) => (
            <div key={review._id} className="review-item">
              <p>User: {review.user.name}</p>
              <div className="review-rating">{renderStars(review.rating)}</div>
              <p>Comment: {review.comment}</p>
            </div>
          ))}
        </div>
        <h3>Add a Review</h3>
        <form onSubmit={submitReview}>
          <label>
            Comment:
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
          </label>
          <label>
            Rating:
            <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min="1" max="5" required />
          </label>
          <button type="submit">Submit Review</button>
        </form>
      </div>
    </div>
  );
};

export default ProductDetails;
