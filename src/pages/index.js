import * as React from "react";
import { Link } from 'gatsby';
import Layout from "../components/layout";
import { WingspanArt } from "../components/box_art";


const IndexPage = () => {
  return (
    <Layout pageTitle="Assignment 4">
      <p>This site provides data from the board game <a href="https://stonemaiergames.com/games/wingspan/">Wingspan</a>.</p>
      <WingspanArt />
      <p>In Wingspan, players compete to build bird sanctuaries. Gameplay is centered on 450+ cards, each which a unique species of bird that has its own attributes and abilities.</p>
      <p>It's a very good game with excellent art, if you like card-based engine building games and/or birds.</p>
      <p>Wingspan data comes from <Link to="https://boardgamegeek.com/filepage/193164/wingspan-spreadsheet-bird-cards-bonus-cards-end-ro">here</Link>. I converted a CSV of that file to a JSON via <Link to="https://www.convertcsv.com/csv-to-json.htm">this conversion app</Link>, and then did some additional manual cleanup to get the structure how I'd like it.</p>
      <p>Each bird has its own page with gameplay information and a gallery of the ten most "interesting" photos of that bird on Flickr. The photos come from Flickr's public API, and are searched by tags. (There are too many birds and photos for me to review the accuracy of the search results, so caveat emptor.)</p>
    </Layout>
  );
};

export default IndexPage

export const Head = () => {
  return (
    <title>Assignment 4</title>
    );
};

