import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NetworkInfo} from 'react-native-network-info';
import * as net from 'react-native-tcp-socket';

const createClient = (ip, chats, setChats) => {
  const options = {
    port: 6666,
    host: ip,
  };
  const client = net.default.createConnection(options, () => {
    console.log('opened client on ' + JSON.stringify(client.address()));
  });
  console.log(client);
  client.on('data', data => {
    setChats([...chats, {id: chats.length + 1, msg: data}]);
  });

  client.on('error', error => {
    console.log('client error' + error);
  });

  client.on('close', () => {
    console.log('client close');
  });

  return client;
};

const ClientScreen = ({navigation}) => {
  const [client, setClient] = useState(null);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const getClient = async () => {
      const ip = await NetworkInfo.getGatewayIPAddress();
      console.log('ip: ' + ip);
      setClient(createClient(ip));
    };
    getClient();
  }, []);

  return (
    <View>
      <Text>Client Screen</Text>
      <Button
        title="Stop Client"
        onPress={() => {
          if (client) {
            client.destroy();
            setClient(null);
          }
        }}
      />
      {client ? <Text> Client is on: {client.address}</Text> : null}
      <FlatList
        data={chats}
        renderItem={({item}) => {
          return <Text style={{margin: 10, fontSize: 20}}>{item.msg}</Text>;
        }}
        keyExtractor={item => item.id}
      />
      <TextInput
        placeholder="Type a message"
        placeholderTextColor="black"
        style={{margin: 10, borderWidth: 2, color: 'black'}}
        onSubmitEditing={({nativeEvent: {text}}) => {
          if (client) {
            client.write(JSON.stringify({msg: text, id: 1}));
          }
        }}
      />
    </View>
  );
};

export default ClientScreen;

const styles = StyleSheet.create({});
