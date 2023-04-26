# assignment-5-cicd
This repository holds the starter code for assignment 5, in which we practice the fundamentals of CI/CD.

Like Assignment 4, this Gatsby app requires an (Flickr API key)[https://www.flickr.com/services/api/misc.api_keys.html] to perform the photo search, held in the FLICKR_API_KEY env variable.

It also requires an API key from (eBird.org)[https://documenter.getpostman.com/view/664302/S1ENwy59], held in the EBIRD_API_KEY variable.

The project is integrated with Netlify and relies on their edge function service for the Nearby bird observation functionality to work.

To run this yourself:
1. Ensure your local environment is capable of running Node v19
2. Clone or download this Git repository in the manner you see fit
3. Run `npm install` to install all the required dependencies
4. Register an account on Flickr, if necessary, and request an API key at the link above
5. Request an API key for eBird, using the link at the beginning of the documentation linked above
6. Create a new .env file using .env.sample, and update the API keys there
7. Register an account on Netlify, if necessary, and link this repository with `netlify cli`
8. Run locally with `netlify dev`