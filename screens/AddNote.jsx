import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import * as Style from '../assets/Styles'

const AddNote = ({ navigation, ...props }) => {
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
                            value={props.note}
                            onChangeText={(text) => props.setNote(text)}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                if (props.note === '') {
                                    Alert.alert('Error', 'No puedes dejar la nota vacía')
                                } else {
                                    props.handleNote();
                                    navigation.navigate('Notas')
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default AddNote

export const styles = StyleSheet.create({
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    button: {
        backgroundColor: Style.color,
        width: '40%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        alignSelf: 'flex-end',
        marginTop: 20,
    },
    input: {
        padding: 20,
        paddingTop: 20,
        width: '100%',
        fontSize: 19,
        color: 'black',
        fontWeight: '600',
        opacity: 0.8,
        shadowColor: Style.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        borderColor: Style.color,
        borderWidth: 2,
        borderRadius: 5,
        height: 300,
    },
    addNoteContainer: {
        paddingHorizontal: 20,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    }
})