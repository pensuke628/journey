// お気に入り
export interface Bookmark {
  id?: number
  userId?: number
  houseId: number
}

export interface Comment {
  id?: number
  content: string
  userId: number | undefined
  reviewId: number
}

export interface CommentUpdateParams {
  content: string
  reviewId: number
}

// 口コミ削除を依頼する時のパラメータ
export interface DeleteRequest {
  userId: number | undefined
  reviewId: number
}

// フォロー
export interface Follow {
  id?: number
  followedId: number | undefined
  followerId: number | undefined
}

export interface Image {
  id: number
  image: {
    url: string
  }
  reviewId: number
  createdAt: Date
  updatedAt: Date
}

// ハウス
export interface HouseData {
  id: number
  name: string
  postalCode: string
  prefectures: string
  municipalities: string
  latitude: number | undefined
  longitude: number | undefined
  image: {
    url: string
  }
  profile: string
  phoneNumber: string
  email: string
  relatedWebsite: string
  price: string
  period: string
  checkInTime: string
  checkOutTime: string
  capacity: string
  parking: string
  bath: string
  shopping: string
  note: string
  tags: Tag[] | undefined
}

export interface Image {
  id: number
  image: {
    url: string
  }
}

// いいね
export interface Like {
  id?: number
  userId?: number | undefined | null
  reviewId: number | undefined | null
}

export interface Message {
  content: string
  userId: number | undefined
  messageRoomId: number
  toUserOpentime: Date | null
  reviewId?: number | undefined
  createdAt?: Date
  updatedAt?: Date
}

export interface MessageRoom {
  messageRoom :{
    id: number
  }
  otherUser: UserData
  lastMessage: Message
}

// 通知
export interface Notification {
  senderId: number | undefined,
  receiverId: number | undefined,
  reviewId : number | undefined,
  commentId : number | undefined,
  messageId : number | undefined,
  act : string,
  checked: boolean | undefined,
  createdAt: Date | undefined,
  updatedAt: Date | undefined,
}

export interface Owner {
  userId: number | undefined
  houseId: number
}

// 口コミ作成
export interface ReviewParams {
  content: string
  date: Date
  houseId: number
  evaluation: number
  tags: string[] | undefined
}

// 口コミ修正
export interface ReviewUpdateParams {
  content: string
}

// 口コミ
export interface ReviewData {
  id: number
  content: string
  date: Date
  userId: number
  houseId: number
  evaluation: number
  createdAt: Date
  updatedAt: Date
  comments: Comment[]
  tags: Tag[] | undefined
  images: Image[]
}

// サインアップ
export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

// サインイン
export interface SignInParams {
  email: string
  password: string
}

export interface Tag {
  id: number
  name: string
  createdAt: Date
  updatedAt: Date
}

// タグ検索時のinterface
export interface TagSearch {
  name: string
}

// ユーザー
export interface UserData {
  id: number
  name: string
  email: string
  avatar: {
    url: string
  }
  profile: string
  backgroundImage: string
  provider: string
  uid: string
  allowPasswordChange: boolean
  createdAt?: Date
  updatedAt?: Date
  reviews: ReviewData[]
  likes: ReviewData[]
  following: UserData[]
  followers: UserData[]
}