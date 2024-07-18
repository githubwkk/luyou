const Login = () => import('@/views/login/index.vue')
const Register = () => import('@/views/login/register.vue')

export default [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  }
]
