type ResponseData = {
  errorMessage?: string
  result?: any
}
import icon16 from '~/src/assets/img/icon16.png'
import icon32 from '~/src/assets/img/icon32.png'
const API_NOT_FOUND = 'API_KEY_NOT_FOUND'
const API_KEY_IS_INCORRECT = 'API_KEY_IS_INCORRECT'
const OTHER = 'OTHER'
type ResponseCallback = (response: ResponseData) => void
(() => {
  async function addBookmark(params: {
    url: string
    title?: string
    description?: string
    tags?: string,
    readLater: 'yes' | 'no',
    starred: 'yes' | 'no'
  }) {

    return new Promise((resolve, reject) => {
      (async () => {
        const endPoint = "https://app.interlinkhq.com/bookmarks/add"
        const api = await chrome.storage.local.get("api")

        if (api.api && api.api.length > 0) {
          const query = {
            key: api.api,
            url: params.url,
            title: params.title || "",
            description: params.description || "",
            tags: params.tags || "",
            readlater: params.readLater || 'no',
            starred: params.starred || 'no'
          }

          const requestURL = endPoint + "?" + new URLSearchParams(query)

          const response = await fetch(requestURL)
          if (response.ok) {
            const data = await response.json()
            resolve(data)
          } else {
            if (response.status === 401) {
              reject(API_KEY_IS_INCORRECT)
            } else {
              reject(OTHER)
            }
          }
        } else {
          reject(API_NOT_FOUND)
        }
      })().catch(e => {
        reject(e)
      })
    })

  }


  chrome.action.onClicked.addListener(async (tab) => {
    try {
      if (tab.id) {
        chrome.tabs
          .query({
            currentWindow: true,
            active: true,
          })
          .then(sendMessageToTabs)
          .catch(onError)
      } else {
      }
    } catch (error) {}
  })

  function onError(error: Error) {
    console.error(`Error: ${error}`)
  }

  function sendMessageToTabs(tabs: chrome.tabs.Tab[], message?: any) {
    for (const tab of tabs) {
      chrome.tabs
        .sendMessage(tab.id!, message || { url: tab.url, type: 'save_url' })
        .then((response) => { })
        .catch(onError)
    }
  }

  function handleMessage(
    request: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) {
    switch (request.type) {
      case 'save_article':
        const data = request.data
        addBookmark(data)
        .then(() => {
          sendResponse({ data: "Done" })
        })
        .catch((err) => {
          sendResponse({error: err})
        })
        break;

      case 'content-ready':
        sender.tab?.id
        chrome.action.setIcon({
          tabId: sender.tab!.id, path: {
            16: icon16,
            32: icon32
          }
        })
        sendResponse({ response: "Background received content-ready message from content" })
        break

      case 'open-option-page':
        chrome.runtime.openOptionsPage()
        break

      default:
        break;
    }

    return true
  }

  chrome.runtime.onMessage.addListener(handleMessage)
})()
