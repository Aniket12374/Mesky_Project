import React, { useEffect, useState } from "react";
import debounce from "lodash/debounce";

function Address({ url }) {
  const [address, setAddress] = useState({
    line_1: "the sprinklez",
  });

  const handleChange = (val) => {
    setAddress((prev) => ({
      ...prev,
      line_1: val,
    }));
  };

  console.log({ address });
  let map;
  let infowindow;
  let service;
  let markers = [];

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);

    return () => {
      head.removeChild(script);
    };
  }, [url]);

  useEffect(() => {
    address?.line_1.length > 5 && initMap();
  }, [address]);

  async function initMap() {
    // const { Map } = await google.maps.importLibrary("maps");
    const gurgaon = new google.maps.LatLng(28.457523, 77.026344);
    map = new google.maps.Map(document.getElementById("mapdiv"), {
      center: gurgaon,
      zoom: 15,
      // mapId: "DEMO_MAP_ID",
    });

    infowindow = new google.maps.InfoWindow();

    placeSearch(address?.line_1);

    map.addListener("click", (e) => {
      const placeLatlng = e.latLng;
      console.log({ placeLatlng, e, markers }, "initfn");
      markers.length > 0 ? markers[0].setMap(null) : null;
      placeSearch(placeLatlng);
      // createMarker(placeLatlng, map, true);
    });

    map.infowindow.open(map);
  }

  console.log({ map, markers });

  function createMarker(place, map, latlng = false) {
    // const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    if (!latlng && (!place.geometry || !place.geometry.location)) return;

    const marker = new google.maps.Marker({
      map,
      position: latlng ? place : place.geometry.location,
    });
    markers.push(marker);

    // new google.maps.marker.AdvancedMarkerElement({
    //   position: latlng ? place : place.geometry.location,
    //   map: map,
    // });

    google.maps.event.addListener(marker, "click", () => {
      // infowindow.setContent(place.name || "");
      console.log({ place });
      // infowindow.open(map);
    });
    map.panTo(latlng ? place : place.geometry.location);
  }

  const placeSearch = (line1) => {
    const request = {
      query: line1,
      fields: ["name", "geometry"],
    };

    service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          createMarker(results[i], map);
        }

        map.setCenter(results[0].geometry.location);
      }
    });
  };

  window.initMap = initMap;

  return (
    <div className='' style={{ width: "100%" }}>
      <div id='mapdiv' style={{ position: "static" }}></div>
      <div>Your Current Location</div>
      <input
        type='text'
        onChange={(e) => handleChange(e.target.value)}
        value={address?.line_1}
        className='border-2 border-gray-200'
      />
    </div>
  );
}

export default Address;
