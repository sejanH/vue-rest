import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Posts from './components/Posts'
import NewPost from './components/NewPost'


Vue.use(Router)

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
	{
		path: '/',
		name: 'home',
		component: Home,
		meta: {
			title: 'Home', requiresAuth: false
		}
	},
	{
		name: 'login', path: '/login', component: Login, meta: { title: 'Login', requiresAuth: false}
	},
	{
		name: 'signup', path: '/join', component: Signup, meta: { title: 'Signup', requiresAuth: false }
	},
	{
		name:'posts',path:'/my-posts',component: Posts,meta:{ title:'My Posts',requiresAuth:true, hideFromNav: false},
		children: [
		{
			name: 'new-post', path: 'new', component: NewPost, meta: { title: 'Add new post', requiresAuth: true, hideFromNav: true }
		}
		]
	}
	]
})
