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

const createServer = (chats, setChats) => {
  const server = net.default
    .createServer(socket => {
      console.log('server connected on ' + socket.address().address);

      socket.on('data', data => {
        const response = JSON.parse(data);
        setChats([...chats, {id: chats.length + 1, msg: response.msg}]);
      });

      socket.on('error', error => console.log('error' + error));

      socket.on('close', error =>
        console.log('server client closed ' + (error ? error : '')),
      );
    })
    .listen(6666, () =>
      console.log('opened server on ' + JSON.stringify(server.address())),
    );

  server.on('error', error => console.log('error' + error));

  server.on('close', () => console.log('server close'));
};

const ServerScreen = ({navigation}) => {
  const [server, setServer] = useState(null);
  const [chats, setChats] = useState([]);
  const [ip, setIp] = useState('');

  return (
    <View>
      {ip.length > 0 ? (
        <Text>Server Screen: {ip}</Text>
      ) : (
        <Text>Server Screen</Text>
      )}
      <Button
        title="Start Server"
        onPress={async () => {
          if (!server) {
            setServer(createServer(chats, setChats));
          }
          try {
            const temp_ip = await NetworkInfo.getIPV4Address();
            setIp(temp_ip);
          } catch (e) {
            console.log(e.message);
          }
        }}
      />
      <Button
        title="Stop Server"
        onPress={() => {
          if (server) {
            server.close();
            setServer(null);
          }
        }}
      />
      <Button
        title="Go to Client Screen"
        onPress={() => navigation.navigate('Client')}
      />
      {server ? <Text>Server is on</Text> : null}
      <FlatList
        data={chats}
        renderItem={({item}) => {
          return <Text style={{margin: 10, fontSize: 20}}>{item.msg}</Text>;
        }}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

export default ServerScreen;

const styles = StyleSheet.create({});
