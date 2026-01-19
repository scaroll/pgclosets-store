export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  specs: string[];
  image: string;
  features?: string[];
  mechanism?: string;
  material?: string;
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
  finishOptions?: string[];
  installation?: string;
  warranty?: string;
}

export interface DetailedSpecs {
  material: string;
  dimensions?: {
    width: string;
    height: string;
    depth: string;
  };
  finish?: string;
  mechanism?: string;
  installation?: string;
  warranty?: string;
}

export const simpleProducts: Product[] = [
  {
    id: "continental-001",
    name: "Continental",
    price: 459,
    image: "/images/arcat/renin_176732_hd.jpg",
    category: "Bifold Doors",
    description: "Premium engineered wood core, durable laminate surface",
    specs: [
      "Premium engineered wood core",
      "Durable laminate surface",
      "Heavy-duty hinges",
      "Easy installation",
    ],
    features: [
      "Space-saving design",
      "Smooth operation",
      "Multiple finish options",
      "Premium hardware included",
    ],
    dimensions: {
      width: "24\"-36\"",
      height: "80\"-96\"",
      depth: "1.375\""
    },
    finishOptions: ["White", "Off-White", "Natural Oak", "Espresso"],
    warranty: "10 Year Limited Warranty",
    installation: "Professional installation recommended"
  },
  {
    id: "provincial-002",
    name: "Provincial",
    price: 559,
    image: "/images/arcat/renin_176733_hd.jpg",
    category: "Bypass Doors",
    description: "Elegant design with smooth-glide track system",
    specs: [
      "Premium MDF construction",
      "Soft-close mechanism",
      "Adjustable track",
      "Contemporary design",
    ],
    features: [
      "Modern aesthetic",
      "Quiet operation",
      "Easy maintenance",
      "Versatile installation options",
    ],
    dimensions: {
      width: "48\"-96\"",
      height: "80\"-96\"",
      depth: "1.5\""
    },
    finishOptions: ["Matte White", "Gray Oak", "Dark Walnut"],
    warranty: "Limited Lifetime Warranty",
    installation: "Professional installation included"
  },
  {
    id: "modern-barn-003",
    name: "Modern Barn",
    price: 799,
    image: "/images/arcat/renin_176734_hd.jpg",
    category: "Barn Doors",
    description: "Contemporary barn door with premium hardware",
    specs: [
      "Solid core construction",
      "Premium sliding hardware",
      "Anti-jump system",
      "Soft-close included",
    ],
    features: [
      "Statement piece design",
      "Smooth sliding action",
      "Multiple size options",
      "Complete hardware kit",
    ],
    dimensions: {
      width: "36\"-42\"",
      height: "84\"-96\"",
      depth: "1.75\""
    },
    finishOptions: ["Weathered Gray", "Classic Black", "Vintage Brown"],
    warranty: "25 Year Limited Warranty",
    installation: "Professional installation required"
  },
  {
    id: "premium-hardware-004",
    name: "Premium Hardware Kit",
    price: 159,
    image: "/images/arcat/renin_176735_hd.jpg",
    category: "Hardware",
    description: "Complete premium door hardware solution",
    specs: [
      "Stainless steel construction",
      "Quiet operation",
      "Easy installation",
      "Universal fit",
    ],
    features: [
      "Durable finish",
      "Smooth mechanism",
      "All mounting hardware included",
      "Installation guide provided",
    ],
    dimensions: {
      width: "N/A",
      height: "N/A",
      depth: "N/A"
    },
    finishOptions: ["Brushed Nickel", "Matte Black", "Oil-Rubbed Bronze"],
    warranty: "Lifetime Warranty",
    installation: "DIY installation possible"
  }
];

export default simpleProducts;