import { Product } from "../models/product-models/product.model";

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
        image:
          'https://placehold.co/800x1000?text=Blush+Pink',
      },
      {
        name: 'Black',
        value: '#111111',
        image:
          'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Wine',
        value: '#722F37',
        image:
          'https://placehold.co/800x1000?text=Wine',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Blush Pink',
          value: '#E8A9B8',
          image:
            'https://placehold.co/800x1000?text=Blush+Pink',
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
          image:
            'https://placehold.co/800x1000?text=Black',
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
          image:
            'https://placehold.co/800x1000?text=Wine',
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

    rating: 4.8,
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
        image:
          'https://placehold.co/800x1000?text=Cream',
      },
      {
        name: 'Black',
        value: '#111111',
        image:
          'https://placehold.co/800x1000?text=Black',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Cream',
          value: '#F5F0E6',
          image:
            'https://placehold.co/800x1000?text=Cream',
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
          image:
            'https://placehold.co/800x1000?text=Black',
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

    rating: 4.6,
    reviewCount: 21,

    collections: [
      {
        name: 'New Arrivals',
        slug: 'new-arrivals',
      },
    ],

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
        image:
          'https://placehold.co/800x1000?text=Pink',
      },
      {
        name: 'Royal Blue',
        value: '#4169E1',
        image:
          'https://placehold.co/800x1000?text=Royal+Blue',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image:
            'https://placehold.co/800x1000?text=Pink',
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
          image:
            'https://placehold.co/800x1000?text=Royal+Blue',
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

    rating: 4.9,
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

    price: 89.99,

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
        image:
          'https://placehold.co/800x1000?text=Baby+Pink',
      },
      {
        name: 'Lavender',
        value: '#B57EDC',
        image:
          'https://placehold.co/800x1000?text=Lavender',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Baby Pink',
          value: '#F4B6C2',
          image:
            'https://placehold.co/800x1000?text=Baby+Pink',
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
          image:
            'https://placehold.co/800x1000?text=Lavender',
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

    rating: 4.7,
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
        image:
          'https://placehold.co/800x1000?text=Pink',
      },
      {
        name: 'Black',
        value: '#111111',
        image:
          'https://placehold.co/800x1000?text=Black',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Pink',
          value: '#E8A0B8',
          image:
            'https://placehold.co/800x1000?text=Pink',
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
          image:
            'https://placehold.co/800x1000?text=Black',
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
        image:
          'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Pink',
        value: '#E8A0B8',
        image:
          'https://placehold.co/800x1000?text=Pink',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image:
            'https://placehold.co/800x1000?text=Black',
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
          image:
            'https://placehold.co/800x1000?text=Pink',
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
        image:
          'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Burgundy',
        value: '#800020',
        image:
          'https://placehold.co/800x1000?text=Burgundy',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image:
            'https://placehold.co/800x1000?text=Black',
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
          image:
            'https://placehold.co/800x1000?text=Burgundy',
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
        image:
          'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Pink',
        value: '#E8A0B8',
        image:
          'https://placehold.co/800x1000?text=Pink',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image:
            'https://placehold.co/800x1000?text=Black',
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
          image:
            'https://placehold.co/800x1000?text=Pink',
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
        image:
          'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Pink',
        value: '#E8A0B8',
        image:
          'https://placehold.co/800x1000?text=Pink',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image:
            'https://placehold.co/800x1000?text=Black',
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
          image:
            'https://placehold.co/800x1000?text=Pink',
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
        image:
          'https://placehold.co/800x1000?text=Black',
      },
      {
        name: 'Nude',
        value: '#D2A679',
        image:
          'https://placehold.co/800x1000?text=Nude',
      },
    ],

    colorGalleries: [
      {
        color: {
          name: 'Black',
          value: '#111111',
          image:
            'https://placehold.co/800x1000?text=Black',
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
          image:
            'https://placehold.co/800x1000?text=Nude',
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
];