import './Blog.scss';

import { Link } from 'react-router-dom';

export const BlogHome = () => {
  return (
    <div className="blog__container">
      <div className="blog__hero">
        <h1 className="blog__hero-title">Blog Home</h1>
      </div>
      <div className="blog__content-container">
        <h1 className="blog__content-title">After Pension And ISA’s</h1>
        <h3 className="blog__content-date">Sep 23</h3>
        <p className="blog__content-text">
          Capital gains tax-allowance means you can make another £12300 profit per year tax efficiently. Pensions and
          ISA’s are the most tax-efficient way of investing, but there is a limit to how much you can contribute; they
          are £40000 and £20000 respectively...
        </p>
        <div className="blog__read-more">
          <Link to="/blog">Read more · 2 min read</Link>
        </div>
      </div>
    </div>
  );
};

// background,
// border,
// borderRadius: radius,
// height,
// width,
// color,
// fontSize,
// fontFamily,
// fontWeight,
