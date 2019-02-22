import { combineReducers } from "redux";
import { scoreboardReducer } from './scoreboardReducer';

const rootReducer = combineReducers({
    scores: scoreboardReducer
});

export default rootReducer;