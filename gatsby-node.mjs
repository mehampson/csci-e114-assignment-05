import * as dotenv from 'dotenv';
import fetch from "@11ty/eleventy-fetch";
import { createRemoteFileNode } from 'gatsby-source-filesystem';

dotenv.config();

/* Convert a bird's common name into a URL-friendly slug */
function slugify(name) {
    return name
        /* We definitely have to strip out apostrophes. We might have to deal with other punctuation, too. 
            We'll use a regex for these, but just replaceAll for changing spaces to dashes. */
        .replace(/[']/g, '')
        /* Several birds have macrons that make URLs look bad when encoded */
        .replace(/[ā]/g, 'a')
        .replace(/[ī]/g, 'i')
        .replace(/[ō]/g, 'o')
        .replace(/[ū]/g, 'u')
        .replaceAll(' ', '-')
        .toLowerCase();
}


async function fetch_bird_photos(bird) {
    /* Fetches info about photos of our bird from Flickr.
       Flickr's REST API has some odd design choices. They only have one endpoint, and you use the 'method' 
       search parameter to specify what you actually want to do. They also assume you want to call the results
       with a callback named jsonFlickrAPI(), which we don't.
       See: https://www.flickr.com/services/developer/api/
     */

    const fetch_options = {
        directory: ".api-cache",
        duration: "1d", // this happens to be the max cache duration Flickr allows
        type: "json"
    };

    const api_url = new URL("https://www.flickr.com/services/rest");

    /* Configuring the API request. */
    api_url.search = new URLSearchParams(
        {
            method: 'flickr.photos.search',
            api_key: process.env.FLICKR_API_KEY,
            format: 'json', // the default response format is XML
            content_type: 1, // photos only
            per_page: 10, // This is effectively how we limit the results per request. Let's be reasonable here.
            privacy_filter: 1, // only public search results, in case your API user has any contacts
            safe_search: 1, // considering some of the bird names we're searching for, we DEFINITELY want safe search
            license: '1,2,3,4,5,6,7,8,9,10', // these are Flickr's open license IDs, to prevent copyright violations
            extras: 'description,license,owner_name,media', // add some additional fields to the results
            sort: 'interestingness-desc', // "interestingness" is Flickr's primary engagement metric
            nojsoncallback: 1, // exclude the non-existant callback from the results
            tags: `"${bird.commonName}", "${bird.scientificName}"` // full-search is an option too
        }
    );

    const bird_photos = await fetch(api_url.href, fetch_options);
    /* Flickr's API seems to always return a 200, and has a 'stat' attribute to indicate success/failure */
    if (bird_photos.stat === 'ok') {
        console.log(`Searching Flickr for ${bird.commonName}: found ${bird_photos.photos.photo.length} photos`);
    }
    else {
        console.warn(`Error ${bird_photos.code} searching Flickr for ${bird.commonName}: ${bird_photos.message}`);
    }
    return bird_photos;
}

export function createSchemaCustomization({ actions }) {
    const { createTypes } = actions;
    const typeDefs = `
        type BirdJson implements Node {
            food: Food
            thumbnail: File @link(from: "fields.thumbnail")
        }
        type Food {
            fish: Int,
            foodCostAlt: Int,
            foodCostAny: Int,
            fruit: Int,
            invertebrate: Int,
            nectar: Int,
            rodent: Int,
            seed: Int,
            totalFoodCost: Int,
            wild_food: Int
        }
    `;

    createTypes(typeDefs);
};


export async function sourceNodes({
    actions
}) {
    const { createNode } = actions;

    /*
    Keeping this in case I change my mind again about whether to infer the schema or not
    
    exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions;
    const typeDefs = `
        type BirdJson implements Node @dontInfer {
            schema.buildObjectType({
                commonName: String!,
                scientificName: String!,
                set: String!,
                color: String!,
                power: String!,
                flavorText: String!,
                predator: Boolean!,
                flocking: Boolean!,
                bonusCard: Boolean!,
                victoryPoints: Number!,
                nestType: String!,
                eggLimit: Number!,
                wingspan: Number!,
                habitat: [
                    "wetland"
                ],
                food: {
                    invertebrate: Number,
                    seed: Number,
                    fish: Number,
                    fruit: Number,
                    rodent: Number,
                    nectar: Number,
                    wild_food: Number,
                    foodCostAny: Boolean,
                    foodCostAlt: Boolean,
                    totalFoodCost: Number
                },
                swiftStart: Boolean,
                location: [    ],
                bonus: [],
            },
            `
    createTypes(typeDefs)
  }*/
}

export async function onCreateNode({ node, actions, createNodeId, createContentDigest, getCache }) {
    /* A bird's common name would be its best slug, so let's add it as a custom field */
    const { createNode, createNodeField, createParentChildLink } = actions;
    if (node.internal.type == 'BirdJson') {
        const slug = slugify(node.commonName);

        createNodeField({ node, name: `slug`, value: slug });

        /* Now let's search for photos of this bird on Flickr, and add the results as child nodes */

        const bird_photo_json = await fetch_bird_photos(node);

        /* Let's not assume the API call worked */
        if (bird_photo_json.stat === 'ok') {
            bird_photo_json.photos.photo.forEach(async (photo, index) => {
                // We'll create the node as an object first
                const photo_node = {
                    ...photo,
                    // Construct the URLs to the image, per https://www.flickr.com/services/api/misc.urls.html
                    // the largest image size we can guarantee won't be restricted
                    large: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`,
                    source: `https://www.flickr.com/photos/${photo.owner}/${photo.id}`,
                    id: createNodeId(`photo-${photo.id}`),
                    parent: node.id,
                    children: [],
                    internal: {
                        type: 'Photo',
                        contentDigest: createContentDigest(photo)
                    }
                };

                // Now register it
                createNode(photo_node);

                // And link it to the bird as a child node
                createParentChildLink({ parent: node, child: photo_node });

                /* If this is the first photo in the loop, use it as the bird's thumbnail  */
                if (index == 0) {
                    const thumbnail = await createRemoteFileNode({
                        url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`,
                        parentNodeId: node.id,
                        createNode,
                        createNodeId,
                        getCache
                    });

                    if (thumbnail) {
                        createNodeField({ node, name: 'thumbnail', value: thumbnail.id });
                        console.log(`Made a thumbnail for ${node.commonName}`);
                    }
                }
            });
        }
    };
}

export default slugify;