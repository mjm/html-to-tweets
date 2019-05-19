import * as htmlparser from "htmlparser2"
import { URL } from "url"

export interface ConvertOptions {
  baseURL?: string
}

export function convert(
  html: string,
  options: ConvertOptions = {}
): ConvertResult {
  const handler = new TweetHandler(options)

  const parser = new htmlparser.Parser(handler as any, { decodeEntities: true })
  parser.write(html)
  parser.end()

  return handler.result
}

export interface ConvertResult {
  body: string
  mediaURLs: string[]
}

class TweetHandler {
  options: ConvertOptions
  text: string = ""
  mediaURLs: string[] = []
  urls: string[] = []
  linkedTwitterUser: string | null = null
  embeddedTweet: { url?: string } | null = null

  constructor(options: ConvertOptions) {
    this.options = options
  }

  onopentag(name: string, attrs: { [key: string]: string }) {
    switch (name) {
      case "a":
        if (attrs.href) {
          if (this.embeddedTweet) {
            if (!attrs.href.startsWith("https://twitter.com")) {
              return
            }

            this.embeddedTweet.url = attrs.href.replace(/(.*)\?.*$/, "$1")
            return
          }
          const twitterUser = getTwitterUsername(attrs.href)
          if (twitterUser) {
            this.linkedTwitterUser = twitterUser
          } else {
            this.addURL(attrs.href)
          }
        }
        break
      case "blockquote":
        if (attrs.class === "twitter-tweet") {
          this.embeddedTweet = {}
        } else {
          this.text += "“"
        }
        break
      case "img":
        if (attrs.src) {
          this.addMediaURL(attrs.src)
        }
        break
      case "iframe":
        if (attrs.src) {
          const youtubeURL = getYoutubeLink(attrs.src)
          if (youtubeURL) {
            this.addURL(youtubeURL)
          }
        }
        break
    }
  }

  ontext(text: string) {
    if (this.linkedTwitterUser || this.embeddedTweet) {
      return
    }

    // collapse all whitespace to a single space
    this.text += text.replace(/\s+/g, " ")
  }

  onclosetag(name: string) {
    switch (name) {
      case "p":
        this.text += "\n\n"
        break
      case "br":
        this.text += "\n"
        break
      case "a":
        if (this.linkedTwitterUser) {
          this.text += `@${this.linkedTwitterUser}`
          this.linkedTwitterUser = null
        }
        break
      case "blockquote":
        if (this.embeddedTweet) {
          if (this.embeddedTweet.url) {
            this.addURL(this.embeddedTweet.url)
          }
          this.embeddedTweet = null
        } else {
          this.text += "”"
        }
        break
    }
  }

  onend() {
    this.text = this.text.trim()
    this.text += ` ${this.urls.join(" ")}`
    this.text = this.text
      .split("\n")
      .map(l => l.trim())
      .join("\n")
  }

  get result(): ConvertResult {
    return {
      body: this.text,
      mediaURLs: this.mediaURLs,
    }
  }

  private addURL(url: string) {
    this.urls.push(this.fixURL(url))
  }

  private addMediaURL(url: string) {
    this.mediaURLs.push(this.fixURL(url))
  }

  private fixURL(url: string): string {
    return new URL(url, this.options.baseURL).toString()
  }
}

const twitterUserRegex = new RegExp(
  "^https?://(?:www.)?twitter.com/([A-Za-z0-9_]{1,15})/?$"
)

function getTwitterUsername(url: string): null | string {
  const match = url.match(twitterUserRegex)
  if (!match) {
    return null
  }

  return match[1]
}

const youtubeRegex = new RegExp(
  "^https://www.youtube.com/embed/([A-Za-z0-9_]+)"
)

function getYoutubeLink(url: string): null | string {
  const match = url.match(youtubeRegex)
  if (!match) {
    return null
  }

  const videoID = match[1]
  return `https://www.youtube.com/watch?v=${videoID}`
}
