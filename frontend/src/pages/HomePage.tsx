import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/use-auth';
import api from '../lib/api';
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
  _id: string;
  user: {
    _id: string;
    username: string;
    gender: 'Boy' | 'Girl';
  };
  image: string;
  caption: string;
  likes: string[];
  createdAt: string;
}

const HomePage: React.FC = () => {
  const { isGirl } = useTheme();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'reels' | 'profile' | 'messages' | 'notifications' | 'settings'>('home');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');

  // Stories - Empty for now since no backend yet
  const stories: Story[] = [
    { id: 1, username: 'Your Story', avatar: '👤', viewed: false },
  ];

  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { data } = await api.post(`/posts/${postId}/like`);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: data.liked 
                ? [...post.likes, currentUser?._id || ''] 
                : post.likes.filter(id => id !== currentUser?._id) 
            } 
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostImage) return;

    try {
      const { data } = await api.post('/posts', {
        image: newPostImage,
        caption: newPostCaption
      });
      setPosts([data, ...posts]);
      setShowCreateModal(false);
      setNewPostImage('');
      setNewPostCaption('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleSave = (postId: string) => {
    // Save functionality can be added to backend later
    console.log('Save post:', postId);
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
              onClick={() => setActiveTab('notifications')}
              className="relative p-2"
            >
              <Heart className="w-6 h-6 text-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab('messages')}
              className="relative p-2"
            >
              <MessageCircle className="w-6 h-6 text-foreground" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab('settings')}
              className="lg:hidden p-2"
            >
              <Settings className="w-6 h-6 text-foreground" />
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
              { icon: MessageCircle, label: 'Messages', tab: 'messages' as const },
              { icon: Heart, label: 'Notifications', tab: 'notifications' as const },
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
            onClick={() => setActiveTab('settings')}
            className={`
              w-full mt-8 flex items-center gap-4 px-4 py-3 rounded-xl transition-colors
              ${activeTab === 'settings'
                ? (isGirl ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600')
                : 'text-foreground hover:bg-accent'
              }
            `}
          >
            <Settings className="w-6 h-6" />
            <span className="font-semibold">Settings</span>
          </motion.button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto pb-20 lg:pb-6">
          <AnimatePresence mode="wait">
            {activeTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
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
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p>Fetching original content...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-12 px-6 bg-card rounded-3xl border border-dashed border-border">
                      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">📭</div>
                      <h3 className="text-xl font-bold text-foreground mb-2">No Posts Yet</h3>
                      <p className="text-muted-foreground mb-6">Be the first to share something with the world!</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateModal(true)}
                        className={`px-8 py-3 rounded-2xl font-bold text-white ${isGirl ? 'bg-pink-500 shadow-pink-500/20' : 'bg-purple-600 shadow-purple-600/20'} shadow-lg`}
                      >
                        Create Post
                      </motion.button>
                    </div>
                  ) : posts.map((post) => (
                    <motion.article
                      key={post._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-card rounded-3xl overflow-hidden border border-border"
                    >
                      {/* Post Header */}
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center text-xl
                            ${post.user.gender === 'Girl'
                              ? 'bg-gradient-to-br from-pink-400 to-rose-500'
                              : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                            }
                          `}>
                            {post.user.gender === 'Girl' ? '👩' : '👨'}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{post.user.username}</p>
                            <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
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
                      </div>

                      {/* Post Actions */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleLike(post._id)}
                            >
                              <Heart
                                className={`w-7 h-7 ${post.likes.includes(currentUser?._id) ? 'fill-red-500 text-red-500' : 'text-foreground'}`}
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
                            onClick={() => handleSave(post._id)}
                          >
                            <Bookmark
                              className={`w-7 h-7 text-foreground`}
                            />
                          </motion.button>
                        </div>

                        <div>
                          <p className="font-semibold text-foreground">
                            {post.likes.length.toLocaleString()} likes
                          </p>
                          <p className="text-foreground mt-1">
                            <span className="font-semibold">{post.user.username}</span>{' '}
                            <span className="text-muted-foreground">{post.caption}</span>
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="relative mb-6">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search people, tags, places..."
                    className="w-full bg-accent text-foreground rounded-2xl py-4 pl-12 pr-4 outline-none border-2 border-transparent focus:border-primary/50 transition-all"
                  />
                </div>
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <div className="text-5xl mb-4">🔍</div>
                  <p>Search for friends and posts</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'reels' && (
              <motion.div
                key="reels"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-[80vh] flex items-center justify-center"
              >
                <div className="relative w-full max-w-[400px] h-full bg-black rounded-3xl overflow-hidden shadow-2xl">
                  <img src="https://picsum.photos/seed/reels/400/700" alt="Reel" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute bottom-8 left-6 text-white">
                    <p className="font-bold">@creator_name</p>
                    <p className="text-sm opacity-90">Loving the vibe today! ✨ #lifestyle</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <div className="flex items-center gap-8 mb-12">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl bg-gradient-to-br ${isGirl ? 'from-pink-400 to-rose-500' : 'from-purple-500 to-indigo-600'}`}>
                    {currentUser?.gender === 'Girl' ? '👩' : '👨'}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{currentUser?.username || 'Guest'}</h2>
                    <div className="flex gap-4 text-sm">
                      <span><strong>{posts.filter(p => p.user._id === currentUser?._id).length}</strong> posts</span>
                      <span><strong>0</strong> followers</span>
                      <span><strong>0</strong> following</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {posts.filter(p => p.user._id === currentUser?._id).map((post) => (
                    <div key={post._id} className="aspect-square bg-muted rounded-lg overflow-hidden border border-border">
                      <img src={post.image} alt="Profile post" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {posts.filter(p => p.user._id === currentUser?._id).length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>You haven't posted anything yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Messages</h2>
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-3xl border border-border">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-3xl">💬</div>
                  <p className="font-semibold">No active chats</p>
                  <p className="text-sm">Go to search to find friends and start chatting!</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">Notifications</h2>
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <div className="text-5xl mb-4">🔔</div>
                  <p>You're all caught up!</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="p-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-8">Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl">
                    <span className="font-medium text-foreground">Dark Mode</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-accent/30 rounded-2xl">
                    <span className="font-medium text-foreground">Notifications</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-destructive/10 text-destructive font-bold rounded-2xl mt-8"
                  >
                    Log Out
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Right Sidebar - Suggestions (Desktop) */}
        <aside className="hidden xl:block w-80 sticky top-20 h-screen p-6">
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-3xl border border-border">
              <h3 className="font-semibold text-muted-foreground mb-4">God X Community</h3>
              <p className="text-sm text-muted-foreground">Welcome to the startup! As more people join, you'll see them here.</p>
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

              <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Image URL</label>
                  <input
                    type="text"
                    value={newPostImage}
                    onChange={(e) => setNewPostImage(e.target.value)}
                    placeholder="Paste an image link here..."
                    className="w-full bg-accent text-foreground rounded-xl py-3 px-4 outline-none border-2 border-transparent focus:border-primary/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">Caption</label>
                  <textarea
                    value={newPostCaption}
                    onChange={(e) => setNewPostCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full bg-accent text-foreground rounded-xl py-3 px-4 outline-none border-2 border-transparent focus:border-primary/50 transition-all h-24 resize-none"
                  />
                </div>
                
                {newPostImage && (
                  <div className="aspect-square rounded-2xl overflow-hidden border border-border">
                    <img src={newPostImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isGirl ? 'bg-pink-500 shadow-pink-500/20' : 'bg-purple-600 shadow-purple-600/20'} shadow-lg`}
                >
                  Share Post
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
