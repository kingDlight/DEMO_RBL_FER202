import React from 'react';

interface CategoryListProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="flex gap-[16px] overflow-x-auto pb-[8px]">
      {categories && categories.length > 0 ? (
        categories.map((cat, index) => {
          const isActive = activeCategory === cat || (activeCategory === null && cat === 'All');
          return (
            <button 
              key={index}
              onClick={() => onSelectCategory(cat === 'All' ? null : cat)}
              className={`px-[32px] py-[8px] rounded-full font-label-md text-[14px] whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-[#d2bbff] text-[#3f008e] font-bold' 
                  : 'bg-[#37333e] text-[#e8dfee] hover:bg-[#3c3742]'
              }`}
            >
              {cat}
            </button>
          );
        })
      ) : (
        <div className="text-[#ccc3d8]">Không có danh mục nào.</div>
      )}
    </div>
  );
};

export default CategoryList;
