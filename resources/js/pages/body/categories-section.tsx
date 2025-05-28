"use client"

import { Utensils, Heart, Sparkles, Home, ChefHat, Baby, Shirt, Recycle, PawPrint } from "lucide-react"

const categories = [
  {
    id: "food-beverage",
    name: "FOOD & BEVERAGE",
    icon: Utensils,
    href: "/categories/food-beverage",
  },
  {
    id: "health-wellness",
    name: "HEALTH & WELLNESS",
    icon: Heart,
    href: "/categories/health-wellness",
  },
  {
    id: "personal-care",
    name: "PERSONAL CARE",
    icon: Sparkles,
    href: "/categories/personal-care",
  },
  {
    id: "home-cleaning",
    name: "HOME CLEANING",
    icon: Home,
    href: "/categories/home-cleaning",
  },
  {
    id: "kitchen-essentials",
    name: "KITCHEN ESSENTIALS",
    icon: ChefHat,
    href: "/categories/kitchen-essentials",
  },
  {
    id: "baby-kids",
    name: "BABY & KIDS",
    icon: Baby,
    href: "/categories/baby-kids",
  },
  {
    id: "clothing-textiles",
    name: "CLOTHING & TEXTILES",
    icon: Shirt,
    href: "/categories/clothing-textiles",
  },
  {
    id: "sustainable-living",
    name: "SUSTAINABLE LIVING",
    icon: Recycle,
    href: "/categories/sustainable-living",
  },
  {
    id: "pet-care",
    name: "PET CARE",
    icon: PawPrint,
    href: "/categories/pet-care",
  },
]

export default function CategoriesSection() {
  const handleCategoryClick = (category: (typeof categories)[0]) => {
    console.log(`Clicked on ${category.name}`)
    // You can replace this with your routing logic
    window.location.href = category.href
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-light text-center text-gray-900 mb-12 tracking-wide">
          Browse by Categories
        </h2>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-6 max-w-7xl mx-auto">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group hover:scale-105"
              >
                {/* Icon */}
                <div className="mb-3 p-3 bg-gray-100 rounded-full group-hover:bg-primary/10 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-gray-700 group-hover:text-primary transition-colors duration-300" />
                </div>

                {/* Category Name */}
                <span className="text-xs font-medium text-gray-800 text-center leading-tight group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
