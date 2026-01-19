type ClarityConfig = {
  id: string
}

let clarityLoaded = false

export function initClarity({ id }: ClarityConfig): void {
  if (clarityLoaded) {
    return
  }

  if (typeof window === 'undefined') {
    return
  }

  const scriptId = 'clarity-script'
  if (document.getElementById(scriptId)) {
    clarityLoaded = true
    return
  }

  const script = document.createElement('script')
  script.id = scriptId
  script.async = true
  script.innerHTML =
    "(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};" +
    "t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;" +
    "y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','" +
    id +
    "');"
  document.head.appendChild(script)
  clarityLoaded = true
}
