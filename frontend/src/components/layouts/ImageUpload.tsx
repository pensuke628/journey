import React, { useState } from 'react';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

import ClearIcon from '@mui/icons-material/Clear';

interface ImagesUploadProps {
  name: string;
  componentRef?: (instance: HTMLInputElement | null) => void;
  images: File[];
  setImages: (files: File[]) => void;
}

const Input = styled('input')({
  display: 'none',
});

const styles = {
}


const ImageUpload: React.FC<ImagesUploadProps> = ({
  name,
  componentRef,
  images,
  setImages,
}: ImagesUploadProps): React.ReactElement => {
  const [isSameError, setIsSameError] = useState(false);
  const [isNumberError, setIsNumberError] = useState(false);
  const [isFileTypeError, setIsFileTypeError] = useState(false);

  const resetErrors = () => {
    setIsSameError(false);
    setIsNumberError(false);
    setIsFileTypeError(false);
  };

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null || event.target.files.length === 0) {
      return;
    }
    const files = Object.values(event.target.files).concat();
    // 初期化することで同じファイルを連続で選択してもonChagngeが発動するように設定し、画像をキャンセルしてすぐに同じ画像を選ぶ動作に対応
    event.target.value = "";
    resetErrors();

    const pickedImages = files.filter((file) => {
      if (
        ![
          'image/gif',
          'image/jpeg',
          'image/png',
          'image/bmp',
          'image/svg+xml',
        ].includes(file.type)
      ) {
        setIsFileTypeError(true);
        return false;
      }

      // 同じファイルが存在しているか確認する
      const existsSameSize = images.some((image) => image.size === file.size);
      if (existsSameSize) {
        setIsSameError(true);
        return false;
      }

      return true;
    });

    if (pickedImages.length === 0) {
      return;
    }

    const concatImages = images.concat(pickedImages);
    if (concatImages.length >= 4) {
      setIsNumberError(true);
    }
    setImages(concatImages.slice(0, 3));
  };

  const handleCancel = (photoIndex: number) => {
      resetErrors();
      const modifyPhotos = images.concat();
      modifyPhotos.splice(photoIndex, 1);
      setImages(modifyPhotos);
  };

  return (
    <>
      <ImageList cols={3} rowHeight={164}>
        {[...Array(3)].map((_: number, index: number) =>
          index < images.length ? (
              <ImageListItem key={index}>
                <ImageListItemBar
                  sx={{
                    background: 'rgba(0,0,0,0)',
                  }}
                  position='top'
                  actionIcon={
                    <IconButton
                      onClick={() => handleCancel(index)}
                    >
                      <ClearIcon/>              
                    </IconButton>
                  }
                />
                <img
                  src={URL.createObjectURL(images[index])}
                  alt={`あなたの写真 ${index + 1}`}
                />
              </ImageListItem>
          ) : (
            <label htmlFor={name} key={index}>
              {/* <PhotoSample number={index + 1} /> */}
            </label>
          )
          )}
      </ImageList>
      {isSameError && (
        <p>※既に選択された画像と同じものは表示されません</p>
      )}
      {isNumberError && (
        <p>※3枚を超えて選択された画像は表示されません</p>
      )}
      {isFileTypeError && (
        <p>※jpeg, png, bmp, gif, svg以外のファイル形式は表示されません</p>
      )}

      <div>
        <label htmlFor='file-upload-button'>
          <Input accept="image/*" id='file-upload-button' multiple type='file' onChange={handleFile}/>
          <Button variant='contained' component='span'>
            写真追加
          </Button>
        </label>
      </div>
    </>
  );
};

export default ImageUpload;