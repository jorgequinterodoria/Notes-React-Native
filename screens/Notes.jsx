import { Alert, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import * as Style from '../assets/Styles'
import { ApplicationProvider, Icon, IconRegistry, Layout } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notes = ({ navigation, ...props }) => {
    const [searchNote, setSearchNote] = useState('')

    function deleteNote(index) {
        let newArray = [...props.notes];
        let movedNote = newArray.splice(index, 1);
        props.setNotes(newArray);
        props.setMoveToBin(movedNote);
        let bin = [movedNote, ...props.moveToBin];
        props.setMoveToBin(bin);

        AsyncStorage.setItem('storedNotes', JSON.stringify(newArray))
            .then(() => { props.setNotes(newArray); })
            .catch(err => { console.log(err); })
        AsyncStorage.setItem('deletedNotes', JSON.stringify(bin))
            .then(() => { props.setMoveToBin(bin) })
            .catch(err => { console.log(err); })
    }

    function search() {
        if (searchNote === '') {
            Alert.alert('Error', 'Escribe algo para buscar')
        } else if (searchNote !== '') {
            props.notes.forEach((item, index) => {
                if (item.toString().includes(searchNote)) {
                    let searchItem = [...props.notes]
                    let firstElOfArray = searchItem[0]
                    let index = [...props.notes].indexOf(item)
                    searchItem[0] = item
                    searchItem[index] = firstElOfArray
                    props.setNotes(searchItem)
                }
            })
        }
        setSearchNote('')
        Keyboard.dismiss()
    }
    function clearAllNotes() {
        Alert.alert(
            'Eliminar todo',
            '¿Estás seguro de eliminar todas las notas?',
            [
                {
                    text: 'Cancelar',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel'
                },
                {
                    text: 'Eliminar', onPress: () => {
                        let emptyArray = [...props.notes]
                        let deletedCompArray = [...props.moveToBin]
                        emptyArray.forEach((item) => {
                            deletedCompArray.push(item)
                        })
                        emptyArray = []
                        props.setNotes(emptyArray)
                        props.setMoveToBin(deletedCompArray)

                        AsyncStorage.setItem('storedNotes', JSON.stringify(emptyArray))
                            .then(() => { props.setNotes(emptyArray); })
                            .catch(err => { console.log(err); })

                        AsyncStorage.setItem('deletedNotes', JSON.stringify(deletedCompArray))
                            .then(() => { props.setMoveToBin(deletedCompArray) })
                            .catch(err => { console.log(err); })

                    }
                }
            ],
        )
    }
    return (
        <View style={[styles.notesContainer]}>
            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Mis Notas</Text>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                        style={[styles.button, { marginLeft: 40 }]}
                        onPress={() => navigation.navigate('DeletedNotes')}
                    >
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={eva.light}>
                            <Icon name='trash-2-outline' fill='#fff' width={25} height={50} />
                        </ApplicationProvider>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button]}
                        onPress={() => {
                            navigation.navigate('AddNote')
                        }}
                    >
                        <IconRegistry icons={EvaIconsPack} />
                        <ApplicationProvider {...eva} theme={eva.light}>
                            <Icon name='plus-outline' fill='#fff' width={25} height={50} />
                        </ApplicationProvider>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontWeight: '700', fontSize: 18, color: Style.color }}>Total: {props.notes.length} </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder='Buscar...'
                    placeholderTextColor={Style.color}
                    style={[styles.input, { borderWidth: 3 }]}
                    value={searchNote}
                    onChangeText={(text) => setSearchNote(text)}
                />
                <TouchableOpacity
                    style={[styles.searchButton, { width: 50 }]}
                    onPress={() => search()}
                >
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider {...eva} theme={eva.light}>
                        <Icon name='search' fill='#fff' width={25} height={40} />
                    </ApplicationProvider>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => clearAllNotes()}
                    style={[styles.searchButton, { width: 60 }]}
                >
                    <Text style={styles.searchButtonText}>Limpiar</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {props.notes.length === 0 ?
                    <View style={styles.emptyNoteContainer}>
                        <Text style={styles.emptyNoteText}>No hay notas aun! click en el botón + para agregar una nueva nota...</Text>
                    </View>
                    :
                    props.notes.map((note, index) => {
                        return (
                            <View key={index} style={styles.item}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={styles.note}>
                                        <Text style={styles.index}>{index + 1}. </Text>
                                        <Text style={styles.text}>{note}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => {
                                            deleteNote(index)
                                        }}
                                    >
                                        <Text style={styles.delete}>X</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.dateContainer}>
                                    <Text>{props.date}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.navigate('EditNote', { note: note, index: index })
                                        }}
                                    >
                                        <Text style={styles.delete}>Editar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                }

            </ScrollView>
        </View>
    )
}

export default Notes

export const styles = StyleSheet.create({
    notesContainer: {
        paddingTop: 10,
        paddingHorizontal: 20,
        marginBottom: 70,
        opacity: 0.9,
    },
    heading: {
        fontSize: 30,
        fontWeight: '700',
        color: Style.color,
    },
    divider: {
        width: '100%',
        height: 2,
        backgroundColor: Style.color,
        marginTop: 5,
        marginbottom: 5,
    },
    dateContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    emptyNoteText: {
        color: Style.color,
        fontWeight: '600',
        fontSize: 15,
    },
    emptyNoteContainer: {
        alignItems: 'center',
        marginTop: 240,
    },
    searchButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
    },
    searchButton: {
        backgroundColor: Style.color,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        borderRadius: 5,
        height: 40,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
    },
    input: {
        height: 40,
        paddingHorizontal: 20,
        width: '65%',
        fontSize: 19,
        color: 'black',
        fontWeight: '600',
        opacity: 0.8,
        shadowColor: Style.color,
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        borderColor: Style.color,
        borderWidth: 2,
        borderRadius: 5,
    },
    delete: {
        color: Style.color,
        fontWeight: '700',
        fontSize: 15,
    },
    text: {
        fontWeight: '700',
        fontSize: 17,
        alignSelf: 'center',
    },
    note: {
        flexDirection: 'row',
        width: '75%',
    },
    scrollView: {
        marginBottom: 70,
    },
    buttonText: {
        color: 'white',
        fontSize: 32,
        fontWeight: '800',
    },
    button: {
        backgroundColor: Style.color,
        width: 50,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        height: 50,
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    index: {
        fontSize: 20,
        fontWeight: '800',
    },
    item: {
        marginBottom: 20,
        padding: 15,
        color: 'black',
        opacity: 0.8,
        marginTop: 10,
        shadowColor: Style.color,
        shadowOpacity: 0.5,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 5,
        backgroundColor: 'white',
        borderColor: Style.color,
        borderWidth: 2,
        borderRadius: 5,
        borderLeftWidth: 15,
    }
})