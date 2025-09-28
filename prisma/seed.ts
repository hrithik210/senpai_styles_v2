import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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

  const email = process.env.admin_email
  const password = process.env.password
  if (!email || !password) {
    throw new Error('Please set admin_email and password in the .env file')
  }
  const hashedPassword = await bcrypt.hash(password, 10)

  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      email: email.toLowerCase(),
      password: hashedPassword,
      name: 'Admin User',
      isActive: true,
    },
  })
  console.log('Created admin user:', admin.email)

  console.log('Seeding finished.')
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