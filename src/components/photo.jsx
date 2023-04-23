import * as React from 'react';
import * as photoStyles from '../components/photo.module.css';

const Photo = ({ photo }) => {
    return (
        <div className={photoStyles.birdImage}>
            <a href={photo.source}><img src={photo.large} /></a>
            <div className={photoStyles.caption}>
                <h5>{photo.title}</h5>
                <p>By {photo.ownername || photo.owner}</p>
            </div>
        </div>
    );
};

export default Photo;