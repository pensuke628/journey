import Button from '@mui/material/Button';
import BookmarkAddIcon from '@mui/icons-material/BookmarkAdd';

type Props = {
  onClick: () => void
}

const BookmarkButton: React.FC<Props> = (props) => {
  return (
    <Button
      variant='contained'
      onClick={props.onClick}
      startIcon={<BookmarkAddIcon />}
      sx= {{ my: 1 }}
    >お気に入りする
    </Button>
  );
}

export default BookmarkButton