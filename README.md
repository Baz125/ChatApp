# def: chinwag
__British English, Hiberno English__ (<sup>verb</sup> -wagged, -wagging)  
(ˈtʃɪnˌwæɡ); slang  
INTRANSITIVE VERB  
to chat idly; gossip  
NOUN  
an idle chat; gossiping  

CHINWAG is a React Native Mobile Chat App, it provides users with a chat interface inside a single chat room with unauthenticated login, and options to share images, audio and location.

The application is built using React Native and Expo. Messages and media are stored on Google Firebase Firestore. Gifted Chat was used for the Chat UI. Chats are availble to the user in offline-mode.

## Prerequisites

- Node.js
- Firebase account
- Expo Go installed on mobile device

## Installation

1. Clone the repository.
2. Navigate to the project directory in the terminal.
3. Run `npm install` to install the necessary dependencies.
4. Create a Firebase project in your Firebase console.
5. Copy the firebaseConfig object from firebase project overview > gear icon > project settings > general tab and paste it in the firebaseConfig object in App.js
6. Enable Firestore and Storage services in the Firebase console.
7. Run `npm expo install`.
8. Run npx expo start.
9. App should become available under Development servers on the Expo Go Homepage.

## Key Features
- Users can enter their name and choose a background color for the chat screen before joining the chat.
- A Chat page displays the conversation, as well as an input field and submit button.
- The chat supports text, audio, images and location sharing.
- Data gets stored online and offline.

## User Stories
- As a new user, I want to be able to easily enter a chat room so I can quickly start talking to my friends and family.
- As a user, I want to be able to send messages to my friends and family members to exchange
the latest news.
- As a user, I want to send images to my friends to show them what I’m currently doing.
- As a user, I want to share my location with my friends to show them where I am.
- As a user, I want to be able to read my messages offline so I can reread conversations at any
time.
- As a user with a visual impairment, I want to use a chat app that is compatible with a screen
reader so that I can engage with a chat interface.

