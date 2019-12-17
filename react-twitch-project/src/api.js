import axios from 'axios';

let api = axios.create({
    mode: 'cors',
    headers: {
        'Client-ID': '5fdbacty8xdyou6xuh0k095ad72a20',
        'Accept': 'application/vnd.twitchtv.v5+json'
    }
})

export default api; 