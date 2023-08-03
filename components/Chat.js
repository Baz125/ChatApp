import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

const ChatScreen = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);

    const { name, backgroundColor } = route.params;

    // this sets the user's name to the navigation header. useEffect with empty array as 2nd paramater means it is run only once, after mounting
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: "You have entered the chat",
                createdAt: new Date(),
                system: true,
            },
            {
                _id: 2,
                text: 'Fancy a chinwag?',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: "React Native",
                    avatar: "https://placeimg.com/140/140/any",
                },
            }
        ]);
    }, []);
    
    // passing a callback into setMessages allows for using the previous state before it disappears
    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
        console.log(newMessages);
    };
    
    const renderBubble = (props) => {
        return <Bubble
            {...props}
            wrapperStyle={{
                right: {
                    backgroundColor: "#002eff"
                },
                left: {
                    backgroundColor: "#00ff52"
                }
            }}
        />
    };
     
    return (
        //  backgroundColor is not available within the scope of the Stylesheet, so I added it separately here, where it is in scope
        <View style={[styles.container, { backgroundColor: backgroundColor }]} >
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1
                }}
            />
            {Platform.OS === 'android' ? <KeyboardAvoidingView behaviour="height" /> : null}
        </View>
    );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    }
});


export default ChatScreen;