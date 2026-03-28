export type Notification = {
  id: number
  author: string
  action: 'mention' | 'tag' | 'like' | 'comment' | 'follow'
  text: string
  timestamp: string
  read: boolean
}

export type User = {
  name: string
  avatar: string
  initials: string
}
