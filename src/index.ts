import { convert } from "./convert"
import { split } from "./split"

interface TranslateInput {
  title: string | null
  url: string
  html: string
}

export interface Tweet {
  body: string
  mediaURLs: string[]
}

export function translate(input: TranslateInput): Tweet[] {
  if (input.title) {
    return [
      {
        body: `${input.title} ${input.url}`,
        mediaURLs: [],
      },
    ]
  }

  const result = convert(input.html, { baseURL: input.url })
  return split(result)
}
