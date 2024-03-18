import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
export const fetchNearbyGyms = onRequest(async (request, response) => {
  const {lat, lng} = request.query;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&rankby=distance&type=gym&key=${process.env.GOOGLE_PLACES_API_KEY}`;

  if (!lat || !lng) {
    response.status(400).send("Latitude and longitude are required");
    return;
  }
  try {
    const fetchResponse = await fetch(url);
    if (!fetchResponse.ok) throw new Error("Failed to fetch");
    const gymData = await fetchResponse.json();
    response.send(gymData);
  } catch (error) {
    logger.error("Error fetching nearby gyms:", error);
    response.status(500).send("Error fetching nearby gyms");
  }
});
