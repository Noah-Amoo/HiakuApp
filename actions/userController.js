"use server"

export const register = async function() {
    console.log('Registering user on the server')
    return {
        skyColor: 'blue',
        grassColor: 'green',
    }
}