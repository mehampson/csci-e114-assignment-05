/**
 * @type {import('gatsby').GatsbyConfig}
 */
module.exports = {
  siteMetadata: {
    title: `assignment-4-gatsby`,
    description: `Starter Gatsby project for Assignment 4`,
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
        path: `${__dirname}/data/`,
      },
    }
  ],
}

    // consider the following plugins you may choose to use for your project
    
    /*    FOR IMAGES LOCATED WITHIN YOUR PROJECT, USING GatsbyImage or StaticImage

    */

    /*  THIS PAIR FOR READING JSON FILES FROM THE FILESYSTEM
    `gatsby-transformer-json`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/data/`,
      },
      /*

      /*  FOR READING IMAGES FROM FILESYSTEM AND PROCESSING THROUGH THE IMAGE PLUGINS 
      {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/[path to where you keep images]]`,
      },
    },  
    */

    /*  FOR PROCESSING MARKDOWN FILES INTO HTML
        `gatsby-transformer-remark`,
    */

    /*  FOR PROCESSING LOCAL IMAGES REFERENCED IN MARKDOWN
        {
      resolve: `gatsby-remark-images`,
      options: {
        maxWidth: 1200,
      },  
    },
    */

    /* FOR PROCESSING REMOTE IMAGES REFERENCED BY URL
        nodeType is the top-level node type, so if you have an 'allPark' node in graphql, you'd put 'park' here
    {
      resolve: `gatsby-plugin-remote-images`,
      options: {
        nodeType: '[GRAPHQL_NODE_CONTAINING_IMAGE_URLS]',  
        imagePath: '[PATH TO IMAGE URL]]',  // navigating from the nodeType down
        name: 'localImages',  // name of property in graphql schema to contain the new, cached processed image
        silent: true   // ignore 404s
      },
    },*/
