import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import {
  Home, Search, PlusSquare, Heart, MessageCircle, Send, Bookmark,
  MoreHorizontal, Camera, Settings, User, Film, Smile,
  X, Image as ImageIcon
} from 'lucide-react';

interface Story {
  id: number;
  username: string;
  avatar: string;
  viewed: boolean;
}

interface Post {
  id: number;
  username: string;
  avatar: string;
  image: string;
  likes: number;
  caption: string;
  comments: number;
  timeAgo: string;
  liked: boolean;
  saved: boolean;
}

const HomePage: React.FC = () => {
  const { isGirl } = useTheme();
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'reels' | 'profile'>('home');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data
  const stories: Story[] = [
    { id: 1, username: 'Your Story', avatar: '👤', viewed: false },
    { id: 2, username: 'sarah_j', avatar: '👩', viewed: false },
    { id: 3, username: 'mike_photo', avatar: '👨', viewed: true },
    { id: 4, username: 'travel_diary', avatar: '✈️', viewed: false },
    { id: 5, username: 'foodie_life', avatar: '🍕', viewed: false },
    { id: 6, username: 'tech_guru', avatar: '💻', viewed: true },
    { id: 7, username: 'fashion_mode', avatar: '👗', viewed: false },
    { id: 8, username: 'art_studio', avatar: '🎨', viewed: false },
  ];

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      username: 'john_doe',
      avatar: '👤',
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba',
      likes: 1234,
      caption: 'Amazing sunset at the beach! 🌅 #sunset #beach #photography',
      comments: 89,
      timeAgo: '2 hours ago',
      liked: false,
      saved: false,
    },
    {
      id: 2,
      username: 'travel_diary',
      avatar: '✈️',
      image: 'https://images.unsplash.com/photo-1682687221363-72518513620e',
      likes: 856,
      caption: 'Exploring the mountains! What an adventure 🏔️',
      comments: 42,
      timeAgo: '5 hours ago',
      liked: true,
      saved: false,
    },
    {
      id: 3,
      username: 'foodie_life',
      avatar: '🍕',
      image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538',
      likes: 2341,
      caption: 'Homemade pizza night! Recipe in bio 🍕👨‍🍳',
      comments: 156,
      timeAgo: '1 day ago',
      liked: false,
      saved: true,
    },
  ]);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

  return (
    <div className="min-h-screen bg-background safe-p transition-colors duration-700">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className={`
              text-3xl font-black
              ${isGirl
                ? 'bg-gradient-to-r from-pink-500 to-rose-600'
                : 'bg-gradient-to-r from-purple-500 to-indigo-600'
              }
              bg-clip-text text-transparent cursor-pointer
            `}
          >
            God X
          </motion.h1>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCreateModal(true)}
              className={`
                p-2 rounded-full
                ${isGirl
                  ? 'bg-pink-100 text-pink-600 hover:bg-pink-200'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }
              `}
            >
              <PlusSquare className="w-6 h-6" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2"
            >
              <Heart className="w-6 h-6 text-foreground" />
              <span className={`
                absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold
                ${isGirl ? 'bg-pink-500' : 'bg-purple-600'}
              `}>
                5
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative p-2"
            >
              <MessageCircle className="w-6 h-6 text-foreground" />
              <span className={`
                absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white font-bold
                ${isGirl ? 'bg-pink-500' : 'bg-purple-600'}
              `}>
                3
              </span>
            </motion.button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block w-64 sticky top-20 h-screen p-6">
          <nav className="space-y-2">
            {[
              { icon: Home, label: 'Home', tab: 'home' as const },
              { icon: Search, label: 'Search', tab: 'search' as const },
              { icon: Film, label: 'Reels', tab: 'reels' as const },
              { icon: MessageCircle, label: 'Messages', tab: 'home' as const },
              { icon: Heart, label: 'Notifications', tab: 'home' as const },
              { icon: PlusSquare, label: 'Create', tab: 'home' as const },
              { icon: User, label: 'Profile', tab: 'profile' as const },
            ].map((item, index) => (
              <motion.button
                key={index}
                whileHover={{ x: 5, backgroundColor: isGirl ? 'rgba(255, 182, 193, 0.1)' : 'rgba(168, 85, 247, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onClick={() => item.label === 'Create' ? setShowCreateModal(true) : setActiveTab(item.tab)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
                  ${activeTab === item.tab && item.label !== 'Create'
                    ? (isGirl ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600')
                    : 'text-foreground hover:bg-accent'
                  }
                `}
              >
                <item.icon className="w-6 h-6" />
                <span className="font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full mt-8 flex items-center gap-4 px-4 py-3 rounded-xl text-foreground hover:bg-accent"
          >
            <Settings className="w-6 h-6" />
            <span className="font-semibold">Settings</span>
          </motion.button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto pb-20 lg:pb-6">
          {/* Stories Section */}
          <div className="px-4 py-6 border-b border-border">
            <div className="flex gap-4 overflow-x-auto scrollbar-hide">
              {stories.map((story) => (
                <motion.div
                  key={story.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 cursor-pointer"
                >
                  <div className={`
                    w-20 h-20 rounded-full p-1 mb-2
                    ${story.viewed
                      ? 'bg-gray-300'
                      : (isGirl
                        ? 'bg-gradient-to-tr from-pink-500 via-rose-500 to-orange-500'
                        : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500'
                      )
                    }
                  `}>
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl">
                      {story.avatar}
                    </div>
                  </div>
                  <p className="text-xs text-center text-muted-foreground truncate w-20">
                    {story.username}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-6 py-6">
            {posts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl overflow-hidden border border-border"
              >
                {/* Post Header */}
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-xl
                      ${isGirl
                        ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                        : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                      }
                    `}>
                      {post.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{post.username}</p>
                      <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoreHorizontal className="w-6 h-6 text-muted-foreground" />
                  </motion.button>
                </div>

                {/* Post Image */}
                <div className="relative aspect-square bg-muted">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Double-tap heart animation would go here */}
                </div>

                {/* Post Actions */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleLike(post.id)}
                      >
                        <Heart
                          className={`w-7 h-7 ${post.liked ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
                        />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MessageCircle className="w-7 h-7 text-foreground" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Send className="w-7 h-7 text-foreground" />
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSave(post.id)}
                    >
                      <Bookmark
                        className={`w-7 h-7 ${post.saved ? 'fill-current text-foreground' : 'text-foreground'}`}
                      />
                    </motion.button>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      {post.likes.toLocaleString()} likes
                    </p>
                    <p className="text-foreground mt-1">
                      <span className="font-semibold">{post.username}</span>{' '}
                      <span className="text-muted-foreground">{post.caption}</span>
                    </p>
                    <button className="text-muted-foreground text-sm mt-2">
                      View all {post.comments} comments
                    </button>
                  </div>

                  {/* Add Comment */}
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <Smile className="w-6 h-6 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none"
                    />
                    <button className={`
                      font-semibold text-sm
                      ${isGirl ? 'text-pink-500' : 'text-purple-600'}
                    `}>
                      Post
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </main>

        {/* Right Sidebar - Suggestions (Desktop) */}
        <aside className="hidden xl:block w-80 sticky top-20 h-screen p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-muted-foreground mb-4">Suggestions For You</h3>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-xl
                        ${isGirl
                          ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                          : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                        }
                      `}>
                        👤
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">user_{i}</p>
                        <p className="text-xs text-muted-foreground">Followed by sarah_j</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        text-sm font-semibold
                        ${isGirl ? 'text-pink-500' : 'text-purple-600'}
                      `}
                    >
                      Follow
                    </motion.button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border z-40">
        <div className="flex items-center justify-around py-3">
          {[
            { icon: Home, tab: 'home' as const },
            { icon: Search, tab: 'search' as const },
            { icon: Film, tab: 'reels' as const },
            { icon: Heart, tab: 'home' as const },
            { icon: User, tab: 'profile' as const },
          ].map((item, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(item.tab)}
              className={`
                p-2 rounded-xl
                ${activeTab === item.tab
                  ? (isGirl ? 'text-pink-500' : 'text-purple-600')
                  : 'text-muted-foreground'
                }
              `}
            >
              <item.icon className="w-6 h-6" />
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-3xl max-w-md w-full overflow-hidden border border-border"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Create New Post</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="w-6 h-6 text-foreground" />
                </motion.button>
              </div>

              <div className="p-6 space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full p-6 rounded-2xl border-2 border-dashed transition-colors
                    ${isGirl
                      ? 'border-pink-300 hover:border-pink-500 hover:bg-pink-50'
                      : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50/10'
                    }
                  `}
                >
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold text-foreground">Upload Photo</p>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG up to 10MB</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full p-6 rounded-2xl border-2 border-dashed transition-colors
                    ${isGirl
                      ? 'border-pink-300 hover:border-pink-500 hover:bg-pink-50'
                      : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50/10'
                    }
                  `}
                >
                  <Film className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold text-foreground">Upload Video</p>
                  <p className="text-sm text-muted-foreground mt-1">MP4 up to 100MB</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full p-6 rounded-2xl border-2 border-dashed transition-colors
                    ${isGirl
                      ? 'border-pink-300 hover:border-pink-500 hover:bg-pink-50'
                      : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50/10'
                    }
                  `}
                >
                  <Camera className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="font-semibold text-foreground">Take Photo</p>
                  <p className="text-sm text-muted-foreground mt-1">Use your camera</p>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
