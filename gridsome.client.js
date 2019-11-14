import Analytics from 'analytics-node'
import nanoid from 'nanoid'

export default (Vue, options, { head, isServer, router }) => {
  const { trackPage, prodKey, devKey } = options

  if (!isServer) {
    // ensures Segment write key is present
    if (!prodKey || prodKey.length < 10) { console.error('segment prodKey must be at least 10 char in length') }

    // if dev key is present, ensures it is at least 10 car in length
    if (devKey && devKey.length < 10) { console.error('if present, devKey must be at least 10 char in length') }

    // use prod write key when in prod env, else use dev write key
    // note below, snippet wont render unless writeKey is truthy
    const writeKey = process.env.NODE_ENV === 'production' ? prodKey : devKey

    const analytics = new Analytics(writeKey)

    Vue.prototype.$analytics = analytics

    if (trackPage) {
      router.afterEach((to, from) => {
        analytics.page({
          anonymousId: nanoid(10),
          name: to.path || '',
          properties: {
            path: to.fullPath,
            referrer: from.fullPath
          }
        })
      })
    }
  }
}

export const defaultOptions = () => ({
  prodKey: '',
  devKey: '',
  trackPage: true
})
