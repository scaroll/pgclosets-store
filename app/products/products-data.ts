export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Bypass Doors' | 'Bifold Doors' | 'Pivot Doors' | 'Barn Doors' | 'Hardware' | 'Mirrors';
  image: string;
  specs: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    "id": "1",
    "name": "Augusta 1-Lite Framed Mullion Design Complete Barn Door Kit with Mix and Match Hardware",
    "description": "Our Augusta 1-Lite Framed Mullion Design sliding barn door presents a clean, Bright White classic frame-within-a-frame of engineered solid wood outlining a translucent one-lite insert.",
    "price": 565,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BD041-Augusta-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 84\" x 1-3/8\""
      },
      {
        "label": "Suitable for Openings",
        "value": "28\" - 34\" wide"
      },
      {
        "label": "Color",
        "value": "Bright White"
      },
      {
        "label": "Material",
        "value": "Engineered solid wood"
      },
      {
        "label": "SKU",
        "value": "BD041"
      }
    ]
  },
  {
    "id": "2",
    "name": "Authentic Complete Barn Door Kit",
    "description": "Our Authentic Barn Door appeals to all who crave a rustic style without forsaking modern engineering. Finished in a Sandstone stain for an enduring aesthetic, this hand-scraped, solid wood sliding barn door is detailed with metal cross braces and matching Rustic Matte Black hardware.",
    "price": 499.99,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/06/BD055_Authentic_Sandstone_Lifestyle-Image-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7181/BD055"
      }
    ]
  },
  {
    "id": "3",
    "name": "Boca Barn Door Kit",
    "description": "This solid engineered wood contemporary 1-panel Shaker design was inspired to match the traditional swing doors within your home or office.",
    "price": 675,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/09/BD042_Boca-Shaker_lifestyle-cropped-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "16423/BD042"
      }
    ]
  },
  {
    "id": "4",
    "name": "Cheval Z-Design Complete Barn Door Kit",
    "description": "Our Cheval Z-Design Barn Door blends traditional beauty and strength. Historically, the diagonal cross brace on a wood panel provided practical reinforcement.",
    "price": 679,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD053-–-Cheval-Z-Barn-Door-in-Iron-Age_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7166/BD053"
      }
    ]
  },
  {
    "id": "5",
    "name": "Cristo 1-Lite Complete Barn Door Kit",
    "description": "Our Cristo 1-Lite barn door's modern style enhances contemporary room designs. The full-height, 1-Lite tempered frosted glass insert presents an uninterrupted field for light transfer, while elegantly concealing what lies beyond.",
    "price": 639,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD054-Cristo-1-Lite-Barn-Door-in-Iron-Age_Lifestyle-1-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7160/BD054"
      }
    ]
  },
  {
    "id": "6",
    "name": "Crochet Multi-X Design Complete Barn Door Kit with Mix and Match Hardware",
    "description": "Our Crochet Multi-X Design sliding barn door offers a handsome design appointed with stacked X's woven against a translucent background. The engineered solid wood frame is pre-finished in Graphite Gray, the color complements modern styles favoring brushed stainless steel and traditional tastes with a palette for pewter.",
    "price": 565,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BD076-Crochet-Graphite-Gray-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 84\" x 1-3/8\""
      },
      {
        "label": "Color",
        "value": "Graphite Gray"
      },
      {
        "label": "Material",
        "value": "Engineered solid wood"
      },
      {
        "label": "SKU",
        "value": "7170/BD076"
      }
    ]
  },
  {
    "id": "7",
    "name": "Driftwood Extra Tall K-Design Invisiglide Barn Door Kit",
    "description": "Extra tall traditional K-design barn door in a rustic Barnwood Oak paired with the InvisiGlide™ Across-the-Wall hardware.",
    "price": 745,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/08/AW64950_MB_LS_36_AW052-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 88\" x 1-3/8\", 42\" x 88\" x 1-3/8\""
      },
      {
        "label": "SKU",
        "value": "7264/AW052"
      },
      {
        "label": "Size Options",
        "value": "36\" x 88\" x 1-3/8\", 42\" x 88\" x 1-3/8\""
      }
    ]
  },
  {
    "id": "8",
    "name": "Driftwood K-Design Complete Barn Door Kit with Mix and Match Hardware",
    "description": "Our Driftwood K-Design engineered solid wood sliding barn door delivers a rustic, tactile design in a Barnwood Oak finish. Perfect for the rooms embracing styles ranging from vintage farmhouse to contemporary country.",
    "price": 589,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BD052-Driftwood-Barnwood-Oak-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    "specs": [
      {
        "label": "Material",
        "value": "Engineered solid wood"
      },
      {
        "label": "SKU",
        "value": "7174"
      }
    ]
  },
  {
    "id": "9",
    "name": "Dunmore K-Lite Complete Barn Door Kit",
    "description": "Our Dunmore Barn Door presents you with a modern interpretation of the classic K-Lite barn door design. This up-to-date barn door includes tempered frosted glass inserts, framed in solid engineered wood.",
    "price": 639,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD064-–-Dunmore-Barn-Door-in-Iron-Age_Lifestyle--scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7163/BD064"
      }
    ]
  },
  {
    "id": "10",
    "name": "Easy-Build Langley Chevron Design Barn Door Kit",
    "description": "Our ready-to-assemble Easy-Build Langley is a modern chevron design packaged in a conveniently sized box that fits in your car.",
    "price": 609,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/Langley-GG-Gen-2-w-MB-Hardware_Beauty_Image_Cinema_Square_v5-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7547/BD136"
      }
    ]
  },
  {
    "id": "11",
    "name": "Easy-Build Pavilion 5-Lite Barn Door Kit",
    "description": "Our ready-to-assemble Easy-Build Pavilion white barn door is a modern 5-Lite design packaged in a conveniently sized box that fits in your car.",
    "price": 609,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/Pavilion-BW-Gen-2-w-MB-Hardware_Beauty_Image_Cinema_Square_v5-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7546/BD062"
      }
    ]
  },
  {
    "id": "12",
    "name": "Easy-Build Ready to Assemble Complete Barn Door Kit",
    "description": "On trend, in budget and ready to go – our Easy-Build Barn Door Kit bundles everything in a box conveniently sized to fit your car and bring home all that you need to transform an opening into a stylish focal point.",
    "price": 599,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BDO69-BW-Gen-1-w-MB-Hardware_Beauty_Image_Cinema_Square_v5-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7543/BD069"
      }
    ]
  },
  {
    "id": "13",
    "name": "Easy-Build Salinas Z-Design Barn Door Kit",
    "description": "Our ready-to-assemble Easy-Build Salinas Barn Door is a traditional Z-design packaged in a conveniently sized box that fits in your car.",
    "price": 679,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/Salinas-Z-Pine-Gen-2-w-MB-Hardware_Beauty_Image_Cinema_Square_v5-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7545/BD053"
      }
    ]
  },
  {
    "id": "14",
    "name": "Easy-Build Stone K-Design Barn Door Kit",
    "description": "Our ready-to-assemble Easy-Build Stone Barn Door kit is a traditional K-design packaged in a conveniently sized box that fits in your car.",
    "price": 609,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/Stone-K-BW-Gen-2-w-MB-Hardware_Beauty_Image_Cinema_Square_v5-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7544/BD052"
      }
    ]
  },
  {
    "id": "15",
    "name": "Flair Pine Complete Barn Door Kit",
    "description": "Our Flair Complete Barn Door Kit highlights its solid wood grain in a pine slat design with a note of coastal style. The wood has been treated with a thin coat of clear primer and can be painted to complement your room's unique color selection.",
    "price": 549,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD133-Flair-Barn-Door-Pine-Lifestyle-1-scaled.jpg",
    "specs": [
      {
        "label": "Material",
        "value": "Pine (Ready to Paint/Stain)"
      },
      {
        "label": "SKU",
        "value": "7185/BD133"
      }
    ]
  },
  {
    "id": "16",
    "name": "Gatsby Chevron 2-Panel Shaker Design Complete Barn Door Kit with Mix and Match Hardware",
    "description": "Our Gatsby Chevron 2-Panel Shaker sliding barn door brings depth, detail and distinction to your room. Finished in Gray with the option to repaint to the color of your choice, the recessed two-panel design displays an ascension of chevrons.",
    "price": 629,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BD045-Gatsby-Gray-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    "specs": [
      {
        "label": "Finishes",
        "value": "Gray (paintable)"
      },
      {
        "label": "SKU",
        "value": "7173"
      }
    ]
  },
  {
    "id": "17",
    "name": "Glim Extra Tall 4-Lite Invisiglide Barn Door Kit",
    "description": "Extra tall 4-lite sliding barn door in a modern Ashen White finish paired with the InvisiGlide™ Across-the-Wall hardware.",
    "price": 745,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/AW64950_MB_LS_36_AW067-scaled.jpg",
    "specs": [
      {
        "label": "Materials",
        "value": "Wood decor wrap, 4mm tempered frosted glass"
      },
      {
        "label": "SKU",
        "value": "7985"
      }
    ]
  },
  {
    "id": "18",
    "name": "Hall 3-Lite Complete Barn Door Kit",
    "description": "Presenting a modern look that balances daylight and privacy, our 3-Lite Hall Barn Door offers the perfect passageway for more than hallways and closets.",
    "price": 639,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD061-Hall-3-Lite-Barn-Door-in-Bright-White_Lifestyle_Open-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7161/BD061"
      }
    ]
  },
  {
    "id": "19",
    "name": "Herringbone Chevron - Design Complete Barn Door Kit",
    "description": "Enhancing your home's character, charm and comfort, our Herringbone Barn Door complements any interior with its stylish chevron plank design, modern neutral shades, Rustic Matte Black hardware and Easy Glide Soft Close.",
    "price": 759,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/Herringbone-Barn-Door-Satin-Nickel-Grey-Stain-Beauty_3-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 84\" x 1-3/8\""
      },
      {
        "label": "Finishes",
        "value": "Satin Nickel Grey – Hand-Stained Solid Wood Finish, Ashen Grey - Pre-Finished Engineered Wood, Ashen White - Pre-Finished Engineered Wood"
      },
      {
        "label": "SKU",
        "value": "BD059"
      }
    ]
  },
  {
    "id": "20",
    "name": "Hollow Core Barn Door Kit",
    "description": "Create a new look in any home with a traditional K-brace style barn door that is easy to install! Barn doors are an excellent space saving solution compared to a traditional swing door while adding character and a unique charm to any room.",
    "price": 645,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/10/HC052_Hollow-Core_White_Lifestyle-Image_Landscape-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "16420/HC052"
      }
    ]
  },
  {
    "id": "21",
    "name": "Lace Multi-X Design Complete Barn Door Kit with Mix and Match Hardware",
    "description": "Our Lace Multi-X Design sliding barn door design elegantly balances a sturdy, engineered solid wood frame pre-finished in Bright White with a delicate filigree of decorative latticework against the translucency of a frosted backdrop.",
    "price": 565,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BD077-Lace-Bright-White-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 84\" x 1-3/8\""
      },
      {
        "label": "SKU",
        "value": "7171/BD077"
      }
    ]
  },
  {
    "id": "22",
    "name": "Metal Works Complete Barn Door Kit",
    "description": "Created for homes that embrace transitional style, our Metal Works Barn Door bridges the best of modern and traditional designs for truly unique aesthetic.",
    "price": 399.99,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/LO130_857410_Beauty-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7165/BD130"
      }
    ]
  },
  {
    "id": "23",
    "name": "Pavilion 5-Lite Complete Barn Door Kit",
    "description": "Serving as a focal statement for any room design, our 5-Lite Pavilion Barn Door is certain to impress with its geometric, modern style.",
    "price": 639,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD062-–-Pavilion-5-Lite-in-Bright-White_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7162/BD062"
      }
    ]
  },
  {
    "id": "24",
    "name": "Provincial 8-Lite Design Single Track Bypass Hardware Barn Door Kit",
    "description": "Provincial Barn Door Slab incorporates French Door traits with durable Engineered Wood, featuring 8 panes of 4mm tempered frosted glass for privacy and light.",
    "price": 1080,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/03/BD280K_MB_Lifestyle_W_Handle-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "30\" x 84\" x 1\", 36\" x 84\" x 1\", 42\" x 84\" x 1\""
      },
      {
        "label": "SKU",
        "value": "9654/BD137"
      },
      {
        "label": "Size Options",
        "value": "30\" x 84\" x 1\", 36\" x 84\" x 1\", 42\" x 84\" x 1\""
      }
    ]
  },
  {
    "id": "25",
    "name": "Sagrada Double X-Design Complete Barn Door Kit",
    "description": "The double X overlay of our Sagrada Barn Door captures the ideal farmhouse style for your living room, dining room, kitchen, bedroom or guest room, or to charmingly conceal a closet, bathroom or pantry.",
    "price": 523,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD060-–-Sagrada-Double-X-Barn-Door-in-Cherry_Lifestyle--scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7167/BD060"
      }
    ]
  },
  {
    "id": "26",
    "name": "Salinas Z-Design Pine Complete Barn Door Kit",
    "description": "Traditional style and 100% solid pine construction celebrates the inherent character of natural wood grain. Minimalistic, cross brace pattern reflects enduring appearance and strong craftsmanship.",
    "price": 739,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD053-Salinas-Z-Pine-Barn-Door-Lifestyle_open-1-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 84\" (fits 28\" - 34\" opening), 42\" x 84\" (fits 34\" - 38\" opening)"
      },
      {
        "label": "Material",
        "value": "Monterey pine"
      },
      {
        "label": "SKU",
        "value": "BD053/7182"
      },
      {
        "label": "Size Options",
        "value": "36\" x 84\" (fits 28\" - 34\" opening), 42\" x 84\" (fits 34\" - 38\" opening)"
      }
    ]
  },
  {
    "id": "27",
    "name": "Sherwood Arrow Design Complete Barn Door Kit with Mix and Match Hardware",
    "description": "Our Sherwood Arrow sliding barn door design showcases a rich Black Brown finish on engineered wood. The bold intersecting diagonal arrow pattern creates an energetic appearance well-suited for an active, cosmopolitan look or sophisticated, modern style.",
    "price": 589,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/06/BD135-Sherwood-Black-Brown-MM-BD-Beauty-Image-Brick_v4-Square-scaled.jpg",
    "specs": [
      {
        "label": "Material",
        "value": "Engineered Wood"
      },
      {
        "label": "SKU",
        "value": "7172"
      }
    ]
  },
  {
    "id": "28",
    "name": "Sherwood Extra Tall Arrow Design Barn Door",
    "description": "Extra tall Arrow Design features a rich Chocolate Ash finish barn door. This beautifully designed 88\" high extra-large barn door complements your modern style featuring contempoary chevron pattern and dark color finish.",
    "price": 0,
    "category": "Barn Doors",
    "image": "",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 88\" x 1-3/8\", 42\" x 88\" x 1-3/8\""
      },
      {
        "label": "Color",
        "value": "Black Brown"
      },
      {
        "label": "Material",
        "value": "Engineered wood"
      },
      {
        "label": "SKU",
        "value": "AW135"
      }
    ]
  },
  {
    "id": "29",
    "name": "Sherwood Extra Tall Arrow Design InvisiGlide Barn Door Kit",
    "description": "Extra tall Arrow Design InvisiGlide Kit features a rich Chocolate Ash finish barn door paired with the InvisiGlide™ Across-the-Wall hardware.",
    "price": 745,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/10/AW64950_Invisiglide_36-inch_Matte-Black_Sherwood_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 88\" x 1-3/8\", 42\" x 88\" x 1-3/8\""
      },
      {
        "label": "SKU",
        "value": "7263/AW135"
      },
      {
        "label": "Size Options",
        "value": "36\" x 88\" x 1-3/8\", 42\" x 88\" x 1-3/8\""
      }
    ]
  },
  {
    "id": "30",
    "name": "Stone K-Design Barn Door Kit",
    "description": "Stone K-Design Barn Door Slabs are available in finished decor surfaces that accentuates the natural variation in the wood grain",
    "price": 429,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/06/BDO52-Stone-K-Off-White-Slab-nH-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "16040/BD052"
      }
    ]
  },
  {
    "id": "31",
    "name": "Stone K-Design Complete Barn Door Kit",
    "description": "Our Stone Barn Door handsomely combines a traditional K-design brace with modern, solid engineered wood construction. Accented with Rustic Matte Black, bent strap barn door hardware kit, the door's trackless design keeps your floor openings clear and hazard-free.",
    "price": 679,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/02/BD052-Stone-K-Barn-Door-Sandstone-Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "Sizes Available",
        "value": "36\" x 84\" x 1-3/8\", 42\" x 84\" x 1-3/8\""
      },
      {
        "label": "Finishes",
        "value": "Off-White, Sandstone, Silver Oak, Iron Age"
      },
      {
        "label": "SKU",
        "value": "7168/BD052"
      },
      {
        "label": "Size Options",
        "value": "36\" x 84\" x 1-3/8\", 42\" x 84\" x 1-3/8\""
      }
    ]
  },
  {
    "id": "32",
    "name": "Sussex Complete Barn Door Kit",
    "description": "Perfectly paired with coastal design styles, our Sussex Barn Door welcomes you back to relaxed living. Our 42-inch barn door with timeless door design goes the distance to accommodate your expansive door openings.",
    "price": 699,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/04/BD063_Sussex-Barn-Door_Beauty-Cropped-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "7164/BD063"
      }
    ]
  },
  {
    "id": "33",
    "name": "TRUporte VersaStyle Bifold Sliding Door & Hardware Kit",
    "description": "The VersaStyle Bifold Sliding Door gives you 10 unique door designs and our Easy-Install hardware and optional fascia gives you more options to create that perfect look within your home or office.",
    "price": 0,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2025/01/VS_BF_OPEN_LS.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BD124M86MW1FGJ42084"
      }
    ]
  },
  {
    "id": "34",
    "name": "Ashbury 2 Panel Insert Design with Steel Frame Bifold Door",
    "description": "Whether your closet size requires two panels or four, the Ashbury bifold door's molded, square top, 2-panel design offers universal appeal and reliable operation. Featuring Easy-Roll bifold closet door hardware and low-profile bottom track, these steel bifold doors operate as a rolling pivot system, freeing up an additional 4 inches for more complete access to your closet or space.",
    "price": 289,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BI0221_18_Ashbury_Molded-Panels_Single_Closed_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BI0221BW16"
      }
    ]
  },
  {
    "id": "35",
    "name": "Euro 1-Lite Bifold Door",
    "description": "The stylish sophistication of our Euro 1-lite sliding bifold closet doors with contemporary frosted glass inserts can clearly be attributed to their Italian design heritage. Each of the doors two panels feature full-height frosted glass inserts and solid engineered wood framing prefinished in Iron Age and completed with a round knob pull in Satin Nickel finish.",
    "price": 409,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU3110_Euro-1-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3110"
      }
    ]
  },
  {
    "id": "36",
    "name": "Euro 1-Lite Bifold Door",
    "description": "The stylish sophistication of our Euro 1-lite sliding bifold closet doors with contemporary frosted glass inserts can clearly be attributed to their Italian design heritage. Each of the doors two panels feature full-height frosted glass inserts and solid engineered wood framing prefinished in Off-White and completed with a round knob pull in Satin Nickel finish.",
    "price": 409,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU3010_Euro_1-Lite-Bifold_Off-White_Lifestyle-1.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3010"
      }
    ]
  },
  {
    "id": "37",
    "name": "Euro 3-Lite Bifold Door",
    "description": "Our Euro 3-lite sliding bifold closet doors showcase a stack window design with contemporary frosted glass inserts that protect privacy while adding light. Each of the bifold doors two panels feature three vertical, frosted glass inserts.",
    "price": 409,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/01/EU3150_Euro-3-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3150"
      }
    ]
  },
  {
    "id": "38",
    "name": "Euro 3-Lite Bifold Door",
    "description": "Our Euro 3-lite sliding bifold closet doors showcase a stack window design with contemporary frosted glass inserts that protect privacy while adding light. Each of the bifold doors two panels feature three vertical, frosted glass inserts.",
    "price": 409,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/EU3080_Euro-3-Lite-Bifold_Off-White_Lifestyle-2-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3080"
      }
    ]
  },
  {
    "id": "39",
    "name": "Georgian 6 Panel Insert Design with Steel Frame Bifold Door",
    "description": "Adding a traditional accent to any room, the Georgian bifold closet door features a raised 6-panel square top design, prefinished in white wood grain texture and encased in a Bright White narrow steel frame.",
    "price": 289,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BI0221_16_Georgian_Wood-Grain-Textured_Single_Closed_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BI0221BW18"
      }
    ]
  },
  {
    "id": "40",
    "name": "Parsons Flush Panel Insert Design with Steel Frame Bifold Door",
    "description": "Coordinating with any room, The Parsons flush panel design bifold closet door's Bright White narrow frame encases smooth, prefinished whitewood inserts with an integrated ergonomic handle. Giving you an additional 4 inches for more complete access to your closet or space, the folding closet door operates as a rolling pivot system with Easy-Roll bifold closet door hardware and low-profile bottom track.",
    "price": 289,
    "category": "Bifold Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BI0221_10_Parsons_Flush-White-Wood-Textured_Single_Closed_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BI0221BW10"
      }
    ]
  },
  {
    "id": "41",
    "name": "Eclipse Mirror Bypass Door - 48\"",
    "description": "Frameless mirror bypass doors with soft-close mechanism. Perfect for modern closets.",
    "price": 749,
    "category": "Bypass Doors",
    "image": "https://picsum.photos/id/1026/1200/900",
    "specs": [
      {
        "label": "SKU",
        "value": "BYP-ECLIPSE-48"
      }
    ]
  },
  {
    "id": "42",
    "name": "Elegance Bypass Mirror Door System - 72\"",
    "description": "Premium bypass system with full-length mirrors. Whisper-quiet roller system with lifetime warranty.",
    "price": 1099,
    "category": "Bypass Doors",
    "image": "https://picsum.photos/id/1037/1200/900",
    "specs": [
      {
        "label": "SKU",
        "value": "BYP-ELEG-72"
      }
    ]
  },
  {
    "id": "43",
    "name": "Harmony Bypass Closet Door System",
    "description": "Complete bypass closet door system with mirror panels. Smooth gliding track system included.",
    "price": 899,
    "category": "Bypass Doors",
    "image": "https://picsum.photos/id/1024/1200/900",
    "specs": [
      {
        "label": "SKU",
        "value": "BYP-HARMONY-60"
      }
    ]
  },
  {
    "id": "44",
    "name": "Ashbury 2 Panel Design Steel Frame Bypass Door",
    "description": "The Ashbury bypass door's raised 2-panel square top design offers universal appeal and reliable operation.",
    "price": 339,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/01/BY0108_Ashbury-Bypass-Door_Lifestyle-Open-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BY0108"
      }
    ]
  },
  {
    "id": "45",
    "name": "Ashbury 2 Panel Insert Design with Steel Frame Bifold Door",
    "description": "Whether your closet size requires two panels or four, the Ashbury bifold door's molded, square top, 2-panel design offers universal appeal and reliable operation.",
    "price": 549,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BI0221_18_Ashbury_Molded-Panels_Single_Closed_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BI0221BW19"
      }
    ]
  },
  {
    "id": "46",
    "name": "Crochet Multi-X Design Pivot Door",
    "description": "Looking for a unique closet door idea? The Crochet multi-X design pivot closet door's handsome design interweaves stacked X's against a translucent background.",
    "price": 599,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/05/PV3330_Crochet-Beauty-Image-Open_cropped-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "PV3330"
      }
    ]
  },
  {
    "id": "47",
    "name": "Euro 1-Lite Bifold Door",
    "description": "The stylish sophistication of our Euro 1-lite sliding bifold closet doors with contemporary frosted glass inserts can clearly be attributed to their Italian design heritage.",
    "price": 509,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU3110_Euro-1-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3110"
      }
    ]
  },
  {
    "id": "48",
    "name": "Euro 1-Lite Bifold Door",
    "description": "The stylish sophistication of our Euro 1-lite sliding bifold closet doors with contemporary frosted glass inserts can clearly be attributed to their Italian design heritage.",
    "price": 509,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU3010_Euro_1-Lite-Bifold_Off-White_Lifestyle-1.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3010"
      }
    ]
  },
  {
    "id": "49",
    "name": "Euro 1-Lite Bypass Door",
    "description": "Italian-designed and classically inspired, our 1-lite sliding bypass closet door features an Iron Age prefinished frame encompassing a frosted glass insert. These high-quality closet doors blend a smooth wood grain look and solid engineered wood frame with the translucent glass insert's openness, light and privacy.",
    "price": 674,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU2450_Euro-1-Lite-Bypass_Iron-Age_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU2450"
      }
    ]
  },
  {
    "id": "50",
    "name": "Euro 1-Lite Bypass Door",
    "description": "This European-inspired 1-lite sliding bypass closet door system with frosted glass insert conceals storage and preserves privacy, while adding a feeling of openness and light to your room. A smooth, Off-White painted-look frame surrounds the glass for a neat, modern appearance that pairs well with mid-century modern, minimalistic, industrial and urban home designs.",
    "price": 674,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU2010_Euro-1-Lite-Bypass_Off-White_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU2010"
      }
    ]
  },
  {
    "id": "51",
    "name": "Euro 1-Lite Design Pivot Door",
    "description": "European-inspired and Italian-designed, 1-lite pivot closet door with frosted glass insert highlights stylish heritage and elegance.",
    "price": 529,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/PV5401_1-Lite-White-Beauty-Image-Open_cropped-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "PV5401"
      }
    ]
  },
  {
    "id": "52",
    "name": "Euro 3-Lite Bifold Door",
    "description": "Our Euro 3-lite sliding bifold closet doors showcase a stack window design with contemporary frosted glass inserts that protect privacy while adding light.",
    "price": 509,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/01/EU3150_Euro-3-Lite-Bifold_Iron-Age_Lifestyle-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3150"
      }
    ]
  },
  {
    "id": "53",
    "name": "Euro 3-Lite Bifold Door",
    "description": "Our Euro 3-lite sliding bifold closet doors showcase a stack window design with contemporary frosted glass inserts that protect privacy while adding light.",
    "price": 509,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/EU3080_Euro-3-Lite-Bifold_Off-White_Lifestyle-2-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3080"
      }
    ]
  },
  {
    "id": "54",
    "name": "Euro 3-Lite Bypass Door",
    "description": "Combining the rich heritage of Italian design with contemporary European styling, these 3-lite sliding bypass closet doors showcase an Iron Age finish on an engineered wood frame. The solid, smooth wood look framework delicately balances the transparency of the three frosted glass inserts, bringing openness and light to any room.",
    "price": 674,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU2460_Euro-3-Lite-Bypass_Iron-Age_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU2460"
      }
    ]
  },
  {
    "id": "55",
    "name": "Euro 3-Lite Bypass Door",
    "description": "European-inspired, 3-lite sliding bypass closet door system with frosted glass for translucent light transmission and privacy. Clean, bright, contemporary appearance ideal for mid-century modern, minimalistic, industrial and urban home designs.",
    "price": 674,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU2030_Euro-3-Lite-Bypass_Off-White_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU2030"
      }
    ]
  },
  {
    "id": "56",
    "name": "Euro 3-Lite Design Pivot Door",
    "description": "European-inspired and Italian-designed, 3-lite pivot closet door with frosted glass insert highlights stylish heritage and elegance.",
    "price": 529,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/PV5402_3-Lite-White-Beauty-Image-Open_cropped-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "PV5402"
      }
    ]
  },
  {
    "id": "57",
    "name": "Euro 5-Lite Bypass Door",
    "description": "Featuring five frosted glass inserts and Iron Age finished framing, these Italian-designed 5-lite sliding bypass closet doors add light and openness to any room without sacrificing privacy. The sliding closet doors are constructed of solid engineered wood with a smooth wood grain look.",
    "price": 674,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU2470_Euro-5-Lite-Bypass_Iron-Age_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU2470"
      }
    ]
  },
  {
    "id": "58",
    "name": "Galloway 4 Panel Design Steel Frame Bypass Door",
    "description": "The Galloway 4-panel bypass closet door's flush inserts feature a raised horizontal panel design encased in a narrow steel frame with an integrated ergonomic handle.",
    "price": 339,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BY0100_beauty.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BY0110"
      }
    ]
  },
  {
    "id": "59",
    "name": "Georgian 6 Panel Design Steel Frame Bypass Door",
    "description": "The Georgian bypass closet door displays a raised 6-panel design, prefinished in white wood grain texture.",
    "price": 339,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/BY0106_Georgian-6-Panel-Design_Open-Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BY0106"
      }
    ]
  },
  {
    "id": "60",
    "name": "Georgian 6 Panel Insert Design with Steel Frame Bifold Door",
    "description": "Adding a traditional accent to any room, the Georgian bifold closet door features a raised 6-panel square top design, prefinished in white wood grain texture and encased in a Bright White narrow steel frame.",
    "price": 549,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BI0221_16_Georgian_Wood-Grain-Textured_Single_Closed_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BI0221BW18"
      }
    ]
  },
  {
    "id": "61",
    "name": "Harmony 1-Lite Bypass Door",
    "description": "The Harmony sliding closet door features full-length mirrors with narrow framing to create a winning combination for both traditional and modern design. The high-quality engineered wood framing is prefinished in Bright White to match any interior decorating palette. The bypass door panels' mirror inserts enhance the functionality of your space, while seeming to enlarge your room with extra depth, dimension and reflection.",
    "price": 649,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU3210-Harmony-Closet-Doors-White-Mirror-Bypass_Beauty-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3210"
      }
    ]
  },
  {
    "id": "62",
    "name": "Lace Multi-X Design Bypass Door",
    "description": "The Lace Multi-X sliding bypass closet door blends cosmopolitan glamour with traditional charm. Overlaying a full-length mirror, the door's Multi-X design creates a geometric lattice of decorative Bright White finished framing in a textured wood grain look.",
    "price": 649,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/EU3265-Urban-Lace-Mirror-Bypass-Closet-Door-Lifestyle-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3265"
      }
    ]
  },
  {
    "id": "63",
    "name": "Parsons Flush Panel Design Steel Frame Bypass Door",
    "description": "The Parsons flush panel design bypass closet door delivers a sleek, neutral appearance compatible with any room.",
    "price": 339,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/Model-100_BW_White_Panel_150-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BY0100"
      }
    ]
  },
  {
    "id": "64",
    "name": "Parsons Flush Panel Insert Design with Steel Frame Bifold Door",
    "description": "Coordinating with any room, The Parsons flush panel design bifold closet door's Bright White narrow frame encases smooth, prefinished whitewood inserts with an integrated ergonomic handle.",
    "price": 549,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/BI0221_10_Parsons_Flush-White-Wood-Textured_Single_Closed_Lifestyle-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BI0221BW10"
      }
    ]
  },
  {
    "id": "65",
    "name": "Provincial 8-Lite Design Pivot Door",
    "description": "Combines traditional design with modern styling of clean lines, white finishes and crisp frosted glass.",
    "price": 599,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/05/PV3340_Provincial-Beauty-Image-Open_cropped-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "PV3340"
      }
    ]
  },
  {
    "id": "66",
    "name": "Savona 2 Panel Arched Design Steel Frame Bypass Door",
    "description": "The Savona 2-panel arched design steel frame sliding bypass closet door features prefinished, flush inserts encased in a Bright White slimline frame with an integrated ergonomic handle.",
    "price": 339,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2021/01/BY0109_Savona-Bypass-Door_Lifestyle_cropped.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "BY0109"
      }
    ]
  },
  {
    "id": "67",
    "name": "Trident Double-K Design Bypass Door",
    "description": "Presenting a modern interpretation of the well known, traditional wood barn doors, our Trident Double-K sliding bypass closet door in Pure White can brighten up any room.",
    "price": 649,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/EU3295-Trident-Pure-White-Lifestyle_Open-Straight-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3295"
      }
    ]
  },
  {
    "id": "68",
    "name": "Trident Double-K Design Bypass Door",
    "description": "The Trident Double-K sliding bypass closet door in Silver Oak presents a creative, modern interpretation of the well known, traditional wood barn doors.",
    "price": 649,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/12/EU3290-Trident-Silver-Oak-Lifestyle_Straight-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3290"
      }
    ]
  },
  {
    "id": "69",
    "name": "Twilight 1-Lite Bypass Door",
    "description": "Full-height, frosted glass set in a Bright White frame make the Twilight sliding bypass closet door an ideal and functional accent for any room.",
    "price": 649,
    "category": "Barn Doors",
    "image": "https://www.renin.com/wp-content/uploads/2020/11/EU3220-Twilight-Closet_Doors_White_Frosted_Glass_Beauty-1-scaled.jpg",
    "specs": [
      {
        "label": "SKU",
        "value": "EU3220"
      }
    ]
  }
];
