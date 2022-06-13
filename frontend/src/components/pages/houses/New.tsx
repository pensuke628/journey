import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// MUIのimport
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import CottageIcon from '@mui/icons-material/Cottage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ReactHooksFormのimport
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// interfaceのimport
import { HouseData } from "interfaces/index";

// バリデーションルールのimport
import { houseSchema } from "schema/house";

const HouseNew: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<HouseData>({
    resolver: yupResolver(houseSchema)
  });

  const navigate = useNavigate();

  const createHouse = async(data: HouseData) => {
    const url: string = "http://localhost:3010/api/v1/houses";
    try {
      const res = await axios.post(url, data);
      console.log('onSubmit:', data);
      console.log('response:', res);
      navigate('/houses', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error)){
        console.log("AxiosError!");
        console.log(error);
      }
    }
  }

  return (
    <Container>
      <Box
        component="form"
        sx = {{
          '& .MuiTextField-root': { m: 1, width: '90%' },
          display: "flex-column",
          textAlign: "center"
        }}
      >
        <Typography
          variant="h3"
          sx = {{ mt:2 }}
        >
          施設の新規登録
        </Typography>
        <TextField
          required
          label="施設名"
          // スプレッド構文を用いている
          {...register('name')}
          error={"name" in errors}
          helperText={errors.name?.message}
        />
        <TextField
          type="number"
          label="郵便番号"
          {...register('postal_code')}
          error={"postal_code" in errors}
          helperText={errors.postal_code?.message}
        />
        <TextField
          required
          label="都道府県名"
          {...register('prefectures')}
          error={"prefectures" in errors}
          helperText={errors.prefectures?.message}
        />
        <TextField
          label="都道府県以降の住所"
          {...register('municipalities')}
        />
        <TextField
          label="施設のイメージ画像"
          {...register('image')}
        />
        <TextField
          label="ひとこと"
          {...register('profile')}
        />
        <TextField
          label="電話番号"
          {...register('phone_number')}
        />
        <TextField
          label="連絡先メールアドレス"
          {...register('email')}
        />
        <TextField
          label="関連サイト"
          {...register('related_website')}
        />
        <TextField
          label="料金"
          {...register('price')}
        />
        <TextField
          label="期間"
          {...register('period')}
        />
        <TextField
          label="チェックイン時刻"
          {...register('check_in_time')}
        />
        <TextField
          label="チェックアウト時刻"
          {...register('check_out_time')}
        />
        <TextField
          label="収容人数"
          {...register('capacity')}
        />
        <TextField
          label="駐車場"
          {...register('parking')}
        />
        <TextField
          label="風呂"
          {...register('bath')}
        />
        <TextField
          label="買い物"
          {...register('shopping')}
        />
        <TextField
          label="備考"
          {...register('note')}
        />
        <Button
          component={Link}
          to="/houses"
          variant="contained"
          startIcon={<ArrowBackIcon />}
         sx = {{ m:2 }}
        >
          一覧に戻る
        </Button>
        <Button
          variant="contained"
          startIcon={<CottageIcon />}
          // handleSubmitは、フォームへの入力を検証した上で、onSubmitを呼び出す
          onClick={handleSubmit(createHouse)}
          sx = {{ m:2 }}
        >
          新規登録
        </Button>
      </Box>
    </Container>
  );
}

export default HouseNew;