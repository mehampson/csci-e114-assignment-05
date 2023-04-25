import { Context } from 'https://edge.netlify.com';


export default async (request: Request, context: Context) => {
  // Here's what's available on context.geo

  // context: {
  //   geo: {
  //     city?: string;
  //     country?: {
  //       code?: string;
  //       name?: string;
  //     },
  //     subdivision?: {
  //       code?: string;
  //       name?: string;
  //     },
  //     latitude?: number;
  //     longitude?: number;
  //     timezone?: string;
  //   }
  // }

  /* Another bird API! */

  const ebird_url = new URL('https://api.ebird.org/v2/data/obs/geo/recent');
  ebird_url.searchParams.append('lat', `${context.geo.latitude}`);
  ebird_url.searchParams.append('lng', `${context.geo.longitude}`);
  ebird_url.searchParams.append('maxResults', '50');


  const response = await fetch(ebird_url, {
    method: 'GET',
    //mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache',
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      'X-eBirdApiToken': Deno.env.get('EBIRD_API_KEY') as string
    },
    redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', 
  });

  return Response.json({
    geo: context.geo,
    observations: await response.json()
  });

};
