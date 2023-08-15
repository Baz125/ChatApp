import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Audio } from "expo-av";
import { useEffect } from "react";
import * as mime from 'react-native-mime-types';

const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID}) => {
    const actionSheet = useActionSheet();
    let recordingObject = null;

    const onActionPress = () => {
        const options = [
            "Choose Picture from Device",
            "Take Picture",
            "Send Location",
            "Record Audio",
            "Cancel",
        ];
        const cancelButtonIndex = options.length - 1;
        actionSheet.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
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
                        return;
                    case 3:
                        startRecording();
                        return;
                    default:
                }
            }
        );
    };

    //creates the unique identifier for any media stored on DB
    const generateReference = (uri) => {
        const timeStamp = new Date().getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
    };

    const uploadAndSendImage = async (imageURI) => {
        const type = mime.lookup(imageURI);
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);

        const imageBlob = await getBlobFromUri(imageURI);
        const metadata = {
            contentType: type
        };
        const uploadTask = uploadBytesResumable(newUploadRef, imageBlob, metadata);
        uploadTask.on('state_changed', undefined, undefined, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                onSend({ image: downloadURL });
            });
        });
    };

    const uploadAndSendAudio = async () => {
        await stopRecording();
        const recordingURI = recordingObject.getURI();
        const type = mime.lookup(recordingURI);
        const uniqueRefString = generateReference(recordingURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const recordingBlob = await getBlobFromUri(recordingURI);
        const metadata = {
            contentType: type
        };
        const uploadTask = uploadBytesResumable(newUploadRef, recordingBlob, metadata);
        uploadTask.on('state_changed', undefined, undefined, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                onSend({ audio: downloadURL });
            })
        })
    };
    //this XMLHttpRequest replaces fetch which is not working on Android 13 and firebase at time of writing
    const getBlobFromUri = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            // If successful return with blob
            xhr.onload = function () {
                resolve(xhr.response);
            };
            // reject on error
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            // setting response type to blob means the server's 
            // response will be accessed as a binary object
            xhr.responseType = "blob";
            // Initialize the request. The third argument set to 'true' denotes 
            // that the request is asynchronous
            xhr.open("GET", uri, true);
            // Send the request. The 'null' argument means
            // that no body content is given for the request
            xhr.send(null);
        });

        return blob;
    };

    //stops recording if user were to exit app during recording, without having pressed cancel or send
    useEffect(() => {
        return () => {
            if (recordingObject) recordingObject.stopAndUnloadAsync();
        }
    }, []);

    const startRecording = async () => {
        try {
            let permissions = await Audio.requestPermissionsAsync();
            if (permissions?.granted) {
                // iOS specific config to allow recording on iPhone devices
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
                });
                Audio.Recording.createAsync(
                    Audio.RecordingOptionsPresets.HIGH_QUALITY
                )
                    .then((results) => {
                        return results.recording;
                    })
                    .then((recording) => {
                        recordingObject = recording;
                        Alert.alert(
                            "You are recording...",
                            undefined,
                            [
                                {
                                    text: "Cancel",
                                    onPress: () => {
                                        stopRecording();
                                    },
                                },
                                {
                                    text: "Stop and Send",
                                    onPress: () => {
                                        uploadAndSendAudio();
                                    },
                                },
                            ],
                            { cancelable: false }
                        );
                    });
            }
        } catch (err) {
            Alert.alert("Failed to record!");
        }
    };

    const stopRecording = async () => {
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: false,
        });
        await recordingObject.stopAndUnloadAsync();
    };


    const pickImage = async () => {
        let permissions =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
            if (!result.canceled)
                await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("permissions haven't been granted");
        }
    };


    const takePhoto = async () => {
        let permissions = await ImagePicker.requestCameraPermissionsAsync();
        if (permissions?.granted) {
            let result = await ImagePicker.launchCameraAsync();
            if (!result.canceled)
                await uploadAndSendImage(result.assets[0].uri);
            else Alert.alert("Permissions haven't been granted.");
        }
    };

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
            } else Alert.alert("Error occurred while fetching location");
        } else {
            Alert.alert("Permissions to read location aren't granted");
        }
    };

    return (
        <TouchableOpacity style={styles.container} onPress={onActionPress}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.iconText, iconTextStyle]}>+</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: "#b2b2b2",
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: "#b2b2b2",
        fontWeight: "bold",
        fontSize: 20,
        backgroundColor: "transparent",
        textAlign: "center",
    },
});

export default CustomActions;
