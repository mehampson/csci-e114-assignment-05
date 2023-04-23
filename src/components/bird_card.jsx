import * as React from 'react';
import Photo from './photo';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFeather, faMound, faEgg, faDove, faSkullCrossbones, faCrow } from '@fortawesome/free-solid-svg-icons';


import * as birdStyles from './bird.module.css';

const BirdCard = ({ bird }) => {

    /* Birds cost some amount of food resources to play. 
       There are several types of food, and a bird usually costs 1-3 of them total.

       Some birds will let you pay any of the listed food types rather than requiring all of them,
       (e.g. '1 seed or fruit') and we'll print those with a / symbol instead of a +. */
    const connector = (bird.food.foodCostAny ? ' / ' : ' + ');

    /* I could have constructed the JSON this way when I converted the spreadsheet I used as the data source,
       but I was thinking more about how I'd want to filter birds by food cost than how I'd want to display them.
       So, no biggie, we just have to do a little extra work here. */
    const food_cost = [
        { food: 'fish', cost: bird.food.fish },
        { food: 'fruit', cost: bird.food.fruit },
        { food: 'invertebrate', cost: bird.food.invertebrate },
        { food: 'nectar', cost: bird.food.nectar },
        { food: 'rodent', cost: bird.food.rodent },
        { food: 'seed', cost: bird.food.seed },
        { food: 'wild', cost: bird.food.wild_food }]
        // strip out any unused food types
        .filter(fc => fc.cost != null)
        // turn the object into a string
        .map(fc => `${fc.cost} ${fc.food}`)
        // construct the final joined string
        .join(connector)
        // Some bird powers allow you to pay an alternative food cost instead of what's listed
        + (bird.food.foodCostAlt ? '*' : '');

    /* Birds have abilities that are color-coded according to when they are triggered. 
       There's enough logic involved in the formatting to handle this here. */
    let power;
    switch (bird.color) {
        case 'white':
            power = { style: '', pre: 'WHEN PLAYED' };
            break;
        case 'brown':
            power = { style: birdStyles.brown, pre: 'WHEN ACTIVATED' };
            break;
        case 'pink':
            power = { style: birdStyles.pink, pre: 'ONCE BETWEEN TURNS' };
            break;
        case 'teal':
            power = { style: birdStyles.teal, pre: 'ROUND END' };
            break;
        case 'yellow':
            power = { style: birdStyles.yellow, pre: 'GAME END' };
            break;
        default:
            power = { style: '', pre: '' };
    }

    return (
        <article>
            <div className={birdStyles.card}>
                <header>
                    <h2>{bird.commonName}</h2>
                    <h3 className={birdStyles.scientificName}>{bird.scientificName}</h3>
                </header>

                <div className={birdStyles.cardBody}>
                    <div className={birdStyles.costBlock}>
                        <p>Food Cost: {food_cost || '\u2205'}</p>

                        <ul className={birdStyles.habitatList}>
                            {/* The player's game board consists of three habitats. 
                        Each bird has a list of which ones it can be played in.
                        Every bird has at least one value here. 
                        */}
                            {bird.habitat.map(habitat => (
                                <li key={habitat} className={`${birdStyles.habitat} 
                                        ${habitat === 'forest' && birdStyles.forest}
                                        ${habitat === 'grassland' && birdStyles.grassland}
                                        ${habitat === 'wetland' && birdStyles.wetland}`}>{habitat}</li>
                            )
                            )}
                        </ul>
                    </div>

                    {/* Birds have some other attributes that affect their gameplay */}
                    <div className={birdStyles.statsBlock}>
                        <p><FontAwesomeIcon icon={faFeather} style={{ color: '#c64600', }} /> {bird.victoryPoints} Points</p>
                        <p><FontAwesomeIcon icon={faMound} rotation={180} style={{ color: '#c64600', }} /> {bird.nestType || 'No'} Nest</p>
                        <p><FontAwesomeIcon icon={faEgg} style={{ color: '#99c1f1', }} /> {bird.eggLimit || 0} Eggs</p>
                        <p><FontAwesomeIcon icon={faDove} style={{ color: '#f5c211', }} /> {bird.wingspan}cm Wingspan</p>
                    </div>

                </div>

                <div className={`${birdStyles.power} ${power.style}`}>
                    <span>
                        {bird.predator && <FontAwesomeIcon icon={faSkullCrossbones} />}
                        {bird.flocking && <FontAwesomeIcon icon={faCrow} />}
                    </span> {power.pre}: {bird.power}

                </div>

            </div>

            <div className={birdStyles.gallery}>
                {bird.childrenPhoto.map(photo => (
                    <div key={photo.id}><Photo photo={photo}></Photo></div>
                )
                )}
            </div>

        </article>
    );
};

export default BirdCard;