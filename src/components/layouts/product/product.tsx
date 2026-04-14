"use client";

import type {ProductProps} from "./product-props.ts";

const Product = ({
                     productId,
                     name,
                     subtitle,
                     image,
                     badges = [],
                     description,
                     price,
                     isLarge,
         backgroundClass
                 }: ProductProps) => {
    const handleGoToProduct = () => {
        window.location.href = `/product/${productId}`;
    };

    return (
        <div className={['product', backgroundClass, isLarge ? 'large' : ''].join(' ')}>
            <div className="product-badges">
                {badges.map((badge, index) => (
                    <span key={index} className="product-badge">
            {badge}
          </span>
                ))}
            </div>

            <div className="product-content">
                <div className="product-left">
                    <img src={image} alt={name} className="product-image" />
                    <h2 className="product-name">{name}</h2>
                    <p className="product-subtitle">{subtitle}</p>
                </div>

                <div className="product-right">
                    <p className="product-description">{description}</p>

                    <div className="product-price">
                        ${price.toFixed(2)}
                    </div>

                    <button
                        className="product-button"
                        onClick={handleGoToProduct}
                    >
                        Go to Product Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;