import { StyleSheet, View, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat, InputToolbar, GiftedAvatar } from 'react-native-gifted-chat';
import { collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = ({ route, navigation, db, isConnected }) => {
    const [messages, setMessages] = useState([]);

    const { name, backgroundColor, userID } = route.params;

    console.log("name: ", name);
    console.log("userID ", userID);

    // this sets the user's name to the navigation header. useEffect with empty array as 2nd paramater means it is run only once, after mounting
    useEffect(() => {
        navigation.setOptions({ title: name });
    }, []);

    let unsubMessages;

    useEffect(() => {
        
        if (isConnected === true) {
            // unregister current onSnapshot() listener to avoid registering
            // multiple listeners when useEffect code is re-executed.
            if (unsubMessages) unsubMessages();
            unsubMessages = null;
            //pull messages from db - order by time created. onSnapshot pushes from db on every change
            const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
            unsubMessages = onSnapshot(q, (documentsSnapshot) => {
                let newMessages = [];
                documentsSnapshot.forEach(doc => {
                    newMessages.push({
                        _id: doc.id,
                        ...doc.data(),
                        createdAt: new Date(doc.data().createdAt.toMillis())
                    });
                });
                cacheMessages(newMessages);
                setMessages(newMessages)
            });
        } else loadCachedMessages();  
        //effect cleanup
        return () => {
            if (unsubMessages) unsubMessages();
        }
        }, [isConnected]);
        
    const cacheMessages = async (messagesToCache) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
        } catch (error) {
            console.log(error.message);
        }
    }

    const loadCachedMessages = async () => {
        const cachedMessages = await AsyncStorage.getItem("messages") || [];
        setMessages(JSON.parse(cachedMessages));
      }
    
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

    const renderInputToolbar = (props) => {
        if (isConnected === true) {
            return <InputToolbar {...props} />
        } else return null;
    }
     
    return (
        //  backgroundColor is not available within the scope of the Stylesheet, so I added it separately here, where it is in scope
        <View style={[styles.container, { backgroundColor: backgroundColor }]} >
            <GiftedChat
                messages={messages}
                renderBubble={renderBubble}
                renderInputToolbar={renderInputToolbar}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name,
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