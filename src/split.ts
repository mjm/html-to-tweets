import { parseTweet, ParsedTweet } from "twitter-text"
import { Tweet } from "./"
import { ConvertResult } from "./convert"

export function split(input: ConvertResult): Tweet[] {
  const [first, ...rest] = numberTweets(splitTweets(input.body))
  return [
    { action: "tweet", body: first, mediaURLs: input.mediaURLs },
    ...rest.map((t): Tweet => ({ action: "tweet", body: t, mediaURLs: [] })),
  ]
}

function splitTweets(text: string, tweets: string[] = []): string[] {
  const [first, rest] = splitOnce(text)
  tweets.push(first)

  if (rest) {
    return splitTweets(rest, tweets)
  }

  return tweets
}

function splitOnce(text: string): [string, string?] {
  const first = shorten(text)

  const second = text.substring(first.length).trim()
  if (second) {
    return [first, second]
  }

  return [first]
}

function shorten(text: string): string {
  let results = parseTweet(text)
  if (!results.valid) {
    // drop a word to make room for numbering
    text = dropWord(truncate(text, results))

    // keep dropping words until it fits
    while ((results = parseTweet(`${text} (XX/XX)`)) && !results.valid) {
      text = dropWord(text)
    }
  }

  return text
}

function truncate(
  text: string,
  { validRangeStart, validRangeEnd }: ParsedTweet
): string {
  return text.substring(validRangeStart, validRangeEnd)
}

function dropWord(text: string): string {
  return text.replace(/\s+\S*$/, "")
}

function numberTweets(tweets: string[]): string[] {
  const total = tweets.length

  if (total <= 1) {
    return tweets
  }

  return tweets.map((t, i) => `${t} (${i + 1}/${total})`)
}
