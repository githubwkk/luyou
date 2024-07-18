import ArticleList from '@/views/home/ArticleList.vue'
import singleArticle from '@/views/home/single/singleArticle.vue'

export default [
  {
    path: '/ArticleListHome',
    name: 'ArticleListHome',
    component: ArticleList
  },
  {
    path: '/singleArticle',
    name: 'singleArticle',
    component: singleArticle
  }
]
