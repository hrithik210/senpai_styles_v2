import ProductPage from '@/components/product-page'

// This would typically come from your database or API
const productData = {
  id: "forbidden-flame-tee",
  name: "The Forbidden Flame Tee",
  price: 899,
  description: "Elevate your streetwear game with our premium Forbidden Flame Tee. This isn't just another t-shirt – it's a statement piece that embodies the rebellious spirit of modern fashion. Crafted with meticulous attention to detail, this tee features a striking flame design that represents passion, energy, and the fire within every fashion enthusiast.",
  images: [
    "/product.png",
    "/image_1.jpg",    // Main product image
    "/image_2.jpg",    // Alternative view
    "/image_3.jpg",    // Detail shot
  ],
  category: "clothing",
  features: [
    "Premium 100% cotton fabric for ultimate comfort",
    "Unique flame design with heat-transfer printing",
    "Reinforced stitching for enhanced durability",
    "Pre-shrunk to maintain perfect fit after washing",
    "Breathable fabric ideal for all-day wear",
    "Unisex design suitable for all body types"
  ],
  materials: [
    "100% Premium Cotton",
    "Eco-friendly water-based inks",
    "Reinforced collar and cuffs",
    "Double-needle hemmed sleeves and bottom"
  ],
  careInstructions: [
    "Machine wash cold with like colors",
    "Use mild detergent, avoid bleach",
    "Tumble dry low or hang dry",
    "Iron inside out on low heat",
    "Do not dry clean",
    "Store in a cool, dry place"
  ]
}

export default function Product() {
  return <ProductPage product={productData} />
}