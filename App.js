import React, {useState} from 'react';
import { View, Text, SafeAreaView } from 'react-native'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import axios from 'axios'
import WeatherData from './src/tabs/WeatherData';
import Map from "./src/tabs/Map";

const Tab = createBottomTabNavigator();

function App(){
  const [weatherData, setWeatherData] = useState([]);
  const [index, setIndex] = useState();
  const [markerStatus, setMarkerStatus] = useState();
  console.log('index', index);
  return(
    <SafeAreaView style={{flex: 1,}}>
      <NavigationContainer>
        <Tab.Navigator tabBarOptions={{style: {paddingBottom: 10, }, labelStyle: {fontSize: 20}}}>
          <Tab.Screen name="Map" children={() => <Map weatherData={(data) => setWeatherData(data)} markerIndex={index} markerStatus={markerStatus} />} />
          <Tab.Screen name="WeatherData" children={() => <WeatherData weatherData={weatherData} setDeleteMarker={(index) =>setIndex(index)} changeMakerColor={(status, i) => setMarkerStatus({status, i})} />} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}


export default App;
