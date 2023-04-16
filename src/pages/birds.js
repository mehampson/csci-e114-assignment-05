import * as React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/layout';
import BirdList from '../components/bird_list';

const BirdPage = ({data}) => {
    const birds = data.allBirdJson.nodes;
    return (
        <Layout pageTitle="So many birdies">
            <BirdList birds={birds} />
        </Layout>
    )
}

export const query = graphql`
    query BirdQuery {
        allBirdJson {
            nodes {
                commonName
                set
                thumbnail {
                    childImageSharp {
                      gatsbyImageData
                    }
                  }
                fields {
                    slug
                }
            }
        }
    }
    `
    
export default BirdPage;