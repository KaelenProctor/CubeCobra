import path from 'path';
import url from 'url';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';

// eslint-disable-next-line no-underscore-dangle
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const config = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            configFile: path.resolve(__dirname, 'babel.config.mjs'),
          },
        },
      },
      {
        test: /\.m?js$/,
        include: /node_modules/,
        type: 'javascript/auto',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  // devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      analytics: path.resolve(__dirname, 'src/client/analytics/'),
      components: path.resolve(__dirname, 'src/client/components/'),
      contexts: path.resolve(__dirname, 'src/client/contexts/'),
      datatypes: path.resolve(__dirname, 'src/datatypes/'),
      drafting: path.resolve(__dirname, 'src/client/drafting/'),
      filtering: path.resolve(__dirname, 'src/client/filtering/'),
      generated: path.resolve(__dirname, 'src/client/generated/'),
      hooks: path.resolve(__dirname, 'src/client/hooks/'),
      layouts: path.resolve(__dirname, 'src/client/layouts/'),
      markdown: path.resolve(__dirname, 'src/client/markdown/'),
      pages: path.resolve(__dirname, 'src/client/pages/'),
      res: path.resolve(__dirname, 'src/client/res/'),
      utils: path.resolve(__dirname, 'src/client/utils/'),
    },
  },
};

export const clientConfig = merge(config, {
  entry: {
    BlogPostPage: './src/client/pages/BlogPostPage.tsx',
    BulkUploadPage: './src/client/pages/BulkUploadPage.tsx',
    CubeSamplePackPage: './src/client/pages/CubeSamplePackPage.tsx',
    CubeAnalysisPage: './src/client/pages/CubeAnalysisPage.tsx',
    CubeBlogPage: './src/client/pages/CubeBlogPage.tsx',
    CubeComparePage: './src/client/pages/CubeComparePage.tsx',
    CubeDeckPage: './src/client/pages/CubeDeckPage.tsx',
    CubeDeckbuilderPage: './src/client/pages/CubeDeckbuilderPage.tsx',
    CubeDraftPage: './src/client/pages/CubeDraftPage.tsx',
    CubeListPage: './src/client/pages/CubeListPage.tsx',
    CubeHistoryPage: './src/client/pages/CubeHistoryPage.tsx',
    CubeOverviewPage: './src/client/pages/CubeOverviewPage.tsx',
    CubePlaytestPage: './src/client/pages/CubePlaytestPage.tsx',
    DashboardPage: './src/client/pages/DashboardPage.tsx',
    GridDraftPage: './src/client/pages/GridDraftPage.tsx',
    DevBlog: './src/client/pages/DevBlog.tsx',
    ContactPage: './src/client/pages/ContactPage.tsx',
    DonatePage: './src/client/pages/DonatePage.tsx',
    InfoPage: './src/client/pages/InfoPage.tsx',
    FiltersPage: './src/client/pages/FiltersPage.tsx',
    DownTimePage: './src/client/pages/DownTimePage.tsx',
    ErrorPage: './src/client/pages/ErrorPage.tsx',
    CardSearchPage: './src/client/pages/CardSearchPage.tsx',
    TopCardsPage: './src/client/pages/TopCardsPage.tsx',
    CardPage: './src/client/pages/CardPage.tsx',
    CommentPage: './src/client/pages/CommentPage.tsx',
    LoginPage: './src/client/pages/LoginPage.tsx',
    RegisterPage: './src/client/pages/RegisterPage.tsx',
    LostPasswordPage: './src/client/pages/LostPasswordPage.tsx',
    NotificationsPage: './src/client/pages/NotificationsPage.tsx',
    PasswordResetPage: './src/client/pages/PasswordResetPage.tsx',
    UserAccountPage: './src/client/pages/UserAccountPage.tsx',
    UserBlogPage: './src/client/pages/UserBlogPage.tsx',
    UserDecksPage: './src/client/pages/UserDecksPage.tsx',
    UserSocialPage: './src/client/pages/UserSocialPage.tsx',
    UserCubePage: './src/client/pages/UserCubePage.tsx',
    ExplorePage: './src/client/pages/ExplorePage.tsx',
    SearchPage: './src/client/pages/SearchPage.tsx',
    VersionPage: './src/client/pages/VersionPage.tsx',
    LandingPage: './src/client/pages/LandingPage.tsx',
    AdminDashboardPage: './src/client/pages/AdminDashboardPage.tsx',
    NoticePage: './src/client/pages/NoticePage.tsx',
    ApplicationPage: './src/client/pages/ApplicationPage.tsx',
    CreatorsPage: './src/client/pages/CreatorsPage.tsx',
    MarkdownPage: './src/client/pages/MarkdownPage.tsx',
    EditArticlePage: './src/client/pages/EditArticlePage.tsx',
    ArticlePage: './src/client/pages/ArticlePage.tsx',
    ReviewContentPage: './src/client/pages/ReviewContentPage.tsx',
    ArticlesPage: './src/client/pages/ArticlesPage.tsx',
    EditVideoPage: './src/client/pages/EditVideoPage.tsx',
    VideoPage: './src/client/pages/VideoPage.tsx',
    VideosPage: './src/client/pages/VideosPage.tsx',
    EditPodcastPage: './src/client/pages/EditPodcastPage.tsx',
    PodcastPage: './src/client/pages/PodcastPage.tsx',
    PodcastsPage: './src/client/pages/PodcastsPage.tsx',
    PodcastEpisodePage: './src/client/pages/PodcastEpisodePage.tsx',
    BrowseContentPage: './src/client/pages/BrowseContentPage.tsx',
    LeaveWarningPage: './src/client/pages/LeaveWarningPage.tsx',
    PackagePage: './src/client/pages/PackagePage.tsx',
    FeaturedCubesQueuePage: './src/client/pages/FeaturedCubesQueuePage.tsx',
    PackagesPage: './src/client/pages/PackagesPage.tsx',
    RecentlyUpdateCubesPage: './src/client/pages/RecentlyUpdateCubesPage.tsx',
    // MerchandisePage: './src/client/pages/MerchandisePage.tsx',
    CubeRecordsPage: './src/client/pages/CubeRecordsPage.tsx',
    CreateNewRecordPage: './src/client/pages/CreateNewRecordPage.tsx',
    RecordPage: './src/client/pages/RecordPage.tsx',
    RecordUploadDeckPage: './src/client/pages/RecordUploadDeckPage.tsx',
    ImportRecordPage: './src/client/pages/ImportRecordPage.tsx',
    CreateRecordFromDraftPage: './src/client/pages/CreateRecordFromDraftPage.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
});

export const serverConfig = merge(config, {
  target: 'node',
  entry: {
    'pages/DashboardPage': './src/client/pages/DashboardPage.tsx',
    'pages/DevBlog': './src/client/pages/DevBlog.tsx',
    'pages/BlogPostPage': './src/client/pages/BlogPostPage.tsx',
    'pages/BulkUploadPage': './src/client/pages/BulkUploadPage.tsx',
    'pages/CubeAnalysisPage': './src/client/pages/CubeAnalysisPage.tsx',
    'pages/CubeBlogPage': './src/client/pages/CubeBlogPage.tsx',
    'pages/CubeComparePage': './src/client/pages/CubeComparePage.tsx',
    'pages/CubeDeckPage': './src/client/pages/CubeDeckPage.tsx',
    'pages/CubeDeckbuilderPage': './src/client/pages/CubeDeckbuilderPage.tsx',
    'pages/CubeDraftPage': './src/client/pages/CubeDraftPage.tsx',
    'pages/CubeListPage': './src/client/pages/CubeListPage.tsx',
    'pages/CubeHistoryPage': './src/client/pages/CubeHistoryPage.tsx',
    'pages/CubeOverviewPage': './src/client/pages/CubeOverviewPage.tsx',
    'pages/CubePlaytestPage': './src/client/pages/CubePlaytestPage.tsx',
    'pages/CubeSamplePackPage': './src/client/pages/CubeSamplePackPage.tsx',
    'pages/GridDraftPage': './src/client/pages/GridDraftPage.tsx',
    'pages/ContactPage': './src/client/pages/ContactPage.tsx',
    'pages/InfoPage': './src/client/pages/InfoPage.tsx',
    'pages/DonatePage': './src/client/pages/DonatePage.tsx',
    'pages/DownTimePage': './src/client/pages/DownTimePage.tsx',
    'pages/FiltersPage': './src/client/pages/FiltersPage.tsx',
    'pages/ErrorPage': './src/client/pages/ErrorPage.tsx',
    'pages/CardSearchPage': './src/client/pages/CardSearchPage.tsx',
    'pages/TopCardsPage': './src/client/pages/TopCardsPage.tsx',
    'pages/CardPage': './src/client/pages/CardPage.tsx',
    'pages/CommentPage': './src/client/pages/CommentPage.tsx',
    'pages/LoginPage': './src/client/pages/LoginPage.tsx',
    'pages/RegisterPage': './src/client/pages/RegisterPage.tsx',
    'pages/LostPasswordPage': './src/client/pages/LostPasswordPage.tsx',
    'pages/NotificationsPage': './src/client/pages/NotificationsPage.tsx',
    'pages/PasswordResetPage': './src/client/pages/PasswordResetPage.tsx',
    'pages/UserAccountPage': './src/client/pages/UserAccountPage.tsx',
    'pages/UserBlogPage': './src/client/pages/UserBlogPage.tsx',
    'pages/UserDecksPage': './src/client/pages/UserDecksPage.tsx',
    'pages/UserSocialPage': './src/client/pages/UserSocialPage.tsx',
    'pages/UserCubePage': './src/client/pages/UserCubePage.tsx',
    'pages/ExplorePage': './src/client/pages/ExplorePage.tsx',
    'pages/SearchPage': './src/client/pages/SearchPage.tsx',
    'pages/VersionPage': './src/client/pages/VersionPage.tsx',
    'pages/LandingPage': './src/client/pages/LandingPage.tsx',
    'pages/AdminDashboardPage': './src/client/pages/AdminDashboardPage.tsx',
    'pages/NoticePage': './src/client/pages/NoticePage.tsx',
    'pages/ApplicationPage': './src/client/pages/ApplicationPage.tsx',
    'pages/CreatorsPage': './src/client/pages/CreatorsPage.tsx',
    'pages/MarkdownPage': './src/client/pages/MarkdownPage.tsx',
    'pages/ArticlePage': './src/client/pages/ArticlePage.tsx',
    'pages/EditArticlePage': './src/client/pages/EditArticlePage.tsx',
    'pages/ReviewContentPage': './src/client/pages/ReviewContentPage.tsx',
    'pages/ArticlesPage': './src/client/pages/ArticlesPage.tsx',
    'pages/VideoPage': './src/client/pages/VideoPage.tsx',
    'pages/EditVideoPage': './src/client/pages/EditVideoPage.tsx',
    'pages/VideosPage': './src/client/pages/VideosPage.tsx',
    'pages/PodcastPage': './src/client/pages/PodcastPage.tsx',
    'pages/EditPodcastPage': './src/client/pages/EditPodcastPage.tsx',
    'pages/PodcastsPage': './src/client/pages/PodcastsPage.tsx',
    'pages/PodcastEpisodePage': './src/client/pages/PodcastEpisodePage.tsx',
    'pages/BrowseContentPage': './src/client/pages/BrowseContentPage.tsx',
    'pages/LeaveWarningPage': './src/client/pages/LeaveWarningPage.tsx',
    'pages/PackagePage': './src/client/pages/PackagePage.tsx',
    'pages/FeaturedCubesQueuePage': './src/client/pages/FeaturedCubesQueuePage.tsx',
    'pages/PackagesPage': './src/client/pages/PackagesPage.tsx',
    'pages/RecentlyUpdateCubesPage': './src/client/pages/RecentlyUpdateCubesPage.tsx',
    // 'pages/MerchandisePage': './src/client/pages/MerchandisePage.tsx',
    'pages/CubeRecordsPage': './src/client/pages/CubeRecordsPage.tsx',
    'pages/CreateNewRecordPage': './src/client/pages/CreateNewRecordPage.tsx',
    'pages/RecordPage': './src/client/pages/RecordPage.tsx',
    'pages/RecordUploadDeckPage': './src/client/pages/RecordUploadDeckPage.tsx',
    'pages/ImportRecordPage': './src/client/pages/ImportRecordPage.tsx',
    'pages/CreateRecordFromDraftPage': './src/client/pages/CreateRecordFromDraftPage.tsx',
  },
  output: {
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2',
  },
  externals: [
    nodeExternals({
      allowlist: [],
    }),
  ],
});
