import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, ActivityIndicator,Button  } from 'react-native'
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps'
import Modal from 'react-native-modal';
import Geocoder from 'react-native-geocoding';
import {Header, Title, Body} from 'native-base'
import { useStateWithCallbackLazy } from 'use-state-with-callback';

function Map(props) {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [curerntLocation, setCurrentLocation] = useState('');
  const [currentCoords, setCurrentCoords] = useState();
  const [weatherData, setWeatherData] = useStateWithCallbackLazy([]);
  const [markerIndex, setMarkerIndex] = useState();
  const [markerStatus, setMarkerStatus] = useState();
  
  useEffect(() => {
    if(props.markerStatus){ 
      setMarkerIndex(props.markerStatus.i);
      setMarkerStatus(props.markerStatus.status)
    }
  }, [props.markerStatus])

//   useEffect(() => {

//     Geocoder.init('');
//     Geocoder.from(41.89, 12.49)
//     .then(json => {
//     var addressComponent = json.results[0].address_components[0];
//     console.log('addressComponent', addressComponent);
//     })
//     .catch(error => console.error(error));

//     // fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + 41.89 + ',' + 12.49 + '&key=' + '')
//     //     .then((response) => response.json())
//     //     .then((responseJson) => {
//     //         console.log('ADDRESS GEOCODE is BACK!! => ' + JSON.stringify(responseJson));
// // })
//   })
  const convertLat = (num) =>{
    let stringNum = num.toString();
    let conversion = `${stringNum.slice(0,2)}${stringNum.slice(3, 7)}`
    return conversion;
  }

  useEffect(() => {
    const markerArray = weatherData.filter((item, i) => convertLat(item.lat) !== props.markerIndex);
    setWeatherData(markerArray);
  }, [props.markerIndex])

  const toggleModal = async() => {

    const apiKey = process.env.googleApiKey;
    setModalVisible(!modalVisible);
    setCoordinates([...coordinates, currentCoords]);

    try{
      const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${currentCoords.latitude}&lon=${currentCoords.longitude}&exclude={part}&appid=${apiKey}`)
      const res = await response.json();
      setWeatherData([...weatherData, res], (currentData) => {
        props.weatherData(currentData);
        
      });
    }catch(err){
      console.log('error', err);
    }
    setLoading(false);
  };

  const locationHandler = (coords) => {}

  return (
      <View>
        <Header>
          <Body style={{alignItems: 'center'}}>
            <Title>Select the location</Title>
          </Body>
        </Header>
        <MapView 
          style={styles.map}
          region={{latitude: 42.882004, 
            longitude: 74.582748,          
            latitudeDelta: 0.0922,          
            longitudeDelta: 0.0421
          }}
          onPress={(e) => {
            setCurrentCoords(e.nativeEvent.coordinate);
            setModalVisible(true);
            setLoading(true);
          }}>
          {
            weatherData.map((data, i) => {
              let coord = {latitude: data.lat, longitude: data.lon}
              return(
                <Marker 
                key={i} 
                coordinate={coord} 
                pinColor={`${markerStatus && markerIndex === convertLat(data.lat) ? '#000' : 'red'}`}
              />
              )
            })
          }
        </MapView> 
        
        <ActivityIndicator size={100} color="#0000ff" animating={loading} style={styles.loadingSpinner} />
        
        <Modal isVisible={modalVisible} style={styles.modalContainer}>
         <View style={{backgroundColor: '#fff', width: '70%', padding: 30}}>
          <View style={styles.modalTextView}>
              <Text style={{textAlign: 'center'}}>Location</Text>
            </View>
            <View style={styles.modalBtnView}>
              <Button title="Cancel" onPress={() => {setLoading(false); setModalVisible(false) } } />
              <Text>{"  "}</Text>
              <Button title="Save" onPress={toggleModal} />
            </View>
         </View>
        </Modal>
      
      </View>
  )
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
    width: "100%",
  },
  loadingSpinner: {
    position: 'absolute', top: "30%", left: '40%', 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTextView:{
    backgroundColor: '#fff',
    width: '80%',
    marginBottom: 20,
    padding: 20,
  },
  modalBtnView: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  modalBtn: {
    width: '30%',
    margin: 10,
  }
 });

export default Map
