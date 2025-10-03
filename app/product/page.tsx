import ProductPage from '@/components/product-page'

// This would typically come from your database or API
const productData = {
  id: "forbidden-flame-tee",
  name: "The Forbidden Flame Tee",
  price: 1, // Updated to match database
  description: "Elevate your streetwear game with our premium Forbidden Flame Tee. This isn't just another t-shirt – it's a statement piece that embodies the rebellious spirit of modern fashion. Crafted with meticulous attention to detail, this tee features a striking flame design that represents passion, energy, and the fire within every fashion enthusiast.",
  images: [
    "/product.png",
    "/image_1.jpg",    // Main product image
    "/image_2.jpg",    // Alternative view
    "/image_3.jpg",    // Detail shot
  ],
  category: "clothing",
  features: [
    "Premium Fabric: 100% Cotton French Terry (Loopknit) — 240 GSM heavyweight build",
    "Luxury Finish: Bio-washed & enzyme-treated for unmatched softness & smooth texture",
    "Unique Print Work: Front red flame design with legendary warrior artwork on back",
    "Back Design: Durable screen print with red bold puff print (3D raised texture)",
    "Streetwear Fit: Oversized cut with perfect drape for everyday & statement wear",
    "Breathability: Loop knit promotes airflow for comfort in all seasons"
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