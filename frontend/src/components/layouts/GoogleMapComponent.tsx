import React, { useCallback, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const API_KEY :string = process.env.REACT_APP_GoogleMapApiKey || ''
const libraries = String(['places']);

const mapContainerStyle = {
  height: '100vh',
  width: '100%',
};

const options = {
  // デフォルトUI（衛星写真オプションなど）を無効にする。
  disableDefaultUI: true,
  zoomControl: true
};

type Props = {
  latitude: number | undefined
  longitude: number | undefined
}

const GoogleMapComponent: React.FC<Props> = (props) => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY,
    [libraries]: libraries,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('map set:', map);
  },[]);

  const onMarkerLoad = useCallback((marker: google.maps.Marker) => {
    console.log('marker set:', marker);
  },[]);

  return (
    (props.latitude && props.longitude) ? (
      isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={{
            lat: props.latitude,
            lng: props.longitude,
          }}
          options={options}
          onLoad={onMapLoad}
        >
          <Marker
            position={{
              lat: props.latitude,
              lng: props.longitude,
            }}
            onLoad={onMarkerLoad}
          />
        </GoogleMap>
      ) : (<p>読み込み中です</p>)
    ) : (<p>位置情報が設定されていません</p>)
  )
};

export default GoogleMapComponent;