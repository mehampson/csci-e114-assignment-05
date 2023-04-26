import { Context } from 'https://edge.netlify.com';


export default async (_request: Request, context: Context) => {
 
  /* Another bird API!
   * We're fetching 50 recent bird observations submitted to eBird.org.
   * Netlify edge functions can access the user's geographic information, so we take the lat/long
   * and pass that to ebird's geographical endpoint.
   * https://documenter.getpostman.com/view/664302/S1ENwy59#62b5ffb3-006e-4e8a-8e50-21d90d036edc
   */

  const ebird_url = new URL('https://api.ebird.org/v2/data/obs/geo/recent');
  /* We don't have many search params. We'll just append them normally. */
  ebird_url.searchParams.append('lat', `${context.geo.latitude}`);
  ebird_url.searchParams.append('lng', `${context.geo.longitude}`);
  ebird_url.searchParams.append('maxResults', '50');


  const response = await fetch(ebird_url, {
    /* I admit I have not thought very hard about the options here */ 
    method: 'GET',
    //mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache',
    //credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
       /* Our auth token goes here. Note we're in Deno, not Node */
      'X-eBirdApiToken': Deno.env.get('EBIRD_API_KEY') as string
    },
    redirect: 'follow', // manual, *follow, error
    //referrerPolicy: 'no-referrer', 
  });

  const obs = await response.json();

  /* We return the geo context and the observations we just received, 
   * plus a count of the observations so useEffect has a primitive to use as a dependency. */
  return new Response(JSON.stringify({
    count: obs.length,
    geo: context.geo,
    observations: obs
  }), {
    headers: { 'content-type': 'application/json' },
  });

};
