import Head from 'next/head';
import { Markdown } from '../../components/Markdown';
import { PostData, loadMarkdownFile } from '../../loader';
import { PostCard } from '../../components/PostCard';

const Home = (props: {
  about: string;
}) => {
  return (
    <div className="content">
      <Head>
        <title>About</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="about">
        <h1>about</h1>
        <Markdown source={props.about} />
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const about = await loadMarkdownFile('about.md');

  const props = {
    about: about.contents,
  };

  return { props };
};
