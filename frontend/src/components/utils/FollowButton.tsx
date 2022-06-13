import Button from '@mui/material/Button';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

type Props = {
  onClick: () => void
}

const FollowButton: React.FC<Props> = (props) => {
  return (
    <Button
      onClick={props.onClick}
      variant="contained"
      startIcon={<PersonAddAltIcon />}
    >フォローする
    </Button>
  );
}

export default FollowButton