import { split } from "../src/split"

test("does not split if tweet is short enough", () => {
  const input = {
    body: "abcd ".repeat(56),
    mediaURLs: [],
  }

  expect(split(input)).toMatchSnapshot()
})

test("splits tweets along word boundaries", () => {
  const input = {
    body: "abcd ".repeat(57),
    mediaURLs: [],
  }

  expect(split(input)).toMatchSnapshot()
})

// Eventually this behavior should change, but this is it for now
test("attaches all media URLs to the first tweet", () => {
  const input = {
    body: "abcd ".repeat(57),
    mediaURLs: ["https://example.com/foo.jpg", "https://example.com/bar.jpg"],
  }

  expect(split(input)).toMatchSnapshot()
})

test("splits bacon ipsum", () => {
  const body =
    "Bacon ipsum dolor amet andouille rump tongue flank leberkas tail shoulder picanha cupim turducken hamburger brisket. Bacon pastrami capicola, pork chop venison landjaeger rump swine doner kevin frankfurter chuck strip steak jerky. Pork belly kielbasa pork buffalo bresaola. Tenderloin fatback short ribs meatloaf. Meatloaf sausage biltong bacon turkey cow frankfurter. Frankfurter jerky drumstick doner, bacon sausage turducken alcatra pig fatback strip steak."
  const input = { body, mediaURLs: [] }

  expect(split(input)).toMatchSnapshot()
})
