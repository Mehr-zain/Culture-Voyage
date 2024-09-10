const AppRoutes = {
    register: {
        name: 'Create Account',
        route: '/register'
    },
    home: {
        label: 'Home',
        route: '/'
    },
    communities: {
        label: 'communities',
        route: 'communities'
    },
    communityDetailPage: {
        label: 'Community Detail',
        route: 'community/:id',
        baseRoute: '/community'
    },
    postDetailPage: {
        label: 'Community Detail',
        route: 'post/:id',
        baseRoute: 'post'
    },
    createPost: {
        label: 'Create Post',
        route: 'create-post'
    },
    profile: {
        label: 'profile',
        route: 'profile/:id',
        baseRoute: 'profile'
    },
    editProfile: {
        label: 'Edit Profile',
        route: '/edit/profile/:id',
        baseRoute: '/edit/profile'
    },
    editPost: {
        label: 'Edit Post',
        route: 'edit/post/:id',
        baseRoute: 'edit/post'

    },
    communityChatPage: {
        label: 'Community Chat',
        route: 'communitychat/:id',
        baseRoute: 'communitychat'

    },
    userChat: {
        label: 'User Chat',
        route: 'userchat/:id',
        baseRoute: 'userchat'

    },

}
export { AppRoutes }