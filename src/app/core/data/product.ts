import { Product } from '../models/product-models/product.model';

export const PRODUCTS: Product[] = [
  // ============================================================
  // DRESSES → CASUAL DRESSES
  // ============================================================

  {
    id: 'dress-001',
    name: 'Blush Satin Wrap Dress',
    slug: 'blush-satin-wrap-dress',
    brand: 'Sissy Dream',

    category: 'dresses',
    subcategory: 'casual-dresses',

    images: [
      'https://placehold.co/800x1000?text=Blush+Wrap+Dress+1',
      'https://placehold.co/800x1000?text=Blush+Wrap+Dress+2',
      'https://placehold.co/800x1000?text=Blush+Wrap+Dress+3',
      'https://placehold.co/800x1000?text=Blush+Wrap+Dress+4',
    ],

    price: 59.99,
    oldPrice: 74.99,

    productDetails: {
      description:
        'A soft satin wrap dress designed with a flattering silhouette and elegant feminine finish.',

      details: [
        'Soft satin fabric',
        'Wrap-front design',
        'Adjustable waist tie',
        'Elegant flowing silhouette',
        'Suitable for casual and evening styling',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Blush Pink',
        value: '#E8A9B8',
        image: 'https://placehold.co/800x1000?text=Blush+Pink',
      },
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Wine',
        value: '#722F37',
        image: 'https://placehold.co/800x1000?text=Wine',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Blush Pink',
          value: '#E8A9B8',
          image: 'https://placehold.co/800x1000?text=Blush+Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Blush+Pink+1',
          'https://placehold.co/800x1000?text=Blush+Pink+2',
          'https://placehold.co/800x1000?text=Blush+Pink+3',
          'https://placehold.co/800x1000?text=Blush+Pink+4',
        ],
      },

      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+1',
          'https://placehold.co/800x1000?text=Black+2',
          'https://placehold.co/800x1000?text=Black+3',
          'https://placehold.co/800x1000?text=Black+4',
        ],
      },

      {
        color: {
          name: 'Wine',
          value: '#722F37',
          image: 'https://placehold.co/800x1000?text=Wine',
        },

        images: [
          'https://placehold.co/800x1000?text=Wine+1',
          'https://placehold.co/800x1000?text=Wine+2',
          'https://placehold.co/800x1000?text=Wine+3',
          'https://placehold.co/800x1000?text=Wine+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 2.5,
    reviewCount: 36,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
    ],

    createdAt: '2026-08-20T10:30:00.000Z',

    active: true,
  },

  // ------------------------------------------------------------

  {
    id: 'dress-002',
    name: 'Everyday Ribbed Midi Dress',
    slug: 'everyday-ribbed-midi-dress',
    brand: 'Sissy Dream',

    category: 'dresses',
    subcategory: 'casual-dresses',

    images: [
      'https://placehold.co/800x1000?text=Ribbed+Midi+Dress+1',
      'https://placehold.co/800x1000?text=Ribbed+Midi+Dress+2',
      'https://placehold.co/800x1000?text=Ribbed+Midi+Dress+3',
      'https://placehold.co/800x1000?text=Ribbed+Midi+Dress+4',
    ],

    price: 44.99,

    productDetails: {
      description:
        'A comfortable ribbed midi dress with a simple silhouette for everyday styling.',

      details: [
        'Stretch ribbed fabric',
        'Midi length',
        'Fitted silhouette',
        'Soft everyday material',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Cream',
        value: '#F5F0E6',
        image: 'https://placehold.co/800x1000?text=Cream',
      },
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Cream',
          value: '#F5F0E6',
          image: 'https://placehold.co/800x1000?text=Cream',
        },

        images: [
          'https://placehold.co/800x1000?text=Cream+1',
          'https://placehold.co/800x1000?text=Cream+2',
          'https://placehold.co/800x1000?text=Cream+3',
          'https://placehold.co/800x1000?text=Cream+4',
        ],
      },

      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+1',
          'https://placehold.co/800x1000?text=Black+2',
          'https://placehold.co/800x1000?text=Black+3',
          'https://placehold.co/800x1000?text=Black+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 3.2,
    reviewCount: 21,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    createdAt: '2026-08-20T10:30:00.000Z',

    active: true,
  },

  // ============================================================
  // DRESSES → FANTASY DRESSES
  // ============================================================

  {
    id: 'dress-003',
    name: 'Princess Satin Ball Gown',
    slug: 'princess-satin-ball-gown',
    brand: 'Sissy Dream',

    category: 'dresses',
    subcategory: 'fantasy-dresses',

    images: [
      'https://placehold.co/800x1000?text=Princess+Gown+1',
      'https://placehold.co/800x1000?text=Princess+Gown+2',
      'https://placehold.co/800x1000?text=Princess+Gown+3',
      'https://placehold.co/800x1000?text=Princess+Gown+4',
    ],

    price: 119.99,
    oldPrice: 149.99,

    productDetails: {
      description:
        'A dramatic satin ball gown inspired by classic princess silhouettes.',

      details: [
        'Luxurious satin finish',
        'Full flowing skirt',
        'Structured bodice',
        'Elegant fantasy styling',
      ],

      shipping: 'Ships within 2–4 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Pink',
        value: '#E8A0B8',
        image: 'https://placehold.co/800x1000?text=Pink',
      },
      {
        name: 'Royal Blue',
        value: '#4169E1',
        image: 'https://placehold.co/800x1000?text=Royal+Blue',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image: 'https://placehold.co/800x1000?text=Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Pink+Gown+1',
          'https://placehold.co/800x1000?text=Pink+Gown+2',
          'https://placehold.co/800x1000?text=Pink+Gown+3',
          'https://placehold.co/800x1000?text=Pink+Gown+4',
        ],
      },

      {
        color: {
          name: 'Royal Blue',
          value: '#4169E1',
          image: 'https://placehold.co/800x1000?text=Royal+Blue',
        },

        images: [
          'https://placehold.co/800x1000?text=Blue+Gown+1',
          'https://placehold.co/800x1000?text=Blue+Gown+2',
          'https://placehold.co/800x1000?text=Blue+Gown+3',
          'https://placehold.co/800x1000?text=Blue+Gown+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    lengths: [
      { name: 'Midi', value: 'midi' },
      { name: 'Floor-Length', value: 'floor-length' },
    ],

    rating: 2.0,
    reviewCount: 18,

    collections: [
      {
        name: 'Featured',
        slug: 'featured',
      },
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    createdAt: '2026-08-20T10:30:00.000Z',
    active: true,
  },

  // ------------------------------------------------------------

  {
    id: 'dress-004',
    name: 'Ruffled Sissy Dress',
    slug: 'ruffled-sissy-dress',
    brand: 'Sissy Dream',

    category: 'dresses',
    subcategory: 'fantasy-dresses',

    images: [
      'https://placehold.co/800x1000?text=Ruffled+Dress+1',
      'https://placehold.co/800x1000?text=Ruffled+Dress+2',
      'https://placehold.co/800x1000?text=Ruffled+Dress+3',
      'https://placehold.co/800x1000?text=Ruffled+Dress+4',
    ],

    price: 897.99,

    productDetails: {
      description:
        'A playful fantasy dress featuring layered ruffles and a feminine silhouette.',

      details: [
        'Layered ruffle skirt',
        'Feminine silhouette',
        'Soft fabric',
        'Fantasy-inspired styling',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Baby Pink',
        value: '#F4B6C2',
        image: 'https://placehold.co/800x1000?text=Baby+Pink',
      },
      {
        name: 'Lavender',
        value: '#B57EDC',
        image: 'https://placehold.co/800x1000?text=Lavender',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Baby Pink',
          value: '#F4B6C2',
          image: 'https://placehold.co/800x1000?text=Baby+Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Pink+Ruffle+1',
          'https://placehold.co/800x1000?text=Pink+Ruffle+2',
          'https://placehold.co/800x1000?text=Pink+Ruffle+3',
          'https://placehold.co/800x1000?text=Pink+Ruffle+4',
        ],
      },

      {
        color: {
          name: 'Lavender',
          value: '#B57EDC',
          image: 'https://placehold.co/800x1000?text=Lavender',
        },

        images: [
          'https://placehold.co/800x1000?text=Lavender+1',
          'https://placehold.co/800x1000?text=Lavender+2',
          'https://placehold.co/800x1000?text=Lavender+3',
          'https://placehold.co/800x1000?text=Lavender+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 1.5,
    reviewCount: 29,

    collections: [
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
    ],

    active: true,
  },

  // ============================================================
  // DRESSES → MATCHING SETS
  // ============================================================

  {
    id: 'dress-005',
    name: 'Satin Crop Top & Skirt Set',
    slug: 'satin-crop-top-skirt-set',
    brand: 'Sissy Dream',

    category: 'dresses',
    subcategory: 'matching-sets',

    images: [
      'https://placehold.co/800x1000?text=Satin+Set+1',
      'https://placehold.co/800x1000?text=Satin+Set+2',
      'https://placehold.co/800x1000?text=Satin+Set+3',
      'https://placehold.co/800x1000?text=Satin+Set+4',
    ],

    price: 69.99,
    oldPrice: 84.99,

    productDetails: {
      description:
        'A coordinated satin crop top and skirt set designed for an elegant matching look.',

      details: [
        'Two-piece matching set',
        'Soft satin fabric',
        'Adjustable fit',
        'Can be styled together or separately',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Pink',
        value: '#E8A0B8',
        image: 'https://placehold.co/800x1000?text=Pink',
      },
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image: 'https://placehold.co/800x1000?text=Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Pink+Set+1',
          'https://placehold.co/800x1000?text=Pink+Set+2',
          'https://placehold.co/800x1000?text=Pink+Set+3',
          'https://placehold.co/800x1000?text=Pink+Set+4',
        ],
      },

      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+Set+1',
          'https://placehold.co/800x1000?text=Black+Set+2',
          'https://placehold.co/800x1000?text=Black+Set+3',
          'https://placehold.co/800x1000?text=Black+Set+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.5,
    reviewCount: 17,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    active: true,
  },

  // ============================================================
  // LINGERIE → BRAS
  // ============================================================

  {
    id: 'lingerie-001',
    name: 'Lace Push-Up Bra',
    slug: 'lace-push-up-bra',
    brand: 'Sissy Dream',

    category: 'lingerie',
    subcategory: 'bras',

    images: [
      'https://placehold.co/800x1000?text=Lace+Push+Up+Bra+1',
      'https://placehold.co/800x1000?text=Lace+Push+Up+Bra+2',
      'https://placehold.co/800x1000?text=Lace+Push+Up+Bra+3',
      'https://placehold.co/800x1000?text=Lace+Push+Up+Bra+4',
    ],

    price: 34.99,

    productDetails: {
      description:
        'A delicate lace push-up bra combining feminine styling with supportive construction.',

      details: [
        'Floral lace fabric',
        'Push-up cups',
        'Adjustable shoulder straps',
        'Hook-and-eye back closure',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Pink',
        value: '#E8A0B8',
        image: 'https://placehold.co/800x1000?text=Pink',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+Bra+1',
          'https://placehold.co/800x1000?text=Black+Bra+2',
          'https://placehold.co/800x1000?text=Black+Bra+3',
          'https://placehold.co/800x1000?text=Black+Bra+4',
        ],
      },

      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image: 'https://placehold.co/800x1000?text=Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Pink+Bra+1',
          'https://placehold.co/800x1000?text=Pink+Bra+2',
          'https://placehold.co/800x1000?text=Pink+Bra+3',
          'https://placehold.co/800x1000?text=Pink+Bra+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.6,
    reviewCount: 31,

    collections: [
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
    ],

    active: true,
  },

  // ============================================================
  // LINGERIE → LINGERIE SETS
  // ============================================================

  {
    id: 'lingerie-002',
    name: 'Floral Lace Lingerie Set',
    slug: 'floral-lace-lingerie-set',
    brand: 'Sissy Dream',

    category: 'lingerie',
    subcategory: 'lingerie-sets',

    images: [
      'https://placehold.co/800x1000?text=Floral+Lace+Set+1',
      'https://placehold.co/800x1000?text=Floral+Lace+Set+2',
      'https://placehold.co/800x1000?text=Floral+Lace+Set+3',
      'https://placehold.co/800x1000?text=Floral+Lace+Set+4',
    ],

    price: 49.99,
    oldPrice: 64.99,

    productDetails: {
      description:
        'A coordinated floral lace set designed with delicate details and a comfortable fit.',

      details: [
        'Three-piece coordinated design',
        'Floral lace',
        'Adjustable straps',
        'Soft stretch construction',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Burgundy',
        value: '#800020',
        image: 'https://placehold.co/800x1000?text=Burgundy',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+Set+1',
          'https://placehold.co/800x1000?text=Black+Set+2',
          'https://placehold.co/800x1000?text=Black+Set+3',
          'https://placehold.co/800x1000?text=Black+Set+4',
        ],
      },

      {
        color: {
          name: 'Burgundy',
          value: '#800020',
          image: 'https://placehold.co/800x1000?text=Burgundy',
        },

        images: [
          'https://placehold.co/800x1000?text=Burgundy+Set+1',
          'https://placehold.co/800x1000?text=Burgundy+Set+2',
          'https://placehold.co/800x1000?text=Burgundy+Set+3',
          'https://placehold.co/800x1000?text=Burgundy+Set+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.8,
    reviewCount: 42,

    collections: [
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
      {
        name: 'Featured',
        slug: 'featured',
      },
    ],

    active: true,
  },

  // ============================================================
  // LINGERIE → GARTER BELTS
  // ============================================================

  {
    id: 'lingerie-003',
    name: 'Satin Strap Garter Belt',
    slug: 'satin-strap-garter-belt',
    brand: 'Sissy Dream',

    category: 'lingerie',
    subcategory: 'garter-belts',

    images: [
      'https://placehold.co/800x1000?text=Satin+Garter+1',
      'https://placehold.co/800x1000?text=Satin+Garter+2',
      'https://placehold.co/800x1000?text=Satin+Garter+3',
      'https://placehold.co/800x1000?text=Satin+Garter+4',
    ],

    price: 29.99,

    productDetails: {
      description:
        'A satin garter belt with adjustable straps and elegant detailing.',

      details: [
        'Smooth satin finish',
        'Adjustable garter straps',
        'Hook-and-eye closure',
        'Comfortable stretch waistband',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Pink',
        value: '#E8A0B8',
        image: 'https://placehold.co/800x1000?text=Pink',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+Garter+1',
          'https://placehold.co/800x1000?text=Black+Garter+2',
          'https://placehold.co/800x1000?text=Black+Garter+3',
          'https://placehold.co/800x1000?text=Black+Garter+4',
        ],
      },

      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image: 'https://placehold.co/800x1000?text=Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Pink+Garter+1',
          'https://placehold.co/800x1000?text=Pink+Garter+2',
          'https://placehold.co/800x1000?text=Pink+Garter+3',
          'https://placehold.co/800x1000?text=Pink+Garter+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.5,
    reviewCount: 19,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    active: true,
  },

  // ============================================================
  // SHAPERS → CORSETS
  // ============================================================

  {
    id: 'shaper-001',
    name: 'Classic Steel-Boned Corset',
    slug: 'classic-steel-boned-corset',
    brand: 'Sissy Dream',

    category: 'shapers',
    subcategory: 'corsets',

    images: [
      'https://placehold.co/800x1000?text=Steel+Boned+Corset+1',
      'https://placehold.co/800x1000?text=Steel+Boned+Corset+2',
      'https://placehold.co/800x1000?text=Steel+Boned+Corset+3',
      'https://placehold.co/800x1000?text=Steel+Boned+Corset+4',
    ],

    price: 79.99,
    oldPrice: 94.99,

    productDetails: {
      description:
        'A structured steel-boned corset designed to create a classic fitted silhouette.',

      details: [
        'Steel boning',
        'Adjustable lace-up back',
        'Structured waist design',
        'Durable fabric construction',
      ],

      shipping: 'Ships within 2–4 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Pink',
        value: '#E8A0B8',
        image: 'https://placehold.co/800x1000?text=Pink',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+Corset+1',
          'https://placehold.co/800x1000?text=Black+Corset+2',
          'https://placehold.co/800x1000?text=Black+Corset+3',
          'https://placehold.co/800x1000?text=Black+Corset+4',
        ],
      },

      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image: 'https://placehold.co/800x1000?text=Pink',
        },

        images: [
          'https://placehold.co/800x1000?text=Pink+Corset+1',
          'https://placehold.co/800x1000?text=Pink+Corset+2',
          'https://placehold.co/800x1000?text=Pink+Corset+3',
          'https://placehold.co/800x1000?text=Pink+Corset+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.7,
    reviewCount: 27,

    collections: [
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
    ],

    active: true,
  },

  // ============================================================
  // SHAPERS → WAIST & BODY SHAPERS
  // ============================================================

  {
    id: 'shaper-002',
    name: 'Satin Waist-Cincher Shaper',
    slug: 'satin-waist-cincher-shaper',
    brand: 'Sissy Dream',

    category: 'shapers',
    subcategory: 'corsets',

    images: [
      'https://placehold.co/800x1000?text=Waist+Cincher+1',
      'https://placehold.co/800x1000?text=Waist+Cincher+2',
      'https://placehold.co/800x1000?text=Waist+Cincher+3',
      'https://placehold.co/800x1000?text=Waist+Cincher+4',
    ],

    price: 54.99,

    productDetails: {
      description:
        'A satin waist-cincher designed for a smooth and sculpted appearance.',

      details: [
        'Satin exterior',
        'Flexible boning',
        'Adjustable closure',
        'Designed for a fitted silhouette',
      ],

      shipping: 'Ships within 1–3 business days.',

      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#111111',
        image: 'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Nude',
        value: '#D2A679',
        image: 'https://placehold.co/800x1000?text=Nude',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image: 'https://placehold.co/800x1000?text=Black',
        },

        images: [
          'https://placehold.co/800x1000?text=Black+Cincher+1',
          'https://placehold.co/800x1000?text=Black+Cincher+2',
          'https://placehold.co/800x1000?text=Black+Cincher+3',
          'https://placehold.co/800x1000?text=Black+Cincher+4',
        ],
      },

      {
        color: {
          name: 'Nude',
          value: '#D2A679',
          image: 'https://placehold.co/800x1000?text=Nude',
        },

        images: [
          'https://placehold.co/800x1000?text=Nude+Cincher+1',
          'https://placehold.co/800x1000?text=Nude+Cincher+2',
          'https://placehold.co/800x1000?text=Nude+Cincher+3',
          'https://placehold.co/800x1000?text=Nude+Cincher+4',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.6,
    reviewCount: 23,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],
    createdAt: '2026-08-20T10:30:00.000Z',

    active: true,
  },

  // ============================================================
  // SHAPERS — CORSETS
  // ============================================================

  {
    id: 'corset-001',
    name: 'Classic Steel-Boned Corset',
    slug: 'classic-steel-boned-corset',
    brand: 'Sissy Dream',
    category: 'shapers',
    subcategory: 'corsets',

    images: [
      'https://placehold.co/800x1000?text=Classic+Corset+1',
      'https://placehold.co/800x1000?text=Classic+Corset+2',
      'https://placehold.co/800x1000?text=Classic+Corset+3',
      'https://placehold.co/800x1000?text=Classic+Corset+4',
    ],

    price: 79.99,
    oldPrice: 99.99,

    productDetails: {
      description:
        'A structured steel-boned corset designed to create a defined waist while providing comfortable support.',
      details: [
        'Steel-boned construction',
        'Adjustable lace-up back',
        'Structured waist design',
        'Suitable for styling and special occasions',
      ],
      shipping: 'Ships within 2–5 business days.',
      returns: 'Eligible for return according to store policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#000000',
        image: 'https://placehold.co/100x100?text=Black',
      },
      {
        name: 'Pink',
        value: '#e91e63',
        image: 'https://placehold.co/100x100?text=Pink',
      },
      {
        name: 'White',
        value: '#ffffff',
        image: 'https://placehold.co/100x100?text=White',
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
          'https://placehold.co/800x1000?text=Black+Corset+Front',
          'https://placehold.co/800x1000?text=Black+Corset+Side',
          'https://placehold.co/800x1000?text=Black+Corset+Back',
          'https://placehold.co/800x1000?text=Black+Corset+Detail',
        ],
      },
      {
        color: {
          name: 'Pink',
          value: '#e91e63',
          image: 'https://placehold.co/100x100?text=Pink',
        },
        images: [
          'https://placehold.co/800x1000?text=Pink+Corset+Front',
          'https://placehold.co/800x1000?text=Pink+Corset+Side',
          'https://placehold.co/800x1000?text=Pink+Corset+Back',
          'https://placehold.co/800x1000?text=Pink+Corset+Detail',
        ],
      },
      {
        color: {
          name: 'White',
          value: '#ffffff',
          image: 'https://placehold.co/100x100?text=White',
        },
        images: [
          'https://placehold.co/800x1000?text=White+Corset+Front',
          'https://placehold.co/800x1000?text=White+Corset+Side',
          'https://placehold.co/800x1000?text=White+Corset+Back',
          'https://placehold.co/800x1000?text=White+Corset+Detail',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],

    rating: 4.7,
    reviewCount: 38,

    collections: [
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
    ],

    active: true,
  },

  // ============================================================
  // SHAPERS — CORSETS
  // ============================================================

  {
    id: 'corset-002',
    name: 'Satin Waist-Cincher Corset',
    slug: 'satin-waist-cincher-corset',
    brand: 'Sissy Dream',
    category: 'shapers',
    subcategory: 'corsets',

    images: [
      'https://placehold.co/800x1000?text=Satin+Corset+1',
      'https://placehold.co/800x1000?text=Satin+Corset+2',
      'https://placehold.co/800x1000?text=Satin+Corset+3',
      'https://placehold.co/800x1000?text=Satin+Corset+4',
    ],

    price: 64.99,

    productDetails: {
      description:
        'A satin-finish waist cincher with a classic silhouette and adjustable back closure.',
      details: [
        'Smooth satin finish',
        'Structured waist support',
        'Adjustable back closure',
        'Designed for comfortable everyday styling',
      ],
      shipping: 'Ships within 2–5 business days.',
      returns: 'Eligible for return according to store policy.',
    },

    colors: [
      {
        name: 'Pink',
        value: '#f48fb1',
        image: 'https://placehold.co/100x100?text=Pink',
      },
      {
        name: 'Black',
        value: '#000000',
        image: 'https://placehold.co/100x100?text=Black',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Pink',
          value: '#f48fb1',
          image: 'https://placehold.co/100x100?text=Pink',
        },
        images: [
          'https://placehold.co/800x1000?text=Pink+Front',
          'https://placehold.co/800x1000?text=Pink+Side',
          'https://placehold.co/800x1000?text=Pink+Back',
          'https://placehold.co/800x1000?text=Pink+Detail',
        ],
      },
      {
        color: {
          name: 'Black',
          value: '#000000',
          image: 'https://placehold.co/100x100?text=Black',
        },
        images: [
          'https://placehold.co/800x1000?text=Black+Front',
          'https://placehold.co/800x1000?text=Black+Side',
          'https://placehold.co/800x1000?text=Black+Back',
          'https://placehold.co/800x1000?text=Black+Detail',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],

    rating: 4.5,
    reviewCount: 24,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    active: true,
  },

  // ============================================================
  // SHAPERS — CORSETS
  // ============================================================

  {
    id: 'corset-003',
    name: 'Lace-Up Underbust Corset',
    slug: 'lace-up-underbust-corset',
    brand: 'Sissy Dream',
    category: 'shapers',
    subcategory: 'corsets',

    images: [
      'https://placehold.co/800x1000?text=Underbust+Corset+1',
      'https://placehold.co/800x1000?text=Underbust+Corset+2',
      'https://placehold.co/800x1000?text=Underbust+Corset+3',
      'https://placehold.co/800x1000?text=Underbust+Corset+4',
    ],

    price: 72.99,
    oldPrice: 89.99,

    productDetails: {
      description:
        'A classic underbust corset featuring a lace-up back and structured silhouette.',
      details: [
        'Underbust design',
        'Adjustable lace-up back',
        'Structured construction',
        'Versatile styling piece',
      ],
      shipping: 'Ships within 2–5 business days.',
      returns: 'Eligible for return according to store policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#000000',
        image: 'https://placehold.co/100x100?text=Black',
      },
      {
        name: 'Red',
        value: '#d32f2f',
        image: 'https://placehold.co/100x100?text=Red',
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
          'https://placehold.co/800x1000?text=Black+Back',
          'https://placehold.co/800x1000?text=Black+Detail',
        ],
      },
      {
        color: {
          name: 'Red',
          value: '#d32f2f',
          image: 'https://placehold.co/100x100?text=Red',
        },
        images: [
          'https://placehold.co/800x1000?text=Red+Front',
          'https://placehold.co/800x1000?text=Red+Side',
          'https://placehold.co/800x1000?text=Red+Back',
          'https://placehold.co/800x1000?text=Red+Detail',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],

    rating: 4.8,
    reviewCount: 51,

    collections: [
      {
        name: 'Best Sellers',
        slug: 'best-sellers',
      },
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    active: true,
  },

  // ============================================================
  // SHAPERS — FAKE BOOBS
  // ============================================================

  {
    id: 'fake-boobs-001',
    name: 'Classic Silicone Breast Forms',
    slug: 'classic-silicone-breast-forms',
    brand: 'Sissy Dream',
    category: 'shapers',
    subcategory: 'fake-boobs',

    images: [
      'https://placehold.co/800x1000?text=Breast+Forms+1',
      'https://placehold.co/800x1000?text=Breast+Forms+2',
      'https://placehold.co/800x1000?text=Breast+Forms+3',
      'https://placehold.co/800x1000?text=Breast+Forms+4',
    ],

    price: 119.99,

    productDetails: {
      description:
        'Soft silicone breast forms designed for a natural-looking silhouette.',
      details: [
        'Soft silicone construction',
        'Smooth outer finish',
        'Balanced symmetrical shape',
        'Designed for comfortable wear',
      ],
      shipping: 'Ships within 2–5 business days.',
      returns: 'Eligible for return according to store policy.',
    },

    colors: [
      {
        name: 'Natural',
        value: '#e8b89a',
        image: 'https://placehold.co/100x100?text=Natural',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Natural',
          value: '#e8b89a',
          image: 'https://placehold.co/100x100?text=Natural',
        },
        images: [
          'https://placehold.co/800x1000?text=Breast+Forms+Front',
          'https://placehold.co/800x1000?text=Breast+Forms+Side',
          'https://placehold.co/800x1000?text=Breast+Forms+Back',
          'https://placehold.co/800x1000?text=Breast+Forms+Detail',
        ],
      },
    ],

    rating: 4.6,
    reviewCount: 19,

    collections: [
      {
        name: 'Featured',
        slug: 'featured',
      },
    ],

    active: true,
  },

  // ============================================================
  // SHAPERS — BUTT ENHANCERS
  // ============================================================

  {
    id: 'butt-enhancer-001',
    name: 'Contour Padded Hip Enhancer',
    slug: 'contour-padded-hip-enhancer',
    brand: 'Sissy Dream',
    category: 'shapers',
    subcategory: 'butt-enhancers',

    images: [
      'https://placehold.co/800x1000?text=Hip+Enhancer+1',
      'https://placehold.co/800x1000?text=Hip+Enhancer+2',
      'https://placehold.co/800x1000?text=Hip+Enhancer+3',
      'https://placehold.co/800x1000?text=Hip+Enhancer+4',
    ],

    price: 84.99,

    productDetails: {
      description:
        'A padded shaping garment designed to create a smooth and contoured silhouette.',
      details: [
        'Lightweight padding',
        'Contoured shape',
        'Stretch fabric',
        'Designed to fit comfortably under clothing',
      ],
      shipping: 'Ships within 2–5 business days.',
      returns: 'Eligible for return according to store policy.',
    },

    colors: [
      {
        name: 'Black',
        value: '#000000',
        image: 'https://placehold.co/100x100?text=Black',
      },
      {
        name: 'Nude',
        value: '#d2a679',
        image: 'https://placehold.co/100x100?text=Nude',
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
          'https://placehold.co/800x1000?text=Black+Back',
          'https://placehold.co/800x1000?text=Black+Detail',
        ],
      },
      {
        color: {
          name: 'Nude',
          value: '#d2a679',
          image: 'https://placehold.co/100x100?text=Nude',
        },
        images: [
          'https://placehold.co/800x1000?text=Nude+Front',
          'https://placehold.co/800x1000?text=Nude+Side',
          'https://placehold.co/800x1000?text=Nude+Back',
          'https://placehold.co/800x1000?text=Nude+Detail',
        ],
      },
    ],

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'X-Large', value: 'XL' },
    ],

    rating: 4.4,
    reviewCount: 16,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

    active: true,
  },

  // ============================================================
  // LINGERIE — PANTIES
  // ============================================================

  {
    id: 'lingerie-004',
    name: 'Lace Trim Panty Set',
    slug: 'lace-trim-panty-set',
    brand: 'Sissy Dream',
    category: 'lingerie',
    subcategory: 'panties',

    images: [
      'https://placehold.co/800x1000?text=Panty+Set+1',
      'https://placehold.co/800x1000?text=Panty+Set+2',
      'https://placehold.co/800x1000?text=Panty+Set+3',
    ],

    price: 24.99,

    productDetails: {
      description:
        'A soft three-pack of lace-trim panties designed for everyday comfort and a feminine finish.',
      details: [
        'Set of three',
        'Stretch lace trim',
        'Soft breathable fabric',
        'Comfortable mid-rise fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.4,
    reviewCount: 22,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // LINGERIE — BIKINI
  // ============================================================

  {
    id: 'lingerie-005',
    name: 'Cheeky Satin Bikini Brief',
    slug: 'cheeky-satin-bikini-brief',
    brand: 'Sissy Dream',
    category: 'lingerie',
    subcategory: 'bikini',

    images: [
      'https://placehold.co/800x1000?text=Satin+Bikini+1',
      'https://placehold.co/800x1000?text=Satin+Bikini+2',
      'https://placehold.co/800x1000?text=Satin+Bikini+3',
    ],

    price: 19.99,
    oldPrice: 26.99,

    productDetails: {
      description:
        'A cheeky-cut satin bikini brief with a smooth finish and comfortable stretch waistband.',
      details: [
        'Smooth satin fabric',
        'Cheeky rear coverage',
        'Stretch waistband',
        'Available in multiple sizes',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.6,
    reviewCount: 33,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // LINGERIE — STOCKINGS & THIGHS
  // ============================================================

  {
    id: 'lingerie-006',
    name: 'Sheer Thigh-High Stockings',
    slug: 'sheer-thigh-high-stockings',
    brand: 'Sissy Dream',
    category: 'lingerie',
    subcategory: 'stockings-thighs',

    images: [
      'https://placehold.co/800x1000?text=Thigh+High+Stockings+1',
      'https://placehold.co/800x1000?text=Thigh+High+Stockings+2',
      'https://placehold.co/800x1000?text=Thigh+High+Stockings+3',
    ],

    price: 16.99,

    productDetails: {
      description:
        'Sheer thigh-high stockings with a stay-up silicone band for an elegant, polished look.',
      details: [
        'Sheer nylon-blend fabric',
        'Silicone stay-up band',
        'Reinforced toe seam',
        'Comfortable stretch fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    lengths: [
      { name: 'Knee-High', value: 'knee-high' },
      { name: 'Thigh-High', value: 'thigh-high' },
      { name: 'Over-the-Knee', value: 'over-the-knee' },
    ],

    rating: 4.7,
    reviewCount: 28,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // LINGERIE — MANTIES & BLOOMERS
  // ============================================================

  {
    id: 'lingerie-007',
    name: 'Ruffled Chiffon Manties',
    slug: 'ruffled-chiffon-manties',
    brand: 'Sissy Dream',
    category: 'lingerie',
    subcategory: 'manties-bloomers',

    images: [
      'https://placehold.co/800x1000?text=Ruffled+Manties+1',
      'https://placehold.co/800x1000?text=Ruffled+Manties+2',
      'https://placehold.co/800x1000?text=Ruffled+Manties+3',
    ],

    price: 22.99,

    productDetails: {
      description:
        'Ruffled chiffon manties with a soft bloomer-style cut for a playful, feminine fit.',
      details: [
        'Layered chiffon ruffles',
        'Bloomer-style silhouette',
        'Elastic waistband',
        'Soft lined interior',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.3,
    reviewCount: 14,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // TOPS — TOPS
  // ============================================================

  {
    id: 'top-001',
    name: 'Satin Cami Top',
    slug: 'satin-cami-top',
    brand: 'Sissy Dream',
    category: 'tops',
    subcategory: 'tops',

    images: [
      'https://placehold.co/800x1000?text=Satin+Cami+1',
      'https://placehold.co/800x1000?text=Satin+Cami+2',
      'https://placehold.co/800x1000?text=Satin+Cami+3',
    ],

    price: 27.99,

    productDetails: {
      description:
        'A silky satin cami top with adjustable straps, perfect for layering or wearing on its own.',
      details: [
        'Smooth satin fabric',
        'Adjustable shoulder straps',
        'Relaxed feminine fit',
        'Machine washable',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.5,
    reviewCount: 19,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // TOPS — BODYSUITS
  // ============================================================

  {
    id: 'top-002',
    name: 'Lace Long-Sleeve Bodysuit',
    slug: 'lace-long-sleeve-bodysuit',
    brand: 'Sissy Dream',
    category: 'tops',
    subcategory: 'bodysuits',

    images: [
      'https://placehold.co/800x1000?text=Lace+Bodysuit+1',
      'https://placehold.co/800x1000?text=Lace+Bodysuit+2',
      'https://placehold.co/800x1000?text=Lace+Bodysuit+3',
    ],

    price: 38.99,
    oldPrice: 47.99,

    productDetails: {
      description:
        'A fitted lace bodysuit with a smoothing snap-bottom closure for a clean, streamlined look.',
      details: [
        'Stretch lace fabric',
        'Snap-bottom closure',
        'Long sleeves',
        'Body-hugging fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.6,
    reviewCount: 25,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // TOPS — NIGHTIES
  // ============================================================

  {
    id: 'top-003',
    name: 'Silky Slip Nightie',
    slug: 'silky-slip-nightie',
    brand: 'Sissy Dream',
    category: 'tops',
    subcategory: 'nighties',

    images: [
      'https://placehold.co/800x1000?text=Slip+Nightie+1',
      'https://placehold.co/800x1000?text=Slip+Nightie+2',
      'https://placehold.co/800x1000?text=Slip+Nightie+3',
    ],

    price: 32.99,

    productDetails: {
      description:
        'A silky slip nightie with delicate lace trim, designed for a relaxed and elegant evening look.',
      details: [
        'Silky smooth fabric',
        'Lace trim hem',
        'Adjustable straps',
        'Lightweight, breathable feel',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.7,
    reviewCount: 30,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // TOPS — JUMPSUITS
  // ============================================================

  {
    id: 'top-004',
    name: 'Cozy Snap-Front Jumpsuit',
    slug: 'cozy-snap-front-jumpsuit',
    brand: 'Sissy Dream',
    category: 'tops',
    subcategory: 'jumpsuits',

    images: [
      'https://placehold.co/800x1000?text=Snap+Jumpsuit+1',
      'https://placehold.co/800x1000?text=Snap+Jumpsuit+2',
      'https://placehold.co/800x1000?text=Snap+Jumpsuit+3',
    ],

    price: 46.99,

    productDetails: {
      description:
        'A cozy fleece one-piece jumpsuit with a full snap front, made for relaxed, comfortable lounging.',
      details: [
        'Soft fleece fabric',
        'Full snap-front closure',
        'Relaxed, comfortable fit',
        'Ideal for at-home wear',
      ],
      shipping: 'Ships within 2–4 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.5,
    reviewCount: 21,

    collections: [
      { name: 'New Arrivals', slug: 'new-arrivals' },
      { name: 'DADDY / ABDL', slug: 'daddy-abdl' },
    ],

    active: true,
  },

  // ============================================================
  // TOPS — JACKETS
  // ============================================================

  {
    id: 'top-005',
    name: 'Cropped Faux-Fur Jacket',
    slug: 'cropped-faux-fur-jacket',
    brand: 'Sissy Dream',
    category: 'tops',
    subcategory: 'jackets',

    images: [
      'https://placehold.co/800x1000?text=Faux+Fur+Jacket+1',
      'https://placehold.co/800x1000?text=Faux+Fur+Jacket+2',
      'https://placehold.co/800x1000?text=Faux+Fur+Jacket+3',
    ],

    price: 58.99,
    oldPrice: 72.99,

    productDetails: {
      description:
        'A cropped faux-fur jacket that adds a plush, glamorous layer to any outfit.',
      details: [
        'Soft faux-fur exterior',
        'Cropped silhouette',
        'Hook-and-eye closure',
        'Lined interior',
      ],
      shipping: 'Ships within 2–4 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.4,
    reviewCount: 12,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // TOPS — APRONS
  // ============================================================

  {
    id: 'top-006',
    name: 'Ruffled Maid Apron Dress',
    slug: 'ruffled-maid-apron-dress',
    brand: 'Sissy Dream',
    category: 'tops',
    subcategory: 'aprons',

    images: [
      'https://placehold.co/800x1000?text=Maid+Apron+1',
      'https://placehold.co/800x1000?text=Maid+Apron+2',
      'https://placehold.co/800x1000?text=Maid+Apron+3',
    ],

    price: 34.99,

    productDetails: {
      description:
        'A ruffled maid-style apron with adjustable ties, designed to layer over dresses or tops.',
      details: [
        'Ruffled trim detailing',
        'Adjustable waist and neck ties',
        'Lightweight cotton-blend fabric',
        'One-size adjustable fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.6,
    reviewCount: 17,

    collections: [
      { name: 'Best Sellers', slug: 'best-sellers' },
      { name: 'Sissy Maid', slug: 'sissy-maid' },
    ],

    active: true,
  },

  // ============================================================
  // BOTTOMS — PANTS
  // ============================================================

  {
    id: 'bottom-001',
    name: 'High-Waist Satin Pants',
    slug: 'high-waist-satin-pants',
    brand: 'Sissy Dream',
    category: 'bottoms',
    subcategory: 'pants',

    images: [
      'https://placehold.co/800x1000?text=Satin+Pants+1',
      'https://placehold.co/800x1000?text=Satin+Pants+2',
      'https://placehold.co/800x1000?text=Satin+Pants+3',
    ],

    price: 42.99,

    productDetails: {
      description:
        'High-waist satin pants with a flowing wide-leg cut for an elegant, comfortable silhouette.',
      details: [
        'Flowing satin fabric',
        'High-waist fit',
        'Wide-leg silhouette',
        'Elastic back waistband',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.5,
    reviewCount: 16,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // BOTTOMS — SHORTS
  // ============================================================

  {
    id: 'bottom-002',
    name: 'Ruffled Booty Shorts',
    slug: 'ruffled-booty-shorts',
    brand: 'Sissy Dream',
    category: 'bottoms',
    subcategory: 'shorts',

    images: [
      'https://placehold.co/800x1000?text=Ruffle+Shorts+1',
      'https://placehold.co/800x1000?text=Ruffle+Shorts+2',
      'https://placehold.co/800x1000?text=Ruffle+Shorts+3',
    ],

    price: 26.99,

    productDetails: {
      description:
        'Playful ruffled shorts with a stretch fit, designed for casual and flirty styling.',
      details: [
        'Ruffled hem detailing',
        'Stretch cotton-blend fabric',
        'Elastic waistband',
        'Casual, flattering fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.3,
    reviewCount: 11,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // BOTTOMS — SKIRTS
  // ============================================================

  {
    id: 'bottom-003',
    name: 'Pleated School Skirt',
    slug: 'pleated-school-skirt',
    brand: 'Sissy Dream',
    category: 'bottoms',
    subcategory: 'skirts',

    images: [
      'https://placehold.co/800x1000?text=Pleated+Skirt+1',
      'https://placehold.co/800x1000?text=Pleated+Skirt+2',
      'https://placehold.co/800x1000?text=Pleated+Skirt+3',
    ],

    price: 29.99,

    productDetails: {
      description:
        'A classic pleated mini skirt with an adjustable waistband, perfect for a schoolgirl-inspired look.',
      details: [
        'Crisp pleated design',
        'Adjustable waistband',
        'Available in mini and midi lengths',
        'Available in classic plaid and solid colors',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    lengths: [
      { name: 'Mini', value: 'mini' },
      { name: 'Midi', value: 'midi' },
    ],

    rating: 4.6,
    reviewCount: 24,

    collections: [
      { name: 'New Arrivals', slug: 'new-arrivals' },
      { name: 'School Girl', slug: 'school-girl' },
    ],

    active: true,
  },

  // ============================================================
  // BOTTOMS — YOGA PANTS
  // ============================================================

  {
    id: 'bottom-004',
    name: 'High-Waist Yoga Leggings',
    slug: 'high-waist-yoga-leggings',
    brand: 'Sissy Dream',
    category: 'bottoms',
    subcategory: 'yoga-pants',

    images: [
      'https://placehold.co/800x1000?text=Yoga+Leggings+1',
      'https://placehold.co/800x1000?text=Yoga+Leggings+2',
      'https://placehold.co/800x1000?text=Yoga+Leggings+3',
    ],

    price: 36.99,

    productDetails: {
      description:
        'High-waist compression leggings built for movement, with a smoothing fit and breathable stretch fabric.',
      details: [
        'Four-way stretch fabric',
        'High-waist compression fit',
        'Breathable, moisture-wicking',
        'Squat-proof, opaque material',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
      { name: 'Extra Large', value: 'XL' },
    ],

    rating: 4.8,
    reviewCount: 40,

    collections: [
      { name: 'Featured', slug: 'featured' },
      { name: 'Sissy Fitness', slug: 'sissy-fitness' },
    ],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — CHASTITY
  // ============================================================

  {
    id: 'toy-001',
    name: 'Silicone Chastity Trainer',
    slug: 'silicone-chastity-trainer',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'chastity',

    images: [
      'https://placehold.co/800x1000?text=Chastity+Trainer+1',
      'https://placehold.co/800x1000?text=Chastity+Trainer+2',
    ],

    price: 44.99,

    productDetails: {
      description:
        'A lightweight, body-safe silicone chastity device designed for comfortable extended wear.',
      details: [
        'Body-safe silicone construction',
        'Lightweight, discreet design',
        'Adjustable, secure fit',
        'Easy to clean',
      ],
      shipping: 'Ships in discreet packaging within 2–4 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    sizes: [
      { name: 'Small', value: 'S' },
      { name: 'Medium', value: 'M' },
      { name: 'Large', value: 'L' },
    ],

    rating: 4.5,
    reviewCount: 27,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — DILDOS
  // ============================================================

  {
    id: 'toy-002',
    name: 'Silicone Training Dildo',
    slug: 'silicone-training-dildo',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'dildos',

    images: [
      'https://placehold.co/800x1000?text=Training+Dildo+1',
      'https://placehold.co/800x1000?text=Training+Dildo+2',
    ],

    price: 34.99,

    productDetails: {
      description:
        'A soft, body-safe silicone training toy with a flared base and a smooth, tapered shape.',
      details: [
        'Body-safe silicone',
        'Flared base for stability',
        'Smooth, tapered profile',
        'Compatible with water-based lubricant',
      ],
      shipping: 'Ships in discreet packaging within 2–4 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.6,
    reviewCount: 35,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — BUTT PLUGS
  // ============================================================

  {
    id: 'toy-003',
    name: 'Beginner Silicone Plug Set',
    slug: 'beginner-silicone-plug-set',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'butt-plugs',

    images: [
      'https://placehold.co/800x1000?text=Plug+Set+1',
      'https://placehold.co/800x1000?text=Plug+Set+2',
    ],

    price: 29.99,

    productDetails: {
      description:
        'A graduated three-piece silicone plug set designed for comfortable, beginner-friendly training.',
      details: [
        'Set of three graduated sizes',
        'Body-safe silicone',
        'Smooth tapered tips',
        'Sturdy retrieval base',
      ],
      shipping: 'Ships in discreet packaging within 2–4 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.4,
    reviewCount: 22,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — FUCK MACHINES
  // ============================================================

  {
    id: 'toy-004',
    name: 'Compact Pleasure Machine',
    slug: 'compact-pleasure-machine',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'fuck-machines',

    images: [
      'https://placehold.co/800x1000?text=Pleasure+Machine+1',
      'https://placehold.co/800x1000?text=Pleasure+Machine+2',
    ],

    price: 189.99,
    oldPrice: 229.99,

    productDetails: {
      description:
        'A compact, quiet motorized unit with adjustable speed settings and interchangeable attachments.',
      details: [
        'Multiple adjustable speed settings',
        'Quiet motor operation',
        'Interchangeable attachments',
        'Rechargeable battery',
      ],
      shipping: 'Ships in discreet packaging within 3–5 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.3,
    reviewCount: 9,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — LUBRICANTS
  // ============================================================

  {
    id: 'toy-005',
    name: 'Water-Based Silky Lubricant',
    slug: 'water-based-silky-lubricant',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'lubricants',

    images: [
      'https://placehold.co/800x1000?text=Lubricant+1',
      'https://placehold.co/800x1000?text=Lubricant+2',
    ],

    price: 14.99,

    productDetails: {
      description:
        'A smooth, long-lasting water-based lubricant that is gentle on skin and easy to clean up.',
      details: [
        'Water-based formula',
        'Long-lasting glide',
        'Body-safe, fragrance-free',
        'Toy and condom compatible',
      ],
      shipping: 'Ships in discreet packaging within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.7,
    reviewCount: 44,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — SISSY SLAVE
  // ============================================================

  {
    id: 'toy-006',
    name: 'Sissy Training Starter Kit',
    slug: 'sissy-training-starter-kit',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'sissy-slave',

    images: [
      'https://placehold.co/800x1000?text=Training+Kit+1',
      'https://placehold.co/800x1000?text=Training+Kit+2',
    ],

    price: 79.99,

    productDetails: {
      description:
        'A curated starter kit bundling entry-level training accessories for those beginning their journey.',
      details: [
        'Curated bundle of starter accessories',
        'Beginner-friendly instructions included',
        'Discreet storage pouch',
        'Body-safe materials throughout',
      ],
      shipping: 'Ships in discreet packaging within 2–4 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.5,
    reviewCount: 13,

    collections: [{ name: 'BBC Addiction', slug: 'bbc-addiction' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — COCK RINGS
  // ============================================================

  {
    id: 'toy-007',
    name: 'Vibrating Silicone Cock Ring',
    slug: 'vibrating-silicone-cock-ring',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'cock-rings',

    images: [
      'https://placehold.co/800x1000?text=Cock+Ring+1',
      'https://placehold.co/800x1000?text=Cock+Ring+2',
    ],

    price: 24.99,

    productDetails: {
      description:
        'A stretchy silicone ring with multiple vibration settings for added sensation.',
      details: [
        'Stretch-fit silicone',
        'Multiple vibration settings',
        'Waterproof design',
        'USB rechargeable',
      ],
      shipping: 'Ships in discreet packaging within 2–4 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.4,
    reviewCount: 20,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // SISSY TOYS — DOLLS & MASTURBATORS
  // ============================================================

  {
    id: 'toy-008',
    name: 'Compact Travel Masturbator',
    slug: 'compact-travel-masturbator',
    brand: 'Sissy Dream',
    category: 'sissy-toys',
    subcategory: 'dolls-masturbators',

    images: [
      'https://placehold.co/800x1000?text=Masturbator+1',
      'https://placehold.co/800x1000?text=Masturbator+2',
    ],

    price: 39.99,

    productDetails: {
      description:
        'A discreet, compact masturbator made from soft, body-safe material for easy travel and cleanup.',
      details: [
        'Soft, body-safe material',
        'Discreet compact case',
        'Textured interior',
        'Easy to clean',
      ],
      shipping: 'Ships in discreet packaging within 2–4 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.2,
    reviewCount: 15,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — LIPS
  // ============================================================

  {
    id: 'makeup-001',
    name: 'Long-Wear Matte Lipstick Set',
    slug: 'long-wear-matte-lipstick-set',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'lips',

    images: [
      'https://placehold.co/800x1000?text=Lipstick+Set+1',
      'https://placehold.co/800x1000?text=Lipstick+Set+2',
    ],

    price: 21.99,

    productDetails: {
      description:
        'A set of long-wear matte lipsticks in versatile shades, from soft nudes to bold reds.',
      details: [
        'Set of four shades',
        'Long-wear matte finish',
        'Lightweight, non-drying formula',
        'Cruelty-free',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.6,
    reviewCount: 37,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — EYES
  // ============================================================

  {
    id: 'makeup-002',
    name: 'Shimmer Eyeshadow Palette',
    slug: 'shimmer-eyeshadow-palette',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'eyes',

    images: [
      'https://placehold.co/800x1000?text=Eyeshadow+Palette+1',
      'https://placehold.co/800x1000?text=Eyeshadow+Palette+2',
    ],

    price: 26.99,

    productDetails: {
      description:
        'A blendable eyeshadow palette with matte and shimmer finishes for everyday to evening looks.',
      details: [
        '18-shade palette',
        'Matte and shimmer finishes',
        'Highly pigmented, blendable formula',
        'Includes dual-ended applicator',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.7,
    reviewCount: 41,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — FACE
  // ============================================================

  {
    id: 'makeup-003',
    name: 'Full-Coverage Liquid Foundation',
    slug: 'full-coverage-liquid-foundation',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'face',

    images: [
      'https://placehold.co/800x1000?text=Foundation+1',
      'https://placehold.co/800x1000?text=Foundation+2',
    ],

    price: 28.99,

    productDetails: {
      description:
        'A full-coverage liquid foundation with a natural matte finish, available in a wide shade range.',
      details: [
        'Full-coverage, buildable formula',
        'Natural matte finish',
        'Long-wearing, transfer-resistant',
        'Wide shade range',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.5,
    reviewCount: 29,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — NAILS
  // ============================================================

  {
    id: 'makeup-004',
    name: 'Press-On Nail Kit',
    slug: 'press-on-nail-kit',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'nails',

    images: [
      'https://placehold.co/800x1000?text=Press+On+Nails+1',
      'https://placehold.co/800x1000?text=Press+On+Nails+2',
    ],

    price: 17.99,

    productDetails: {
      description:
        'A press-on nail kit with 24 pre-shaped nails, adhesive tabs, and a prep file for a salon-quality finish.',
      details: [
        '24 pre-shaped nails',
        'Includes adhesive tabs and prep file',
        'Reusable with proper care',
        'Glossy finish',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.4,
    reviewCount: 26,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — MAKEUP SETS
  // ============================================================

  {
    id: 'makeup-005',
    name: 'Complete Glam Makeup Set',
    slug: 'complete-glam-makeup-set',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'makeup-sets',

    images: [
      'https://placehold.co/800x1000?text=Glam+Set+1',
      'https://placehold.co/800x1000?text=Glam+Set+2',
    ],

    price: 54.99,
    oldPrice: 69.99,

    productDetails: {
      description:
        'An all-in-one glam makeup set with everything needed for a complete face — from base to finishing touches.',
      details: [
        'Includes foundation, eyeshadow, lipstick, and blush',
        'Complete face routine in one set',
        'Travel-friendly packaging',
        'Suitable for all skill levels',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.8,
    reviewCount: 52,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — TATTOOS
  // ============================================================

  {
    id: 'makeup-006',
    name: 'Temporary Feminine Tattoo Pack',
    slug: 'temporary-feminine-tattoo-pack',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'tattoos',

    images: [
      'https://placehold.co/800x1000?text=Temp+Tattoos+1',
      'https://placehold.co/800x1000?text=Temp+Tattoos+2',
    ],

    price: 12.99,

    productDetails: {
      description:
        'A pack of delicate temporary tattoos featuring floral and feminine designs, easy to apply and remove.',
      details: [
        'Set of 20 designs',
        'Easy water-transfer application',
        'Lasts 3–5 days',
        'Skin-safe ink',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.3,
    reviewCount: 18,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — SKINCARE
  // ============================================================

  {
    id: 'makeup-007',
    name: 'Hydrating Skincare Routine Set',
    slug: 'hydrating-skincare-routine-set',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'skincare',

    images: [
      'https://placehold.co/800x1000?text=Skincare+Set+1',
      'https://placehold.co/800x1000?text=Skincare+Set+2',
    ],

    price: 44.99,

    productDetails: {
      description:
        'A gentle three-step skincare routine designed to cleanse, hydrate, and prep skin for makeup application.',
      details: [
        'Cleanser, toner, and moisturizer set',
        'Suitable for sensitive skin',
        'Fragrance-free formulas',
        'Dermatologist tested',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.7,
    reviewCount: 33,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // MAKE-UP — HAIR REMOVAL
  // ============================================================

  {
    id: 'makeup-008',
    name: 'Painless Hair Removal Cream',
    slug: 'painless-hair-removal-cream',
    brand: 'Sissy Dream',
    category: 'make-up',
    subcategory: 'hair-removal',

    images: [
      'https://placehold.co/800x1000?text=Hair+Removal+Cream+1',
      'https://placehold.co/800x1000?text=Hair+Removal+Cream+2',
    ],

    price: 15.99,

    productDetails: {
      description:
        'A gentle depilatory cream that removes hair painlessly in minutes, leaving skin smooth and soft.',
      details: [
        'Fast-acting, painless formula',
        'Suitable for body use',
        'Soothing aloe vera extract',
        'Dermatologist tested',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns: 'Non-returnable for hygiene reasons unless item is defective.',
    },

    rating: 4.2,
    reviewCount: 20,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — CHOKERS
  // ============================================================

  {
    id: 'acc-001',
    name: 'Gothic Velvet Choker',
    slug: 'gothic-velvet-choker',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'chokers',

    images: [
      'https://placehold.co/800x1000?text=Velvet+Choker+1',
      'https://placehold.co/800x1000?text=Velvet+Choker+2',
    ],

    price: 13.99,

    productDetails: {
      description:
        'A velvet choker with an antique-finish charm pendant, perfect for a dramatic gothic-inspired look.',
      details: [
        'Soft velvet band',
        'Antique-finish charm pendant',
        'Adjustable clasp closure',
        'One-size fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.5,
    reviewCount: 24,

    collections: [{ name: 'Goth Style', slug: 'goth-style' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — BELTS & GLASSES
  // ============================================================

  {
    id: 'acc-002',
    name: 'Cat-Eye Glasses & Belt Set',
    slug: 'cat-eye-glasses-belt-set',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'belts-glasses',

    images: [
      'https://placehold.co/800x1000?text=Glasses+Belt+Set+1',
      'https://placehold.co/800x1000?text=Glasses+Belt+Set+2',
    ],

    price: 24.99,

    productDetails: {
      description:
        'A coordinated set featuring retro cat-eye glasses and a slim waist belt for a polished finishing touch.',
      details: [
        'Retro-style cat-eye frames',
        'Adjustable slim waist belt',
        'Lightweight, comfortable fit',
        'Versatile styling pieces',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.4,
    reviewCount: 15,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — BRACELETS
  // ============================================================

  {
    id: 'acc-003',
    name: 'Layered Charm Bracelet Set',
    slug: 'layered-charm-bracelet-set',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'bracelets',

    images: [
      'https://placehold.co/800x1000?text=Charm+Bracelets+1',
      'https://placehold.co/800x1000?text=Charm+Bracelets+2',
    ],

    price: 18.99,

    productDetails: {
      description:
        'A set of three layered charm bracelets that can be worn together or separately for a delicate stacked look.',
      details: [
        'Set of three bracelets',
        'Delicate charm detailing',
        'Adjustable chain length',
        'Tarnish-resistant finish',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.6,
    reviewCount: 28,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — HARNESSES
  // ============================================================

  {
    id: 'acc-004',
    name: 'Adjustable Body Harness',
    slug: 'adjustable-body-harness',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'harnesses',

    images: [
      'https://placehold.co/800x1000?text=Body+Harness+1',
      'https://placehold.co/800x1000?text=Body+Harness+2',
    ],

    price: 32.99,

    productDetails: {
      description:
        'An adjustable strap harness designed to layer over clothing for an edgy, statement-making look.',
      details: [
        'Fully adjustable straps',
        'Vegan leather construction',
        'Secure buckle closures',
        'Designed to layer over tops or dresses',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.5,
    reviewCount: 19,

    collections: [{ name: 'Goth Style', slug: 'goth-style' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — MASKS
  // ============================================================

  {
    id: 'acc-005',
    name: 'Lace Trim Eye Mask',
    slug: 'lace-trim-eye-mask',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'masks',

    images: [
      'https://placehold.co/800x1000?text=Lace+Eye+Mask+1',
      'https://placehold.co/800x1000?text=Lace+Eye+Mask+2',
    ],

    price: 11.99,

    productDetails: {
      description:
        'A delicate lace-trimmed eye mask with an elastic band, adding a touch of mystery to any outfit.',
      details: [
        'Lace trim detailing',
        'Comfortable elastic band',
        'Lightweight construction',
        'One-size fit',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.2,
    reviewCount: 10,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — RINGS
  // ============================================================

  {
    id: 'acc-006',
    name: 'Statement Cocktail Ring Set',
    slug: 'statement-cocktail-ring-set',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'rings',

    images: [
      'https://placehold.co/800x1000?text=Cocktail+Rings+1',
      'https://placehold.co/800x1000?text=Cocktail+Rings+2',
    ],

    price: 16.99,

    productDetails: {
      description:
        'A set of bold statement rings featuring crystal and gemstone-inspired accents.',
      details: [
        'Set of five rings',
        'Crystal and gemstone-style accents',
        'Adjustable band sizing',
        'Tarnish-resistant plating',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.5,
    reviewCount: 22,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — GLOVES
  // ============================================================

  {
    id: 'acc-007',
    name: 'Satin Opera Gloves',
    slug: 'satin-opera-gloves',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'gloves',

    images: [
      'https://placehold.co/800x1000?text=Opera+Gloves+1',
      'https://placehold.co/800x1000?text=Opera+Gloves+2',
    ],

    price: 19.99,

    productDetails: {
      description:
        'Elegant satin opera gloves that extend past the elbow for a glamorous, vintage-inspired finish.',
      details: [
        'Smooth satin fabric',
        'Available in three lengths',
        'Stretch fit for easy wear',
        'Elegant, formal styling',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    lengths: [
      { name: 'Wrist-Length', value: 'wrist-length' },
      { name: 'Elbow-Length', value: 'elbow-length' },
      { name: 'Opera-Length', value: 'opera-length' },
    ],

    rating: 4.4,
    reviewCount: 13,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — HAIR ACCESSORIES
  // ============================================================

  {
    id: 'acc-008',
    name: 'Lolita Hair Bow Set',
    slug: 'lolita-hair-bow-set',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'hair-accessories',

    images: [
      'https://placehold.co/800x1000?text=Hair+Bow+Set+1',
      'https://placehold.co/800x1000?text=Hair+Bow+Set+2',
    ],

    price: 14.99,

    productDetails: {
      description:
        'A pastel-toned set of oversized hair bows designed to complete a sweet Lolita-inspired look.',
      details: [
        'Set of two oversized bows',
        'Secure alligator clip backing',
        'Layered ruffle detailing',
        'Lightweight, comfortable wear',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.6,
    reviewCount: 17,

    collections: [{ name: 'Lolita Fashion', slug: 'lolita-fashion' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — EARRINGS
  // ============================================================

  {
    id: 'acc-009',
    name: 'Crystal Drop Earrings',
    slug: 'crystal-drop-earrings',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'earrings',

    images: [
      'https://placehold.co/800x1000?text=Drop+Earrings+1',
      'https://placehold.co/800x1000?text=Drop+Earrings+2',
    ],

    price: 17.99,

    productDetails: {
      description:
        'Sparkling crystal drop earrings that add a touch of elegance to both casual and formal looks.',
      details: [
        'Faceted crystal drops',
        'Hypoallergenic posts',
        'Lightweight design',
        'Secure butterfly backing',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.7,
    reviewCount: 31,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ============================================================
  // ACCESSORIES — PURSES
  // ============================================================

  {
    id: 'acc-010',
    name: 'Mini Quilted Purse',
    slug: 'mini-quilted-purse',
    brand: 'Sissy Dream',
    category: 'accessories',
    subcategory: 'purses',

    images: [
      'https://placehold.co/800x1000?text=Quilted+Purse+1',
      'https://placehold.co/800x1000?text=Quilted+Purse+2',
    ],

    price: 39.99,

    productDetails: {
      description:
        'A mini quilted purse with a chain strap, sized perfectly for essentials on a night out.',
      details: [
        'Quilted vegan leather exterior',
        'Detachable chain strap',
        'Magnetic snap closure',
        'Interior card slot',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    rating: 4.5,
    reviewCount: 20,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ============================================================
  // WIGS
  // ============================================================

  {
    id: 'wig-001',
    name: 'Silky Long Wavy Wig',
    slug: 'silky-long-wavy-wig',
    brand: 'Sissy Dream',
    category: 'wigs',

    images: [
      'https://placehold.co/800x1000?text=Wavy+Wig+1',
      'https://placehold.co/800x1000?text=Wavy+Wig+2',
    ],

    price: 49.99,
    oldPrice: 64.99,

    productDetails: {
      description:
        'A long, silky wavy wig with a natural-looking part and breathable cap for all-day comfort.',
      details: [
        'Heat-resistant synthetic fibers',
        'Natural-looking lace part',
        'Breathable adjustable cap',
        'Pre-styled loose waves',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    lengths: [
      { name: 'Short', value: 'short' },
      { name: 'Medium', value: 'medium' },
      { name: 'Long', value: 'long' },
    ],

    rating: 4.6,
    reviewCount: 34,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: true,
  },

  // ------------------------------------------------------------

  {
    id: 'wig-002',
    name: 'Colorful Cosplay Wig',
    slug: 'colorful-cosplay-wig',
    brand: 'Sissy Dream',
    category: 'wigs',

    images: [
      'https://placehold.co/800x1000?text=Cosplay+Wig+1',
      'https://placehold.co/800x1000?text=Cosplay+Wig+2',
    ],

    price: 32.99,

    productDetails: {
      description:
        'A vibrant, color-fast cosplay wig with a pre-styled cut, ready to wear straight out of the box.',
      details: [
        'Vivid, color-fast synthetic fibers',
        'Pre-styled cut',
        'Adjustable breathable cap',
        'Includes wig cap',
      ],
      shipping: 'Ships within 1–3 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    lengths: [
      { name: 'Short', value: 'short' },
      { name: 'Medium', value: 'medium' },
      { name: 'Long', value: 'long' },
    ],

    rating: 4.5,
    reviewCount: 26,

    collections: [{ name: 'Sissy Cosplay', slug: 'sissy-cosplay' }],

    active: true,
  },

  // ============================================================
  // SHOES
  // ============================================================

  {
    id: 'shoe-001',
    name: 'Classic Platform Heels',
    slug: 'classic-platform-heels',
    brand: 'Sissy Dream',
    category: 'shoes',

    images: [
      'https://placehold.co/800x1000?text=Platform+Heels+1',
      'https://placehold.co/800x1000?text=Platform+Heels+2',
    ],

    price: 54.99,

    productDetails: {
      description:
        'Classic platform heels with a padded footbed, designed for comfortable all-day wear.',
      details: [
        'Cushioned padded footbed',
        'Sturdy platform sole',
        'Ankle strap with buckle closure',
        'Non-slip outsole',
      ],
      shipping: 'Ships within 2–4 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'US 6', value: '6' },
      { name: 'US 7', value: '7' },
      { name: 'US 8', value: '8' },
      { name: 'US 9', value: '9' },
      { name: 'US 10', value: '10' },
      { name: 'US 11', value: '11' },
    ],

    rating: 4.6,
    reviewCount: 30,

    collections: [{ name: 'Best Sellers', slug: 'best-sellers' }],

    active: true,
  },

  // ------------------------------------------------------------

  {
    id: 'shoe-002',
    name: 'Ankle Strap Stiletto Pumps',
    slug: 'ankle-strap-stiletto-pumps',
    brand: 'Sissy Dream',
    category: 'shoes',

    images: [
      'https://placehold.co/800x1000?text=Stiletto+Pumps+1',
      'https://placehold.co/800x1000?text=Stiletto+Pumps+2',
    ],

    price: 62.99,
    oldPrice: 79.99,

    productDetails: {
      description:
        'Elegant stiletto pumps with an adjustable ankle strap, designed for a polished, statement-making look.',
      details: [
        'Sleek stiletto heel',
        'Adjustable ankle strap',
        'Cushioned insole',
        'Pointed toe silhouette',
      ],
      shipping: 'Ships within 2–4 business days.',
      returns:
        'Eligible for return according to the Sissy Dream return policy.',
    },

    sizes: [
      { name: 'US 6', value: '6' },
      { name: 'US 7', value: '7' },
      { name: 'US 8', value: '8' },
      { name: 'US 9', value: '9' },
      { name: 'US 10', value: '10' },
      { name: 'US 11', value: '11' },
    ],

    rating: 4.5,
    reviewCount: 18,

    collections: [{ name: 'Featured', slug: 'featured' }],

    active: true,
  },

  // ============================================================
  // EBOOKS
  // ============================================================

  {
    id: 'ebook-001',
    name: 'Sissy Style Guide eBook',
    slug: 'sissy-style-guide-ebook',
    brand: 'Sissy Dream',
    category: 'ebooks',

    images: ['https://placehold.co/800x1000?text=Style+Guide+eBook'],

    price: 9.99,

    productDetails: {
      description:
        'A digital style guide covering outfit building, color pairing, and beginner-friendly styling tips.',
      details: [
        'Instant digital download (PDF)',
        'Outfit-building guidance',
        'Color and silhouette tips',
        'Beginner-friendly format',
      ],
      shipping: 'Delivered instantly via email after purchase.',
      returns: 'Digital products are non-refundable once downloaded.',
    },

    rating: 4.7,
    reviewCount: 46,

    collections: [{ name: 'New Arrivals', slug: 'new-arrivals' }],

    active: false,
  },

  // ------------------------------------------------------------

  {
    id: 'ebook-002',
    name: 'Feminize Your Space Guide',
    slug: 'feminize-your-space-guide',
    brand: 'Sissy Dream',
    category: 'ebooks',

    images: ['https://placehold.co/800x1000?text=Feminize+Your+Space+eBook'],

    price: 12.99,

    productDetails: {
      description:
        'A digital guide with tips on curating a personal space, wardrobe organization, and self-expression essentials.',
      details: [
        'Instant digital download (PDF)',
        'Wardrobe and space organization tips',
        'Self-expression and confidence guidance',
        'Printable checklists included',
      ],
      shipping: 'Delivered instantly via email after purchase.',
      returns: 'Digital products are non-refundable once downloaded.',
    },

    rating: 4.6,
    reviewCount: 21,

    collections: [{ name: 'Feminize Your Space', slug: 'feminize-your-space' }],

    active: false,
  },
];
