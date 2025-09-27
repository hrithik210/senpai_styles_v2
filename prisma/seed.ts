import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a sample product
  const product = await prisma.product.upsert({
    where: { id: 'forbidden-flame-tee' },
    update: {},
    create: {
      id: 'forbidden-flame-tee',
      name: 'The Forbidden Flame Tee',
      price: 899,
      description: 'Premium quality t-shirt with unique flame design',
      image: '/product.png',
      category: 'clothing',
      isActive: true,
    },
  })

  console.log('Created product:', product)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })