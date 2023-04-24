import { ReactComponent as Star } from './assets/star.svg';
import './App.css';
// import { useRef } from 'react';
import { createContext } from 'react';
import { useContext } from 'react';
import { useState } from 'react';
import { useReducer } from 'react';




const initialState = {
  mails: [
    {
      "msg": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
      "id": "200c593c-b928-4d03-a4c2-c33a4cf65d65"
    },
    {
      "msg": "ut labore et dolore magna aliqua. Gravida rutrum quisque non tellus orci ac auctor augue. aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "id": "badc0ef0-6015-4df1-b7fb-fb39355e0040"
    },
    {
      "msg": "A pellentesque sit amet porttitor eget. Sit amet nisl suscipit adipiscing bibendum est ult",
      "id": "c75ab8bf-9fd2-47a5-8cab-931603e887ff"
    },
    {
      "msg": "ricies integer. Sit amet dictum sit amet justo donec. Arcu felis bibendum ut tristique et ",
      "id": "00c36f9d-af2c-46c4-8430-195cd556abd4"
    },
    {
      "msg": "egestas quis ipsum suspendisse. Eu lobortis elementum nibh tellus molestie nunc non blandi",
      "id": "82b801f5-1c5a-4bb8-bbab-4e2598de6448"
    },
    {
      "msg": "t. Sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Dictum at t",
      "id": "8dcf33e1-0bc3-470b-bead-c42b096e90e5"
    },
    {
      "msg": "empor commodo ullamcorper a lacus vestibulum sed arcu. Tortor pretium viverra suspendisse ",
      "id": "3c167de8-22c8-40ee-a92d-9f0a46a83b58"
    },
    {
      "msg": "potenti nullam ac tortor vitae. Velit scelerisque in dictum non consectetur. Consequat ac ",
      "id": "521904b4-c66e-427e-97de-ec883be90e2f"
    },
    {
      "msg": "felis donec et. Cras ornare arcu dui vivamus arcu felis bibendum ut.",
      "id": "a29792e6-8fb1-4adf-bccd-7f788f164b60"
    }],
  drafts: [
    {
      "id": "25a131d1-a356-4d0f-bbd8-6f2ee9b24225",
      "msg": "monka slash banana",
      "active": true
    }],
  searchQuery: "",
  leftBarExpand: true
}




function App() {
  return (
    <ContextProvider>
      <TopBar />
      <div className="not-top-bar">
        <LeftBar />
        <Hero />
      </div>
      <MailEditorBar />
    </ContextProvider>
  );
}

export default App;




const stateCtx = createContext(null)
const dispatchCtx = createContext(null)

function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <stateCtx.Provider value={state}>
      <dispatchCtx.Provider value={dispatch}>
        {children}
      </dispatchCtx.Provider>
    </stateCtx.Provider>
  )
}

function reducer(state, action) {
  switch (action.type) {
    case 'left bar size toggle': {
      return {
        ...state,
        leftBarExpand: !state.leftBarExpand
      }
    }
    case 'search query set': {
      return {
        ...state,
        searchQuery: action.searchQuery,
      }
    }
    case 'message favorite set': {
      console.log(action)
      return {
        ...state,
        mails: state.mails.map(m => {
          if (m.id !== action.id) {
            return m
          }
          return {
            ...m,
            favorite: action.favorite
          }
        })
      }
    }
    case 'mail editor create': {
      return {
        ...state,
        drafts: [
          action.draft,
          ...state.drafts,
        ]
      }
    }
    case 'mail editor close': {
      return {
        ...state,
        drafts: state.drafts.filter(draft => draft.id !== action.id)
      }
    }
    case 'mail editor expand': {
      return {
        ...state,
        drafts: state.drafts.map(draft => {
          if (draft.id === action.id) {
            return {
              ...draft,
              active: (draft.active !== undefined ? !draft.active : true)
            }
          }
          return draft
        })
      }
    }
    default: {
      console.log(`invalid action type: ${action.type}`)
      return state
    }
  }
}




function TopBar() {
  const dispatch = useContext(dispatchCtx)

  return (
    <div className='top-bar'>
      <div className='top-bar-left'>
        <button className='left-bar-button' onClick={() => dispatch({
          type: 'left bar size toggle'
        })}>
          X
        </button>
      </div>
      <div className='top-bar-main'>
        <SearchBar />
      </div>
    </div>
  )
}

function SearchBar() {
  const dispatch = useContext(dispatchCtx)
  const [input, setInput] = useState('')

  function onClick(e) {
    // console.log(e)
    e.preventDefault()
    dispatch({
      type: 'search query set',
      searchQuery: input
    })
    setInput('')
  }

  return (
    <form>
      <input value={input} onChange={e => setInput(e.target.value)}></input>
      <input type="submit" onClick={onClick}></input>
    </form>
  )
}




function LeftBar() {
  const [hover, setHover] = useState(false)
  const dispatch = useContext(dispatchCtx)
  let isExpanded = useContext(stateCtx).leftBarExpand
  const className = (isExpanded ? 'left-bar' : 'left-bar left-bar-shrunked')
  isExpanded = isExpanded || hover

  const newMailClick = () => dispatch({
    type: 'mail editor create',
    draft: {
      id: crypto.randomUUID(),
      active: true
    }
  })
  const newMailButton = <NavItem
    icon={'Y'}
    title={'New mail'}
    className={'new-mail-button'}
    isExpanded={isExpanded}
    onClick={newMailClick}
  />

  const linksLables = ['Incoming', 'Outgoing', 'Drafts', 'Starred']
  const links = linksLables.map((v, idx) => {
    return (
      <NavItem
        icon={idx}
        title={v}
        className={'nav-link'}
        isExpanded={isExpanded}
        onClick={() => {}}
        key={idx}
      />
    )
  })

  // const ref = useRef(null)
  // delay = ref.current.get
  const delay = 200; // hardcoded, expected to be equal --transition-duration;

  return (
    <div
      className={className}
      onMouseEnter={() => { setTimeout(() => setHover(true), 1.5*delay) }}
      onMouseLeave={() => { setTimeout(() => setHover(false), delay / 2) }}
    >
      <div className='left-bar-positioning'>
        {newMailButton}
        <div className='nav-bar'>
          {links}
        </div>
      </div>
    </div>
  )
}

function NavItem({ icon, title, onClick, className, isExpanded}) {
  return (
    <div 
      className={isExpanded ? className : className + ` ${className}-shrunked`}
      onClick={onClick}
    >
        <div className={`${className}-icon`}>
          {icon}
        </div>
        {isExpanded && (
          <div>
            {title}
          </div>
        )}
    </div>
  )
}



function Hero() {
  return (
    <div className="hero-container">
      <div className="hero">
        <Messages />
      </div>
    </div>
  )
}

function Messages() {
  const { searchQuery, mails } = useContext(stateCtx)
  const filteredMails = mails.filter(m => {
    return m.msg.includes(searchQuery)
  })
  const messages = filteredMails.map(m => {
    // console.log(v)
    return <Message text={m.msg} isFav={m.favorite} key={m.id} id={m.id} />
  })
  return (
    <div className="messages" >
      {messages}
    </div>
  )
}

function Message({ text, isFav, id }) {
  const dispatch = useContext(dispatchCtx)

  return (
    <div className="message">
      <div className="favorite">
        <Star
          onClick={() => dispatch({
            type: 'message favorite set',
            id: id,
            favorite: isFav !== undefined ? !isFav : true
          })}
          className={isFav ? 'fill' : ''}
        />
      </div>
      {text}
    </div>
  )
}




function MailEditorBar() {
  const drafts = useContext(stateCtx).drafts
  const mailEditors = drafts.map(draft => {
    return (
      <MailEditor draft={draft} key={draft.id} />
    )
  })

  return (
    <div className="mail-editor-bar">
      {mailEditors}
    </div>
  )
}

function MailEditor({ draft }) {
  const dispatch = useContext(dispatchCtx)

  return (
    <div className={draft.active ? 'mail-editor mail-editor-active' : 'mail-editor'}>
      <div className='mail-editor-header'>
        {draft.title || 'new message'}
        <button onClick={() => dispatch({
          type: 'mail editor expand',
          id: draft.id,
          active: draft.active
        })}>
          1
        </button>
        <button onClick={() => dispatch({
          type: 'mail editor close',
          id: draft.id
        })}>
          2
        </button>
      </div>
      {draft.active && (
        <form className='mail-editor-body'>
          <label>
            Theme
            <input type='text' />
          </label>
          <br />
          <label>
            Message
            <input type='text' />
          </label>
        </form>
      )}
    </div>
  )
}


// IDEA: unite mails and drafts, use smth like type attribute to distingush
  // THOUT: maybe not, viwer can dynamically form entries, gathering only fields it needs
