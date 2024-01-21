interface UserTrackingInterface {
  name: string;
  contactInviteId: string;
  posts: string[];
}

interface PostItemInterface {
  userId: string;
  createdAt: Date;
  updatedAt?: Date;
  editedAt?: Date;
}

interface FeedItemInterface {
  text: string;
  cost: number;
  postItemId: string;
}

interface PostFeedDataInterface {
  users: Map<string, UserTrackingInterface>;
  postItems: Map<string, PostItemInterface>;
  feed: FeedItemInterface[];
  time: Date;
}

interface CookieInterface {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: number;
  size?: number;
  httpOnly?: boolean;
  secure?: boolean;
  session?: boolean;
}

interface PostInterface {
  postItemId: string;
  userId: string;
  text: string;
  groupId: string;
  permissions: {
    comment: boolean;
    canEmojify: boolean;
    follow: boolean;
  };
  createdAt: number;
  updatedAt?: number;
  editedAt?: number;
  hashTags: Array<string>;
  follows: boolean;
}

interface UserInterface {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  contactInviteId: string;
}

interface GroupInterface {
  id: string;
  name: string;
  color: {
    defaultColor: string;
    light: string;
    dark: string;
    background: string;
  };
  _links: {
    self: {
      href: string;
    };
    groupAvatar: {
      href: string;
      templated: boolean;
    };
  };
}

interface MediaInterface {
  mediaId: string;
  postItemId: string;
  photo: {
    id: string;
    size: {
      width: number;
      height: number;
    };
    mime: string;
    _links: {
      img: {
        href: string;
        templated: boolean;
      };
    };
  };
}

interface ResponseFeedItemInterface {
  postItemId: string;
  userId: string;
  text: string;
  mediasCount: number;
  photosCount: number;
  groupId: string;
  permissions: {
    comment: boolean;
    canEmojify: boolean;
    download: boolean;
    follow: boolean;
  };
  createdAt: number;
  updatedAt: number;
  hashTags: string[];
  follows: boolean;
  medias?: MediaInterface[];
}

interface ResponseInterface {
  feed: ResponseFeedItemInterface[];
  order: string;
  users: UserInterface[];
  groups: GroupInterface[];
  _links: {
    self: {
      href: string;
    };
    nextPage: {
      href: string;
    };
  };
}
