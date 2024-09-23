import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  StandaloneSearchBox,
  useJsApiLoader,
  MarkerF,
} from "@react-google-maps/api";
import { extractSectorValue, getDetails } from "../../utils";
import PinkIcon from "../../assets/Location.png";
import EditableAddressForm from "./EditableAddressForm";
import { getPinDetails } from "../../services/customerInfo/CustomerInfoService";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const inputStyle = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `39%`,
  height: `32px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
  position: "absolute",
  top: "25px",
  margin: "10px",
  //   position: "absolute",
  //   left: "10px",
  //   margin: "10px",
  //   bottom: "10px",
};

export default function Address2({
  data,
  showNext,
  setShowNext,
  closeModal = null,
}) {
  const searchBoxRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    libraries: ["places"],
    googleMapsApiKey: import.meta.env.VITE_REACT_APP_GOOGLE_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(10);
  const [center, setCenter] = useState({
    lat: Number(data?.latitude) || 28.4595,
    lng: Number(data?.longitude) || 77.0266,
  });

  const [errors, setErrors] = useState({});

  const [address, setAddress] = useState({
    line_2: data?.line_2,
    pincode: data?.pincode,
    sector_name: data?.sector_name,
    latitude: data?.latitude,
    longitude: data?.longitude,
  });

  useEffect(() => {
    setAddress((prev) => ({
      ...prev,
      line_2: data?.line_2,
      pincode: data?.pincode,
      sector_name: data?.sector_name,
      latitude: data?.latitude,
      longitude: data?.longitude,
    }));
    setCenter({
      lat: Number(data?.latitude),
      lng: Number(data?.longitude),
    });
  }, [data]);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const place = places[0];

      setAddress((prev) => ({
        ...prev,
        line_2: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        pincode: "",
        sector_name: "",
      }));
      let pincodeCompo = place?.address_components?.find((x) =>
        x.types.includes("postal_code")
      );
      let pincode = pincodeCompo?.long_name;

      getPinDetails(pincode).then((res) => {
        const data = res?.data;
        console.log({ data }, data["subscrption"]);
        if (!data["subscrption"]) {
          setErrors((prev) => ({
            ...prev,
            pincode: "Our service are not available in this location yet",
          }));
        }
        setAddress((prev) => ({
          ...prev,
          ...data,
          sector_name: extractSectorValue(place?.formatted_address),
        }));
      });
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    }
  };

  const onChange = (key, val) => {
    setAddress((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const handleClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setCenter({
      lat,
      lng,
    });
    getDetails(lat, lng).then((res) => {
      const firstResult =
        res.results.length > 0 ? res.results[0].formatted_address : "";

      setAddress((prev) => ({
        ...prev,
        line_2: firstResult,
      }));
    });
  };
  console.log({ center });

  return isLoaded ? (
    <div className='flex space-x-10'>
      <div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleClick}
          tilt={0}
          options={{
            disableDefaultUI: true,
          }}
        >
          <MarkerF
            position={center}
            icon={PinkIcon}
            onClick={() => setZoom(20)}
          />
        </GoogleMap>
        <div className='roboto-600 mt-2'>Customer Address: </div>
        <div className='text-sm'>{address?.line_2}</div>
        <StandaloneSearchBox
          onLoad={(ref) => (searchBoxRef.current = ref)}
          onPlacesChanged={onPlacesChanged}
        >
          <input
            type='text'
            placeholder='Search your location'
            style={inputStyle}
            name='line_2'
            onChange={(e) => onChange("line_2", e.target.value)}
            value={address?.line_2}
          />
        </StandaloneSearchBox>
      </div>

      <EditableAddressForm
        data={{
          ...data,
          ...address,
        }}
        closeModal={closeModal}
        errors={errors}
        setErrors={setErrors}
      />
    </div>
  ) : (
    <>Loading....</>
  );
}
