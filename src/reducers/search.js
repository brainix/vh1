/*---------------------------------------------------------------------------*\
 |  search.js                                                                |
\*---------------------------------------------------------------------------*/

const searchReducer = (state = { query: '', uuid: null, results: [], selected: null }, action) => {
  switch (action.type) {
    case 'search/setQuery':
      return { ...state, query: action.query, uuid: action.uuid, selected: null };
    case 'search/showResults':
      return { ...state, results: action.results, selected: null };
    case 'search/setSelected':
      return { ...state, selected: action.index };
    case 'search/clearSearch':
      return { query: '', results: [], selected: null };
    default:
      return state;
  }
};

export default searchReducer;
