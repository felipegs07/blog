import Head from 'next/head';
import { PostData, loadBlogPosts } from '../../loader';
import { PostCard } from '../../components/PostCard';

type Props = {
  introduction: string;
  features: string;
  readme: string;
  posts: PostData[];
};

const Home = (props: Props) => {
  return (
    <div className="content">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="section">
        <h2>blog</h2>
        <div>
          {props.posts.map((post, j) => {
            return <PostCard complete post={post} key={j} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const posts = await loadBlogPosts();

  const props = {
    posts,
  };

  return { props };
};
