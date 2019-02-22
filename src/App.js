import React, { Component } from 'react';
import PropTypes from 'prop-types';
import logo from './logo.svg';
import './App.css';
import { fetchNBAScores } from './actions/scoreboardActions';
import { connect } from 'react-redux';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      scores: []
    };

    this.getScores = this.getScores.bind(this);
  }

  async componentDidMount() {
    await this.props.fetchNBAScores();
  }

  getScores() {
    if (this.props.scores.length === 0) {
      return "";
    } else {
      return this.props.scores.games[0].hTeam.score;
    }
  }

  render() {
    const scores = this.getScores();
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {scores}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
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
  scores: state.scores.scores
});

const mapDispatchToProps = dispatch => {
  return {
    fetchNBAScores: () => {
      dispatch(fetchNBAScores());
    }
  };
};



export default connect(mapStateToProps, mapDispatchToProps)(App);
