import React, { useState } from 'react';

// MUIのimport
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

// componentのimport
import PrefectureSelectButton from 'components/utils/PrefectureSelectButton';

// 画像ファイルのimport
import JapanMap from '../../images/JapanMap.png';
import TohokuMap from '../../images/TohokuMap.png';
import KantoMap from '../../images/KantoMap.png';
import ChubuMap from '../../images/ChubuMap.png';
import KinkiMap from '../../images/KinkiMap.png';
import ChugokuMap from '../../images/ChugokuMap.png';
import ShikokuMap from '../../images/ShikokuMap.png';
import KyushuMap from '../../images/KyushuMap.png';

type Props = {
  handleClick:(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const Tohoku: string[] = ['青森', '秋田', '岩手', '山形', '宮城', '福島'];
const Kanto: string[] = ['茨城', '栃木', '群馬', '千葉', '埼玉', '東京', '神奈川'];
const Chubu: string[] = ['新潟', '富山', '石川', '福井', '長野', '岐阜', '山梨', '静岡', '愛知'];
const Kinki: string[] = ['滋賀', '京都', '兵庫', '三重', '奈良', '大阪', '和歌山'];
const Chugoku: string[] = ['鳥取', '島根', '岡山', '広島', '山口'];
const Shikoku: string[] = ['香川', '愛媛', '徳島', '高知'];
const Kyushu: string[] = ['福岡', '佐賀', '長崎', '大分', '熊本', '宮崎', '鹿児島'];

const JapanMapComponent = (props: Props) => {
  const [backgroundImage, setBackgroundImage] = useState(JapanMap);
  const [Area, setArea] = useState('Japan');
  const {handleClick} = props

  const PrefectureListButton = (props: {text: string}) => {
    return (
      <Button
        color='inherit'
        value={props.text}
        onClick={(event) => handleClick(event)}
      >
        <Typography>
          {props.text}
        </Typography>
      </Button>
    );
  }



  const setAreaButton = () => {
    if (Area === 'Japan') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfTohokuButton = () => {
    if (Area === 'Tohoku') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfKantoButton = () => {
    if (Area === 'Kanto') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfChubuButton = () => {
    if (Area === 'Chubu') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfKinkiButton = () => {
    if (Area === 'Kinki') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfChugokuButton = () => {
    if (Area === 'Chugoku') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfShikokuButton = () => {
    if (Area === 'Shikoku') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setPrefectureOfKyushuButton = () => {
    if (Area === 'Kyushu') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const setAllPrefectureButton = () => {
    if (Area !== 'Japan') {
      return 'block';
    } else {
      return 'none';
    }
  }

  const styles = {
    hokkaido: {
      position: 'absolute',
      top: '12%',
      left: '67%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton,
    },

    // 東北
    tohoku: {
      position: 'absolute',
      top: '43%',
      left: '57%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton,
    },

    aomori: {
      // position: 'absolute',
      top: '12%',
      left: '47%',
      // color: 'black',
      // fontWeight: 'bold',
      display: setPrefectureOfTohokuButton,
    },

    akita: {
      position: 'absolute',
      top: '33%',
      left: '40%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfTohokuButton,
    },

    iwate: {
      position: 'absolute',
      top: '33%',
      left: '57%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfTohokuButton,
    },

    yamagata: {
      position: 'absolute',
      top: '60%',
      left: '37%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfTohokuButton,
    },

    miyagi: {
      position: 'absolute',
      top: '60%',
      left: '50%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfTohokuButton,
    },

    fukushima: {
      position: 'absolute',
      top: '80%',
      left: '40%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfTohokuButton,
    },

    // 関東
    kanto: {
      position: 'absolute',
      top: '59%',
      left: '55%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },

    ibaraki: {
      position: 'absolute',
      top: '32%',
      left: '70%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    tochigi: {
      position: 'absolute',
      top: '15%',
      left: '50%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    gunma: {
      position: 'absolute',
      top: '23%',
      left: '20%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    chiba: {
      position: 'absolute',
      top: '60%',
      left: '70%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    saitama: {
      position: 'absolute',
      top: '45%',
      left: '33%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    tokyo: {
      position: 'absolute',
      top: '59%',
      left: '40%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    kanagawa: {
      position: 'absolute',
      top: '71%',
      left: '35%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKantoButton,
    },

    // 中部
    chubu: {
      position: 'absolute',
      top: '59%',
      left: '45%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },

    nigata: {
      position: 'absolute',
      top: '25%',
      left: '70%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    toyama: {
      position: 'absolute',
      top: '43%',
      left: '37%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    ishikawa: {
      position: 'absolute',
      top: '45%',
      left: '25%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    fukui: {
      position: 'absolute',
      top: '60%',
      left: '17%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    nagano: {
      position: 'absolute',
      top: '55%',
      left: '52%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    gifu: {
      position: 'absolute',
      top: '63%',
      left: '34%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    yamanashi: {
      position: 'absolute',
      top: '67%',
      left: '65%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    shizuoka: {
      position: 'absolute',
      top: '80%',
      left: '60%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    aichi: {
      position: 'absolute',
      top: '82%',
      left: '36%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChubuButton,
    },

    // 近畿
    kinki: {
      position: 'absolute',
      top: '67%',
      left: '34%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },

    shiga: {
      position: 'absolute',
      top: '25%',
      left: '65%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    kyoto: {
      position: 'absolute',
      top: '25%',
      left: '45%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    hyogo: {
      position: 'absolute',
      top: '20%',
      left: '16%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    mie: {
      position: 'absolute',
      top: '48%',
      left: '72%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    nara: {
      position: 'absolute',
      top: '58%',
      left: '55%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    osaka: {
      position: 'absolute',
      top: '45%',
      left: '42%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    wakayama: {
      position: 'absolute',
      top: '75%',
      left: '36%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKinkiButton,
    },

    // 中国
    chugoku: {
      position: 'absolute',
      top: '65%',
      left: '20%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },

    tottori: {
      position: 'absolute',
      top: '12%',
      left: '78%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChugokuButton,
    },

    shimane: {
      position: 'absolute',
      top: '30%',
      left: '40%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChugokuButton,
    },

    okayama: {
      position: 'absolute',
      top: '40%',
      left: '75%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChugokuButton,
    },

    hiroshima: {
      position: 'absolute',
      top: '52%',
      left: '46%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChugokuButton,
    },

    yamaguchi: {
      position: 'absolute',
      top: '70%',
      left: '12%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfChugokuButton,
    },
    
    // 四国
    shikoku: {
      position: 'absolute',
      top: '72%',
      left: '23%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },
    
    kagawa: {
      position: 'absolute',
      top: '18%',
      left: '65%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfShikokuButton,
    },

    ehime: {
      position: 'absolute',
      top: '40%',
      left: '20%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfShikokuButton,
    },

    tokushima: {
      position: 'absolute',
      top: '35%',
      left: '75%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfShikokuButton,
    },

    kochi: {
      position: 'absolute',
      top: '50%',
      left: '40%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfShikokuButton,
    },

    // 九州
    kyushu: {
      position: 'absolute',
      top: '76%',
      left: '7%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },

    fukuoka: {
      position: 'absolute',
      top: '10%',
      left: '50%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    saga: {
      position: 'absolute',
      top: '13%',
      left: '30%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    nagasaki: {
      position: 'absolute',
      top: '25%',
      left: '25%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    oita: {
      position: 'absolute',
      top: '20%',
      left: '72%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    kumamoto: {
      position: 'absolute',
      top: '35%',
      left: '50%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    miyazaki: {
      position: 'absolute',
      top: '45%',
      left: '65%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    kagoshima: {
      position: 'absolute',
      top: '50%',
      left: '40%',
      color: 'black',
      fontWeight: 'bold',
      display: setPrefectureOfKyushuButton,
    },

    // 沖縄
    okinawa: {
      position: 'absolute',
      top: '82%',
      left: '67%',
      color: 'black',
      fontWeight: 'bold',
      display: setAreaButton
    },

    allPrefectures: {
      position: 'absolute',
      top: '-3%',
      left: '0%',
      color: 'black',
      fontWeight: 'bold',
      display: setAllPrefectureButton,
    },
  };
  
  const handleSetTohokuImage = () => {
    setBackgroundImage(TohokuMap);
    setArea('Tohoku');
  };
  
  const handleSetKantoImage = () => {
    setBackgroundImage(KantoMap);
    setArea('Kanto');
  };
  
  const handleSetChubuImage = () => {
    setBackgroundImage(ChubuMap);
    setArea('Chubu');
  };
  
  const handleSetKinkiImage = () => {
    setBackgroundImage(KinkiMap);
    setArea('Kinki');
  };
  
  const handleSetChugokuImage = () => {
    setBackgroundImage(ChugokuMap);
    setArea('Chugoku');
  };
  
  const handleSetShikokuImage = () => {
    setBackgroundImage(ShikokuMap);
    setArea('Shikoku');
  };
  
  const handleSetKyushuImage = () => {
    setBackgroundImage(KyushuMap);
    setArea('Kyushu');
  };

  const handleSetJapanImage = () => {
    setBackgroundImage(JapanMap);
    setArea('Japan');
  };

  return (
    <Box sx={{display: 'flex'}}>
      <Box
        sx={{
          width: '500px'
        }}
      >
        <Box>
          <Typography>北海道</Typography>
          <PrefectureListButton text='北海道'/>
        </Box>
        <Box>
          <Typography>東北</Typography>
          <Box>
          {
            Tohoku.map((pref) => {
              return (
                <PrefectureListButton
                text={pref}
                />
                )
              })
            }
          </Box>
        </Box>
        <Box>
          <Typography>関東</Typography>
          {
            Kanto.map((pref) => {
              return (
                <PrefectureListButton
                  text={pref}
                />
              )
            })
          }
        </Box>
        <Box>
          <Typography>中部</Typography>
          {
            Chubu.map((pref) => {
              return (
                <PrefectureListButton
                  text={pref}
                />
              )
            })
          }
        </Box>
        <Box>
          <Typography>近畿</Typography>
          {
            Kinki.map((pref) => {
              return (
                <PrefectureListButton
                  text={pref}
                />
              )
            })
          }
        </Box>
        <Box>
          <Typography>中国</Typography>
          {
            Chugoku.map((pref) => {
              return (
                <PrefectureListButton
                  text={pref}
                />
              )
            })
          }
        </Box>
        <Box>
          <Typography>四国</Typography>
          {
            Shikoku.map((pref) => {
              return (
                <PrefectureListButton
                  text={pref}
                />
              )
            })
          }
        </Box>
        <Box>
          <Typography>九州</Typography>
          {
            Kyushu.map((pref) => {
              return (
                <PrefectureListButton
                  text={pref}
                />
              )
            })
          }
        </Box>
        <Box>
          <Typography>沖縄</Typography>
          <PrefectureListButton text='沖縄'/>
        </Box>
      </Box>
      <Box
        sx={{
          display: {
            xs: 'none', sm: 'none', md: 'block'
          },
          position: 'relative',
          height: '410px',
          Width: '550px',
        }}
      >
        <Box
          component='img'
          width='508px'
          height='400px'
          src={backgroundImage}
        />

        {/* 北海道 */}
        <PrefectureSelectButton
          text='北海道'
          sx={styles.hokkaido}
          onClick={(event) => props.handleClick(event) }
        />

        {/* 東北地方 */}
        <Button
          onClick={handleSetTohokuImage}
          sx={styles.tohoku}
        >
          東北
        </Button>
        <PrefectureSelectButton
          text='青森'
          sx={styles.aomori}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='秋田'
          sx={styles.akita}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='岩手'
          sx={styles.iwate}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='山形'
          sx={styles.yamagata}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='宮城'
          sx={styles.miyagi}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='福島'
          sx={styles.fukushima}
          onClick={(event) => props.handleClick(event) }
        />
        
        {/* 関東地方 */}
        <Button
          onClick={handleSetKantoImage}
          sx={styles.kanto}
        >
          関東
        </Button>
        <PrefectureSelectButton
          text='茨城'
          sx={styles.ibaraki}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='栃木'
          sx={styles.tochigi}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='群馬'
          sx={styles.gunma}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='千葉'
          sx={styles.chiba}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='埼玉'
          sx={styles.saitama}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='東京'
          sx={styles.tokyo}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='神奈川'
          sx={styles.kanagawa}
          onClick={(event) => props.handleClick(event) }
        />

        {/* 中部地方 */}
        <Button
          onClick={handleSetChubuImage}
          sx={styles.chubu}
        >
          中部
        </Button>
        <PrefectureSelectButton
          text='新潟'
          sx={styles.nigata}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='富山'
          sx={styles.toyama}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='石川'
          sx={styles.ishikawa}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='福井'
          sx={styles.fukui}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='長野'
          sx={styles.nagano}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='岐阜'
          sx={styles.gifu}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='山梨'
          sx={styles.yamanashi}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='静岡'
          sx={styles.shizuoka}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='愛知'
          sx={styles.aichi}
          onClick={(event) => props.handleClick(event) }
        />

        {/* 近畿地方 */}
        <Button
          onClick={handleSetKinkiImage}
          sx={styles.kinki}
        >
          近畿
        </Button>
        <PrefectureSelectButton
          text='滋賀'
          sx={styles.shiga}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='京都'
          sx={styles.kyoto}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='兵庫'
          sx={styles.hyogo}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='三重'
          sx={styles.mie}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='奈良'
          sx={styles.nara}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='大阪'
          sx={styles.osaka}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='和歌山'
          sx={styles.wakayama}
          onClick={(event) => props.handleClick(event) }
        />
        
        {/* 中国地方 */}
        <Button
          onClick={handleSetChugokuImage}
          sx={styles.chugoku}
        >
          中国
        </Button>
        <PrefectureSelectButton
          text='鳥取'
          sx={styles.tottori}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='島根'
          sx={styles.shimane}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='岡山'
          sx={styles.okayama}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='広島'
          sx={styles.hiroshima}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='山口'
          sx={styles.yamaguchi}
          onClick={(event) => props.handleClick(event) }
        />

        {/* 四国地方 */}
        <Button
          onClick={handleSetShikokuImage}
          sx={styles.shikoku}
        >
          四国
        </Button>
        <PrefectureSelectButton
          text='香川'
          sx={styles.kagawa}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='愛媛'
          sx={styles.ehime}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='徳島'
          sx={styles.tokushima}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='高知'
          sx={styles.kochi}
          onClick={(event) => props.handleClick(event) }
        />

        {/* 九州地方 */}            
        <Button
          onClick={handleSetKyushuImage}
          sx={styles.kyushu}
        >
          九州
        </Button>
        <PrefectureSelectButton
          text='福岡'
          sx={styles.fukuoka}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='佐賀'
          sx={styles.saga}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='長崎'
          sx={styles.nagasaki}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='大分'
          sx={styles.oita}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='熊本'
          sx={styles.kumamoto}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='宮崎'
          sx={styles.miyazaki}
          onClick={(event) => props.handleClick(event) }
        />
        <PrefectureSelectButton
          text='鹿児島'
          sx={styles.kagoshima}
          onClick={(event) => props.handleClick(event) }
        />

        {/* 沖縄 */}
        <PrefectureSelectButton
          text='沖縄'
          sx={styles.okinawa}
          onClick={(event) => props.handleClick(event) }
        />
        <Button
          onClick={handleSetJapanImage}
          sx={styles.allPrefectures}
        >
          全国へ
        </Button>
      </Box>
    </Box>
  )
};

export default JapanMapComponent;