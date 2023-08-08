import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { collection, query, orderBy, where, addDoc, onSnapshot } from "firebase/firestore";

const ChatScreen = ({ route, navigation, db }) => {
    const [messages, setMessages] = useState([]);

    const { name, backgroundColor, userID } = route.params;

    // this sets the user's name to the navigation header. useEffect with empty array as 2nd paramater means it is run only once, after mounting
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    useEffect(() => {
        //pull messages from db - order by time created. onSnapshot pushes from db on every change, updates messages state
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
        const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
            let newMessages = [];
            documentsSnapshot.forEach(doc => {
                newMessages.push({ id: doc.id, ...doc.data() })
            });
            setMessages(newMessages)
        });
        //effect cleanup
        return () => {
            if (unsubMessages) unsubMessages();
        }
    }, []);
    
    // passing a callback into setMessages allows for using the previous state before it disappears
    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages[0])
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
                    _id: 1,
                    name: name
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