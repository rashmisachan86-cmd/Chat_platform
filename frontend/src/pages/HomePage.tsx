import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../hooks/use-auth';
import api from '../lib/api';
import {
  Home, Search, PlusSquare, Heart, MessageCircle, Send, Bookmark,
  MoreHorizontal, Settings, User, Film,
  X, Upload, Camera
} from 'lucide-react';

interface Post {
  _id: string;
  user: {
    _id: string;
    username: string;
    gender: 'Boy' | 'Girl';
    profilePic?: string;
  };
  image: string;
  caption: string;
  likes: string[];
  comments: Array<{
    user: {
      _id: string;
      username: string;
      profilePic?: string;
      gender: 'Boy' | 'Girl';
    };
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
}

const Avatar = ({ user, className = "w-10 h-10" }: { user: any, className?: string }) => {
  if (user?.profilePic) {
    return (
      <div className={`${className} rounded-full overflow-hidden border border-border flex-shrink-0 bg-muted`}>
        <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${className} rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${user?.gender === 'Girl' ? 'from-pink-400 to-rose-500' : 'from-purple-500 to-indigo-600'}`}>
      <User className="w-1/2 h-1/2 text-white" />
    </div>
  );
};

const HomePage: React.FC = () => {
  const { isGirl } = useTheme();
  const { user: currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'reels' | 'profile' | 'messages' | 'notifications' | 'settings'>('home');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostCaption, setNewPostCaption] = useState('');
  const [commentTexts, setCommentTexts] = useState<{[key: string]: string}>({});
  const [editingBio, setEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(currentUser?.bio || '');

  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchPosts();
    fetchSuggestions();
    fetchConversations();
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

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data } = await api.get('/auth/users?search=');
      setSuggestions(data.filter((u: any) => u._id !== currentUser?._id).slice(0, 5));
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const { data } = await api.get(`/auth/users?search=${query}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const startConversation = async (participantId: string) => {
    try {
      await api.post('/conversations', { participantId, isGroup: false });
      // In a real app we would navigate to /chat/:id, but for now we'll just switch to messages tab
      setActiveTab('messages');
      fetchConversations();
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
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

  const handleComment = async (postId: string) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;

    try {
      const { data } = await api.post(`/posts/${postId}/comment`, { text });
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: data } : p));
      setCommentTexts({ ...commentTexts, [postId]: '' });
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    try {
      await api.post(`/auth/users/${userId}/follow`);
      fetchSuggestions();
      // Reload profile if currently viewing it
      if (activeTab === 'profile') {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUpdateBio = async () => {
    try {
      await updateProfile({ bio: newBio });
      setEditingBio(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating bio:', error);
    }
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
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-shrink-0 cursor-pointer"
                    >
                      <div className={`
                        w-20 h-20 rounded-full p-1 mb-2
                        bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600
                      `}>
                        <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-2xl relative">
                          {currentUser?.gender === 'Girl' ? '👩' : '👨'}
                          <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border-2 border-background">
                            <PlusSquare className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-center text-muted-foreground truncate w-20">
                        Your Story
                      </p>
                    </motion.div>
                    
                    {/* Placeholder for real stories when available */}
                    <div className="flex items-center text-xs text-muted-foreground px-4 opacity-50 italic">
                      More stories coming soon as friends join!
                    </div>
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
                          <Avatar user={post.user} className="w-10 h-10" />
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
                          <p className="text-foreground mt-1 text-sm">
                            <span className="font-bold">{post.user.username}</span>{' '}
                            <span className="text-muted-foreground">{post.caption}</span>
                          </p>

                          {/* Comments Section */}
                          {post.comments?.length > 0 && (
                            <div className="mt-3 space-y-2 border-t border-border pt-3">
                              {post.comments.slice(-2).map((comment, i) => (
                                <div key={i} className="flex gap-2 items-start text-xs">
                                  <Avatar user={comment.user} className="w-5 h-5" />
                                  <p className="text-foreground">
                                    <span className="font-bold mr-1">{comment.user.username}</span>
                                    {comment.text}
                                  </p>
                                </div>
                              ))}
                              {post.comments.length > 2 && (
                                <button className="text-[10px] text-muted-foreground font-semibold hover:underline">
                                  View all {post.comments.length} comments
                                </button>
                              )}
                            </div>
                          )}

                          {/* Comment Input */}
                          <div className="mt-4 flex gap-2">
                            <input 
                              type="text"
                              value={commentTexts[post._id] || ''}
                              onChange={(e) => setCommentTexts({ ...commentTexts, [post._id]: e.target.value })}
                              placeholder="Add a comment..."
                              className="flex-1 bg-accent/50 rounded-lg px-3 py-1.5 text-xs text-foreground outline-none border border-transparent focus:border-primary/30 transition-all"
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                            />
                            <button 
                              onClick={() => handleComment(post._id)}
                              disabled={!commentTexts[post._id]?.trim()}
                              className={`text-xs font-bold ${isGirl ? 'text-pink-500' : 'text-purple-600'} disabled:opacity-30`}
                            >
                              Post
                            </button>
                          </div>
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
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search people by username..."
                    className="w-full bg-accent text-foreground rounded-2xl py-4 pl-12 pr-4 outline-none border-2 border-transparent focus:border-primary/50 transition-all"
                  />
                </div>

                {isSearching ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((user) => (
                      <motion.div
                        key={user._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar user={user} className="w-12 h-12" />
                          <div>
                            <p className="font-bold text-foreground">{user.username}</p>
                            <p className="text-xs text-muted-foreground">{user.gender} • {user.vibe || 'Friendly'}</p>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleFollow(user._id)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                            currentUser?.following?.includes(user._id)
                              ? 'border-border text-foreground hover:bg-muted'
                              : (isGirl ? 'bg-pink-500 border-pink-500 text-white shadow-pink-500/20' : 'bg-purple-600 border-purple-600 text-white shadow-purple-600/20')
                          } shadow-md`}
                        >
                          {currentUser?.following?.includes(user._id) ? 'Following' : 'Follow'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => startConversation(user._id)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 border-primary/20 hover:border-primary/50 text-foreground transition-all`}
                        >
                          Message
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="text-center py-20 text-muted-foreground">
                    <p>No users found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <div className="text-5xl mb-4">🔍</div>
                    <p>Search for friends and start chatting</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'reels' && (
              <motion.div
                key="reels"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="h-[80vh] flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="text-6xl mb-6">🎥</div>
                <h2 className="text-3xl font-black text-foreground mb-4">Reels are Coming Soon!</h2>
                <p className="text-muted-foreground max-w-sm">
                  We're currently building a world-class short-video experience for God X. Stay tuned for the update!
                </p>
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
                  <div className="relative group">
                    <Avatar user={currentUser} className="w-24 h-24 text-4xl" />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                      <Camera className="w-8 h-8" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = async () => {
                              try {
                                const base64String = reader.result as string;
                                await updateProfile({ profilePic: base64String });
                                window.location.reload(); // Refresh to update user context
                              } catch (error) {
                                console.error('Error updating profile pic:', error);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{currentUser?.username || 'Guest'}</h2>
                    <div className="flex gap-4 text-sm mb-4">
                      <span><strong>{posts.filter(p => p.user._id === currentUser?._id).length}</strong> posts</span>
                      <span><strong>{currentUser?.followers?.length || 0}</strong> followers</span>
                      <span><strong>{currentUser?.following?.length || 0}</strong> following</span>
                    </div>
                    {editingBio ? (
                      <div className="space-y-2">
                        <textarea 
                          value={newBio}
                          onChange={(e) => setNewBio(e.target.value)}
                          className="w-full bg-accent rounded-lg p-2 text-sm text-foreground outline-none border border-primary/30"
                          placeholder="Tell us about yourself..."
                        />
                        <div className="flex gap-2">
                          <button 
                            onClick={handleUpdateBio}
                            className={`px-3 py-1 rounded-lg text-white text-xs font-bold ${isGirl ? 'bg-pink-500' : 'bg-purple-600'}`}
                          >
                            Save
                          </button>
                          <button 
                            onClick={() => setEditingBio(false)}
                            className="px-3 py-1 rounded-lg bg-muted text-foreground text-xs font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="text-sm text-foreground whitespace-pre-wrap">{currentUser?.bio || 'No bio yet'}</p>
                        <button 
                          onClick={() => setEditingBio(true)}
                          className={`text-xs font-bold ${isGirl ? 'text-pink-500' : 'text-purple-600'} hover:opacity-70`}
                        >
                          Edit Bio
                        </button>
                      </div>
                    )}
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
                className="p-6 h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Messages</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setActiveTab('search')}
                    className={`p-2 rounded-xl ${isGirl ? 'bg-pink-100 text-pink-600' : 'bg-purple-100 text-purple-600'}`}
                  >
                    <PlusSquare className="w-6 h-6" />
                  </motion.button>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[70vh] scrollbar-hide">
                  {conversations.length > 0 ? (
                    conversations.map((conv) => {
                      const otherUser = conv.isGroup ? null : conv.participants?.find((p: any) => p._id !== currentUser?._id);
                      const displayTitle = conv.isGroup ? conv.title : (otherUser?.username || conv.title);

                      return (
                        <motion.div
                          key={conv._id}
                          whileHover={{ x: 5 }}
                          className="flex items-center gap-4 p-4 bg-card rounded-3xl border border-border cursor-pointer hover:bg-accent/30 transition-all"
                        >
                          <Avatar user={otherUser || { gender: 'Boy' }} className="w-14 h-14" />
                          <div className="flex-1 overflow-hidden">
                            <h3 className="font-bold text-foreground truncate">{displayTitle}</h3>
                            <p className="text-sm text-muted-foreground truncate">{conv.lastMessage || 'No messages yet'}</p>
                          </div>
                          <div className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card rounded-3xl border border-dashed border-border">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-3xl">💬</div>
                      <p className="font-semibold">No active chats</p>
                      <p className="text-sm px-10 text-center">Start a conversation by searching for friends in the search tab!</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTab('search')}
                        className={`mt-6 px-6 py-2 rounded-xl font-bold text-white ${isGirl ? 'bg-pink-500' : 'bg-purple-600'}`}
                      >
                        Find Friends
                      </motion.button>
                    </div>
                  )}
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
                    onClick={handleLogout}
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
              <h3 className="font-semibold text-muted-foreground mb-4">Suggested for you</h3>
              <div className="space-y-4">
                {suggestions.length > 0 ? (
                  suggestions.map((u) => (
                    <div key={u._id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <Avatar user={u} className="w-8 h-8" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">{u.username}</p>
                          <p className="text-[10px] text-muted-foreground">{u.vibe}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleFollow(u._id)}
                          className={`text-xs font-bold transition-all ${
                            currentUser?.following?.includes(u._id)
                              ? 'text-muted-foreground'
                              : (isGirl ? 'text-pink-500 hover:text-pink-600' : 'text-purple-600 hover:text-purple-700')
                          }`}
                        >
                          {currentUser?.following?.includes(u._id) ? 'Following' : 'Follow'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Welcome to God X! New users will appear here soon.</p>
                )}
              </div>
            </div>
            <div className="text-xs text-muted-foreground px-4">
              © 2026 GOD X FROM PARTH
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">Select Image</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      placeholder="Paste image link or upload..."
                      className="flex-1 bg-accent text-foreground rounded-xl py-3 px-4 outline-none border-2 border-transparent focus:border-primary/50 transition-all"
                    />
                    <label className={`p-3 rounded-xl cursor-pointer flex items-center justify-center text-white ${isGirl ? 'bg-pink-500' : 'bg-purple-600'}`}>
                      <Upload className="w-6 h-6" />
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewPostImage(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
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
