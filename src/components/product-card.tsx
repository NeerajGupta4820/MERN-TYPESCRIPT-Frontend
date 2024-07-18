import { FaPlus, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (CartItem: CartItem) => string | undefined;
  rating: number; 
};

const ProductCard = ({
  productId,
  price,
  name,
  photo,
  stock,
  handler,
  rating,
}: ProductsProps) => {
  const renderStars = (rating:number) => {
    const fullStars = Math.floor(rating); 
    const hasHalfStar = rating % 1 !== 0; 
    const emptyStars = 5 - Math.ceil(rating); 
  
    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="star-icon" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="star-icon" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="star-icon" />);
    }
  
    return stars;
  };
  

  return (
    <div className="product-card">
      <div className="imgBox">
        <Link to={`/product/${productId}`}>
          <img
            src={`${server}/${photo}`}
            alt={name}
            className="product-img"
          />
        </Link>
      </div>
      <div className="contentBox">
        <Link to={`/product/${productId}`}>
          <h3>{name}</h3>
          <h2 className="price">₹{price}</h2>
        </Link>
        <div className="product-rating">{renderStars(rating)}</div>
        <button
          className="buy"
          onClick={() =>
            handler({ productId, price, name, photo, stock, quantity: 1 })
          }
        >
          <FaPlus />
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
