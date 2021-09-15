import Head from 'next/head';
import { generateRSS } from '../rssUtil';
import { Markdown } from '../components/Markdown';
import { PostData, loadBlogPosts, loadMarkdownFile } from '../loader';
import { PostCard } from '../components/PostCard';

type Props = {
  introduction: string;
  features: string;
  readme: string;
  posts: PostData[];
};

const Home = (props: Props) => {
  const renderLastPosts = (posts: PostData[]) => {
    let lastPosts = []

    for (let i = 0; i < 3; i++) {
      lastPosts.push(<PostCard complete={false} post={posts[i]} key={i} />)
    }

    return lastPosts;
  };

  return (
    <div className="content">
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="introduction">
        <h1>hello good people ✌</h1>
        <Markdown source={props.introduction} />
      </div>

      <div className="section">
        <h2>last blog posts</h2>
        <div>
          {
            renderLastPosts(props.posts)
          }
        </div>
      </div>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const introduction = await loadMarkdownFile('introduction.md');
  const posts = await loadBlogPosts();

  // comment out to turn off RSS generation during build step.
  await generateRSS(posts);

  const props = {
    introduction: introduction.contents,
    posts,
  };

  return { props };
};
