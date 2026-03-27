import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

type PostType = 'update' | 'challenge' | 'auction' | 'tournament' | 'achievement'

type FeedPost = {
  id: number
  author: string
  avatar: string
  sport: string
  city: string
  type: PostType
  text: string
  media?: { kind: 'photo' | 'video'; name: string }
  likes: number
  comments: Comment[]
  timestamp: string
  liked: boolean
}

type Comment = {
  id: number
  author: string
  text: string
  timestamp: string
}

const postTypeLabels: Record<PostType, { label: string; icon: string; color: string }> = {
  update: { label: 'Update', icon: '📝', color: '#3b82f6' },
  challenge: { label: 'Challenge', icon: '🎯', color: '#f59e0b' },
  auction: { label: 'Auction Pick', icon: '🔨', color: '#8b5cf6' },
  tournament: { label: 'Tournament', icon: '🏆', color: '#22c55e' },
  achievement: { label: 'Achievement', icon: '⭐', color: '#ef4444' },
}

const samplePosts: FeedPost[] = [
  {
    id: 1,
    author: 'Rahul Sharma',
    avatar: 'RS',
    sport: 'Cricket',
    city: 'Bangalore',
    type: 'tournament',
    text: '🏆 We just won the Koramangala Premier League! 3 matches unbeaten, and the trophy is home. Massive thanks to my squad — every single player showed up when it mattered. Next stop: City Championship!',
    likes: 48,
    comments: [
      { id: 1, author: 'Arjun Patel', text: 'Well played bro! 🔥', timestamp: '2h ago' },
      { id: 2, author: 'Priya Singh', text: 'Champions!! 🏆🏆', timestamp: '1h ago' },
    ],
    timestamp: '3h ago',
    liked: false,
  },
  {
    id: 2,
    author: 'Sneha Iyer',
    avatar: 'SI',
    sport: 'Badminton',
    city: 'Bangalore',
    type: 'challenge',
    text: 'Just completed the "Smash King" challenge on Gully World — 50 consecutive smash winners in practice! 🏸 Anyone up for a doubles match this weekend at HSR courts?',
    media: { kind: 'photo', name: 'smash-practice.jpg' },
    likes: 32,
    comments: [
      { id: 3, author: 'Dev Kumar', text: 'Count me in for doubles! 🙋‍♂️', timestamp: '45min ago' },
    ],
    timestamp: '5h ago',
    liked: false,
  },
  {
    id: 3,
    author: 'Karthik Reddy',
    avatar: 'KR',
    sport: 'Cricket',
    city: 'Bangalore',
    type: 'auction',
    text: '🔨 Got picked by Indiranagar Strikers in the Gully World auction for ₹8,500! Ready to bowl some heat this season. Let\'s gooo! 🔥',
    likes: 67,
    comments: [
      { id: 4, author: 'Rahul Sharma', text: 'Big buy! Destroy them 💪', timestamp: '2h ago' },
      { id: 5, author: 'Amit Joshi', text: 'Strikers got a steal!', timestamp: '1h ago' },
      { id: 6, author: 'Neha Patil', text: 'Well deserved bro', timestamp: '30min ago' },
    ],
    timestamp: '8h ago',
    liked: false,
  },
  {
    id: 4,
    author: 'Priya Singh',
    avatar: 'PS',
    sport: 'Football',
    city: 'Bangalore',
    type: 'achievement',
    text: '⭐ 100 matches completed on Gully World! From weekend kickabouts to city tournaments — this platform changed my game. Grateful for every team that gave me a chance. Here\'s to the next 100! ⚽',
    media: { kind: 'photo', name: 'milestone-100.jpg' },
    likes: 112,
    comments: [
      { id: 7, author: 'Sneha Iyer', text: 'Legend! 💯', timestamp: '6h ago' },
    ],
    timestamp: '12h ago',
    liked: false,
  },
  {
    id: 5,
    author: 'Arjun Patel',
    avatar: 'AP',
    sport: 'Cricket',
    city: 'Mumbai',
    type: 'update',
    text: 'Looking for a left-arm spinner for our team in the upcoming Andheri Night League. DM me or check my team page on Gully World. Trials this Saturday at Azad Maidan. 🏏',
    likes: 19,
    comments: [],
    timestamp: '1d ago',
    liked: false,
  },
  {
    id: 6,
    author: 'Dev Kumar',
    avatar: 'DK',
    sport: 'Football',
    city: 'Bangalore',
    type: 'tournament',
    text: 'Our 5-a-side team "Street FC" just qualified for the Gully World City Finals! 🎉 Semi-final hat trick sealed it. See you all at the finals next Sunday!',
    media: { kind: 'video', name: 'hattrick-goals.mp4' },
    likes: 85,
    comments: [
      { id: 8, author: 'Priya Singh', text: 'That third goal was INSANE 🤯', timestamp: '4h ago' },
      { id: 9, author: 'Karthik Reddy', text: 'Finals here we come!', timestamp: '3h ago' },
    ],
    timestamp: '1d ago',
    liked: false,
  },
]

export default function FeedPage({
  isLoggedIn,
  onAddNotification,
}: {
  isLoggedIn?: boolean
  onAddNotification?: (author: string, action: 'mention' | 'tag' | 'like' | 'comment' | 'follow', text: string) => void
}) {
  const [posts, setPosts] = useState<FeedPost[]>(samplePosts)
  const [showComposer, setShowComposer] = useState(false)
  const [postText, setPostText] = useState('')
  const [postType, setPostType] = useState<PostType>('update')
  const [mediaFile, setMediaFile] = useState<{ kind: 'photo' | 'video'; name: string } | null>(null)
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({})
  const [filterType, setFilterType] = useState<PostType | 'all'>('all')
  const [activeCity, setActiveCity] = useState('Bangalore')
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginPopupReason, setLoginPopupReason] = useState('Login to explore more Community features.')

  useEffect(() => {
    const savedCity = localStorage.getItem('gullyworld-city') || 'Bangalore'
    setActiveCity(savedCity)
  }, [])

  function requestLogin(reason: string) {
    setLoginPopupReason(reason)
    setShowLoginPopup(true)
  }

  function handleMediaUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const ext = file.name.split('.').pop()?.toLowerCase() ?? ''
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp']
    const videoExts = ['mp4', 'mov', 'webm', 'avi']

    if (imageExts.includes(ext)) {
      setMediaFile({ kind: 'photo', name: file.name })
    } else if (videoExts.includes(ext)) {
      setMediaFile({ kind: 'video', name: file.name })
    }
  }

  function handlePost() {
    if (!isLoggedIn) {
      requestLogin('Login to create posts, upload media, and share your moments.')
      return
    }

    if (!postText.trim()) return

    const newPost: FeedPost = {
      id: Date.now(),
      author: 'You',
      avatar: 'YO',
      sport: 'Cricket',
      city: activeCity,
      type: postType,
      text: postText.trim(),
      media: mediaFile ?? undefined,
      likes: 0,
      comments: [],
      timestamp: 'Just now',
      liked: false,
    }

    setPosts((prev) => [newPost, ...prev])
    
    // Detect mentions
    const mentionRegex = /@(\w+)/g
    const mentions = postText.match(mentionRegex) || []
    
    mentions.forEach((mention) => {
      const mentionedName = mention.slice(1)
      if (mentionedName.toLowerCase() !== 'you' && onAddNotification) {
        onAddNotification(newPost.author, 'mention', `mentioned @${mentionedName} in a ${postType} post`)
      }
    })
    
    // Notify if you're tagged
    if (postText.toLowerCase().includes('you') && onAddNotification) {
      onAddNotification(newPost.author, 'tag', `tagged you in their ${postType} post`)
    }

    setPostText('')
    setPostType('update')
    setMediaFile(null)
    setShowComposer(false)
  }

  function toggleLike(postId: number) {
    if (!isLoggedIn) {
      requestLogin('Login to like and react to posts.')
      return
    }

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          if (!post.liked && onAddNotification) {
            onAddNotification(post.author, 'like', `liked your ${post.type} post`)
          }
          return { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        }
        return post
      }),
    )
  }

  function addComment(postId: number) {
    if (!isLoggedIn) {
      requestLogin('Login to join the conversation and comment.')
      return
    }

    const text = commentInputs[postId]?.trim()
    if (!text) return

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          if (onAddNotification) {
            onAddNotification('You', 'comment', `commented on ${post.author}'s ${post.type} post`)
          }
          return {
            ...post,
            comments: [
              ...post.comments,
              { id: Date.now(), author: 'You', text, timestamp: 'Just now' },
            ],
          }
        }
        return post
      }),
    )
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }))
  }

  const filteredPosts =
    filterType === 'all' ? posts : posts.filter((p) => p.type === filterType)

  return (
    <div className="subpage">
      <div className="subpage-content feed-content-top">
        <div className="feed-layout">
          {/* Left sidebar */}
          <aside className="feed-sidebar">
            {isLoggedIn ? (
              <>
                <div className="feed-profile-card">
                  <div className="feed-profile-cover"></div>
                  <div className="feed-profile-avatar">YO</div>
                  <strong>Your Profile</strong>
                  <span className="feed-profile-city">📍 {activeCity}</span>
                  <div className="feed-profile-stats">
                    <div className="feed-profile-stat-row">
                      <span>Profile viewers</span>
                      <strong>47</strong>
                    </div>
                    <div className="feed-profile-stat-row">
                      <span>Post impressions</span>
                      <strong>10</strong>
                    </div>
                  </div>
                </div>

                <div className="feed-sidebar-links-card">
                  <button type="button" className="feed-sidebar-link">🔖 Saved items</button>
                  <button type="button" className="feed-sidebar-link">👥 Groups</button>
                  <button type="button" className="feed-sidebar-link">📰 Newsletters</button>
                  <button type="button" className="feed-sidebar-link">📅 Events</button>
                </div>
              </>
            ) : (
              <div className="feed-guest-note-card">
                <h4>Welcome to Community</h4>
                <p>Browse all public posts. Login to post, like, comment, follow players, and unlock your network.</p>
                <button type="button" className="feed-guest-login-btn" onClick={() => requestLogin('Login to explore more Community features and grow your sports profile.')}>Explore More Features</button>
              </div>
            )}

            <div className="feed-filter-card">
              <h4>Filter Feed</h4>
              <button
                type="button"
                className={`feed-filter-pill${filterType === 'all' ? ' active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All Posts
              </button>
              {(Object.keys(postTypeLabels) as PostType[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`feed-filter-pill${filterType === key ? ' active' : ''}`}
                  onClick={() => setFilterType(key)}
                >
                  {postTypeLabels[key].icon} {postTypeLabels[key].label}
                </button>
              ))}
            </div>

            <div className="feed-trending-card">
              <h4>Trending Topics</h4>
              <div className="feed-trending-item">
                <span>#IPL2026</span>
                <small>2.4k posts</small>
              </div>
              <div className="feed-trending-item">
                <span>#GullyWorldCup</span>
                <small>1.8k posts</small>
              </div>
              <div className="feed-trending-item">
                <span>#WeekendCricket</span>
                <small>960 posts</small>
              </div>
              <div className="feed-trending-item">
                <span>#HireMe</span>
                <small>720 posts</small>
              </div>
              <div className="feed-trending-item">
                <span>#AuctionPick</span>
                <small>540 posts</small>
              </div>
            </div>
          </aside>

          {/* Main feed */}
          <div className="feed-main">
            {/* LinkedIn-style compose box */}
            <div className="feed-compose-card">
              <div className="feed-compose-top-row">
                <span className="feed-quick-avatar">{isLoggedIn ? 'YO' : 'GW'}</span>
                {isLoggedIn && showComposer ? (
                  <div style={{ flex: 1 }}>
                    <div className="feed-composer-type-row" style={{ marginBottom: 8 }}>
                      {(Object.keys(postTypeLabels) as PostType[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          className={`feed-type-chip${postType === key ? ' active' : ''}`}
                          style={
                            postType === key
                              ? { borderColor: postTypeLabels[key].color, color: postTypeLabels[key].color }
                              : undefined
                          }
                          onClick={() => setPostType(key)}
                        >
                          {postTypeLabels[key].icon} {postTypeLabels[key].label}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="feed-composer-textarea"
                      placeholder="Share your sports moment... Won a match? Got picked in auction? Completed a challenge?"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      rows={4}
                      autoFocus
                    />
                    {mediaFile ? (
                      <div className="feed-media-preview">
                        <span>{mediaFile.kind === 'photo' ? '🖼️' : '🎬'} {mediaFile.name}</span>
                        <button type="button" onClick={() => setMediaFile(null)}>✕</button>
                      </div>
                    ) : null}
                    <div className="feed-composer-actions">
                      <div className="feed-composer-media-btns">
                        <label className="feed-media-btn">
                          📷 Photo
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            hidden
                            onChange={handleMediaUpload}
                          />
                        </label>
                        <label className="feed-media-btn">
                          🎥 Video
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            hidden
                            onChange={handleMediaUpload}
                          />
                        </label>
                      </div>
                      <div className="feed-composer-submit-row">
                        <button
                          type="button"
                          className="feed-cancel-btn"
                          onClick={() => {
                            setShowComposer(false)
                            setPostText('')
                            setMediaFile(null)
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="feed-post-btn"
                          disabled={!postText.trim()}
                          onClick={handlePost}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="feed-start-post-input"
                    onClick={() => {
                      if (!isLoggedIn) {
                        requestLogin('Login to create posts and upload photos/videos.')
                        return
                      }
                      setShowComposer(true)
                    }}
                  >
                    {isLoggedIn ? 'Start a post' : 'Start a post (Login required)'}
                  </button>
                )}
              </div>
              {!showComposer && (
                <div className="feed-compose-actions-row">
                  {isLoggedIn ? (
                    <label className="feed-compose-action-btn">
                      <span className="feed-compose-action-icon" style={{ color: '#16a34a' }}>▶</span> Video
                      <input type="file" accept="video/*" hidden onChange={handleMediaUpload} />
                    </label>
                  ) : (
                    <button type="button" className="feed-compose-action-btn" onClick={() => requestLogin('Login to upload videos and create rich posts.')}>
                      <span className="feed-compose-action-icon" style={{ color: '#16a34a' }}>▶</span> Video
                    </button>
                  )}
                  {isLoggedIn ? (
                    <label className="feed-compose-action-btn">
                      <span className="feed-compose-action-icon" style={{ color: '#3b82f6' }}>🖼️</span> Photo
                      <input type="file" accept="image/*" hidden onChange={handleMediaUpload} />
                    </label>
                  ) : (
                    <button type="button" className="feed-compose-action-btn" onClick={() => requestLogin('Login to upload photos and create posts.')}>
                      <span className="feed-compose-action-icon" style={{ color: '#3b82f6' }}>🖼️</span> Photo
                    </button>
                  )}
                  <button
                    type="button"
                    className="feed-compose-action-btn"
                    onClick={() => {
                      if (!isLoggedIn) {
                        requestLogin('Login to write and publish posts.')
                        return
                      }
                      setShowComposer(true)
                    }}
                  >
                    <span className="feed-compose-action-icon" style={{ color: '#ef4444' }}>📝</span> Write article
                  </button>
                </div>
              )}
            </div>

            {/* Sort row */}
            <div className="feed-sort-row">
              <hr className="feed-sort-line" />
              <span className="feed-sort-label">
                Select feed view: <strong>Most relevant first</strong> ▾
              </span>
            </div>

            {/* Posts */}
            {filteredPosts.map((post) => (
              <article key={post.id} className="feed-post">
                <div className="feed-post-header">
                  <div className="feed-post-avatar">{post.avatar}</div>
                  <div className="feed-post-meta">
                    <div className="feed-post-author-row">
                      <strong>{post.author}</strong>
                      <span
                        className="feed-post-type-badge"
                        style={{ background: `${postTypeLabels[post.type].color}18`, color: postTypeLabels[post.type].color }}
                      >
                        {postTypeLabels[post.type].icon} {postTypeLabels[post.type].label}
                      </span>
                    </div>
                    <div className="feed-post-subline">
                      <span>{post.sport}</span>
                      <span>·</span>
                      <span>📍 {post.city}</span>
                      <span>·</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className="feed-post-text">{post.text}</p>

                {post.media ? (
                  <div className="feed-post-media">
                    {post.media.kind === 'photo' ? (
                      <div className="feed-media-placeholder photo">
                        <span>🖼️</span>
                        <p>{post.media.name}</p>
                      </div>
                    ) : (
                      <div className="feed-media-placeholder video">
                        <span>▶</span>
                        <p>{post.media.name}</p>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="feed-post-stats">
                  <span>{post.likes > 0 ? `👍 ${post.likes}` : ''}</span>
                  <span>{post.comments.length > 0 ? `${post.comments.length} comments` : ''}</span>
                </div>

                <div className="feed-post-actions">
                  <button
                    type="button"
                    className={`feed-action-btn${post.liked ? ' liked' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    {post.liked ? '👍' : '👍'} {post.liked ? 'Liked' : 'Like'}
                  </button>
                  <button type="button" className="feed-action-btn" onClick={() => !isLoggedIn && requestLogin('Login to comment and interact with posts.') }>
                    💬 Comment
                  </button>
                  <button type="button" className="feed-action-btn" onClick={() => !isLoggedIn && requestLogin('Login to share posts and grow your network.') }>
                    🔄 Share
                  </button>
                </div>

                {/* Comments section */}
                {post.comments.length > 0 ? (
                  <div className="feed-comments">
                    {post.comments.map((c) => (
                      <div key={c.id} className="feed-comment">
                        <strong>{c.author}</strong>
                        <span>{c.text}</span>
                        <small>{c.timestamp}</small>
                      </div>
                    ))}
                  </div>
                ) : null}

                {isLoggedIn ? (
                  <div className="feed-comment-input-row">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentInputs[post.id] ?? ''}
                      onChange={(e) =>
                        setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') addComment(post.id)
                      }}
                    />
                    <button type="button" onClick={() => addComment(post.id)}>
                      Post
                    </button>
                  </div>
                ) : (
                  <button type="button" className="feed-login-inline-btn" onClick={() => requestLogin('Login to comment on this post.') }>
                    Login to comment
                  </button>
                )}
              </article>
            ))}

            {filteredPosts.length === 0 ? (
              <div className="feed-empty">
                <h3>No posts yet</h3>
                <p>Be the first to share a sports update in your area!</p>
              </div>
            ) : null}
          </div>

          {/* Right sidebar */}
          <aside className="feed-sidebar feed-sidebar-right">
            <div className="feed-suggested-card">
              <h4>Add to your feed</h4>
              <div className="feed-suggested-item">
                <div className="feed-suggested-avatar">AM</div>
                <div>
                  <strong>Amit Mishra</strong>
                  <span>Cricket · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
              <div className="feed-suggested-item">
                <div className="feed-suggested-avatar">NK</div>
                <div>
                  <strong>Neha Kapoor</strong>
                  <span>Badminton · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
              <div className="feed-suggested-item">
                <div className="feed-suggested-avatar">VR</div>
                <div>
                  <strong>Vikram Rathod</strong>
                  <span>Football · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
              <div className="feed-suggested-item">
                <div className="feed-suggested-avatar">RP</div>
                <div>
                  <strong>Riya Patel</strong>
                  <span>Cricket · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
            </div>

            <div className="feed-live-card">
              <div className="feed-live-dot"></div>
              <h4>Live Now</h4>
              <div className="feed-live-item">
                <span>🏏</span>
                <div>
                  <strong>Koramangala Premier League</strong>
                  <small>Finals · 2 teams</small>
                </div>
              </div>
              <div className="feed-live-item">
                <span>⚽</span>
                <div>
                  <strong>HSR 5-a-side Cup</strong>
                  <small>Semi Finals · Live</small>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {showLoginPopup ? (
        <div className="feed-login-popup-overlay" role="dialog" aria-label="Login required" onClick={() => setShowLoginPopup(false)}>
          <div className="feed-login-popup" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="feed-login-popup-close" onClick={() => setShowLoginPopup(false)} aria-label="Close popup">✕</button>
            <p className="feed-login-popup-badge">Unlock full Gully World</p>
            <h3>Login or Signup to explore more features</h3>
            <p>{loginPopupReason}</p>
            <ul className="feed-login-popup-benefits">
              <li>Create posts and upload photos/videos</li>
              <li>Like, comment, and follow top players</li>
              <li>Get notifications when someone tags or mentions you</li>
              <li>Build your sports profile and get discovered faster</li>
            </ul>
            <div className="feed-login-popup-actions">
              <Link to="/login" className="feed-login-popup-primary">Login</Link>
              <Link to="/login" className="feed-login-popup-tertiary">Signup</Link>
              <button type="button" className="feed-login-popup-secondary" onClick={() => setShowLoginPopup(false)}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
