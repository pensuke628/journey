import React from 'react';

import styled from '@mui/system/styled';
import Button from '@mui/material/Button';

type CustomButtonProps = {
  text: string
  sx: {
    top: string
    left: string
    display: () => string
  }
  onClick?: (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const PrefectureButton = styled(Button)({
  position: 'absolute',
  color: 'black',
  fontWeight: 'bold',
})

const PrefectureSelectButton = (props: CustomButtonProps) => {
  const { onClick } = props

  return(
    <PrefectureButton
      value={props.text}
      onClick={onClick}
      sx={props.sx}
    >
      {props.text}
    </PrefectureButton>
  )
}

export default PrefectureSelectButton