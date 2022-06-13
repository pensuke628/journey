import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { OwnerContext } from 'App';

const styles = {
  cardRoot: {
    margin: '0 1rem',
    height: '150px',
    display: 'flex',
    border: '1px solid #000'
  }
}

const OwnerIndex: React.FC = () => {
  const { owneredHouses } = useContext(OwnerContext);

  return (
    <>
      <h1>{`管理施設 全${owneredHouses.length}件`}</h1>
      {owneredHouses.map((house, index) => {
        return (
          <Card key={index} style={styles.cardRoot}>
            <Grid container>
              <Grid item xs={4}>
                <CardMedia
                  component='img'
                  image={house.image}
                  alt='Image for house'
                />
              </Grid>
              <Grid item xs={8}>
                <CardContent>
                  <Typography>
                    <RouterLink to ={`/houses/${house.id}`}>
                      {house.name}
                    </RouterLink>
                  </Typography>
                  <Typography>
                    エリア: {house.prefectures}
                  </Typography>
                  <Typography>
                    タグ:
                  </Typography>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        );
      })}
      <Button
        component={RouterLink}
        to='/owners'
        variant='contained'
        sx = {{ m:2 }}
      >新規登録する</Button>
    </>
  );
}

export default OwnerIndex;