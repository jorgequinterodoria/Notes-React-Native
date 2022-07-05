import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useState } from 'react'
import { styles } from './AddNote'
import AsyncStorage from '@react-native-async-storage/async-storage'

const EditNote = ({ route, navigation, ...props }) => {
    const { note, index } = route.params
    const [newEdit, setNewEdit] = useState(note)
    function editNote() {
        let edited = [...props.notes]
        edited[index] = newEdit
        props.setNotes(edited)
        navigation.navigate('Notas')

        AsyncStorage.setItem('storedNotes', JSON.stringify(edited))
            .then(() => { props.setNotes(edited); })
            .catch(err => { console.log(err); })
    }
    return (
        <ScrollView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback
                    onPress={() => {
                        Keyboard.dismiss()
                    }}
                >
                    <View style={{ padding: 20, justifyContent: 'space-around' }}>
                        <TextInput
                            style={styles.input}
                            placeholder='Escriba aquí ...'
                            multiline={true}
                            value={newEdit.toString()}
                            onChangeText={(text) => setNewEdit(text)}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                if (newEdit === '') {
                                    Alert.alert('Error', 'No puedes dejar la nota vacía')
                                } else {
                                    editNote();
                                    navigation.navigate('Notas')
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Editar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default EditNote

