import { Observable, CoreTypes, Http } from "@nativescript/core";
const geolocation = require("@nativescript/geolocation");
const { password } = require("./assets/secrets.json");

const GEO_SETTINGS = {
  desiredAccuracy: CoreTypes.Accuracy.any,
  maximumAge: 5000,
  timeout: 20000,
  updateDistance: 1000
};

export function createViewModel() {
  const viewModel = new Observable();
  viewModel.remoteLocation = "";
  viewModel.currentLocation = "";
  viewModel.latitude = 0;
  viewModel.longitude = 0;

  viewModel.onSync = async function() {
    const { currentCity } = await Http.getJSON(
      "https://is-rafa-in-berlin.herokuapp.com/rafa"
    );
    viewModel.set("remoteLocation", currentCity);
    return true;
  };

  viewModel.onRefresh = async () => {
    const {
      latitude,
      longitude,
      timestamp
    } = await geolocation.getCurrentLocation(GEO_SETTINGS);
    viewModel.set("latitude", latitude);
    viewModel.set("longitude", longitude);
    viewModel.set("localLocation", `${latitude}, ${longitude}`);
    const { address } = await Http.getJSON(
      "https://nominatim.openstreetmap.org/reverse?" +
        `lat=${latitude}&lon=${longitude}` +
        "&format=json"
    );
    if (address.city) viewModel.set("localLocation", address.city);
    return true;
  };

  viewModel.onSend = async function() {
    const latitude = viewModel.get("latitude");
    const longitude = viewModel.get("longitude");

    const configs = {
      url: "https://is-rafa-in-berlin.herokuapp.com/rafa",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      content: JSON.stringify({ password, latitude, longitude })
    };
    await Http.request(configs);
    // const result = response.content.toJSON();
    // console.log(`Http POST result: ${JSON.stringify(result)}`);
    return true;
  };

  viewModel.watch = function() {
    geolocation.watchLocation(
      newLocation => {
        const prevLocation = {
          longitude: viewModel.get("longitude"),
          latitude: viewModel.get("latitude")
        };
        const displacement = Math.sqrt(
          (newLocation.longitude - prevLocation.longitude) ** 2 +
            (newLocation.latitude - prevLocation.latitude) ** 2
        );
        if (displacement > 0.5) viewModel.onRefresh().then(viewModel.onSend);
      },
      err => console.log(err),
      GEO_SETTINGS
    );
  };

  return viewModel;
}
