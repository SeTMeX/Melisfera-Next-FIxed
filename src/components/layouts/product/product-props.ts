 export type ProductProps = {
    productId: string;          // Used for navigation
    name: string;               // e.g. "Sauvage"
    subtitle: string;           // e.g. "Eau De Parfum"
    image: string;              // Image URL
    badges?: string[];          // e.g. ["Fully Infused With", "Rare Notes"]
    description: string;        // Product description
    price: number;              // 240
    currency?: string;          // "$"
    isLarge?: boolean;
    backgroundClass?: string
};