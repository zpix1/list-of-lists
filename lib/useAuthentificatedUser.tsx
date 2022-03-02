import useUser from './useUser'

export default function useAuthentificatedUser() {
    return useUser({
        redirectTo: '/login',
        redirectIfFound: true
    })
}