import Head from 'next/head';
import { generateRSS } from '../rssUtil';
import { PostData, loadBlogPosts, loadMarkdownFile } from '../loader';
import { PostCard } from '../components/PostCard';
import { Author } from '../components/Author';

type Props = {
  introduction: string;
  features: string;
  readme: string;
  posts: PostData[];
};

const Home = (props: Props) => {
  // const renderLastPosts = (posts: PostData[]) => {
  //   let lastPosts = []

  //   for (let i = 0; i < 3; i++) {
  //     lastPosts.push(<PostCard complete={false} post={posts[i]} key={i} />)
  //   }

  //   return lastPosts;
  // };

  return (
    <>
      <div className="blog-post">
        <div className="blog-post-title wrapper box">
          <Author 
            title="personal blog by " 
            description="here I post thoughts, experiences and in-depth tech articles"
          />
        </div>
      </div>
      <div className="content">
        <Head>
          <title>Home - A blog by Felipe Gustavo</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* <div className="introduction">
          <h1>hello good people ✌</h1>
          <Markdown source={props.introduction} />
        </div> */}
        <div className="section">
          <h2>last blog posts</h2>
          <div>
            { props.posts.map((post, j) => {
                return <PostCard complete={false} post={post} key={j} />;
            })}
          </div>
        </div>
      </div>
    </>
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
