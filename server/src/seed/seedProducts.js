
require('dotenv').config()

const mongoose = require('mongoose');
const Product = require('../models/product');

const sampleProducts = [
  {
    name: 'Test Satin Dress',
    slug: 'test-satin-dress',
    brand: 'Sissy Glams',
    category: 'dresses',
    subcategory: 'casual-dresses',
    images: ['https://placehold.co/800x1000?text=Black+Front'],
    price: 49.99,
    oldPrice: 69.99,
    productDetails: {
      description: 'Seeded test dress.',
      details: ['Soft fabric'],
      shipping: 'Ships in 2–5 days.',
      returns: '30-day returns.',
    },
    colors: [
      {
        name: 'Black',
        value: '#000000',
        image: 'https://placehold.co/100x100?text=Black',
      },
    ],
    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#000000',
          image: 'https://placehold.co/100x100?text=Black',
        },
        images: [
          'https://placehold.co/800x1000?text=Black+Front',
          'https://placehold.co/800x1000?text=Black+Side',
        ],
      },
    ],
    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
    ],
    stock: 10,
    active: true,
    rating: 4.5,
    reviewCount: 3,
  },
];

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI missing in .env');
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Optional: wipe products before seeding
    // await Product.deleteMany({});

    const result = await Product.insertMany(sampleProducts, { ordered: false });
    console.log(`Seeded ${result.length} product(s)`);
  } catch (err) {
    console.error(err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
    process.exit(0);
  }
};

seed();