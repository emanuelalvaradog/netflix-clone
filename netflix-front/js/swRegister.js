if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js", {scope:'/'}).catch((err) => {
    console.log(err);
  });
}
