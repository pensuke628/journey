import Button from '@mui/material/Button';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

type Props = {
  onClick: () => void
}

const UnbookmarkButton: React.FC<Props> = (props) => {
  return (
    <Button
      variant='contained'
      color='success'
      onClick={props.onClick}
      startIcon={<BookmarkAddIcon />}
      sx= {{ my: 1 }}
    >お気に入り中
    </Button>
  );
}

export default UnbookmarkButton