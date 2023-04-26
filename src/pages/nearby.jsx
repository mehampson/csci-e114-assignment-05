import React, { useEffect, useState } from 'react';
import Layout from '../components/layout';
import fetch from 'node-fetch';

const ObsPage = () => {
    const [obsData, setObsData] = useState({});

    const fetchBirdObs = async () => {
        const response = await fetch('/nearby-birds', { method: 'GET' });
        const json = await response.json();
        setObsData(json);
    };

    useEffect(() => {
        fetchBirdObs();
    }, [obsData.count]);

    console.log('Obs: ' + obsData.count);

    if ('observations' in obsData) {
        return (
            <Layout pageTitle="Birds Near You">
                <h2>Birds Near You</h2>
                <p>Here are some recent bird observations from near you in {obsData.geo.city}.</p>
                <p>These records come from <a href="https://ebird.org/home">eBird.org</a> by the Cornell Lab of Ornithology.</p>
                <ul>
                    {obsData.observations.map((obs) => {
                        return (
                            <div key={obs.speciesCode + obs.obsDt}>
                                <p>{obs.obsDt}: {obs.howMany}x {obs.comName} ({obs.sciName}) at {obs.locName}</p>
                            </div>
                        );
                    })}
                </ul>
            </Layout>
        );
    }
};

export default ObsPage;

