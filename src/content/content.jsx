import { createRoot } from "react-dom/client"
import { XMarkIcon } from "@heroicons/react/24/outline"

import { XCircleIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import { useState, useEffect, useRef } from "react"
import { Switch } from "@headlessui/react"
import * as PropTypes from "prop-types"

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const domNode = document.createElement("div")
domNode.setAttribute('id', 'interlink-app')
const root = createRoot(domNode)
root.render(<LinkForm />)
document.body.appendChild(domNode)

function notifyReady() {
  chrome.runtime
    .sendMessage({ type: "content-ready" })
    .then(() => {})
    .catch((err) => {})
}

notifyReady()

function getPageDetails() {
  return {
    title: document.title,
    description: htmlDecode(getDescription(getMetaContent())),
    url: document.URL,
  }
}

// A solution from SO, for unescaping escaped content in meta tag:
// https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
function htmlDecode(input) {
  if (!input) return ""
  var doc = new DOMParser().parseFromString(input, "text/html")
  return doc.documentElement.textContent
}

function getMetaContent() {
  const t = {}
  return (
    document.querySelectorAll("head > meta").forEach((e) => {
      const i = e.getAttribute("property"),
        s = e.getAttribute("content")
      t[i] = s && s.trim()
    }),
    t
  )
}

function getDescription(t) {
  return (
    t["dc:description"] ||
    t["dcterm:description"] ||
    t["og:description"] ||
    t["weibo:article:description"] ||
    t["weibo:webpage:description"] ||
    t.description ||
    t["twitter:description"]
  )
}

function AddLinkForm(props) {
  const tagsRef = useRef()

  useEffect(() => {
    if (tagsRef.current) {
      tagsRef.current.focus()
    }
  }, [])
  return (
    <div className="box-border font-sans rounded-lg bg-white shadow-lg shadow-slate-200 border border-gray-200">
      <h3 className="text-center w-full px-4 mt-2 text-lg font-bold text-gray-900">
        Save to Interlink
      </h3>
      <div className="border-b border-gray-300 w-3/5 mx-auto mt-3 "></div>

      <div className="p-4">
        <div className="mt-4">
          <label htmlFor="url" className="block text-sm text-gray-500">
            URL
          </label>
          <textarea
            type="text"
            name="url"
            id="url"
            className="p-2 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-slate-100 h-16"
            value={props.url}
            onChange={props.onChange}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="title" className="block text-sm text-gray-500">
            Title
          </label>
          <div className="mt-1">
            <textarea
              type="text"
              name="title"
              id="title"
              className="p-2 block w-full rounded-lg border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-slate-100 h-16"
              value={props.title}
              onChange={props.onTitleChanged}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="description" className="block text-sm text-gray-500">
            Description
          </label>
          <div className="mt-1">
            <textarea
              type="text"
              name="description"
              id="description"
              className="p-2 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-slate-100 h-24"
              value={props.description || ""}
              onChange={props.onDescriptionChanged}
            />
          </div>
        </div>
        <div className="mt-4">
          <label htmlFor="tags" className="block text-sm text-gray-500">
            Tags
          </label>
          <input
            type="text"
            name="tags"
            id="tags"
            className="mt-1 p-2 block w-full rounded-md border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900 bg-slate-100 h-10 float-none"
            placeholder="space-separated tags"
            ref={tagsRef}
            onChange={(e) => {
              props.onTagChanged(e)
            }}
          />
        </div>
        <div className="mt-6">
          <Switch.Group as="div" className="flex items-center w-full">
            <Switch
              checked={props.readlaterenabled}
              onChange={props.onReadLaterChanged}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Unread</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md bg-white"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  props.readlaterenabled ? "bg-indigo-600" : "bg-gray-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
              />
              <span
                aria-hidden="true"
                className={classNames(
                  props.readlaterenabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
              />
            </Switch>
            <Switch.Label as="span" className="ml-3">
              <span className="text-sm font-medium text-gray-900">
                Unread
              </span>
            </Switch.Label>
          </Switch.Group>
        </div>
        <div className="mt-6">
          <Switch.Group as="div" className="flex items-center w-full">
            <Switch
              checked={props.starredenabled}
              onChange={props.onStarredChanged}
              className="group relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Starred</span>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute h-full w-full rounded-md bg-white"
              />
              <span
                aria-hidden="true"
                className={classNames(
                  props.starredenabled ? "bg-indigo-600" : "bg-gray-200",
                  "pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out"
                )}
              />
              <span
                aria-hidden="true"
                className={classNames(
                  props.starredenabled ? "translate-x-5" : "translate-x-0",
                  "pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out"
                )}
              />
            </Switch>
            <Switch.Label as="span" className="ml-3">
              <span className="text-sm font-medium text-gray-900">
                Starred
              </span>
            </Switch.Label>
          </Switch.Group>
        </div>
        <button
          type="button"
          className="mt-4 inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-200 disabled:text-gray-500"
          onClick={props.onSaveClicked}
          disabled={props.saving}
        >
          {props.saving && (
            <svg
              aria-hidden="true"
              role="status"
              class="inline w-4 h-4 mr-3 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg>
          )}
          {props.saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  )
}

AddLinkForm.propTypes = {
  url: PropTypes.string,
  onChange: PropTypes.func,
  title: PropTypes.string,
  onTitleChanged: PropTypes.func,
  description: PropTypes.string,
  onDescriptionChanged: PropTypes.func,
  readlaterenabled: PropTypes.bool,
  starredenabled: PropTypes.bool,
  onReadLaterChanged: PropTypes.func,
  onStarredChanged: PropTypes.func,
  onSaveClicked: PropTypes.func,
}

function ErrorAlert(props) {
  useEffect(() => {
    let timer
    if (!props.showOptionButton) {
      timer = setInterval(() => {
        props.onAlertDismissed()
      }, 3000)
    } else {
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [])
  return (
    <div className="rounded-md bg-red-50 p-4 shadow-lg shadow-slate-200 border border-gray-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            {props.errorMessage}
          </h3>

          {props.showOptionButton && (
            <button
              type="button"
              className="mt-2 rounded-md bg-red-100 px-2 -ml-2 py-1.5 text-sm font-bold text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50 "
              onClick={() => {
                chrome.runtime.sendMessage({type: 'open-option-page'})
              }}
            >
              Open Settings
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

ErrorAlert.propTypes = { errorMessage: PropTypes.string }

function SuccessAlert(props) {
  useEffect(() => {
    const timer = setInterval(() => {
      props.onAlertDismissed()
    }, 3000)
    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="rounded-md bg-green-50 p-4 shadow-lg shadow-slate-200 border border-gray-200">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Saved.
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>
              {(props.title || '')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LinkForm() {
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [url, setURL] = useState("")
  const [readLaterEnabled, setReadLaterEnabled] = useState(false)
  const [starredEnabled, setStarredEnabled] = useState(false)
  const tagsRef = useRef()
  const [errorMessage, setErrorMessage] = useState("")
  const [success, setSucess] = useState(true)
  const [showOptionButton, setShowOptionButton] = useState(false)
  const [tags, setTags] = useState('')
  const [isLoading, setLoading] = useState(false)

  const handleActionClicked = async (request) => {
    setShow(true)
    setSucess(false)
    setErrorMessage("")
    const details = getPageDetails()
    const selectedText = document.getSelection().toString()
    setTitle(details.title)
    setDescription(selectedText || details.description || "")
    setURL(details.url)

    return Promise.resolve("OK")
  }

  function handleSaveArticle(e) {
    setLoading(true)
    chrome.runtime
      .sendMessage({
        type: "save_article",
        data: {
          url: url,
          title: title,
          description: description,
          tags: tags,
          readLater: readLaterEnabled ? "yes" : "no",
          starred: starredEnabled ? "yes" : "no"
        },
      })
      .then(
        (response) => {
          const { error, data } = response

          if (error) {
            // let message
            switch (error) {
              case "OTHER":
                setErrorMessage("Failed to save the link.")
                setShowOptionButton(false)
                break

              case "API_KEY_NOT_FOUND":
                setErrorMessage(
                  "Missing API key, please go to the extension setting to set it."
                )
                setShowOptionButton(true)
                break

              case "API_KEY_IS_INCORRECT":
                setErrorMessage(
                  "API key appears to be incorrect, please go to the extension setting to set it. Make sure you have an active subscription to Interlink for the API key to work."
                )
                setShowOptionButton(true)
                break

              default:
                setErrorMessage("Unknown error. Please reach out to hello@interlinkhq.com for support.")
                setShowOptionButton(false)
            }

            setSucess(false)
            setShow(true)
          } else {
            setErrorMessage("")
            setSucess(true)
            setShow(true)
          }
        },
        (reason) => {}
      )
      .finally(() => {
        setLoading(false)
      })
  }

  function handleEscapeKey(e) {
    if (e.code === "Escape") {
      setShow(false)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleEscapeKey)

    chrome.runtime.onMessage.addListener(handleActionClicked)

    return () => {
      chrome.runtime.onMessage.removeListener(handleActionClicked)
      window.removeEventListener("keydown", handleEscapeKey)
    }
  }, [])

  useEffect(() => {
    if (show) {
      if (tagsRef.current) {
        tagsRef.current.focus()
      }
    }
  }, [show])

  if (!show) return null

  return (
    <>
      <div className="fixed top-4 right-4 z-[2147483646] w-96 ">
        <button
          className="w-6 h-6 absolute -left-2 -top-2 bg-slate-200 rounded-full"
          onClick={() => {
            setShow(false)
          }}
        >
          <XMarkIcon className="p-1 text-gray-900" />
        </button>
        {success && <SuccessAlert title={title} onAlertDismissed={() => setShow(false)} />}
        {errorMessage && (
          <ErrorAlert
            errorMessage={errorMessage}
            showOptionButton = {showOptionButton}
            onAlertDismissed={() => setShow(false)}
          />
        )}
        {!success && !errorMessage && (
          <AddLinkForm
            url={url}
            onChange={(e) => setURL(e.target.value)}
            title={title}
            onTitleChanged={(e) => setTitle(e.target.value)}
            description={description}
            onDescriptionChanged={(e) => setDescription(e.target.value)}
            onTagChanged={(e) => setTags(e.target.value) }
            readlaterenabled={readLaterEnabled}
            starredenabled={starredEnabled}
            onReadLaterChanged={setReadLaterEnabled}
            onStarredChanged={setStarredEnabled}
            onSaveClicked={handleSaveArticle}
            saving={isLoading}
          />
        )}
      </div>
    </>
  )
}
