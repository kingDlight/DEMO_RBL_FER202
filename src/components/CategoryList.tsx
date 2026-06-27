import React from 'react';

const CategoryList: React.FC = () => {
  // Khai báo mảng danh mục
  const CATEGORIES = ["All", "Electronic", "Synthwave", "Lo-Fi", "Ambient", "Pop", "Rock", "Jazz"];
  
  // Biến cờ (flag) để demo conditional rendering
  const isLoading = false;

  return (
    <section className="px-[16px] md:px-[32px] mb-[48px]">
      <h2 className="font-headline-md text-[24px] font-bold text-[#e8dfee]">Browse Categories</h2>
      
      {/* Conditional Rendering: Toán tử 3 ngôi (Ternary Operator) */}
      {isLoading ? (
        <div className="text-[#ccc3d8] mt-4">Đang tải danh mục...</div>
      ) : (
        /* Lại dùng toán tử && (Logical AND) để kiểm tra mảng rỗng */
        CATEGORIES.length > 0 && (
          <div className="flex gap-[16px] overflow-x-auto pb-[8px] mt-[24px]">
            {CATEGORIES.map((cat, index) => (
              <button 
                key={index}
                className={`px-[32px] py-[8px] rounded-full font-label-md text-[14px] whitespace-nowrap transition-colors ${
                  index === 0 
                    ? 'bg-[#d2bbff] text-[#3f008e] font-bold' 
                    : 'bg-[#37333e] text-[#e8dfee] hover:bg-[#3c3742]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )
      )}
      
      {/* Thêm một fallback nữa nếu mảng rỗng (cho đúng chuẩn bài toán) */}
      {!isLoading && CATEGORIES.length === 0 && (
        <div className="text-[#ffb4ab] mt-4">Không có danh mục nào.</div>
      )}
    </section>
  );
};

export default CategoryList;
