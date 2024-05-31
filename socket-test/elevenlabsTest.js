const axios = require("axios");
const args = process.argv.slice(2);
const voiceName = args[0]
const txt2SpeechString = args[1]
const dotenv = require("dotenv")

const key = process.env.KEY

const domain = "https://api.elevenlabs.io"
let voice_id
const txt2SpeechPath = `/v1/text-to-speech/${voice_id}/`
const voicesPath = `/v1/voices/`



// grabs voice id from elevenlabs api
// using known name of voice
getVoice = async (voiceName) => {
    const url = `${domain}${voicesPath}`
    let voice_id
    try {


        response = await axios.get(url, {
            headers: {
                "accept": "application/json",
                "xi-api-key": key,
            },
        })
        voice = response.data.voices.filter(voice => voice.name === voiceName)
        // returns voice_id to use for whatever application needs
        return voice[0].voice_id
    } catch (error) {
        console.log("Error :", error)

    }
}

// response includes .mp3 file of text to speech
// string is whatever needs to be placed into text to speech
// voiceName is the name of the voice to use
// model_id is currently hard-coded
// other models can do other languages
const getText2Speech = async (string, voiceName) => {

    // grab voice id from function above to inject into url
    const voice_id = await getVoice(voiceName)
    const url = `${domain}/v1/text-to-speech/${voice_id}?optimize_streaming_latency=0`
    try {
        response = await axios({
            url: url,
            method: "post",
            data:
            {
                text: string,
                model_id: "eleven_monolingual_v1",
                voice_settings: {
                    stability: 0,
                    similarity_boost: 0,
                    style: 0.5,
                    use_speaker_boost: true
                }
            },
            headers: {
                "accept": "audio/mpeg",
                "Content-Type": "application/json",
                "xi-api-key": key,
            }
        })
        console.log(response)
    } catch (error) {
        console.log("Error :", error)
        console.log("Url: ", url)


    }
    return voice_id
}

module.exports.default = getText2Speech
// getText2Speech(txt2SpeechString, voiceName)




