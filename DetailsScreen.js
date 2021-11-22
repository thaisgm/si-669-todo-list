import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { getDataModel } from './DataModel';
import { CheckBox } from 'react-native-elements';
import { getFirestore, setDoc, doc } from 'firebase/firestore';

const firestore = getFirestore();


function getPriorityVal(priority, priority2, priority3) {
    if (priority == true) {
        return priority;
    } else if (priority2 == true){
        return priority2;
    } else {
        return priority3;
    }
}

function getPriorityNum(priority, priority2, priority3) {
    if (priority == true) {
        return 1;
    } else if (priority2 == true) {
        return 2;
    } else if (priority3 == true) {
        return 3;
    } else {
        return 0;
    }
}

function DetailsScreen({navigation, route}) {

  let item = route.params ? route.params.item : null;
  let editMode = (item != null);
  const [inputText, setInputText] = useState(item? item.text : '');
  const [priority, setItemPriority] = useState();
  const [priority2, setItemPriority2] = useState();
  const [priority3, setItemPriority3] = useState();
  const [isComplete, setComplete] = useState(item? item.value : false);

  

  let dataModel = getDataModel();

  return (
    <View style={styles.container}>
      <View style={styles.inputArea}>
        <Text style={styles.inputLabel}>Item:</Text>
        <Input 
          containerStyle={styles.inputBox} 
          placeholder="New Todo Item"
          onChangeText={(text)=>setInputText(text)}
          value={inputText}
        />
      </View>   
      <View style={styles.inputArea}>
          <Text style={styles.inputLabelPriority}>Priority: </Text>
          <CheckBox
              onPress = {() => {
                dataModel.setPriority(priority, 1, setItemPriority);
              }}
              checked = {priority}
              checkedIcon = "exclamation"
              uncheckedIcon = "exclamation"
              uncheckedColor = "black"
              checkedColor='red'
            />
            <CheckBox
              onPress = {() => {
                dataModel.setPriority(priority2, 2, setItemPriority2);
              }}
              checked = {priority2}
              checkedIcon = "angle-double-right"
              uncheckedIcon = "angle-double-right"
              uncheckedColor = "black"
              checkedColor='red'
            />
            <CheckBox
              onPress = {() => {
                dataModel.setPriority(priority3, 3, setItemPriority3);
              }}
              checked = {priority3}
              checkedIcon = "bars"
              uncheckedIcon = "bars"
              uncheckedColor = "black"
              checkedColor='red'
            />
        </View>   

        <View style={styles.inputArea}>
            <Text style={styles.inputLabel}>Completed:</Text>
            <CheckBox
              containerStyle={styles.inputBox} 
              onPress = {() => {
                dataModel.setCompleted(isComplete, setComplete, item);
              }}
              checked = {isComplete}
            //   checked = {item? item.value : isComplete}
            />
        </View>

      <View style={styles.buttonArea}>
        <Button
          containerStyle={styles.button}
          title="Cancel"
          onPress={()=>{
            navigation.navigate("Home");
          }}
        />
        <Button
          containerStyle={styles.button}
          title={editMode ? "Save" : "Add Item"}
          onPress={()=>{
            if (editMode) {
                console.log('????', priority, priority2, priority3)
              item.text = inputText;
              item.priorityValue = getPriorityNum(priority, priority2, priority3);
              item.value = isComplete;
              dataModel.updateItem(item.key, item);
              console.log('new data model: ', dataModel.getTodoList());
            } else {
              // update data model
              number = getPriorityVal(priority, priority2, priority3);
              dataModel.addItem({text: inputText, value: isComplete, priorityValue: number}); // let the data model add the key
              console.log('new data model: ', dataModel.getTodoList());
              setDoc(doc(firestore, "list-3000", inputText), {
                text: inputText,
                value: isComplete,
                priorityValue: number
              });              

            }
            navigation.navigate("Home");
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 30
  },
  inputArea: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center', 
  },
  inputLabel: {
    flex: 0.4,
    textAlign: 'right',
    fontSize: 18,
    paddingBottom: 10, 
    paddingRight: 10
  },
  inputLabelPriority: {
    flex: 0.6,
    textAlign: 'right',
    fontSize: 18,
    paddingBottom: 10, 
  }, 
  inputBox: {
    flex: 0.8,
  },
  buttonArea: {
    flex: 0.1,
    flexDirection: 'row',
    paddingTop: 30,
    justifyContent: 'space-between',
    //alignItems: 'center',
    width: '70%',
    //backgroundColor: 'tan'
  },
  button: {
    width: '40%'
  }
});

export default DetailsScreen;