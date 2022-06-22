import React, { useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '100vh',
  width: '100%',
};

const mapStyles = [
  {
    "featureType": "all",
    "elementType": "labels.text",
    "stylers": [
        {
            "color": "#878787"
        }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text.stroke",
    "stylers": [
        {
            "visibility": "off"
        }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
        {
            "color": "#f9f5ed"
        }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
        {
            "color": "#f5f5f5"
        }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
        {
            "color": "#c9c9c9"
        }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
        {
            "color": "#aee0f4"
        }
    ]
  }
];

const options = {
  // styles: mapStyles,
  // デフォルトUI（衛星写真オプションなど）をキャンセルする。
  disableDefaultUI: true,
  zoomControl: true
  // zoomControlOptions: {
  //   position: google.maps.ControlPosition.RIGHT_CENTER,
  // }
};


const locations = [
  {
    name: '北海道庁',
    location: {
      lat: 43.064309,
      lng: 141.346832,
    },
  },
  {
    name: '札幌ドーム',
    location: {
      lat: 43.015019,
      lng: 141.410005,
    }
  },
];

const position = {
  lat: 40.8299,
  lng: 140.734,
}

const markerLabel = {
  color: 'red',
  fontFamily: 'sans-serif',
  fontSize: '48px',
  fontWeight: '100',
  text: '札幌駅',
}

const containerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: 35.69575,
  lng: 139.77521,
};

const positionAkiba = {
  lat: 35.69731,
  lng: 139.7747,
};

const positionIwamotocho = {
  lat: 35.69397,
  lng: 139.7762,
};

type Props = {
  latitude: number | undefined
  longitude: number | undefined
}

const API_KEY :string = process.env.REACT_APP_GoogleMapApiKey || ''

const GoogleMapComponent: React.FC<Props> = (props) => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: API_KEY
  });

  const mapRef = useRef();
  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map;
    console.log('map set');
  }, []);

  const onMarkLoad = useCallback(() => {
    console.log('mark set');
  }, []);

  return (
    (props.latitude && props.longitude) ? (
      isLoaded ? (
        <GoogleMap
          id="marker-example"
          mapContainerStyle={mapContainerStyle}
          zoom={15}
          center={{
            lat: props.latitude || 0,
            lng: props.longitude || -180,
          }}
          options={options}
          onLoad={onMapLoad}
        >
          {/* {
            locations.map(item => {
              return (
                <Marker key={item.name} position={item.location} onLoad={onMarkLoad}/>
              )
            })
          } */}
          <Marker position={position} onLoad={onMarkLoad}/>
        </GoogleMap>
      ) : (<p>読み込み中です</p>)
    ) : (<p>位置情報が設定されていません</p>)
  )
//     // (props.latitude && props.longitude) ? (
//     //     <LoadScript googleMapsApiKey={API_KEY}>
//     //       <GoogleMap
//     //         mapContainerStyle={mapContainerStyle}
//     //         zoom={15}
//     //         center={{
//     //           lat: props.latitude,
//     //           lng: props.longitude,
//     //         }}
//     //         options={options}
//     //         // onLoad={onMapLoad}
//     //       >
//     //       </GoogleMap>
//     //     </LoadScript>  
//     // ) : (<p>位置情報が設定されていません</p>)
};

export default GoogleMapComponent;