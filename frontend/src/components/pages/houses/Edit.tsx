import React from "react";
import axios from "axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

// MUIのimport
import {
  Container,
  Box,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import UpdateIcon from '@mui/icons-material/Update';

// ReactHooksFormのimport
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

// interfaceのimport
import { HouseData, Tag } from "interfaces/index";

// バリデーションルールのimport
import { houseSchema } from "schema/house";

const HouseEdit: React.FC = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<HouseData>({
    resolver: yupResolver(houseSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const [house, setHouse] = React.useState<HouseData>(location.state as HouseData);

  const updateHouse = async(data: HouseData) => {
    const id = house.id
    console.log("動作確認です");
    console.log(data);
    await axios.put(`http://localhost:3010/api/v1/houses/${id}`, data )
                  .then(res => {
                    console.log('onSubmit:', data);
                    navigate(`/houses/${id}`, { replace: true })
                  })
                  .catch(error => {
                    console.log(error.response.statusText);
                  })
  };

  const returnTags = (taglist: Tag[] |  undefined) => {
    if (taglist) {
      const tags = taglist.map(tag => tag.name);
      // 配列要素をstringで展開し、,を除いたものを返す
      return tags.toString().replace(/,/g," ");
    }
  };
  return (
    <form onSubmit={handleSubmit(updateHouse)}>
      <Container>
        <Box
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
            施設情報を更新する
          </Typography>
          <Controller
            name="name"
            control={control}
            defaultValue={ house.name }
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="施設名"
                error={"name" in errors}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            name="postal_code"
            control={control}
            defaultValue={ house.postal_code || ""}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="郵便番号"
                error={"postal_code" in errors}
                helperText={errors.postal_code?.message}
              />
            )}
          />
          <Controller
            name="prefectures"
            control={control}
            defaultValue={ house.prefectures }
            render={({ field }) => (
              <TextField
                {...field}
                required
                label="都道府県名"
                error={"prefectures" in errors}
                helperText={errors.prefectures?.message}
              />
            )}
          />
          <Controller
            name="municipalities"
            control={control}
            defaultValue={ house.municipalities || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="都道府県以降の住所"
              />
            )}
          />
          <Controller
            name="image"
            control={control}
            defaultValue={ house.image || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="施設のイメージ画像"
              />
            )}
          />
          <Controller
            name="profile"
            control={control}
            defaultValue={ house.profile || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="ひとこと"
              />
            )}
          />
          <Controller
            name="phone_number"
            control={control}
            defaultValue={ house.phone_number || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="電話番号"
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            defaultValue={ house.email || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="連絡先メールアドレス"
              />
            )}
          />
          <Controller
            name="related_website"
            control={control}
            defaultValue={ house.related_website || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="関連サイト"
              />
            )}
          />
          <Controller
            name="price"
            control={control}
            defaultValue={ house.price || ""}
            render={({ field }) => (
              <TextField
                {...field}
                label="料金"
              />
            )}
          />
          <Controller
            name="period"
            control={control}
            defaultValue={ house.period || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="期間"
              />
            )}
          />
          <Controller
            name="check_in_time"
            control={control}
            defaultValue={ house.check_in_time || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="チェックイン時刻"
              />
            )}
          />
          <Controller
            name="check_out_time"
            control={control}
            defaultValue={ house.check_out_time || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="チェックアウト時刻"
              />
            )}
          />
          <Controller
            name="capacity"
            control={control}
            defaultValue={ house.capacity || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="収容人数"
              />
            )}
          />
          <Controller
            name="parking"
            control={control}
            defaultValue={ house.parking || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="駐車場"
              />
            )}
          />
          <Controller
            name="bath"
            control={control}
            defaultValue={ house.bath || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="風呂"
              />
            )}
          />
          <Controller
            name="shopping"
            control={control}
            defaultValue={ house.shopping || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="買い物"
              />
            )}
          />
          <Controller
            name="note"
            control={control}
            defaultValue={ house.note || "" }
            render={({ field }) => (
              <TextField
                {...field}
                label="備考"
              />
            )}
          />
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="タグ"
                defaultValue={returnTags(house.tags)}
              />
            )}
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
            type="submit"
            variant="contained"
            startIcon={<UpdateIcon />}
            // handleSubmitは、フォームへの入力を検証した上で、onSubmitを呼び出す
            sx = {{ m:2 }}
          >
            情報を更新する
          </Button>
        </Box>
      </Container>
    </form>
  );
}

export default HouseEdit;