
const main = () => {
  const {
    useEffect,
    useState,
    memo,
    createElement: h,
  } = React

  const { HashRouter, Switch, Route, Link, useParams } = ReactRouterDOM

  const Index = memo(() => {
    const [data, setData] = useState([])

    useEffect(() => {
      fetch('./data.json').then(i => i.json()).then(setData)
    }, [])

    const list = data.map(i => {
      return h('li', {}, [
        h(Link, { to: '/topic/' + i.i }, '[' + i.m + '] ' + i.t)
      ])
    })
    return h('ul', {}, list)
  })

  const Topic = memo(() => {
    const { id } = useParams()
    const [data, setData] = useState()

    const [err, setErr] = useState()

    useEffect(() => {
      fetch('./topics/' + id + '.json')
        .then(i => i.json())
        .then(setData)
        .catch(setErr)
    }, [id])

    if (err) {
      return err.message
    }

    if (!data) {
      return 'loading...'
    }

    if (data && data.talk && data.talk.text) {
      return h('div', {
        style: {
          whiteSpace: 'pre',
        },
        dangerouslySetInnerHTML: { __html: data.talk.text }
      })
    }
  })

  const App = () => {
    return h(HashRouter, {}, [
      h(Switch, {}, [
        h(Route, { path: '/topic/:id' }, h(Topic)),
        h(Route, { path: '/' }, h(Index)),
      ])
    ])
  }

  ReactDOM.render(h(App), document.getElementById('content'))
}

window.onload = main
