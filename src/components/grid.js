import React from 'react';
import { Grid} from 'semantic-ui-react';

const GridLayout = (props) => {
  
    return (
      <div className='grid-layout'>
        <style>{`
          body > div,
          body > div > div,
          body > div > div > div.grid-layout {
            height: 100%;
          }
        `}</style>
        <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='top'>
          <Grid.Column style={{ maxWidth: 1000 }}>
            {props.children}
          </Grid.Column>
        </Grid>
      </div>
    )
}

export default GridLayout


