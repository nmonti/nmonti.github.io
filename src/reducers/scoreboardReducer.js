export const scoreboardReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_NBA_SCORES':
      return action.scores;
    default:
      return state;
  }
}