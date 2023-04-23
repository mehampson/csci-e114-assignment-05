import('gatsby').GatsbyConfig;
import path from 'path';
import { fileURLToPath } from 'url';

// from https://alvin.codes/snippets/migrate-gatsby-esm
const dirname = path.dirname(fileURLToPath(import.meta.url));

const config = {
  siteMetadata: {
    title: `assignment-5-gatsby`,
    description: `Starter Gatsby project for Assignment 5`,
    course: `CSCI E-114`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: path.join(dirname, 'data'),
      },
    }
  ],
};


export default config;
