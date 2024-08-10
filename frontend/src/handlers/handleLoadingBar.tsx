import { LoadingBarContextType } from "../hooks/LoadingBarContext";

export function handleLoadingBar(loadingBarRef: LoadingBarContextType | null) {
  loadingBarRef?.current?.staticStart();
  setTimeout(() => {
    loadingBarRef?.current?.complete();
  }, 200);
  // window.addEventListener("load", () => {
  //   console.log("ready");

  //   loadingBarRef?.current?.complete();
  // });
}
