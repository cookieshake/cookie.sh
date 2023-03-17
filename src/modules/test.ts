import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment'

export function onRouteDidUpdate({location, previousLocation}) {
  const footnotes = document.querySelectorAll('.footnote-ref')
  footnotes.forEach((fn, index) => {
    fn.addEventListener('mouseover', (e: Event) => {

    })

    fn.addEventListener('mouseout',  (e: Event) => {

    })
  })
}