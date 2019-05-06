import convert from "./convert"

interface TranslateInput {
  title: string | null
  url: string
  html: string
}

interface TranslatedTweet {
  body: string
  mediaURLs: string[]
}

function translate(input: TranslateInput): TranslatedTweet[] {
  if (input.title) {
    return [
      {
        body: `${input.title} ${input.url}`,
        mediaURLs: [],
      },
    ]
  }

  const result = convert(input.html)
  return [result]
}

export default translate
