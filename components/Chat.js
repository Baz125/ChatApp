import { StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';

const ChatScreen = ({ route, navigation }) => {
    const { name, backgroundColor } = route.params;
    // const bgColor = backgroundColor;

    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

 return (
    <View style={[styles.container, { backgroundColor: backgroundColor }]} >
    <Text>Hello Screen2! Hey</Text>
    </View>
 );
}

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    }
});

export default ChatScreen;