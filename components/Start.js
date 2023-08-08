import { useState } from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView, TextInput, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import bgImage from '../assets/Background_Image.png';
import { getAuth, signInAnonymously } from "firebase/auth";

const StartScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');
    const auth = getAuth();

    //this function signs the user into firebase anonymously, and if that is successful, navigates the user to the chat while passing the relevant props
    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate("ChatScreen", { userID: result.user.uid, name: name, backgroundColor: backgroundColor });
            })
            .catch((error) => {
                Alert.alert("Unable to sign in, please try again later")
            })
    }

  return (
    <View style={styles.container}>
        <ImageBackground source={bgImage} resizeMode="cover" style={styles.bgImage}>
            <View style={styles.appTitleContainer}>
                <Text style={styles.appTitle}>chinwag</Text>
            </View>
            <View style={styles.wrapper}>
                <View style={styles.inputArea}>
                    <TextInput
                        style={styles.textInput}
                        value={name}
                        onChangeText={setName}
                        placeholder='Your Name'
                        inlineImageLeft='icons8-user-30.png'
                    />

                    <Text style={styles.chooseBgColor}>Choose Background Color:</Text>
                    <View style={styles.colorButtons}>
                        {/* onPress must be a callback instead of a direct use of setBackgroundColor to avoid an infinite loop  */}
                            <TouchableOpacity style={[styles.colorButton, styles.color1]} onPress={() => setBackgroundColor('#090C08')} /> 
                            <TouchableOpacity style={[styles.colorButton, styles.color2]} onPress={() => setBackgroundColor('#474056')} />
                            <TouchableOpacity style={[styles.colorButton, styles.color3]} onPress={() => setBackgroundColor('#8A95A5')} />
                            <TouchableOpacity style={[styles.colorButton, styles.color4]} onPress={() => setBackgroundColor('#B9C6AE')} />
                    </View>
                    <TouchableOpacity
                        style={styles.startChattingBtn}
                        onPress={() => signInUser()}
                    >
                    <Text style={styles.startChattingBtnText}>Start Wagging Your Chin</Text>
                    </TouchableOpacity> 
                </View>
            </View>
        </ImageBackground>      
          {Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}  
          {Platform.OS === "android" ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    bgImage: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        height: '100%',
    },
    appTitleContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    appTitle: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        textAlign: 'center',
    },
    wrapper: {
        padding: 16,
        width: '100%',
    },
    inputArea: {
        backgroundColor: 'white',
        // height: '44%',
        // width: '88%',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginTop: '50%',
        borderRadius: 5,
        padding: 16,
    },
    textInput: {
        // width: "88%",
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(117, 112, 131, 0.6)',
        // marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '300',
        color: 'rgba(117, 112, 131, 0.6)',
        width: '100%',
    },
    chooseBgColor: {
        fontSize: 16,
        color: 'rgba(117, 112, 131, 0.6)',
        alignSelf: 'flex-start',
        // marginLeft: '6%',
    },
    colorButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
        // marginLeft: '6%',
        marginBottom: 24
    },
    colorButton: {
        height: 50,
        width: 50,
        borderRadius: 25,
        marginBottom: 10,
        margin: 5,
    },
    color1: {
        backgroundColor: '#090C08',
    },
    color2: {
        backgroundColor: '#474056',
    },
    color3: {
        backgroundColor: '#8A95A5',
    },
    color4: {
        backgroundColor: '#B9C6AE',
    },
    startChattingBtn: {
        backgroundColor: '#757083',
        // width: '88%',
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: '5%',
        // height: 60,
        borderRadius: 5,
        padding: 16,
        width: '100%'
    },
    startChattingBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
  });
  
  export default StartScreen;