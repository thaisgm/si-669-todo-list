
// utility function for getting unique keys
// will go away when we start using persistent storage
let nextKey = 1;
function getNextKey() {
  return '' + nextKey++;
}

let priorityNum = 0;


class DataModel {

  constructor() {
    this.todoList = [];
    this.subscribers = []; 

    //hardcoded list for testing
    this.todoList.push({text: "Get milk", key: getNextKey(), 'value': false, 'priorityValue': 1});
    this.todoList.push({text: "Dry cleaning", key: getNextKey(), 'value': false, 'priorityValue': 2});
    this.todoList.push({text: "Pay rent", key: getNextKey(), 'value': false, 'priorityValue': 3});
   
  }

  subscribeToUpdates(callback) {
    console.log("new subscriber: ", callback);
    this.subscribers.push(callback);
  }

  updateSubscribers() {
    for (let sub of this.subscribers) {
      sub(); // just tell them there's an update
    }
  }

  addItem(item) {
    console.log('HELLO, ', item)
    item.key = getNextKey();
    item.value = item.value;
    if (item.priorityValue == undefined){
        item.priorityValue = 0;
    } else {
        item.priorityValue = priorityNum;
    };
    this.todoList.push(item);
    this.updateSubscribers();
  }

  deleteItem(key) {
    let idx = this.todoList.findIndex((elem)=>elem.key===key);
    this.todoList.splice(idx, 1);
    this.updateSubscribers();
  }

  updateItem(key, newItem) {
    let idx = this.todoList.findIndex((elem)=>elem.key===key);
    this.todoList[idx] = newItem;
    this.updateSubscribers();
  }

  getItem(key) {
    let idx = this.todoList.findIndex((elem)=>elem.key===item.key);
    return(this.todoList[key]);
  }

  getTodoList() {
    return this.todoList;
  }

  getTodoListCopy() {
    return Array.from(this.todoList);
  }

  setSelection(key, check, change) {
    let idx = this.todoList.findIndex((elem)=>elem.key===key);
    // console.log('set selection', this.todoList[idx]['value']);
    // console.log('set selection', check);
    let new_check = !check;
    this.todoList[idx]['value'] = new_check;
    // console.log('set selection2', new_check);
    return change(new_check);
  }

  setPriority(pri, num, change) {
    // let idx = this.todoList.findIndex((elem)=>elem.key===key);
    // console.log('set selection', this.todoList[idx]['value']);
    // console.log('set selection', check);
    let new_pri = !pri;
    priorityNum = num;
    // this.todoList[idx]['checkValue'] = new_pri;
    // console.log('YOOOOO', pri, num, change)
    // console.log('set selection2', new_check);
    return change(new_pri);
  }

  setCompleted(check, change, item) {

    let new_check = !check;
    // console.log('set selection2', new_check);
    return change(new_check);
  }
}

let theDataModel;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}