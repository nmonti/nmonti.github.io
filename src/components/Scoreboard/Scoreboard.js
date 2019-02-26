import React, { Component } from 'react'
import { PropTypes } from 'prop-types';

export default class Scoreboard extends Component {
  constructor(props) {
    super(props);

    const stats = this.format(props.stats);

    this.state = {
      stats
    };

    this.format = this.format.bind();
  }

  format(stats = {}) {
    if (Object.keys(stats).length > 0) {
      return {
        city: stats.arena.city,
        home: {
          team: stats.hTeam.triCode,
          score: stats.hTeam.score
        },
        away: {
          team: stats.vTeam.triCode,
          score: stats.vTeam.score
        }
      }
    } else {
      return {};
    }
  }
  
  render() {
    return (
      <div>
        {this.state.stats.city}
      </div>
    )
  }
}

Scoreboard.propTypes = {
  league: PropTypes.string,
  stats: PropTypes.object
};

Scoreboard.defaultProps = {
  city: "Boston",
  home: {
    team: "BOS",
    score: 124
  },
  away: {
    team: "LAL",
    score: 70
  }
}
