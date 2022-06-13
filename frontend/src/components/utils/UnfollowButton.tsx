import Button from '@mui/material/Button';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

type Props = {
  onClick: () => void
}

const UnfollowButton: React.FC<Props> = (props) => {
  return (
    <Button
      onClick={props.onClick}
      variant="contained"
      color='success'
      startIcon={<PersonRemoveIcon />}
    >フォロー中
    </Button>
  );
}

export default UnfollowButton