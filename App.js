import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddNote from './screens/AddNote';
import DeletedNotes from './screens/DeletedNotes';
import Notes from './screens/Notes';
import React, { useState, useEffect } from 'react';
import moment from "moment";
import { formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale'
import EditNote from './screens/EditNote';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

export default function App() {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState();
  const fecha = moment(new Date()).toDate()
  const [date, setDate] = useState(formatDistanceToNowStrict(fecha, { addSuffix: true, locale: es }));
  const [moveToBin, setMoveToBin] = useState([]);

  function handleNote() {
    let newNote = note;
    let newNotes = [newNote, ...notes];
    setNotes(newNotes);
    setNote('');
    AsyncStorage.setItem('storedNotes', JSON.stringify(newNotes))
      .then(() => { setNotes(newNotes); })
      .catch(err => { console.log(err); })
      ;
    AsyncStorage.setItem('date', JSON.stringify(date))
      .then(() => { setDate(date); })
      .catch(err => { console.log(err); })

  }

  function loadNotes() {
    AsyncStorage.getItem('storedNotes')
      .then(data => {
        if (data) { setNotes(JSON.parse(data)); }
      })
      .catch(err => { console.log(err); });

    AsyncStorage.getItem('date')
      .then(data => {
        if (data) { setDate(JSON.parse(data)); }
      })
      .catch(err => { console.log(err); });

    AsyncStorage.getItem('deletedNotes')
      .then(data => {
        if (data) { setMoveToBin(JSON.parse(data)); }
      })
      .catch(err => { console.log(err); });
  }

  useEffect(() => {
    loadNotes();
  }, []);


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Notas"
          options={{
            headerTitle: 'Notas',
          }}
        >
          {
            props =>
              <Notes
                {...props}
                notes={notes}
                setNotes={setNotes}
                note={note}
                setNote={setNote}
                date={date}
                setDate={setDate}
                moveToBin={moveToBin}
                setMoveToBin={setMoveToBin}
              />}
        </Stack.Screen>
        <Stack.Screen name="AddNote"
          options={{
            headerTitle: 'Agregar Nota',
          }}
        >
          {props => <AddNote {...props} note={note} setNote={setNote} handleNote={handleNote} />}
        </Stack.Screen>
        <Stack.Screen name="DeletedNotes"
          options={{
            headerTitle: 'Notas Eliminadas',
          }}
        >
          {
            props =>
              <DeletedNotes
                {...props}
                moveToBin={moveToBin}
                setMoveToBin={setMoveToBin}
                notes={notes}
                setNotes={setNotes}
                date={date}
                setDate={setDate}
              />
          }
        </Stack.Screen>
        <Stack.Screen name="EditNote"
          options={{
            headerTitle: 'Editar Nota',
          }}
        >
          {
            props =>
              <EditNote
                {...props}
                notes={notes}
                setNotes={setNotes}
                handleNote={handleNote}
              />
          }
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


