import React, {useEffect, useState} from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Container, Header, Content, Accordion, Icon } from "native-base";
import {Collapse,CollapseHeader, CollapseBody, AccordionList} from 'accordion-collapse-react-native';
import { LineChart, Grid, XAxis, YAxis } from 'react-native-svg-charts'
import { v4 as uuidv4 } from 'uuid';

function WeatherData(props) {

  const [weatherData, setWeatherData] = useState(props.weatherData);
  const [isExpanded, setIsExpnaded] = useState(false);
  const [selectedIconId, setSelectedIconId] = useState();

  useEffect(() => {
    setWeatherData(props.weatherData);
  }, [props.weatherData])
 
  const getDate = (timestamp) => {
    var date = new Date(timestamp * 1000)

    const stringDate = JSON.stringify(date)
    const finalDate = stringDate.substring(1,11)
    return finalDate;
  }

  const axesSvg = { fontSize: 10, fill: 'grey' };
  const verticalContentInset = { top: 10, bottom: 10 }
  const xAxisHeight = 30
  
  const convertLat = (num) =>{
    let stringNum = num.toString();
    let conversion = `${stringNum.slice(0,2)}${stringNum.slice(3)}`
    return conversion;
  }
  const handleDeleteLocation = (index) => {
    const array = weatherData.filter((data, i) => convertLat(data.lat) !== index);
    setWeatherData(array);
    props.setDeleteMarker(index);
  }

  return (
    <>
      <ScrollView style={{flex: 1}}>
        <Header />
        {weatherData.length > 0 ? (
            
          weatherData.map((location, i) => {
          const {humidity, sunrise, sunset, temp, wind_speed} = location.current || {} ;
          const mapData = location.daily.map(item => item.temp.day);
          const xAxisData = location.daily.map(item => item.dt);
          const handleToggle = (isExp, index) => {
            if(index === key){
              setIsExpnaded(isExp);
              props.changeMakerColor(isExp, index);
            } 
          }
          
          const handleIcon = (index) => {
            setSelectedIconId(index);
          }

          let key = convertLat(location.lat)

          if(location.current)
            return(
              <Collapse key={key} style={styles.collapseContainer} onToggle={(isExp) => {handleToggle(isExp, key); handleIcon(key)}} >
                <CollapseHeader style={styles.collapseHeader}>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <Text>Location</Text>
                    <Icon 
                      type={`${selectedIconId === key && isExpanded ? 'Entypo' : 'MaterialIcons' }`}
                      name={`${selectedIconId === key && isExpanded ? 'cross' : 'arrow-drop-down' }`}
                      onPress={() => selectedIconId === key && isExpanded ? handleDeleteLocation(key): null }
                    />
                  </View>
                </CollapseHeader>
                <CollapseBody style={styles.collapseBody}>
                  <Text>Humidity: {humidity}</Text>
                  <Text>Sunrise: {sunrise}</Text>
                  <Text>Sunset: {sunset}</Text>
                  <Text>Temperature: {temp}</Text>
                  <Text>Wind Speed: {wind_speed}</Text>
                  <View style={{ height: 200, padding: 20, flexDirection: 'row' }}>
                    <YAxis
                      data={mapData}
                      style={{ marginBottom: xAxisHeight }}
                      contentInset={verticalContentInset}
                      svg={axesSvg}
                    />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                    <LineChart
                      style={{ flex: 1 }}
                      data={mapData}
                      contentInset={verticalContentInset}
                      svg={{ stroke: 'rgb(134, 65, 244)' }}
                    >
                    <Grid/>
                    </LineChart>
                    <XAxis
                      style={{ marginHorizontal: -10, height: xAxisHeight }}
                      data={mapData}
                      formatLabel={(value, index) => value}
                      contentInset={{ left: 10, right: 10 }}
                      svg={axesSvg}
                      // xAccessor={ item => item.item }
                    />
                    </View>
                  </View>
                  
                </CollapseBody>
              </Collapse>
            )
          }))
        : <Text style={{fontSize: 30, margin: 30}}>No data to show</Text>
      }
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  collapseContainer: {
    borderWidth: 1,  
  },
  collapseHeader:{
    backgroundColor: 'skyblue',
    padding: 15,
  },
  collapseBody: {
    // backgroundColor:'#EDEDED',
    padding: 15,
  }
})

export default WeatherData