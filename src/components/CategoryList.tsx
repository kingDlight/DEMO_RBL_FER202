import React from 'react';

interface CategoryListProps {
  categories: string[];
  activeCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  if (!categories || categories.length === 0) {
    return <div className="text-on-surface-variant">Khong co danh muc nao.</div>;
  }

  return (
    <div className="grid grid-cols-2 gap-md sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {categories.map((category) => {
        const isActive =
          activeCategory === category || (activeCategory === null && category === 'All');

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelectCategory(category === 'All' ? null : category)}
            className={`min-h-14 rounded-xl px-md py-sm text-center font-label-md text-label-md transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-primary-container text-on-primary-container shadow-[0_10px_30px_rgba(124,58,237,0.24)]'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            <span className="block truncate">{category}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryList;
