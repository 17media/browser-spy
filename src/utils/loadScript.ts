export function loadScript(src: string) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.defer = true;
  script.src = src;

  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode!.insertBefore(script, firstScript);

  return new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
}

export function loadScripts(...src: string[]) {
  return Promise.all(src.map(loadScript));
}
