import './Blog.scss';

export const Blog = () => {
  return (
    <div className="blog__container">
      <div className="blog__hero">
        <h1 className="blog__hero-title">Blog page you wanted</h1>
      </div>
      <div className="blog__content-container">
        <h1 className="blog__content-title">After Pension And ISA’s</h1>
        <h3 className="blog__content-date">Sep 23 * 2 min read</h3>
        <p className="blog__content-text">
          Capital gains tax-allowance means you can make another £12300 profit per year tax efficiently. Pensions and
          ISA’s are the most tax-efficient way of investing, but there is a limit to how much you can contribute; they
          are £40000 and £20000 respectively. After leveraging them, the next place tax efficiency you can look at
          leveraging is capital gains tax. The current capital gains tax-free allowance is £12,300. It’s possible to
          make £12,300 in profit before you need to pay capital gains tax. Capital gains tax is an annual threshold, and
          you can leverage it year on year.
        </p>
        <h2 className="blog__content-subtitle">How does it work?</h2>
        <p className="blog__content-text">
          Let’s say Alice has leveraged her £40000 pension allowance and contributed £20000 to her ISA. She has an
          annual bonus of £20000 that she wants to invest in, so she puts it into a general stocks investment fund. Her
          investment fund is excelling, and Alice is making a good return of 10%. She doesn’t have to pay any tax whilst
          she holds these stocks. <br />
          <br />
          After five years, Alice has invested £100000. The growth of the investment means it’s worth £124600. Alice has
          still not paid any tax on this investment, and she doesn’t until she sells and makes capital on her
          investment. The amount the investment had grown was £24600. If she were to sell all the stocks, Alice would be
          able to leverage the £12300 capital gains tax-free allowance and then she’d have to pay capital gains tax at
          £2460 on the other £12300. <br />
          <br />
          For ease of calculation, the investment doesn’t grow over the next few years. Alice could split selling the
          investment over two tax years instead of selling the investment over one tax year so she wouldn’t have to pay
          the £2460 capital gains tax.
        </p>
        <img
          className="blog__content-image"
          alt="financial graph"
          src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmluYW5jZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        />
        <h2 className="blog__content-subtitle">Other investments</h2>
        <p className="blog__content-text">
          Property is another investment popular investment. You can profit from property in the rental income as well
          as the growth of the asset. It’s necessary to consider the additional costs when investing in property, such
          as maintenance, letting fees and time when the property isn’t let out. On top of this, selling property is
          very binary; you can only sell the whole house. It makes it hard to be tax-efficient when trying to get the
          capital back out. You can’t split the profit over multiple tax years, and you’ll have to pay tax on any growth
          over £12300. It doesn’t rule out investing in property. A varied investment portfolio can reduce risk.
        </p>
      </div>
    </div>
  );
};
