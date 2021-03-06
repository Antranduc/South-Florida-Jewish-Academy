import React from 'react';
import {
  Checkbox,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  Paper,
} from '@material-ui/core';

// eslint-disable-next-line require-jsdoc
function sortGrades(a, b) {
  const aSplit = a.split('_');
  const bSplit = b.split('_');
  if (aSplit.length === 1 && bSplit.length === 1) {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  } else {
    return aSplit[1] - bSplit[1];
  }
}

// eslint-disable-next-line require-jsdoc
function processOption(s) {
  const list = s.split('_');
  const resultList = [];
  for (let i = 0; i < list.length; i++) {
    resultList.push(list[i][0].toUpperCase() + list[i].substring(1));
  }
  return resultList.join(' ');
}

// eslint-disable-next-line require-jsdoc,react/prop-types,max-len
export default function Filters({filters, updateFilter, filteredLength}) {
  const [selected, setSelected] = React.useState(null);
  if (filters === undefined) {
    return (<div>
      <Paper>
        Filters
      </Paper>
    </div>);
  }
  return (
    <Paper>
    Filters
      {Object.keys(filters).map((filter) => (
        <div key={filter}>
          <div style={{textAlign: 'left', paddingLeft: 10}}>
            {filter[0].toUpperCase().concat(filter.substring(1)).concat(':')}
          </div>
          <List>
            {/* eslint-disable-next-line max-len */}
            {Object.keys(filters[filter]).sort(sortGrades).map((optionKey) => (
              <ListItem
                key={optionKey}
                onClick={
                  () => updateFilter(
                      filter,
                      optionKey,
                      !filters[filter][optionKey],
                  )
                }
                style={{
                  cursor: 'pointer',
                  paddingTop: 1,
                  paddingBottom: 1,
                  backgroundColor: selected === filter + optionKey ?
                    'rgba(211,211,211, 0.7)' :
                    '#ffffff'}}
                onMouseEnter={() => setSelected(filter + optionKey)}
                onMouseLeave={() => setSelected(null)}
              >
                <ListItemIcon
                  style={{cursor: 'pointer'}}
                >
                  <Checkbox
                    edge="start"
                    checked={filters[filter][optionKey]}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{'aria-labelledby': optionKey}}
                  />
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    {processOption(optionKey)}
                  </div>
                </ListItemIcon>
              </ListItem>
            ))}
            {filter === 'grades' && filteredLength === null ?
              // eslint-disable-next-line max-len
              <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                <CircularProgress/>
              </div> : null}
          </List>
        </div>
      ))}
      <div style={{display: 'flex', fontSize: 13, padding: 10}}>
        Displaying {filteredLength} student{filteredLength === 1 ? '' : 's'}.
      </div>
    </Paper>);
}
