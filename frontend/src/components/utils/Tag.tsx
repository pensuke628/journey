import React from 'react';

import Button from '@mui/material/Button';
import TagIcon from '@mui/icons-material/Tag';

type CustomTagProps = {
  text: string
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const Tag = (props: CustomTagProps) => {
  const { onClick } = props

  return(
    <Button
      value={props.text}
      startIcon={<TagIcon/>}
      onClick={onClick}
    >
      {props.text}
    </Button>
  )
}

export default Tag