import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native'
import React from 'react'
import * as Style from '../assets/Styles'
import { styles } from './Notes'
import AsyncStorage from '@react-native-async-storage/async-storage'

const DeletedNotes = ({ navigation, ...props }) => {
    function emptyBin() {
        Alert.alert(
            'Eliminar todo',
            '¿Estás seguro de eliminar permanentemente todas las notas?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Eliminar', onPress: () => {
                        let emptyArray = [...props.moveToBin]
                        emptyArray = []
                        props.setMoveToBin(emptyArray)
                        AsyncStorage.setItem('deletedNotes', JSON.stringify(emptyArray))
                            .then(() => { props.setMoveToBin(emptyArray) })
                            .catch(err => { console.log(err); })
                    }
                }
            ],
        )
    }
    function undoAllNotes() {
        let deletedNotes = [...props.moveToBin]
        let notes = [...props.notes]
        deletedNotes.forEach((item, index) => {
            notes.push(item)
        })
        props.setMoveToBin([])
        props.setNotes(deletedNotes)

        AsyncStorage.setItem('storedNotes', JSON.stringify(notes))
            .then(() => { props.setNotes(notes); })
            .catch(err => { console.log(err); })

        AsyncStorage.setItem('deletedNotes', JSON.stringify([]))
            .then(() => { props.setMoveToBin([]) })
            .catch(err => { console.log(err); })
    }
    function undoNote(index) {
        let getBack = props.moveToBin[index]
        let array = [getBack, ...props.notes]
        props.setNotes(array)
        let newArray = [...props.moveToBin]
        newArray.splice(index, 1)
        props.setMoveToBin(newArray)

        AsyncStorage.setItem('storedNotes', JSON.stringify(array))
            .then(() => { props.setNotes(array); })
            .catch(err => { console.log(err); })

        AsyncStorage.setItem('deletedNotes', () => {
            return
        }
        );
    }
    function permanentlyDelete(index) {
        Alert.alert(
            'Eliminar permanentemente',
            '¿Estás seguro de eliminar permanentemente esta nota?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        let newArray = [...props.moveToBin]
                        newArray.splice(index, 1)
                        props.setMoveToBin(newArray)
                        AsyncStorage.setItem('deletedNotes', JSON.stringify(newArray))
                            .then(() => { props.setMoveToBin(newArray) })
                            .catch(err => { console.log(err); })

                    }
                }
            ],
        )
    }
    return (
        <ScrollView>
            <View style={styles.notesContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={style.emptyButton}
                        onPress={() => undoAllNotes()}
                    >
                        <Text style={style.emptyButtonText}>Restaurar</Text>
                    </TouchableOpacity>
                    <Text style={{ fontWeight: '700', fontSize: 18, color: Style.color }}>
                        Total: {props.moveToBin.length}
                    </Text>
                    <TouchableOpacity
                        style={style.emptyButton}
                        onPress={() => emptyBin()}
                    >
                        <Text style={style.emptyButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.divider} />
                {props.moveToBin.length === 0 ? (
                    <View style={styles.emptyNoteContainer}>
                        <Text style={styles.emptyNoteText}>
                            No hay notas eliminadas
                        </Text>
                    </View>
                ) : (
                    props.moveToBin.map((item, index) => {
                        return (
                            <View style={styles.item} key={index}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={styles.note}>
                                        <Text style={styles.index}>{index + 1}.</Text>
                                        <Text style={styles.text}>{item}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => undoNote(index)}
                                    >
                                        <Text style={styles.delete}>Deshacer</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dateContainer}>
                                    <Text>{props.date}</Text>
                                    <TouchableOpacity
                                        onPress={() => permanentlyDelete(index)}
                                    >
                                        <Text style={styles.delete}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                )}
            </View>
        </ScrollView >
    )
}

export default DeletedNotes

const style = StyleSheet.create({
    emptyButton: {
        backgroundColor: Style.color,
        width: '25%',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        marginBottom: 5,
    },
    emptyButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})