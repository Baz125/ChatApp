import { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput, ImageBackground, TouchableOpacity } from 'react-native';
import bgImage from '../assets/Background_Image.png';

const StartScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('');

  return (
    <View style={styles.container}>
        <ImageBackground source={bgImage} resizeMode="cover" style={styles.bgImage}>
            <Text style={styles.appTitle}>chinwag</Text>
            <View style={styles.inputArea}>
                <TextInput
                    style={styles.textInput}
                    value={name}
                    onChangeText={setName}
                    placeholder='Your Name'
                    inlineImageLeft='icons-user-30.png'
                />
                {/* <View style={styles.chooseBgColor}> */}
                      <Text style={styles.chooseBgColor}>Choose Background Color:</Text>
                      <View style={styles.colorButtons}>
                          <TouchableOpacity style={[styles.colorButton, styles.color1]} onPress={() => setBackgroundColor('#090C08')} />
                          <TouchableOpacity style={[styles.colorButton, styles.color2]} onPress={() => setBackgroundColor('#474056')} />
                          <TouchableOpacity style={[styles.colorButton, styles.color3]} onPress={() => setBackgroundColor('#8A95A5')}/>
                          <TouchableOpacity style={[styles.colorButton, styles.color4]} onPress={() => setBackgroundColor('#B9C6AE')}/>
                      </View>
                {/* </View>   */}
                <TouchableOpacity
                    style={styles.startChattingBtn}
                    onPress={() => navigation.navigate('ChatScreen', { name: name, backgroundColor: backgroundColor })}
                >
                  <Text style={styles.startChattingBtnText}>Start Wagging Your Chin</Text>
                </TouchableOpacity> 
            </View>
        </ImageBackground>      
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
        // justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    appTitle: {
        fontSize: 45,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: '35%',
    },
    inputArea: {
        backgroundColor: 'white',
        height: '44%',
        width: '88%',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '50%',
        borderRadius: 5,
    },
    textInput: {
        width: "88%",
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(117, 112, 131, 0.6)',
        marginTop: 15,
        marginBottom: 15,
        fontSize: 16,
        fontWeight: '300',
        color: 'rgba(117, 112, 131, 0.6)'
    },
    chooseBgColor: {
        fontSize: 16,
        color: 'rgba(117, 112, 131, 0.6)',
        alignSelf: 'flex-start',
        marginLeft: '6%',
    },
    colorButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
        marginLeft: '6%',
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
        width: '88%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
        height: 60,
        borderRadius: 5,
    },
    startChattingBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    }
  });
  
  export default StartScreen;