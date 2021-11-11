import React from 'react';
import {SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
const COLORS = {primary:'#1f145c',white:'#fff'}


const App = () => {
  const [todos, setTodos] = React.useState([]);
  const [textInput, setTextInput] = React.useState('');

  React.useEffect(() => {
    getTodosFromUserDevice();
  }, []);

  React.useEffect(() => {
    saveTodoToUserDevice(todos);
  }, [todos]);
  const ListItem = ({todo}) => {
    return <View style={styles.ListItem}>
      {
        !todo?.completed ?
          <TouchableOpacity style={[styles.actionIconSuc]} onPress={() => markCompleted (todo?.id)}>
          <Icon name="done" size={20} color={"green"} />
        </TouchableOpacity>
        :
        <TouchableOpacity style={[styles.actionIconSuce]} onPress={() => markNoCompleted (todo?.id)}>
        <Icon name="done" size={20} color={"white"} />
      </TouchableOpacity>
      }
      <View style={{flex:1}} >
        <Text style={{fontWeight:"bold", fontSize:15,color:COLORS.primary, textDecorationLine:todo?.completed?"line-through":"none"}} >{todo?.task}</Text>
      </View>
      <TouchableOpacity style={[styles.actionIcon]} onPress={() => deleteTodo (todo?.id)}>
        <Icon name="delete" size={20} color={"red"} />
      </TouchableOpacity>
    </View>
  }
  const saveTodoToUserDevice = async todos => {
    try {
      const stringifyTodos = JSON.stringify(todos);
      await AsyncStorage.setItem('todos', stringifyTodos);
    } catch (error) {
      console.log(error);
    }
  };
  const getTodosFromUserDevice = async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const addTodo = () =>{
    if(textInput == ''){
      Alert.alert("error","Please input to do")
    }else{
    const newTodo = {
      id: Math.random(),
      task:textInput,
      completed:false
    }
    setTodos([...todos, newTodo])
    setTextInput('')
  }
  }
  const markCompleted = todoId => {
    const newTodos = todos.map((item)=>{
      if(item.id == todoId){
        return {...item,completed:true}
      }
      return item;
    })
    setTodos(newTodos);
  }
  const markNoCompleted = todoId => {
    const newTodos = todos.map((item)=>{
      if(item.id == todoId){
        return {...item,completed:false}
      }
      return item;
    })
    setTodos(newTodos);
  }
  const deleteTodo = (todoId) =>{
    const newTodos = todos.filter(item => item.id != todoId)
    setTodos(newTodos)
  }
  const clearTodo = () =>{
    Alert.alert('Confirm', 'Clear al todos?' , [
      {
      text:"yes",
      onPress: ()=>setTodos([]), 
      },
      {
        text:"no",

      }
    ])
  }
  return (
    <SafeAreaView style={{flex:1,backgroundColor:COLORS.white}} >
      <View style={styles.header}>
        <Text style={{fontWeight:"bold", fontSize:20, color:COLORS.primary}} >Yapılacaklar listesi</Text>
        <Icon name="delete" size={25} color="red" onPress={clearTodo} />
      </View>
      <FlatList
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{padding:20,paddingBottom:100}}
      data={todos} renderItem={({item}) => <ListItem todo={item} />} />
      <View style={styles.footer}>
        <View style={styles.inputConteiner} >
        <TextInput
            value={textInput}
            placeholder="Liste ekle"
            onChangeText={text => setTextInput(text)}
            placeholderTextColor="black"
            style={{color:"black"}}
          />
        </View>
        <TouchableOpacity onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Icon name="add" color={COLORS.white} size={30} />
          </View>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding:20,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  footer: {
    position:"absolute",
    bottom: 0,
    color: COLORS.white,
    width:"100%",
    flexDirection: "row",
    alignItems:"center",
    paddingHorizontal:20
  },
  inputConteiner : {
    backgroundColor: COLORS.white,
    elevation:40,
    flex:1,
    height:50,
    marginVertical:20,
    marginRight:20,
    borderRadius:30,
    paddingHorizontal:20,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius:100,
    elevation: 40,
    justifyContent:"center",
    alignItems:"center",

  },
  ListItem:{
    padding:20,
    backgroundColor: COLORS.white,
    flexDirection:"row",
    elevation:12,
    borderRadius:7,
    marginVertical:10,

  },
  actionIconSuc :{
    height:25,
    width:25,
    borderWidth:1,
    borderColor:"green",
    justifyContent:"center",
    alignItems:"center",
    marginRight:5,
    borderRadius:100
  },
  actionIconSuce :{
    height:25,
    width:25,
    borderWidth:1,
    borderColor:"green",
    justifyContent:"center",
    backgroundColor:"green",
    alignItems:"center",
    marginRight:5,
    borderRadius:100
  },
  actionIcon :{
    height:25,
    width:25,
    justifyContent:"center",
    alignItems:"center",
    marginRight:5,
    borderRadius:100
  }
});


export default App;
