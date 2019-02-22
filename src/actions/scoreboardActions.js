export const GET_NBA_SCORES = 'GET_NBA_SCORES';

const getNBAScores = (scores) => {
  return {
    type: 'GET_NBA_SCORES',
    scores
  }
};

export const fetchNBAScores = () => {

  return async (dispatch) => {
    const scores = require('../mock/scoreboard.json');
    const json = await Promise.resolve(scores);

    return dispatch(getNBAScores(json));

  }
}

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  let month = d.getMonth() + 1;
  month = `0${month}` ? month < 10 : month;
  const day = d.getDate();

  return `${year}${month}${day}`;
}