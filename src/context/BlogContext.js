
import { createContext, useContext, useState } from 'react';

const BlogContext = createContext();

export const BlogProvider = ({ children, initialCategories }) => {
  const [categories, setCategories] = useState(initialCategories);

  return (
    <BlogContext.Provider value={{ categories, setCategories }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => useContext(BlogContext);
