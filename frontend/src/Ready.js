import React, { Component } from 'react';
import './Ready.css';

class Ready extends Component {
  render() {
    let { currentPlayer, playerList } = this.props;

    let joinList = [];
    for (let player in playerList) {
      joinList.push(
        <h5 className="join-notice" key={playerList[player].player}>
          <span style={{ color: playerList[player].color }}>
            {playerList[player].color.toUpperCase()}
          </span>{' '}
          has joined{'   '}
          {playerList[player].isReady ? (
            // <img src="../public/ready.jpg" />
            <img
              src="https://www.carepatrol.com/wp-content/uploads/2017/09/icond.jpg"
              height="20px"
              alt="ready"
            />
          ) : (
            undefined
          )}
        </h5>
      );
    }

    return (
      <div className="Ready">
        <h1 className="my-3" id="title">
          Devolve
        </h1>
        <h1 className="join-notice my-3">
          You are{' '}
          {currentPlayer.player === 'playerBig' ? (
            <span>
              <span style={{ color: currentPlayer.color }}>THE BEAST</span>
              <h4>Chase down your prey!</h4>
            </span>
          ) : (
            <span>
              <span style={{ color: currentPlayer.color }}>
                {currentPlayer.color.toUpperCase()}
              </span>
              <h4>Escape from THE BEAST!</h4>
            </span>
          )}
        </h1>

        <h4>All players must be ready before game can start</h4>

        {joinList}

        {!playerList[currentPlayer.player].isReady ? (
          <button
            className="ready-button btn btn-primary btn-lg my-3 mx-3"
            onClick={this.props.handleReady}
          >
            Ready
          </button>
        ) : (
          <button
            className="ready-button btn btn-danger btn-lg my-3 mx-3"
            onClick={this.props.handleReady}
          >
            Ready
          </button>
        )}

        {!this.props.playersReady ? (
          <button className="start-button btn btn-success btn-lg my-3" disabled>
            Start the Chase
          </button>
        ) : (
          <button
            className="start-button btn btn-success btn-lg my-3"
            onClick={this.props.handleStart}
          >
            Start the Chase
          </button>
        )}
      </div>
    );
  }
}

export default Ready;
