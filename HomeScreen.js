import React, {useEffect, useState} from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import { MaterialIcons as Icon } from '@expo/vector-icons'; 
import { getDataModel } from './DataModel';
import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getDatabase, ref, onValue, set } from 'firebase/database';


const firebaseConfig = {
  authDomain: 'si-669-hw5-message-board.firebaseapp.com',
  databaseURL: 'https://si-669-hw5-message-board.firebaseio.com',
  projectId: 'si-669-hw5-message-board',
  storageBucket: 'si-669-hw5-message-board.appspot.com',
};

const firebaseApp = initializeApp(firebaseConfig);

const firestore = getFirestore(firebaseApp);

// const toDoDB = firestore.collection('list-3000')

const q = query(collection(firestore, "list-3000"));

console.log('TEST', q)

function getExclamation(item){
    if (item.priorityValue == 0) {
        return '';
    } else if (item.priorityValue == 1){
        return '!'   
    } else if (item.priorityValue == 2) {
        return '!!'
    } else {
        return '!!!'; 
    }
};

setDoc(doc(firestore, "list-3000", 'thais'), {
  employment: "plumber",
  outfitColor: "red",
  specialAttack: "fireball"
});

function HomeScreen({navigation}) {

  const dataModel = getDataModel();
  const [todoList, setTodoList] = useState(dataModel.getTodoListCopy());
  const [isSelected, setSelection] = useState();

  useEffect(()=>{
    dataModel.subscribeToUpdates(()=>{
      setTodoList(dataModel.getTodoListCopy());
    });
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={todoList} 
          renderItem={({item})=>{
            return (
            <View style={styles.listItem}>
              {/* <CheckBox/> */}
              <CheckBox
              onPress = {() => {
                dataModel.setSelection(item.key, isSelected, setSelection);
              }}
              checked = {item.value}
              />
              <Text style={styles.listItemText}>{item.text}</Text>
              <Text>{getExclamation(item)}</Text>
              <Text>{item.checkValue}</Text>
              <View style={styles.listItemButtons}>
                <Button
                  icon={<Icon name="edit" size={24} color="darkgrey"/>}
                  type="clear"
                  onPress={()=>{
                    navigation.navigate('Details', {item: item, 'firestore': firestore});
                  }}
                />
                <Button
                  icon={<Icon name="delete" size={24} color="darkgrey"/>}
                  type="clear"
                  onPress={()=>{
                    dataModel.deleteItem(item.key);
                  }}
                />
              </View>
            </View>
            );
          }}
        />
      </View>

      <Button
        title="Add Item"
        onPress={()=>{
          navigation.navigate("Details");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listContainer: {
    flex: 0.5,
    padding: 30,
    width: '100%',
  },
  listContentContainer: {
    justifyContent: 'flex-start',
  },
  listItem: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 5
  }, 
  listItemText: {
    flex: 0.7,
    fontSize: 18
  },
  listItemButtons: {
    flex: 0.2,
    flexDirection: 'row',
  }
});

export default HomeScreen;