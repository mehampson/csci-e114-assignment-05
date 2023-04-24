import { createRemoteFileNode } from 'gatsby-source-filesystem';
import type { GatsbyNode } from 'gatsby';
import { BirdSearch, Photo, slugify, fetch_bird_photos } from './bird-tools';


export const createSchemaCustomization: GatsbyNode['createSchemaCustomization'] = ({ actions }) => {
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
}

/*
export async function sourceNodes({
    actions
}) {
    const { createNode } = actions;

    
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
  }
}*/

export const onCreateNode: GatsbyNode['onCreateNode'] = async ({ node, getNode, actions, createNodeId, createContentDigest, getCache }) => {
    /* A bird's common name would be its best slug, so let's add it as a custom field */
    const { createNode, createNodeField, createParentChildLink } = actions;
    if (node.internal.type === 'BirdJson') {

        const slug = slugify(node.commonName as string); // You and I know this will be a non-empty string, but the compiler doesn't

        createNodeField({ node, name: `slug`, value: slug });

        /* Now let's search for photos of this bird on Flickr, and add the results as child nodes */
        const bird_search: BirdSearch = { common_name: node.commonName as string, scientific_name: node.scientificName as string };
        const bird_photo_json = await fetch_bird_photos(bird_search);

        /* Let's not assume the API call worked */
        if (bird_photo_json.stat === 'ok') {
            bird_photo_json.photos.photo.forEach(async (photo: Photo, index: number) => {
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
