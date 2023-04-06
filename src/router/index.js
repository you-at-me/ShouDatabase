import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/HomeView.vue'

Vue.use(Router)

/* 解决频繁刷新某一个路由在控制台出现异常错误的情况 */
const VueRouterPush = Router.prototype.push
Router.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch(err => err)
}

/* 配置路由 */
const router = new Router({
  mode: 'hash', // 运行该项目的模式，可取的值有hash和history,默认值是hash。

  // base: "/", // 默认值: “/”，项目请求应用的基路径，也可称之为应用于部署上线模式的项目根路径，一般应用在生产环境下。例如，如果整个单页应用服务在 /app/ 下，然后 base 就应该设为 “/app/”，所对应请求的url地址也就是会在域名后面添加/app/，所有的路径都将基于/app/路径后面。

  /* 配置各个组件各自的路由规则 */
  routes: [
    {
      // 该路由名称，以后在路径匹配的时候可以直接通过vue语法 :to="{name: 'about'}" 进行路径的匹配，并不需要写一大长串的路径了，name属性值只是该路由的标识，唯一即可。
      name: 'home',
      path: '/', // 路由指定的路径，此处千万不要省略掉斜杠 '/'
      // 指定该路由匹配哪个组件，路由会在匹配到该path路径之后，自行去找这里配置的组件，直接渲染该组件配置的部分页面，并不刷新整个页面。组件需要导入配置。
      component: Home, // 也可以在这里直接引入，不需要变量导入，例如 component: () => import ('@/pages/AboutView'),
      meta: { // $route对象中meta属性对象是用于存放开发者一些自定义的属性的
        isNotAuth: true,
        title: 'about'
      }
    }, {
      name: 'jbrowse',
      path: '/jbrowse',
      component: () => import('../components/JBrowseView.vue'),
      props: function ($route) { // 这种props函数的写法也适用于传递query参数
        return { // 返回对象的key通过props传给对应组件，对应组件也必须根据该所传对象的key通过props获取
          speciesName: $route.query.speciesName,
        }
      }
    }, {
      name: 'gene-search',
      path: '/genome/gene-search',
      component: () => import('../components/GeneSearch.vue'),
      props: function ($route) { // 这种props函数的写法也适用于传递query参数
        return { // 返回对象的key通过props传给对应组件，对应组件也必须根据该所传对象的key通过props获取
          speciesName: $route.query.speciesName,
        }
      }
    }, {
      name: 'gene-annotation',
      path: '/genome/gene-annotation',
      component: () => import('../components/GeneAnnotation.vue'),
    }, {
      name: 'germplasm-resource',
      path: '/germplasm/germplasm-resource',
      component: () => import('../components/GermplasmResource.vue'),
    }, {
      name: 'germplasm-info',
      path: '/germplasm/germplasm-info',
      component: () => import('../components/GermplasmInfo.vue'),
    }
  ]
})

export default router