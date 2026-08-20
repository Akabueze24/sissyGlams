import { Product } from '../models/product-models/product.model';

export const PRODUCTS: Product[] = [
  {
    id: 'dress-001',
    name: 'Blush Satin Wrap Dress',
    slug: 'blush-satin-wrap-dress',
    brand: 'Sissy Glams',

    category: 'dresses',

    subcategory: {
      name: 'Mini Dresses',
      slug: 'mini-dresses',
      category: 'dresses'
    },

    // Default gallery
    images: [
      'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Front',
      'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Back',
      'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Side',
      'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Detail'
    ],

    // Pricing
    price: 42.99,
    oldPrice: 59.99,

    // Description, details, shipping and returns
    productDetails: {
      description:
        'A soft satin wrap dress with a flattering tie waist and flowing skirt — designed to feel elegant and move beautifully, from everyday wear to your next special occasion.',

      details: [
        'Fabric: 95% satin polyester, 5% spandex',
        'Wrap-tie waist with adjustable fit',
        'Machine washable, cold, gentle cycle',
        'Imported'
      ],

      shipping:
        'Free worldwide shipping on orders over $50. Orders are processed within 1–2 business days and typically arrive within 5–10 business days depending on destination.',

      returns:
        'Returns are accepted within 30 days of delivery for unworn items with tags attached.'
    },

    // Colors customers can select
    colors: [
      {
        name: 'Pink',
        value: 'pink',
        image:
          'https://placehold.co/80x80/ffd6e8/e8558c?text=Pink'
      },
      {
        name: 'Black',
        value: 'black',
        image:
          'https://placehold.co/80x80/2b2b2b/ffffff?text=Black'
      },
      {
        name: 'Red',
        value: 'red',
        image:
          'https://placehold.co/80x80/c62841/ffffff?text=Red'
      }
    ],

    // Images belonging to each color
    colorGalleries: [
      {
        color: {
          name: 'Pink',
          value: 'pink',
          image:
            'https://placehold.co/80x80/ffd6e8/e8558c?text=Pink'
        },

        images: [
          'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Front',
          'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Back',
          'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Side',
          'https://placehold.co/800x800/ffd6e8/e8558c?text=Pink+Detail'
        ]
      },

      {
        color: {
          name: 'Black',
          value: 'black',
          image:
            'https://placehold.co/80x80/2b2b2b/ffffff?text=Black'
        },

        images: [
          'https://placehold.co/800x800/2b2b2b/ffffff?text=Black+Front',
          'https://placehold.co/800x800/2b2b2b/ffffff?text=Black+Back',
          'https://placehold.co/800x800/2b2b2b/ffffff?text=Black+Side',
          'https://placehold.co/800x800/2b2b2b/ffffff?text=Black+Detail'
        ]
      },

      {
        color: {
          name: 'Red',
          value: 'red',
          image:
            'https://placehold.co/800x800/c62841/ffffff?text=Red'
        },

        images: [
          'https://placehold.co/800x800/c62841/ffffff?text=Red+Front',
          'https://placehold.co/800x800/c62841/ffffff?text=Red+Back',
          'https://placehold.co/800x800/c62841/ffffff?text=Red+Side',
          'https://placehold.co/800x800/c62841/ffffff?text=Red+Detail'
        ]
      }
    ],

    // Sizes
    sizes: [
      {
        name: 'Small',
        value: 'S'
      },
      {
        name: 'Medium',
        value: 'M'
      },
      {
        name: 'Large',
        value: 'L'
      },
      {
        name: 'Extra Large',
        value: 'XL'
      }
    ],

    // Reviews
    rating: 4.5,
    reviewCount: 28,

    // Collections
    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals'
      },
      {
        name: 'Best Sellers',
        slug: 'best-sellers'
      }
    ],

    active: true
  },
  {
  id: 'dress-002',
  name: 'Midnight Ruched Mini Dress',
  slug: 'midnight-ruched-mini-dress',
  brand: 'Sissy Glams',

  category: 'dresses',

  subcategory: {
    name: 'Mini Dresses',
    slug: 'mini-dresses',
    category: 'dresses'
  },

  images: [
    'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Front',
    'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Back',
    'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Side',
    'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Detail'
  ],

  price: 36.99,
  oldPrice: 49.99,

  productDetails: {
    description:
      'A sleek ruched mini dress designed with a flattering fitted silhouette and soft stretch fabric. Perfect for nights out, parties and special occasions.',

    details: [
      'Fabric: 92% polyester, 8% spandex',
      'Adjustable side ruching',
      'Fitted mini silhouette',
      'Machine washable, cold, gentle cycle',
      'Imported'
    ],

    shipping:
      'Free worldwide shipping on orders over $50. Orders are processed within 1–2 business days and typically arrive within 5–10 business days depending on destination.',

    returns:
      'Returns are accepted within 30 days of delivery for unworn items with tags attached.'
  },

  colors: [
    {
      name: 'Black',
      value: 'black',
      image:
        'https://placehold.co/80x80/1f1f1f/ffffff?text=Black'
    },
    {
      name: 'Wine',
      value: 'wine',
      image:
        'https://placehold.co/80x80/72243a/ffffff?text=Wine'
    },
    {
      name: 'Ivory',
      value: 'ivory',
      image:
        'https://placehold.co/80x80/f5eee5/333333?text=Ivory'
    }
  ],

  colorGalleries: [
    {
      color: {
        name: 'Black',
        value: 'black',
        image:
          'https://placehold.co/80x80/1f1f1f/ffffff?text=Black'
      },

      images: [
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Front',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Back',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Side',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Detail'
      ]
    },

    {
      color: {
        name: 'Wine',
        value: 'wine',
        image:
          'https://placehold.co/80x80/72243a/ffffff?text=Wine'
      },

      images: [
        'https://placehold.co/800x800/72243a/ffffff?text=Wine+Front',
        'https://placehold.co/800x800/72243a/ffffff?text=Wine+Back',
        'https://placehold.co/800x800/72243a/ffffff?text=Wine+Side',
        'https://placehold.co/800x800/72243a/ffffff?text=Wine+Detail'
      ]
    },

    {
      color: {
        name: 'Ivory',
        value: 'ivory',
        image:
          'https://placehold.co/80x80/f5eee5/333333?text=Ivory'
      },

      images: [
        'https://placehold.co/800x800/f5eee5/333333?text=Ivory+Front',
        'https://placehold.co/800x800/f5eee5/333333?text=Ivory+Back',
        'https://placehold.co/800x800/f5eee5/333333?text=Ivory+Side',
        'https://placehold.co/800x800/f5eee5/333333?text=Ivory+Detail'
      ]
    }
  ],

  sizes: [
    {
      name: 'Small',
      value: 'S'
    },
    {
      name: 'Medium',
      value: 'M'
    },
    {
      name: 'Large',
      value: 'L'
    },
    {
      name: 'Extra Large',
      value: 'XL'
    }
  ],

  rating: 4.7,
  reviewCount: 41,

  collections: [
    {
      name: 'New Arrivals',
      slug: 'new-arrivals'
    },
    {
      name: 'Best Sellers',
      slug: 'best-sellers'
    }
  ],

  active: true
},

{
  id: 'wig-001',
  name: 'Silky Straight Lace Front Wig',
  slug: 'silky-straight-lace-front-wig',
  brand: 'Sissy Glams',

  category: 'wigs',

  subcategory: {
    name: 'Straight Wigs',
    slug: 'straight-wigs',
    category: 'wigs'
  },

  images: [
    'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Front',
    'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Back',
    'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Side',
    'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Detail'
  ],

  price: 129.99,
  oldPrice: 159.99,

  productDetails: {
    description:
      'A silky straight lace front wig with a natural-looking hairline and soft, flowing strands. Designed for a sleek everyday look with effortless styling.',

    details: [
      'Hair type: Premium synthetic fiber',
      'Lace front construction',
      'Pre-styled straight texture',
      'Adjustable inner straps',
      'Heat-resistant fiber'
    ],

    shipping:
      'Free worldwide shipping on orders over $50. Orders are processed within 1–2 business days and typically arrive within 5–10 business days depending on destination.',

    returns:
      'Returns are accepted within 30 days of delivery for unused wigs that remain in their original condition.'
  },

  colors: [
    {
      name: 'Natural Black',
      value: 'natural-black',
      image:
        'https://placehold.co/80x80/2b211d/ffffff?text=Natural+Black'
    },
    {
      name: 'Dark Brown',
      value: 'dark-brown',
      image:
        'https://placehold.co/80x80/4a2c20/ffffff?text=Dark+Brown'
    },
    {
      name: 'Burgundy',
      value: 'burgundy',
      image:
        'https://placehold.co/80x80/641f35/ffffff?text=Burgundy'
    }
  ],

  colorGalleries: [
    {
      color: {
        name: 'Natural Black',
        value: 'natural-black',
        image:
          'https://placehold.co/80x80/2b211d/ffffff?text=Natural+Black'
      },

      images: [
        'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Front',
        'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Back',
        'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Side',
        'https://placehold.co/800x800/2b211d/ffffff?text=Natural+Black+Detail'
      ]
    },

    {
      color: {
        name: 'Dark Brown',
        value: 'dark-brown',
        image:
          'https://placehold.co/80x80/4a2c20/ffffff?text=Dark+Brown'
      },

      images: [
        'https://placehold.co/800x800/4a2c20/ffffff?text=Dark+Brown+Front',
        'https://placehold.co/800x800/4a2c20/ffffff?text=Dark+Brown+Back',
        'https://placehold.co/800x800/4a2c20/ffffff?text=Dark+Brown+Side',
        'https://placehold.co/800x800/4a2c20/ffffff?text=Dark+Brown+Detail'
      ]
    },

    {
      color: {
        name: 'Burgundy',
        value: 'burgundy',
        image:
          'https://placehold.co/80x80/641f35/ffffff?text=Burgundy'
      },

      images: [
        'https://placehold.co/800x800/641f35/ffffff?text=Burgundy+Front',
        'https://placehold.co/800x800/641f35/ffffff?text=Burgundy+Back',
        'https://placehold.co/800x800/641f35/ffffff?text=Burgundy+Side',
        'https://placehold.co/800x800/641f35/ffffff?text=Burgundy+Detail'
      ]
    }
  ],

  sizes: [],

  lengths: [
    {
      name: '18 inches',
      value: '18'
    },
    {
      name: '20 inches',
      value: '20'
    },
    {
      name: '22 inches',
      value: '22'
    },
    {
      name: '24 inches',
      value: '24'
    }
  ],

  rating: 4.8,
  reviewCount: 56,

  collections: [
    {
      name: 'New Arrivals',
      slug: 'new-arrivals'
    },
    {
      name: 'Best Sellers',
      slug: 'best-sellers'
    }
  ],

  active: true
},

{
  id: 'top-001',
  name: 'Satin Cowl Neck Crop Top',
  slug: 'satin-cowl-neck-crop-top',
  brand: 'Sissy Glams',

  category: 'tops',

  subcategory: {
    name: 'Crop Tops',
    slug: 'crop-tops',
    category: 'tops'
  },

  images: [
    'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Front',
    'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Back',
    'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Side',
    'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Detail'
  ],

  price: 24.99,
  oldPrice: 32.99,

  productDetails: {
    description:
      'A feminine satin crop top featuring a soft cowl neckline and delicate adjustable straps. A versatile piece that pairs beautifully with skirts, trousers and jeans.',

    details: [
      'Fabric: 100% polyester satin',
      'Cowl neckline',
      'Adjustable shoulder straps',
      'Cropped silhouette',
      'Imported'
    ],

    shipping:
      'Free worldwide shipping on orders over $50. Orders are processed within 1–2 business days and typically arrive within 5–10 business days depending on destination.',

    returns:
      'Returns are accepted within 30 days of delivery for unworn items with tags attached.'
  },

  colors: [
    {
      name: 'Blush',
      value: 'blush',
      image:
        'https://placehold.co/80x80/f3c6d8/333333?text=Blush'
    },
    {
      name: 'Champagne',
      value: 'champagne',
      image:
        'https://placehold.co/80x80/e8d5b5/333333?text=Champagne'
    },
    {
      name: 'Black',
      value: 'black',
      image:
        'https://placehold.co/80x80/1f1f1f/ffffff?text=Black'
    }
  ],

  colorGalleries: [
    {
      color: {
        name: 'Blush',
        value: 'blush',
        image:
          'https://placehold.co/80x80/f3c6d8/333333?text=Blush'
      },

      images: [
        'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Front',
        'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Back',
        'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Side',
        'https://placehold.co/800x800/f3c6d8/333333?text=Blush+Detail'
      ]
    },

    {
      color: {
        name: 'Champagne',
        value: 'champagne',
        image:
          'https://placehold.co/80x80/e8d5b5/333333?text=Champagne'
      },

      images: [
        'https://placehold.co/800x800/e8d5b5/333333?text=Champagne+Front',
        'https://placehold.co/800x800/e8d5b5/333333?text=Champagne+Back',
        'https://placehold.co/800x800/e8d5b5/333333?text=Champagne+Side',
        'https://placehold.co/800x800/e8d5b5/333333?text=Champagne+Detail'
      ]
    },

    {
      color: {
        name: 'Black',
        value: 'black',
        image:
          'https://placehold.co/80x80/1f1f1f/ffffff?text=Black'
      },

      images: [
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Front',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Back',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Side',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Detail'
      ]
    }
  ],

  sizes: [
    {
      name: 'Small',
      value: 'S'
    },
    {
      name: 'Medium',
      value: 'M'
    },
    {
      name: 'Large',
      value: 'L'
    },
    {
      name: 'Extra Large',
      value: 'XL'
    }
  ],

  rating: 4.6,
  reviewCount: 19,

  collections: [
    {
      name: 'New Arrivals',
      slug: 'new-arrivals'
    }
  ],

  active: true
},

{
  id: 'bottom-001',
  name: 'High Waist Wide Leg Trousers',
  slug: 'high-waist-wide-leg-trousers',
  brand: 'Sissy Glams',

  category: 'bottoms',

  subcategory: {
    name: 'Trousers',
    slug: 'trousers',
    category: 'bottoms'
  },

  images: [
    'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Front',
    'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Back',
    'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Side',
    'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Detail'
  ],

  price: 39.99,
  oldPrice: 52.99,

  productDetails: {
    description:
      'Elegant high-waisted trousers with a flowing wide-leg silhouette. Designed to create a polished look while keeping you comfortable throughout the day.',

    details: [
      'Fabric: 95% polyester, 5% spandex',
      'High-rise waist',
      'Wide-leg silhouette',
      'Side pockets',
      'Concealed zip fastening',
      'Imported'
    ],

    shipping:
      'Free worldwide shipping on orders over $50. Orders are processed within 1–2 business days and typically arrive within 5–10 business days depending on destination.',

    returns:
      'Returns are accepted within 30 days of delivery for unworn items with tags attached.'
  },

  colors: [
    {
      name: 'Mocha',
      value: 'mocha',
      image:
        'https://placehold.co/80x80/e7d9ce/333333?text=Mocha'
    },
    {
      name: 'Black',
      value: 'black',
      image:
        'https://placehold.co/80x80/1f1f1f/ffffff?text=Black'
    },
    {
      name: 'Cream',
      value: 'cream',
      image:
        'https://placehold.co/80x80/f3eadb/333333?text=Cream'
    }
  ],

  colorGalleries: [
    {
      color: {
        name: 'Mocha',
        value: 'mocha',
        image:
          'https://placehold.co/80x80/e7d9ce/333333?text=Mocha'
      },

      images: [
        'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Front',
        'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Back',
        'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Side',
        'https://placehold.co/800x800/e7d9ce/333333?text=Mocha+Detail'
      ]
    },

    {
      color: {
        name: 'Black',
        value: 'black',
        image:
          'https://placehold.co/80x80/1f1f1f/ffffff?text=Black'
      },

      images: [
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Front',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Back',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Side',
        'https://placehold.co/800x800/1f1f1f/ffffff?text=Black+Detail'
      ]
    },

    {
      color: {
        name: 'Cream',
        value: 'cream',
        image:
          'https://placehold.co/80x80/f3eadb/333333?text=Cream'
      },

      images: [
        'https://placehold.co/800x800/f3eadb/333333?text=Cream+Front',
        'https://placehold.co/800x800/f3eadb/333333?text=Cream+Back',
        'https://placehold.co/800x800/f3eadb/333333?text=Cream+Side',
        'https://placehold.co/800x800/f3eadb/333333?text=Cream+Detail'
      ]
    }
  ],

  sizes: [
    {
      name: 'Small',
      value: 'S'
    },
    {
      name: 'Medium',
      value: 'M'
    },
    {
      name: 'Large',
      value: 'L'
    },
    {
      name: 'Extra Large',
      value: 'XL'
    }
  ],

  rating: 4.4,
  reviewCount: 15,

  collections: [
    {
      name: 'Best Sellers',
      slug: 'best-sellers'
    }
  ],

  active: true
},
];