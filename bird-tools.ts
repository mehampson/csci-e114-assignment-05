import * as dotenv from 'dotenv';
import fetch from "@11ty/eleventy-fetch";

dotenv.config();

/* Define some types that we'll use when we call the Flickr API to enrich our bird nodes */

export interface BirdSearch {
    common_name: string,
    scientific_name: string
};

// Why is the description structured like this? Are there more fields that might appear?
export interface PhotoDesc {
    _content: string
};

export interface Photo {
    id: string,
    owner: string,
    secret: string,
    server: string,
    farm: number,
    title: string,
    ispublic: number,
    isfriend: number,
    isfamily: number,
    license: string,
    description: PhotoDesc,
    ownername: string,
    media: string,
    media_status: string
};


/* Convert a bird's common name into a URL-friendly slug */
export function slugify(name: string) {
    return name
        /* We definitely have to strip out apostrophes. We might have to deal with other punctuation, too. 
            We'll use a regex for these, but just replaceAll for changing spaces to dashes. */
        .replace(/[']/g, '')
        /* Several birds have macrons that make URLs look bad when encoded */
        .replace(/[ā]/g, 'a')
        .replace(/[ī]/g, 'i')
        .replace(/[ō]/g, 'o')
        .replace(/[ū]/g, 'u')
        .replace(/\s/g, '-')
        .toLowerCase();
}


export async function fetch_bird_photos(bird: BirdSearch) {
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

    const base_url = 'https://www.flickr.com/services/rest';

    const api_url = new URL(base_url);

    const params = new URLSearchParams( {
            method: 'flickr.photos.search',
            api_key: process.env.FLICKR_API_KEY || '',
            format: 'json', // the default response format is XML
            content_type: '1', // photos only
            per_page: '10', // This is effectively how we limit the results per request. Let's be reasonable here.
            privacy_filter: '1', // only public search results, in case your API user has any contacts
            safe_search: '1', // considering some of the bird names we're searching for, we DEFINITELY want safe search
            license: '1,2,3,4,5,6,7,8,9,10', // these are Flickr's open license IDs, to prevent copyright violations
            extras: 'description,license,owner_name,media', // add some additional fields to the results
            sort: 'interestingness-desc', // "interestingness" is Flickr's primary engagement metric
            nojsoncallback: '1', // exclude the non-existant callback from the results
            tags: `"${bird.common_name}", "${bird.scientific_name}"` // full-search is an option too
    });

    api_url.search = params.toString();
    

    /* Configuring the API request. */

    const bird_photos = await fetch(api_url.href, fetch_options);
    /* Flickr's API seems to always return a 200, and has a 'stat' attribute to indicate success/failure */
    if (bird_photos.stat === 'ok') {
        console.log(`Searching Flickr for ${bird.common_name}: found ${bird_photos.photos.photo.length} photos`);
    }
    else {
        console.warn(`Error ${bird_photos.code} searching Flickr for ${bird.common_name}: ${bird_photos.message}`);
    }
    return bird_photos;
}
