import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCity } from '../hooks'
import styles from './FeedPage.module.css'

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
  const [activeCity] = useCity()
  const [showLoginPopup, setShowLoginPopup] = useState(false)
  const [loginPopupReason, setLoginPopupReason] = useState('Login to explore more Community features.')

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
      <div className={`subpage-content ${styles.feedContentTop}`}>
        <div className={styles.feedLayout}>
          {/* Left sidebar */}
          <aside className={styles.feedSidebar}>
            {isLoggedIn ? (
              <>
                <div className={styles.feedProfileCard}>
                  <div className={styles.feedProfileCover}></div>
                  <div className={styles.feedProfileAvatar}>YO</div>
                  <strong>Your Profile</strong>
                  <span className={styles.feedProfileCity}>📍 {activeCity}</span>
                  <div className={styles.feedProfileStats}>
                    <div className={styles.feedProfileStatRow}>
                      <span>Profile viewers</span>
                      <strong>47</strong>
                    </div>
                    <div className={styles.feedProfileStatRow}>
                      <span>Post impressions</span>
                      <strong>10</strong>
                    </div>
                  </div>
                </div>

                <div className={styles.feedSidebarLinksCard}>
                  <button type="button" className={styles.feedSidebarLink}>🔖 Saved items</button>
                  <button type="button" className={styles.feedSidebarLink}>👥 Groups</button>
                  <button type="button" className={styles.feedSidebarLink}>📰 Newsletters</button>
                  <button type="button" className={styles.feedSidebarLink}>📅 Events</button>
                </div>
              </>
            ) : (
              <div className={styles.feedGuestNoteCard}>
                <h4>Welcome to Community</h4>
                <p>Browse all public posts. Login to post, like, comment, follow players, and unlock your network.</p>
                <button type="button" className={styles.feedGuestLoginBtn} onClick={() => requestLogin('Login to explore more Community features and grow your sports profile.')}>Explore More Features</button>
              </div>
            )}

            <div className={styles.feedFilterCard}>
              <h4>Filter Feed</h4>
              <button
                type="button"
                className={`${styles.feedFilterPill}${filterType === 'all' ? ' active' : ''}`}
                onClick={() => setFilterType('all')}
              >
                All Posts
              </button>
              {(Object.keys(postTypeLabels) as PostType[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`${styles.feedFilterPill}${filterType === key ? ' active' : ''}`}
                  onClick={() => setFilterType(key)}
                >
                  {postTypeLabels[key].icon} {postTypeLabels[key].label}
                </button>
              ))}
            </div>

            <div className={styles.feedTrendingCard}>
              <h4>Trending Topics</h4>
              <div className={styles.feedTrendingItem}>
                <span>#IPL2026</span>
                <small>2.4k posts</small>
              </div>
              <div className={styles.feedTrendingItem}>
                <span>#GullyWorldCup</span>
                <small>1.8k posts</small>
              </div>
              <div className={styles.feedTrendingItem}>
                <span>#WeekendCricket</span>
                <small>960 posts</small>
              </div>
              <div className={styles.feedTrendingItem}>
                <span>#HireMe</span>
                <small>720 posts</small>
              </div>
              <div className={styles.feedTrendingItem}>
                <span>#AuctionPick</span>
                <small>540 posts</small>
              </div>
            </div>
          </aside>

          {/* Main feed */}
          <div className={styles.feedMain}>
            {/* LinkedIn-style compose box */}
            <div className={styles.feedComposeCard}>
              <div className={styles.feedComposeTopRow}>
                <span className={styles.feedQuickAvatar}>{isLoggedIn ? 'YO' : 'GW'}</span>
                {isLoggedIn && showComposer ? (
                  <div style={{ flex: 1 }}>
                    <div className={styles.feedComposerTypeRow} style={{ marginBottom: 8 }}>
                      {(Object.keys(postTypeLabels) as PostType[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          className={`${styles.feedTypeChip}${postType === key ? ' active' : ''}`}
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
                      className={styles.feedComposerTextarea}
                      placeholder="Share your sports moment… Won a match? Got picked in auction?"
                      aria-label="Compose a post"
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      rows={4}
                    />
                    {mediaFile ? (
                      <div className={styles.feedMediaPreview}>
                        <span>{mediaFile.kind === 'photo' ? '🖼️' : '🎬'} {mediaFile.name}</span>
                        <button type="button" onClick={() => setMediaFile(null)}>✕</button>
                      </div>
                    ) : null}
                    <div className={styles.feedComposerActions}>
                      <div className={styles.feedComposerMediaBtns}>
                        <label className={styles.feedMediaBtn}>
                          📷 Photo
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            hidden
                            onChange={handleMediaUpload}
                          />
                        </label>
                        <label className={styles.feedMediaBtn}>
                          🎥 Video
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            hidden
                            onChange={handleMediaUpload}
                          />
                        </label>
                      </div>
                      <div className={styles.feedComposerSubmitRow}>
                        <button
                          type="button"
                          className={styles.feedCancelBtn}
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
                          className={styles.feedPostBtn}
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
                    className={styles.feedStartPostInput}
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
                <div className={styles.feedComposeActionsRow}>
                  {isLoggedIn ? (
                    <label className={styles.feedComposeActionBtn}>
                      <span className={styles.feedComposeActionIcon} style={{ color: '#16a34a' }}>▶</span> Video
                      <input type="file" accept="video/*" hidden onChange={handleMediaUpload} />
                    </label>
                  ) : (
                    <button type="button" className={styles.feedComposeActionBtn} onClick={() => requestLogin('Login to upload videos and create rich posts.')}>
                      <span className={styles.feedComposeActionIcon} style={{ color: '#16a34a' }}>▶</span> Video
                    </button>
                  )}
                  {isLoggedIn ? (
                    <label className={styles.feedComposeActionBtn}>
                      <span className={styles.feedComposeActionIcon} style={{ color: '#3b82f6' }}>🖼️</span> Photo
                      <input type="file" accept="image/*" hidden onChange={handleMediaUpload} />
                    </label>
                  ) : (
                    <button type="button" className={styles.feedComposeActionBtn} onClick={() => requestLogin('Login to upload photos and create posts.')}>
                      <span className={styles.feedComposeActionIcon} style={{ color: '#3b82f6' }}>🖼️</span> Photo
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.feedComposeActionBtn}
                    onClick={() => {
                      if (!isLoggedIn) {
                        requestLogin('Login to write and publish posts.')
                        return
                      }
                      setShowComposer(true)
                    }}
                  >
                    <span className={styles.feedComposeActionIcon} style={{ color: '#ef4444' }}>📝</span> Write article
                  </button>
                </div>
              )}
            </div>

            {/* Sort row */}
            <div className={styles.feedSortRow}>
              <hr className={styles.feedSortLine} />
              <span className={styles.feedSortLabel}>
                Select feed view: <strong>Most relevant first</strong> ▾
              </span>
            </div>

            {/* Posts */}
            {filteredPosts.map((post) => (
              <article key={post.id} className={styles.feedPost}>
                <div className={styles.feedPostHeader}>
                  <div className={styles.feedPostAvatar}>{post.avatar}</div>
                  <div className={styles.feedPostMeta}>
                    <div className={styles.feedPostAuthorRow}>
                      <strong>{post.author}</strong>
                      <span
                        className={styles.feedPostTypeBadge}
                        style={{ background: `${postTypeLabels[post.type].color}18`, color: postTypeLabels[post.type].color }}
                      >
                        {postTypeLabels[post.type].icon} {postTypeLabels[post.type].label}
                      </span>
                    </div>
                    <div className={styles.feedPostSubline}>
                      <span>{post.sport}</span>
                      <span>·</span>
                      <span>📍 {post.city}</span>
                      <span>·</span>
                      <span>{post.timestamp}</span>
                    </div>
                  </div>
                </div>

                <p className={styles.feedPostText}>{post.text}</p>

                {post.media ? (
                  <div className={styles.feedPostMedia}>
                    {post.media.kind === 'photo' ? (
                      <div className={`${styles.feedMediaPlaceholder} photo`}>
                        <span>🖼️</span>
                        <p>{post.media.name}</p>
                      </div>
                    ) : (
                      <div className={`${styles.feedMediaPlaceholder} video`}>
                        <span>▶</span>
                        <p>{post.media.name}</p>
                      </div>
                    )}
                  </div>
                ) : null}

                <div className={styles.feedPostStats}>
                  <span>{post.likes > 0 ? `👍 ${post.likes}` : ''}</span>
                  <span>{post.comments.length > 0 ? `${post.comments.length} comments` : ''}</span>
                </div>

                <div className={styles.feedPostActions}>
                  <button
                    type="button"
                    className={`${styles.feedActionBtn}${post.liked ? ' liked' : ''}`}
                    onClick={() => toggleLike(post.id)}
                  >
                    {post.liked ? '👍' : '👍'} {post.liked ? 'Liked' : 'Like'}
                  </button>
                  <button type="button" className={styles.feedActionBtn} onClick={() => !isLoggedIn && requestLogin('Login to comment and interact with posts.') }>
                    💬 Comment
                  </button>
                  <button type="button" className={styles.feedActionBtn} onClick={() => !isLoggedIn && requestLogin('Login to share posts and grow your network.') }>
                    🔄 Share
                  </button>
                </div>

                {/* Comments section */}
                {post.comments.length > 0 ? (
                  <div className={styles.feedComments}>
                    {post.comments.map((c) => (
                      <div key={c.id} className={styles.feedComment}>
                        <strong>{c.author}</strong>
                        <span>{c.text}</span>
                        <small>{c.timestamp}</small>
                      </div>
                    ))}
                  </div>
                ) : null}

                {isLoggedIn ? (
                  <div className={styles.feedCommentInputRow}>
                    <input
                      type="text"
                      placeholder="Write a comment…"
                      aria-label="Write a comment"
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
                  <button type="button" className={styles.feedLoginInlineBtn} onClick={() => requestLogin('Login to comment on this post.') }>
                    Login to comment
                  </button>
                )}
              </article>
            ))}

            {filteredPosts.length === 0 ? (
              <div className={styles.feedEmpty}>
                <h3>No posts yet</h3>
                <p>Be the first to share a sports update in your area!</p>
              </div>
            ) : null}
          </div>

          {/* Right sidebar */}
          <aside className={`${styles.feedSidebar} ${styles.feedSidebarRight}`}>
            <div className={styles.feedSuggestedCard}>
              <h4>Add to your feed</h4>
              <div className={styles.feedSuggestedItem}>
                <div className={styles.feedSuggestedAvatar}>AM</div>
                <div>
                  <strong>Amit Mishra</strong>
                  <span>Cricket · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
              <div className={styles.feedSuggestedItem}>
                <div className={styles.feedSuggestedAvatar}>NK</div>
                <div>
                  <strong>Neha Kapoor</strong>
                  <span>Badminton · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
              <div className={styles.feedSuggestedItem}>
                <div className={styles.feedSuggestedAvatar}>VR</div>
                <div>
                  <strong>Vikram Rathod</strong>
                  <span>Football · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
              <div className={styles.feedSuggestedItem}>
                <div className={styles.feedSuggestedAvatar}>RP</div>
                <div>
                  <strong>Riya Patel</strong>
                  <span>Cricket · {activeCity}</span>
                </div>
                <button type="button" onClick={() => !isLoggedIn && requestLogin('Login to follow players and build your network.')}>Follow</button>
              </div>
            </div>

            <div className={styles.feedLiveCard}>
              <div className={styles.feedLiveDot}></div>
              <h4>Live Now</h4>
              <div className={styles.feedLiveItem}>
                <span>🏏</span>
                <div>
                  <strong>Koramangala Premier League</strong>
                  <small>Finals · 2 teams</small>
                </div>
              </div>
              <div className={styles.feedLiveItem}>
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
        <div className={styles.feedLoginPopupOverlay} role="dialog" aria-label="Login required" onClick={() => setShowLoginPopup(false)}>
          <div className={styles.feedLoginPopup} onClick={(event) => event.stopPropagation()}>
            <button type="button" className={styles.feedLoginPopupClose} onClick={() => setShowLoginPopup(false)} aria-label="Close popup">✕</button>
            <p className={styles.feedLoginPopupBadge}>Unlock full Gully World</p>
            <h3>Login or Signup to explore more features</h3>
            <p>{loginPopupReason}</p>
            <ul className={styles.feedLoginPopupBenefits}>
              <li>Create posts and upload photos/videos</li>
              <li>Like, comment, and follow top players</li>
              <li>Get notifications when someone tags or mentions you</li>
              <li>Build your sports profile and get discovered faster</li>
            </ul>
            <div className={styles.feedLoginPopupActions}>
              <Link to="/login" className={styles.feedLoginPopupPrimary}>Login</Link>
              <Link to="/login" className={styles.feedLoginPopupTertiary}>Signup</Link>
              <button type="button" className={styles.feedLoginPopupSecondary} onClick={() => setShowLoginPopup(false)}>
                Maybe later
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
