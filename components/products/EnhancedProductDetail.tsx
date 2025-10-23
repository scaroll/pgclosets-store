"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Truck,
  Shield,
  Award,
  Share2,
  Heart,
  ZoomIn,
  Star,
  Clock,
  Package,
  Wrench,
  Download,
  Phone,
  Mail,
  MapPin,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Calculator,
  Percent,
  MessageCircle,
  ThumbsUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReninProduct, ProductVariant } from "@/lib/types/renin-products";

interface EnhancedProductDetailProps {
  product: ReninProduct;
}

export function EnhancedProductDetail({ product }: EnhancedProductDetailProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-10-15",
      title: "Absolutely Beautiful!",
      content: "The quality exceeded our expectations. Installation was smooth and the final look is stunning.",
      verified: true,
      helpful: 23
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4,
      date: "2024-10-12",
      title: "Great Product, Excellent Service",
      content: "Very happy with our purchase. The team was professional and the product is well-made.",
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 5,
      date: "2024-10-08",
      title: "Transformed Our Space",
      content: "These doors completely transformed our closet space. Worth every penny!",
      verified: true,
      helpful: 31
    }
  ];

  // Calculate price range
  const priceRange = useMemo(() => {
    if (!product.variants?.length) return { min: 0, max: 0 };
    const prices = product.variants.map(v => v.priceCAD);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [product.variants]);

  // Format price
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
    }).format(price);
  };

  // Get availability status
  const getAvailabilityStatus = (availability: string) => {
    switch (availability) {
      case 'InStock':
        return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
      case 'OutOfStock':
        return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Limited Stock', color: 'bg-yellow-100 text-yellow-800' };
    }
  };

  // Handle share functionality
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out this ${product.name} from PG Closets!`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(product.name)}&body=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  // Add to cart functionality
  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      variant: selectedVariant,
      quantity,
      price: selectedVariant.priceCAD,
      image: product.media?.[0]?.url
    };

    // TODO: Implement cart state management
    console.log('Added to cart:', cartItem);

    // Show success message
    alert('Product added to cart!');
  };

  // Calculate total price
  const totalPrice = selectedVariant ? selectedVariant.priceCAD * quantity : 0;
  const installationPrice = selectedVariant?.installAddonCAD || 0;
  const totalWithInstallation = totalPrice + installationPrice;

  // Bulk pricing tiers
  const bulkPricingTiers = [
    { minQty: 1, maxQty: 4, discount: 0 },
    { minQty: 5, maxQty: 9, discount: 5 },
    { minQty: 10, maxQty: 24, discount: 10 },
    { minQty: 25, maxQty: 49, discount: 15 },
    { minQty: 50, maxQty: 999, discount: 20 }
  ];

  // Calculate bulk pricing
  const getCurrentBulkPricing = () => {
    const tier = bulkPricingTiers.find(t => quantity >= t.minQty && quantity <= t.maxQty);
    return tier || bulkPricingTiers[0];
  };

  const bulkPricing = getCurrentBulkPricing();
  const discountedPrice = totalPrice * (1 - bulkPricing.discount / 100);
  const savings = totalPrice - discountedPrice;

  // Get related products (mock data for now)
  const relatedProducts = [
    {
      name: "Matching Hardware Set",
      price: 299,
      image: "/images/products/hardware.jpg",
      description: "Complete hardware kit for perfect installation"
    },
    {
      name: "Installation Service",
      price: 450,
      image: "/images/products/installation.jpg",
      description: "Professional installation by certified technicians"
    },
    {
      name: "Care & Maintenance Kit",
      price: 89,
      image: "/images/products/care-kit.jpg",
      description: "Everything needed to maintain your doors"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center space-x-2 py-4 text-sm">
            <li><Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/products" className="text-gray-500 hover:text-gray-700">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href={`/products?category=${product.category}`} className="text-gray-500 hover:text-gray-700 capitalize">
                {product.category?.replace('-', ' ')}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium truncate">{product.name}</li>
          </ol>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Main Section */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image with Zoom */}
            <div
              className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <Image
                src={product.media?.[selectedImageIndex]?.url || '/placeholder.svg'}
                alt={product.media?.[selectedImageIndex]?.alt || product.name}
                width={800}
                height={800}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
              />

              {/* Image Zoom Icon */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                <ZoomIn className="w-5 h-5 text-gray-700" />
              </div>

              {/* Image Counter */}
              {product.media && product.media.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                  {selectedImageIndex + 1} / {product.media.length}
                </div>
              )}

              {/* Badges Overlay */}
              {product.badges && product.badges.length > 0 && (
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  {product.badges.slice(0, 2).map((badge, index) => (
                    <Badge key={index} className="bg-white/90 text-gray-900 backdrop-blur-sm">
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.media && product.media.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {product.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200",
                      selectedImageIndex === index
                        ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                        : "border-gray-200 hover:border-gray-400 hover:scale-105"
                    )}
                  >
                    <Image
                      src={media.url}
                      alt={`${media.alt} - Thumbnail`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex gap-2 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="flex items-center gap-2"
              >
                <Heart className={cn("w-4 h-4", isWishlisted && "fill-red-500 text-red-500")} />
                {isWishlisted ? 'Saved' : 'Save'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            {/* Share Menu */}
            {showShareMenu && (
              <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                <div className="grid grid-cols-4 gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="text-sky-600 hover:text-sky-700"
                  >
                    Twitter
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="text-blue-700 hover:text-blue-800"
                  >
                    LinkedIn
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleShare('email')}
                    className="text-gray-600 hover:text-gray-700"
                  >
                    Email
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extralight text-gray-900 leading-tight mb-2">
                    {product.name}
                  </h1>
                  <p className="text-lg text-gray-600 font-light mb-3">{product.tagline}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.9 from 127 reviews)</span>
              </div>

              {/* Price Display */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3 mb-2">
                  {priceRange.min === priceRange.max ? (
                    <div className="text-3xl font-light text-gray-900">
                      {formatPrice(priceRange.min)}
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm text-gray-500">From</span>
                      <span className="text-3xl font-light text-gray-900">
                        {formatPrice(priceRange.min)}
                      </span>
                      <span className="text-lg text-gray-500">to {formatPrice(priceRange.max)}</span>
                    </div>
                  )}
                  {selectedVariant && bulkPricing.discount > 0 && (
                    <Badge className="bg-green-100 text-green-800 animate-pulse">
                      <Percent className="w-3 h-3 mr-1" />
                      {bulkPricing.discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* Bulk Pricing Display */}
                {selectedVariant && quantity > 1 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-900">Bulk Pricing Applied</span>
                      <Badge className="bg-blue-600 text-white">
                        {bulkPricing.discount}% Savings
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Regular:</span>
                        <span className="ml-2 line-through text-gray-500">{formatPrice(totalPrice)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">You save:</span>
                        <span className="ml-2 font-semibold text-green-600">{formatPrice(savings)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Your price:</span>
                        <span className="ml-2 font-bold text-blue-600">{formatPrice(discountedPrice)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Urgency Indicator */}
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Limited stock - Order soon!</span>
                  </div>
                  {product.attributes?.madeInCanada && (
                    <Badge className="bg-red-100 text-red-800">
                      <MapPin className="w-3 h-3 mr-1" />
                      Made in Canada
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Variant Selection */}
            {product.variants && product.variants.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Select Size & Finish</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedVariant?.sku}
                    onValueChange={(value) => {
                      const variant = product.variants?.find(v => v.sku === value);
                      setSelectedVariant(variant);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a variant" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map((variant) => (
                        <SelectItem key={variant.sku} value={variant.sku}>
                          <div className="flex flex-col">
                            <span>{variant.name}</span>
                            <span className="text-sm text-gray-500">
                              {formatPrice(variant.priceCAD)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-r-none"
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="h-10 w-16 text-center border-0 rounded-none"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-l-none"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Availability Status */}
            {selectedVariant && (
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                <span className="text-sm">
                  Status:
                  <span className={cn("ml-2 px-2 py-1 rounded-full text-xs font-medium",
                    getAvailabilityStatus(selectedVariant.availability).color
                  )}>
                    {getAvailabilityStatus(selectedVariant.availability).text}
                  </span>
                </span>
              </div>
            )}

            {/* Price Summary */}
            {selectedVariant && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product Price ({quantity}x):</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span>{formatPrice(installationPrice)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total:</span>
                      <span>{formatPrice(totalWithInstallation)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Bulk Pricing Table */}
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Trade Pricing Available
                  </h4>
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    <Calculator className="w-4 h-4 mr-1" />
                    Calculate
                  </Button>
                </div>
                <div className="space-y-1 text-sm">
                  {bulkPricingTiers.map((tier, index) => (
                    <div
                      key={index}
                      className={`flex justify-between p-2 rounded ${
                        quantity >= tier.minQty && quantity <= tier.maxQty
                          ? 'bg-purple-200 font-semibold'
                          : 'text-gray-600'
                      }`}
                    >
                      <span>
                        {tier.minQty}-{tier.maxQty === 999 ? '+' : tier.maxQty} units
                      </span>
                      <span className="flex items-center gap-2">
                        {tier.discount > 0 && (
                          <>
                            <span className="line-through text-gray-500">
                              {formatPrice(selectedVariant?.priceCAD || 0)}
                            </span>
                            <span className="text-green-600 font-medium">
                              {formatPrice((selectedVariant?.priceCAD || 0) * (1 - tier.discount / 100))}
                            </span>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Save {tier.discount}%
                            </Badge>
                          </>
                        )}
                        {tier.discount === 0 && (
                          <span>{formatPrice(selectedVariant?.priceCAD || 0)}</span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || selectedVariant.availability !== 'InStock'}
                  className="min-h-[52px] relative overflow-hidden group"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Free Quote
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="min-h-[52px]"
                >
                  <Link href="/book">
                    <Phone className="w-4 h-4 mr-2" />
                    Book Consultation
                  </Link>
                </Button>
              </div>

              {/* Additional CTAs */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Live Chat
                </Button>
                <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Quote
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-green-600" />
                <span>{product.specifications?.warranty || '5 Year Warranty'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Wrench className="w-5 h-5 text-purple-600" />
                <span>Pro Installation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-5 h-5 text-yellow-600" />
                <span>Premium Quality</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <Tabs defaultValue="overview" className="w-full mb-12">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews (127)</TabsTrigger>
            <TabsTrigger value="installation">Installation</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Key Features</h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      See what our customers are saying about this product
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Review Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900 mb-1">4.9</div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">Based on 127 reviews</p>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-600 w-8">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{
                                width: `${rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`
                              }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8">
                            {rating === 5 ? 95 : rating === 4 ? 19 : rating === 3 ? 9 : rating === 2 ? 2 : 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Form */}
                {showReviewForm && (
                  <Card className="mb-6 border-blue-200 bg-blue-50">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-4">Write Your Review</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button key={star} className="text-gray-300 hover:text-yellow-400">
                                <Star className="w-6 h-6" />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Your Name" />
                          <Input placeholder="Email Address" />
                        </div>
                        <Input placeholder="Review Title" />
                        <textarea
                          placeholder="Write your review here..."
                          className="w-full p-3 border border-gray-300 rounded-lg h-32 resize-none"
                        />
                        <div className="flex items-center gap-2">
                          <Checkbox />
                          <label className="text-sm text-gray-600">
                            I agree to the terms and conditions
                          </label>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Submit Review
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {review.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{review.name}</h4>
                              {review.verified && (
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span>•</span>
                              <span>{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-gray-700 mb-3">{review.content}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <button className="flex items-center gap-1 hover:text-blue-600">
                          <ThumbsUp className="w-4 h-4" />
                          Helpful ({review.helpful})
                        </button>
                        <button className="hover:text-blue-600">Report</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="text-center mt-6">
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    Load More Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>
                  Detailed product measurements and technical information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 pb-3">
                      <dt className="font-medium text-gray-900 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </dt>
                      <dd className="text-gray-600">{String(value)}</dd>
                    </div>
                  ))}

                  {selectedVariant && (
                    <>
                      <div className="border-b border-gray-200 pb-3">
                        <dt className="font-medium text-gray-900 mb-1">SKU</dt>
                        <dd className="text-gray-600">{selectedVariant.sku}</dd>
                      </div>
                      <div className="border-b border-gray-200 pb-3">
                        <dt className="font-medium text-gray-900 mb-1">Weight</dt>
                        <dd className="text-gray-600">{selectedVariant.weight} lbs</dd>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="installation" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Installation Information</CardTitle>
                <CardDescription>
                  Professional installation details and requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Estimated Time
                    </h4>
                    <p className="text-blue-700">{product.attributes?.installationTime || '2-3 hours'}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <Wrench className="w-5 h-5" />
                      Professional Installation
                    </h4>
                    <p className="text-green-700">Available in Ottawa area</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">What's Included with Installation:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Professional measurement and assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Complete door installation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Hardware mounting and adjustment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Removal and disposal of old doors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-600 mt-0.5" />
                      <span>Final cleanup and demonstration</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Warranty Information</h4>
                  <p className="text-yellow-700 text-sm">
                    All installations include a 2-year workmanship warranty in addition to the manufacturer's warranty.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Features & Benefits</CardTitle>
                <CardDescription>
                  Premium features that make this product exceptional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {product.attributes?.madeInCanada && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-6 h-6 text-red-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Canadian Made</h4>
                        <p className="text-gray-600 text-sm">Proudly manufactured in Canada with premium materials</p>
                      </div>
                    </div>
                  )}

                  {product.attributes?.ecoFriendly && (
                    <div className="flex items-start gap-3">
                      <Award className="w-6 h-6 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold">Eco-Friendly</h4>
                        <p className="text-gray-600 text-sm">Sustainable materials and environmentally conscious manufacturing</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Durable Construction</h4>
                      <p className="text-gray-600 text-sm">Built to last with premium materials and craftsmanship</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Truck className="w-6 h-6 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Free Delivery</h4>
                      <p className="text-gray-600 text-sm">Complimentary delivery within the Ottawa area</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products Section */}
        <section>
          <Separator className="mb-8" />
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-extralight text-gray-900 tracking-tight">
              Complete the Look
            </h2>
            <Button variant="ghost" className="text-blue-600">
              View All Accessories
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map((item, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{formatPrice(item.price)}</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Add to Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Premium Services Banner */}
          <div className="mt-12 p-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-4">Professional Installation Available</h3>
                <p className="text-lg opacity-90 mb-6">
                  Let our certified professionals handle your installation. We'll measure, install, and ensure everything is perfect.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Licensed & Insured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>2-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5" />
                    <span>Free Estimates</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold mb-2">Starting at</div>
                  <div className="text-5xl font-extralight">$450</div>
                  <p className="text-sm opacity-75 mt-2">Professional installation service</p>
                </div>
                <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold">
                  <Wrench className="w-5 h-5 mr-2" />
                  Get Installation Quote
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Image Zoom Modal */}
      {isZoomed && product.media && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-6xl max-h-full">
            <Image
              src={product.media[selectedImageIndex].url}
              alt={product.media[selectedImageIndex].alt}
              width={1200}
              height={1200}
              className="max-w-full max-h-full object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsZoomed(false)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}