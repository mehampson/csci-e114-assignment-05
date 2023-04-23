import * as React from 'react';
import { Link } from 'gatsby';
import * as birdStyles from '../components/birdlist.module.css';
import { GatsbyImage, getImage } from 'gatsby-plugin-image';

const BirdList = ({ birds }) => {
    return (
        <div className={birdStyles.birdlist}>
        {
            birds.map((bird) => {
                const thumbnail = getImage(bird.thumbnail);
                return (
                    <div className={birdStyles.birdItem} key={bird.id}>
                        <Link to={'/birds/' + bird.fields.slug}>
                            <p>{bird.commonName}</p>
                            <GatsbyImage image={thumbnail} />
                            <p className={birdStyles.expansion}>{bird.set !== 'core' ? `${bird.set} Expansion` : ''}</p>
                            </Link>    
                    </div>
                );
            })
        }
        </div>
    );
};

export default BirdList;