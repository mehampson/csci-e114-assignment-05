import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

export function WingspanArt() {
    return <StaticImage 
            src='../images/wingspan.jpg' 
            alt='The box art for the Wingspan board game' 
            width={400}
            />;
  }