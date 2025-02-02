import { useFrappeAuth, useSWRConfig } from 'frappe-react-sdk'
import { FC, PropsWithChildren } from 'react'
import { createContext } from 'react'

interface UserContextProps {
    isLoading: boolean,
    isLoggedIn: boolean,
    currentUser: string,
    login: (username: string, password: string) => Promise<void>,
    logout: () => Promise<void>,
    updateCurrentUser: VoidFunction,
}

export const UserContext = createContext<UserContextProps>({
    currentUser: '',
    isLoading: false,
    isLoggedIn: false,
    login: () => Promise.resolve(),
    logout: () => Promise.resolve(),
    updateCurrentUser: () => { },
})

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {

    const { mutate } = useSWRConfig()
    const { login, logout, currentUser, error, updateCurrentUser, isLoading } = useFrappeAuth()

    const isLoggedIn = currentUser !== undefined && currentUser !== null && currentUser !== "Guest"
    const handleLogout = async () => {
        return logout()
            .then(() => {
                //Clear cache on logout
                return mutate(() => true, undefined, false)
            })
            .then(() => {
                //Reload the page so that the boot info is fetched again
                const URL = import.meta.env.VITE_BASE_NAME ? `${import.meta.env.VITE_BASE_NAME}` : ``
                window.location.replace(`/login?redirect-to=${URL}/channel`)
                // window.location.reload()
            })
    }

    const handleLogin = async (username: string, password: string) => {
        return login(username, password)
            .then(() => {
                //Reload the page so that the boot info is fetched again
                window.location.reload()
            })
    }
    return (
        <UserContext.Provider value={{ isLoading, isLoggedIn, updateCurrentUser, login: handleLogin, logout, currentUser: currentUser ?? "" }}>
            {children}
        </UserContext.Provider>
    )
}