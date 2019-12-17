// useState and useEffect are React Hook imports to avoid setting this up as
// a class function 

import React, { useState, useEffect } from 'react';
// pull axios from earlier setup of api
import api from '../api'
import { Link } from 'react-router-dom';

function Games() {
    const [games, setGames] = useState([]);

    // equivalent of componentDidMount
    useEffect(() => {
        const fetchData = async () => {
            const result = await api.get('https://api.twitch.tv/kraken/games/top')
            // console.log(result.data.top.forEach(game => console.log(game.game)))
            setGames(result.data.top);
        };

        fetchData();

    })

    return (
        <div>
            <h1>Most Popular Games</h1>
            <div className='row'>
                {
                    games.map(game => (
                        <div className="col-lg-4 col-md-6 col-sm-12 mt-5">
                            <div className="card">
                                <img className="card-img-top" src={game.game.box.large} />
                                <div className="card-body">
                                    <h5 className="card-title">{game.game.name}</h5>
                                    <button className="btn btn-success">
                                        <Link className="link" to={{
                                            pathname: 'game/' + game.game.name,
                                            state: {
                                                gameID: game.game._id
                                            }
                                        }}>{game.game.name} streams {game.game.popularity}</Link>
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))
                }
                {/* {games.map(game => {
                    // let { name, box, popularity, _id } = game.game
                    < div className="col-lg-4 col-md-6 col-sm-12 mt-5" >
                        <div className="card">
                            <img className="card-img-top" src={game.game.box.medium} />
                            <div className="card-body">
                                <h5 className="card-title">{game.game.name}</h5>
                                <button className="btn btn-success">
                                    <Link
                                        className="link"
                                        to={{
                                            pathname: "game/" + game.game.name,
                                            state: {
                                                gameID: game.game._id
                                            }
                                        }}
                                    >
                                        {game.game.name} streams{" "}
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>

                } */}
            </div>
        </div >
    )
}

export default Games