import * as React from 'react'
import { Provider, connect } from 'react-redux'
import createStore from '../state/createStore'
import 'isomorphic-fetch'
import { styled} from '../styled'
import { Store } from 'redux'
import PlaygroundWrapper from './PlaygroundWrapper'
import { injectState } from '../state/workspace/actions'

export const store: Store<any> = createStore()

function getParameterByName(name: string): string {
  const url = window.location.href
  name = name.replace(/[\[\]]/g, '\\$&')
  const regexa = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regexa.exec(url)
  if (!results || !results[2]) {
    return ''
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export interface Props {
  endpoint?: string
  subscriptionEndpoint?: string
  history?: any
  match?: any
  headers?: any
}

export interface State {
  endpoint?: string
  subscriptionEndpoint?: string
  shareUrl?: string
  loading: boolean
  headers: any
}

export interface ReduxProps {
  injectState: (state: any) => void
}

class GraphQLBinApp extends React.Component<Props & ReduxProps, State> {
  constructor(props: Props & ReduxProps) {
    super(props)

    this.state = {
      endpoint: props.endpoint,
      subscriptionEndpoint: props.subscriptionEndpoint,
      loading: false,
      headers: props.headers || {},
    }
  }

  componentWillMount() {
    this.setState({ loading: true })

    // DOM side-effect:
    // #loading-wrapper is a hardcoded DOM element in the HTML entrypoint
    const loadingWrapper = document.getElementById('loading-wrapper')

    if (loadingWrapper) {
      loadingWrapper.classList.remove('fadeOut')
    }

    setTimeout(() => {
      if (loadingWrapper) {
        loadingWrapper.remove()
      }
    }, 1000)

    fetch(`${location.href}/_endpoint`, {
      method: 'get',
    })
      .then(res => res.json())
      .then(res => {
        if (loadingWrapper) {
          loadingWrapper.classList.add('fadeOut')
        }

        this.setState({
          endpoint: res.endpoint,
          subscriptionEndpoint: res.subscriptionEndpoint,
          loading: false,
        })
      })
  }

  render() {
    let { endpoint, subscriptionEndpoint } = this.state
    // If no  endpoint passed tries to get one from url
    if (!endpoint) {
      endpoint = getParameterByName('endpoint')
    }
    if (!subscriptionEndpoint) {
      subscriptionEndpoint = getParameterByName('subscription')
    }

    return (
      <Wrapper>
        {this.state.loading ? null : (
          <PlaygroundWrapper
            endpoint={endpoint}
            headers={this.state.headers}
            subscriptionEndpoint={subscriptionEndpoint}
          />
        )}
      </Wrapper>
    )
  }
}

const ConnectedGraphQLBinApp = connect(
  null,
  { injectState },
)(GraphQLBinApp)

// tslint:disable
export default class GraphQLBinAppHOC extends React.Component<Props> {
  render() {
    return (
      <Provider store={store}>
        <ConnectedGraphQLBinApp {...this.props} />
      </Provider>
    )
  }
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
`
