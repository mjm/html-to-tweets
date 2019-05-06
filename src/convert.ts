import * as htmlparser from "htmlparser2"

function convert(html: string): ConvertResult {
  const handler = new TweetHandler()

  const parser = new htmlparser.Parser(handler as any, { decodeEntities: true })
  parser.write(html)
  parser.end()

  return handler.result
}

interface ConvertResult {
  text: string
  mediaURLs: string[]
}

class TweetHandler {
  text: string = ""
  mediaURLs: string[] = []
  urls: string[] = []
  linkedTwitterUser: string | null = null
  embeddedTweet: { url?: string } | null = null

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
            this.urls.push(attrs.href)
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
          this.mediaURLs.push(attrs.src)
        }
        break
    }
  }

  ontext(text: string) {
    if (this.linkedTwitterUser || this.embeddedTweet) {
      return
    }

    this.text += text
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
            this.urls.push(this.embeddedTweet.url)
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
    this.text = this.text.trim()
  }

  get result(): ConvertResult {
    return {
      text: this.text,
      mediaURLs: this.mediaURLs,
    }
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

export default convert
