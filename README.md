# Twitch Interface Appendix Apps

This is a repository of different apps I've made to augment the viewer experience on my Twitch channel.

---

## Steps to Start Intended Twitch Experience

In order to start the application, the following processes need to run:

1. node [/twitch-pubsub-project/index.js](../twitch/twitch-pubsub-project/index.js) - This is the listener for the Twitch chat room. Without this, messages from other servers will not interact with the Twitch. It is currently hard-coded for gamemasterthompson.

2. FROM THE WINDOWS ENVIRONMENT: node [/twitch/lol-liveserver/index.js](/lol-liveserver/index.js) This starts the League of Legends live server listener. Due to WSL network issues, this will not function properly when run from WSL.

3. node [/socket-test/index.js](/socket-test/index.js) - This is the socket server that emits events, which will then be passed to [the local HTML](/socket-test/index.html) file running out of the same folder

---

## eve-q-counter

This is the front end of an app that reports how many times a specific button, currently "Q", is pressed on the screen.

## input-checker

This is the back end of the Q counter app. It pulls global keypresses and adds them to a total on an Express server that is constantly checked for its value by the q-counter

## moment-overlay

Simple countdown app to display how long remains before a designated time, currently set to 10am local time.

## socket-test

This uses socket.io to open and close movies on call from Twitch chat by socket emitters in twitch-pubsub-project

## twitch-overlay

This uses CSS and GSAP to place a customizable overlay over the broadcast video.

## twitch-pubsub-project

This uses tmi.js to connect to a Twitch channel and respond to events in that channel. Currently wired to respond to subscriptions, raids, and messages, with a custom function to respond to a specific channel point event.
