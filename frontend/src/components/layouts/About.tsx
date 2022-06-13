import { Link } from "react-router-dom";

const About: React.FC = () => {
  return (
    <>
      <h1>ここはAboutページです</h1>
      <Link to="/">Home</Link>
    </>
  )
}

export default About;