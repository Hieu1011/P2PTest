import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import Zeroconf from 'react-native-zeroconf';

const HomeScreen = () => {
  const [services, setServices] = useState([]);
  const zeroconf = new Zeroconf();

  useEffect(() => {
    zeroconf.on('start', () => {
      console.log('Zeroconf scan started.');
    });

    zeroconf.on('found', data => {
      console.log('Service found:', data);
      setServices(prevServices => [...prevServices, data]);
    });

    zeroconf.on('remove', data => {
      console.log('Service removed:', data);
      setServices(prevServices =>
        prevServices.filter(service => service.name !== data.name),
      );
    });

    zeroconf.scan('http', 'tcp', 'local.');

    return () => {
      zeroconf.stop();
    };
  }, []);

  return (
    <View>
      <Text>Zeroconf Service Discovery</Text>
      {services.map((service, index) => (
        <View key={index}>
          <Text>Name: {service.name}</Text>
          <Text>Type: {service.type}</Text>
          <Text>IP Address: {service.address}</Text>
        </View>
      ))}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
