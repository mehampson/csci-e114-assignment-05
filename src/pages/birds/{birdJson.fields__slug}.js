import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Layout from '../../components/layout';
import BirdCard from '../../components/bird_card';

const BirdPage = ({ data }) => {
  const bird = data.allBirdJson.nodes[0];
  return (
    <Layout pageTitle={bird.commonName}>
      <BirdCard bird={bird}></BirdCard>     
    </Layout>
  );
};

export const query = graphql`
  query BirdPageQuery ($id: String!) {
    allBirdJson(filter: {id: {eq: $id}}) {
      nodes {
        commonName
        fields {
          slug
        }
        bonus
        bonusCard
        color
        eggLimit
        flocking
        food {
          fish
          foodCostAlt
          foodCostAny
          fruit
          invertebrate
          nectar
          rodent
          seed
          totalFoodCost
          wild_food
        }
        habitat
        location
        nestType
        power
        predator
        scientificName
        set
        victoryPoints
        wingspan
        childrenPhoto {
          large
          title
          description {
            _content
          }
          source
          ownername
          owner
        }
        
      }
    }
  }
  `



  export default BirdPage;