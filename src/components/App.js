import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../style/App.css';
import { fetchNBAScores } from '../actions/scoreboardActions';
import { connect } from 'react-redux';
import Scoreboard from './Scoreboard/Scoreboard';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scores: []
    };

    this.getScoreboards = this.getScoreboards.bind(this);
  }

  async componentDidMount() {
    await this.props.fetchNBAScores();
  }

  getScoreboards() {
    const scores = this.props.scores;

    if (scores.length > 0) {
      return scores.map(score => (
        <Scoreboard league="NBA" stats={score} />
      ));
    } else {
      return '';
    }
  }

  render() {
    return (
      <div className="App">
        {this.getScoreboards()}
      </div>
    );
  }
}

App.propTypes = {
  scores: PropTypes.array
};

App.defaultProps = {
  scores: []
};

const mapStateToProps = state => ({
  scores: state.scores.games
});

const mapDispatchToProps = dispatch => {
  return {
    fetchNBAScores: () => {
      dispatch(fetchNBAScores());
    }
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(App);
