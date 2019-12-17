import TwitchClient from 'twitch';

const clientId = '123abc';
const accessToken = 'def456';
const twitchClient = await TwitchClient.withCredentials(clientId, accessToken);