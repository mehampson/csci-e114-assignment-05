/* I'd intended the list of observations to be constructed here, but couldn't get it to work.
 * The obsData object seemed to lose its attributes once it was passed into a component that lived here.
 * I moved the component logic up into the Nearby page itself and works fine now.

 * I don't think we actually use these interfaces for anything now, but we're keeping them anyway.
 */

export interface NearbyBirds {
    count: number,
    geo: Geo,
    observations: Observation[]
}


export interface Observation {
    speciesCode: string,
    comName: string,
    sciName: string,
    locId: string,
    locName: string,
    obsDt: string,
    howMany: number,
    lat: number,
    lng: number,
    obsValid: boolean,
    obsReviewed: boolean,
    locationPrivate: boolean,
}

// This one comes straight from Netlify's edge function docs
export interface Geo {
    city?: string;
    country?: {
        code?: string;
        name?: string;
    },
    subdivision?: {
        code?: string;
        name?: string;
    },
    latitude?: number;
    longitude?: number;
    timezone?: string;
}
