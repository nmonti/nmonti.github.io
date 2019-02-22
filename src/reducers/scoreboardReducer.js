export const scoreboardReducer = (state = [], action) => {
  switch (action.type) {
    case 'GET_NBA_SCORES':
      return {scores: action.scores};
    default:
      return state;
  }
}