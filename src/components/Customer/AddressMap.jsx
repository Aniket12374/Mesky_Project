import React, { useEffect, useState } from "react";
import AddressForm from "./AddressForm";
import { getPinDetails } from "../../services/customerInfo/CustomerInfoService";

function Address({ url, data, showNext, setShowNext }) {
  var map;
  var infowindow;
  var marker;

  const [address, setAddress] = useState({
    line_2: data?.line_2,
    pincode: data?.pincode,
    sector_name: data?.sector_name,
    latitude: data?.latitude,
    longitude: data?.longitude,
  });

  const [scriptLoaded, setScriptLoaded] = useState(false);
  // const [map, setMap] = useState(null);

  const handleChange = (val) => {
    setAddress((prev) => ({
      ...prev,
      line_2: val,
    }));

    const input = document.getElementById("line_2");
    const autocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: "IN" },
    });

    autocomplete.addListener("place_changed", function () {
      const place = autocomplete.getPlace();
      const latLngs = place?.geometry?.location;
      const lat = latLngs?.lat();
      const lng = latLngs?.lng();

      let pincodeCompo = place?.address_components?.find((x) =>
        x.types.includes("postal_code")
      );
      let pincode = pincodeCompo?.long_name;

      getPinDetails(pincode).then((res) => {
        const data = res?.data;
        Object.keys(data).map((x) => {
          onChange(x, data[x]);
        });
      });

      setAddress((prev) => ({
        ...prev,
        line_2: place?.formatted_address,
        sector_name: extractSectorValue(place?.formatted_address),
        pincode,
        longitude: lng,
        latitude: lat,
      }));
      console.log({ map });
      createMarker({ lat, lng }, map, true);
    });
  };

  const onChange = (key, val) => {
    setAddress((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  useEffect(() => {
    const head = document.querySelector("head");
    const script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);
    setScriptLoaded(true);

    return () => {
      head.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!map) initMap();
    console.log("map called ");
  }, [data, scriptLoaded]);

  function createMarker(place, map) {
    map = new google.maps.Map(document.getElementById("mapdiv"), {
      center: { lat: place.lat, lng: place.lng },
      zoom: 20,
    });
    marker = new google.maps.Marker({
      position: { lat: place.lat, lng: place.lng },
      map: map,
    });

    map.panTo(place);
  }

  async function initMap() {
    let defaultLatLng = {
      lat: Number(data?.latitude) || 28.457523,
      lng: Number(data?.longitude) || 77.026344,
    };

    const gurgaon = new google.maps.LatLng(
      defaultLatLng.lat,
      defaultLatLng.lng
    );
    map = new google.maps.Map(document.getElementById("mapdiv"), {
      center: gurgaon,
      zoom: 20,
    });

    infowindow = new google.maps.InfoWindow();

    map.addListener("click", (e) => {
      const { placeId, latLng } = e;
      var geocoder = new google.maps.Geocoder();
      console.log("clicked map");

      geocoder.geocode(
        {
          latLng,
        },
        function (results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              console.log({ results });
              onChange("line_2", results[0].formatted_address);
            }
          }
        }
      );
      const lat = latLng.lat();
      const lng = latLng.lng();
      // fetch the value of the e and set the value of search input -- done
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
      marker = new google.maps.Marker({
        position: { lat, lng },
        map: map,
      });
    });

    infowindow.open(map);
  }

  // createMarker({ lat: data?.latitude, lng: data?.longitude }, map);

  const extractSectorValue = (line) => {
    if (typeof line !== "string") return "";

    const sectorPattern = /sector\s*[^,]*/i; // Match 'sector' followed by any number of spaces and then any characters except a comma
    const result = line.match(sectorPattern);
    return result ? result[0].trim() : "";
  };

  window.initMap = initMap;

  return (
    <>
      {!showNext ? (
        <div className='' style={{ width: "500px" }}>
          <div
            id='mapdiv'
            style={{ position: "static", width: "500px", height: "35vh" }}
          ></div>
          <div className='roboto-500 mt-3'>Your Current Address</div>
          <input
            type='text'
            id='line_2'
            onChange={(e) => handleChange(e.target.value)}
            value={address?.line_2}
            className='border-2 border-gray-200 w-full focus:outline-none'
          />
          <button onClick={() => setShowNext(true)} className='search-btn'>
            Next
          </button>
        </div>
      ) : (
        <AddressForm
          data={{
            ...data,
            ...address,
          }}
        />
      )}
    </>
  );
}

export default Address;
