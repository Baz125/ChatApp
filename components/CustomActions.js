import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ref, uploadBytes } from 'firebase/storage';


const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage} ) => {
    const actionSheet = useActionSheet();
    const onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        pickImage();
                        return;
                    case 1:
                        takePhoto();
                        return;
                    case 2:
                        getLocation();
                    default:
                }
            },
        );
    };

    const pickImage = async() => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();    
            if (!result.canceled) {
                const imageURI = result.assets[0].uri;
                console.log(imageURI);
                //fetch doesn't seem to want to work with the URI because it's not a URL
                const response = await fetch(imageURI);
                const blob = await response.blob();
                const newUploadRef = ref(storage, 'image123');
                uploadBytes(newUploadRef, blob).then(async (snapshot) => {
                    console.log('File has been uploaded successfully');
                })
            } else Alert.alert("permissions haven't been granted");
        }
    }


//An attempt at getting the file from the device without using fetch
    // const pickImage = async() => {
    //     let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
    //     if (permissions?.granted) {
    //       let result = await ImagePicker.launchImageLibraryAsync();    
    //         if (!result.canceled) {
    //             const imageURI = result.assets[0].uri;
    //             try {
    //                 const fileData = await RNFS.readFile(imageURI, 'base64');
    //                 const blob = new Blob([fileData], { type: 'image/jpeg' }); // Adjust the type as needed
    //                 const newUploadRef = ref(storage, 'image123');
    //                 uploadBytes(newUploadRef, blob).then(async (snapshot) => {
    //                     console.log('File has been uploaded successfully');
    //                 });
    //             } catch (error) {
    //                 console.error('Error reading local file as blob:', error);
    //             }
    //         } else {
    //             Alert.alert("Permissions haven't been granted");
    //         }
    //     }
    // }


    
    const takePhoto = async () => {
    let permissions = await ImagePicker.requestCameraPermissionsAsync();

        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();

            if (!result.canceled) console.log('photo taken');
            else setImage(null)
        }   
    }
    
    const getLocation = async () => {
        let permissions = await Location.requestForegroundPermissionsAsync();

        if (permissions?.granted) {
            const location = await Location.getCurrentPositionAsync({});
            if (location) {
                onSend({
                    location: {
                        longitude: location.coords.longitude,
                        latitude: location.coords.latitude,
                    },
                });
            } else Alert.alert("Error occurred while fetching location")
        } else {
            Alert.alert("Permissions to read location aren't granted");
        }
    }

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onActionPress}
        >
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
      );
}

const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 10,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
  });

export default CustomActions;
