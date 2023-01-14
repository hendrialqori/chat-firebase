/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
import {
  createContext,
  useContext,
  useReducer
} from 'react'

enum ActionType {
  TOGGLEMODAL = 'toggleModal',
  CHOOSEUSER = 'chooseUser',
  TOGGLESETTING = 'toggleSetting',
  CLEARCHOOSEUSER = 'clearChooseUser'
}

type ActionTypes =
    { type: typeof ActionType.TOGGLEMODAL | typeof ActionType.TOGGLESETTING | typeof ActionType.CLEARCHOOSEUSER } |
    { type: typeof ActionType.CHOOSEUSER, payload: currentFriendTypes }

interface currentFriendTypes {
  chatId: string
  userFriend: {
    uid: string
    username: string
    image: string
  }
}

interface initialTypes {
  toggleModal: boolean
  currentFriend: currentFriendTypes
  toggleSetting: boolean
}

interface UserContextTypes {
  state: initialTypes
  dispatch: React.Dispatch<ActionTypes>
}

const initialValue = {
  toggleModal: false,
  currentFriend: {},
  toggleSetting: false
} as initialTypes

const UserContext = createContext({} as UserContextTypes)

const reducer: React.Reducer<initialTypes, ActionTypes> = (state, action) => {
  switch (action.type) {
    case ActionType.TOGGLEMODAL:
      return {
        ...state,
        toggleModal: !state.toggleModal
      }
    case ActionType.CHOOSEUSER:
      return {
        ...state,
        currentFriend: {
          chatId: action.payload.chatId,
          userFriend: action.payload.userFriend
        }
      }
    case ActionType.TOGGLESETTING:
      return {
        ...state,
        toggleSetting: !state.toggleSetting
      }
    case ActionType.CLEARCHOOSEUSER:
      return {
        ...state,
        currentFriend: {} as currentFriendTypes
      }
    default:
      return state
  }
}

const UserContextProvider =
     ({ children }: { children: React.ReactNode }): JSX.Element => {
       const [state, dispatch] = useReducer(reducer, initialValue)
       return (
            <UserContext.Provider value={{ state, dispatch }}>
                {children}
            </UserContext.Provider>
       )
     }

const useStoreUser = (): UserContextTypes => useContext(UserContext)

export { UserContextProvider, useStoreUser, ActionType }
