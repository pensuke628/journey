import React from 'react';

// MUIのimport
import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

// 画像のimport
import Feature1 from '../../images/AboutFeature1.jpg';
import Feature2 from '../../images/AboutFeature2.jpg';
import Feature3 from '../../images/AboutFeature3.jpg';

const CustomedCard = styled(Card) ({
  // maxHeight: { sx: '500px', md: '420px'},
})

const CustomedCardContent = styled(CardContent) ({
  textAlign: 'center',
})

const CustromedCardTitle = styled(Typography) ({
  fontWeight: 'bold',
})

const About: React.FC = () => {
  return (
    <Container>
      <Typography
        component='div'
        variant='h2'
        gutterBottom
        textAlign='center'
        sx={{
          py: 3
        }}
      >
        JOURNEYでできること
      </Typography>
      <Grid container justifyContent='center' spacing={4} >
        <Grid item xs={8} lg={6} xl={4}>
          <Card
            elevation={0}
            sx={{
              maxHeight: { md: '420px'},
            }}
          >
            <CardMedia
              component='img'
              image={Feature1}
              sx={{
                height: '220px',
              }}
            />
            <CustomedCardContent>
              <CustromedCardTitle
                variant='h6'
              >
                ハウスを検索
              </CustromedCardTitle>
              <Typography component="p">
                国内のゲストハウスやライダーハウスを検索することができます。
                施設名による検索や、都道府県による検索にも対応しています。お気に入りハウスを保存することもできます！
              </Typography>
            </CustomedCardContent>
          </Card>
        </Grid>
        <Grid item xs={8} lg={6} xl={4}>
          <Card
            elevation={0}
            sx={{
              maxHeight: { md: '420px'},
            }}
          >
            <CardMedia
              component='img'
              src={Feature2}
              alt='feature2'
              sx={{
                height: '220px'
              }}
            />
            <CustomedCardContent>
              <CustromedCardTitle
                variant='h6'
              >
                口コミを投稿
              </CustromedCardTitle>
              <Typography component="p">
                訪れたゲストハウスやライダーハウスがあれば、旅の思い出とともに口コミを投稿してみましょう。
                あなたの口コミを見た旅人がその宿に行ってみたくなると良いですね！
              </Typography>
            </CustomedCardContent>
          </Card>
        </Grid>
        <Grid item xs={8} lg={6} xl={4}>
          <Card
            elevation={0}
            sx={{
              maxHeight: { md: '420px'},
            }}
          >
            <CardMedia
              component='img'
              src={Feature3}
              alt='feature3'
              sx={{
                height: '220px'
              }}
            />
            <CustomedCardContent>
              <CustromedCardTitle
                variant='h6'
              >
                他のユーザーと交流
              </CustromedCardTitle>
              <Typography component="p">
                他のライダーの口コミをいいねしたり、知り合ったライダーをフォローして交流することができます。
                素敵な思い出とともに、仲間も増えるといいですね！
              </Typography>
            </CustomedCardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default About;