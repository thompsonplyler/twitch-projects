# Twitch Interface Appendix Apps
This is a repository of different apps I've made to augment the viewer experience on my Twitch channel. 

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