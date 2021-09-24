import { Adsense } from '@ctrl/react-adsense';
import {
  Box, createTheme, makeStyles,
  NoSsr,
  Theme, useMediaQuery
} from '@material-ui/core';
import { useMemo } from 'react';
import './Articles.scss';

const useStyles = makeStyles((theme: Theme) => ({
  root: { minHeight: '100vh' },
  inner: { minHeight: '100vh' },
  dividerFullWidth: {
    margin: `5px 0 0 ${theme.spacing(2)}px`,
    textAlign: 'center',
    padding: '5px',
  },
}));

function Articles() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = useMemo(
    () =>
      createTheme({
        spacing: 8,
        palette: {
          primary: {
            main: '#ef5a00',
          },
          type: prefersDarkMode ? 'dark' : 'light',
          background: {
            default: prefersDarkMode ? '#000' : '#FFF',
          },
        },
      }),
    [prefersDarkMode]
  );
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box mx={{ xs: 1, sm: 4, md: 16, lg: 32 }}>
        <Adsense
          client="ca-pub-1383291322337575"
          slot="7259870550"
          style={{ display: 'block' }}
          layout="in-article"
          format="fluid"
        />
        <NoSsr>
          <main className="wrapper">
            <section className="hero">
              <h1>Articles hub</h1>
              <article>
                <p>
                  All the best <span className="highlighted">FIRE</span> information at your fingertips
                </p>
              </article>
            </section>
            <section className="breweries" id="breweries">
              <ul>
                <li>
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8ZmluYW5jZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                      alt="Pensions"
                    />
                    <figcaption>
                      <h3>Pensions</h3>
                    </figcaption>
                  </figure>
                  <p>
                    Pensions are a great tool in the FIRE toolbox, even when the goal is to FIRE before you reach
                    pension age.
                  </p>
                  <a href="/article/pension">View full article</a>
                </li>
                <li>
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZmluYW5jZSUyMGZ1bGwlMjB3aWR0aHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                      alt="Capital Gains"
                    />
                    <figcaption>
                      <h3>Capital Gains</h3>
                    </figcaption>
                  </figure>
                  <p>Capital gains tax-allowance means you can make another £12300 profit per year tax efficiently.</p>
                  <a href="/article/capital-gains">View full article</a>
                </li>
                <li>
                  <figure>
                    <img
                      src="https://images.unsplash.com/photo-1624953901718-e24ee7200b85?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZmluYW5jZSUyMGZ1bGwlMjB3aWR0aHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                      alt="Fire Calculator"
                    />
                    <figcaption>
                      <h3>Fire Calculator</h3>
                    </figcaption>
                  </figure>
                  <p>Calculate FIRE figures and see when you can FIRE</p>
                  <a href="/calculator">View full article</a>
                </li>
              </ul>
            </section>
          </main>
          <footer>
            <p>&copy; 2021. Fire Calculator Club.</p>
          </footer>
        </NoSsr>
      </Box>
    </div>
  );
}

export default Articles;
