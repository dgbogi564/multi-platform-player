import {Component} from "react"
import {retrieve} from "../../utils/localStorage.jsx"

const OAUTH_CLIENT_ID = "861556708454-d6dlm3lh05idd8npek18k6be8ba3oc68.apps.googleusercontent.com"
const OAUTH_CLIENT_SECRET = "SboVhoG9s0rNafixCSGGKXAT"
const MATCH_PLAYLIST = /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=(.*$)/
const OAUTH_CODE_URL = "https://www.youtube.com/o/oauth2/device/code"
const OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token"
const OAUTH_GRANT_TYPE = "http://oauth.net/grant_type/device/1.0"

export default class Youtube extends Component {
    state = {
        device_code: null,
        token: retrieve("youtube_token", null)
    }

    getCode = () => {
        fetch(OAUTH_CODE_URL, {
                headers: {
                    'User-Agent': window.navigator.userAgent + " Cobalt/Version"
                },
                params: {
                    client_id: OAUTH_CLIENT_ID,
                    scope: OAUTH_CODE_URL
                }
            },
        )

        return axios.request(OAUTH_CODE_URL, {
            method: "post",
            baseURL: OAUTH_CODE_URL,
            headers: {
                'User-Agent': axios.defaults.headers.common['User-Agent'] + " Cobalt/Version"
            },
            params: {
                client_id: OAUTH_CLIENT_ID,
                scope: OAUTH_CODE_URL
            }
        }).data
    }

    getToken = () => {
        const config = axios.create({
            method: "post",
            baseURL: OAUTH_TOKEN_URL,
            params: {
                client_secret: OAUTH_CLIENT_SECRET,
                grant_type: OAUTH_GRANT_TYPE,
                code: this.state.device_code
            }
        })

        let token = axios.request(config).data
        token["expires_at"] = Date.now() + parseInt(token["expires_in"]) * 1000
        return token
    }

    openAuthWindow = () => {
        const response = this.getCode()
        this.setState({device_code: response['device_code']})
        const url = response['verification_url'] + "?user_code=" + response['user_code']
        window.open(url)
    }

    pollToken = () => {

    }

    render() {
        const token = this.state.token


        return (
            <button onClick={this.openAuthWindow}> Youtube Oauth Button Test</button>
        )
    }
}