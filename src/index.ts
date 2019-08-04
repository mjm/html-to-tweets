import { convert } from "./convert"
import { split } from "./split"

interface TranslateInput {
  title: string | null
  url: string
  html: string
}

export type TwitterAction = Tweet | Retweet

export interface Tweet {
  action: "tweet"
  body: string
  mediaURLs: string[]
}

export interface Retweet {
  action: "retweet"
  tweetID: string
}

export function translate(input: TranslateInput): TwitterAction[] {
  if (input.title) {
    return [
      {
        action: "tweet",
        body: `${input.title} ${input.url}`,
        mediaURLs: [],
      },
    ]
  }

  const result = convert(input.html, { baseURL: input.url })
  const tweets = split(result)
  if (tweets.length === 1) {
    const retweetID = extractRetweetId(tweets[0])
    if (retweetID) {
      return [
        {
          action: "retweet",
          tweetID: retweetID,
        },
      ]
    }
  }

  return tweets
}

const tweetRegex = new RegExp(
  "^https?://(?:www.)?twitter.com/[A-Za-z0-9_]+/status/([0-9]+)/?$"
)

function extractRetweetId(tweet: Tweet): string | null {
  if (tweet.mediaURLs.length) {
    // if the tweet has media, it's not a retweet
    return null
  }

  const match = tweet.body.match(tweetRegex)
  if (!match) {
    return null
  }

  return match[1]
}
