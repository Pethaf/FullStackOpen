
const Login= ({
        username, 
        password, 
        updatePassword, 
        updateUsername, 
        handleLogin}) => {
    return (
<form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
<label>Username
        <input type="text" 
               autoComplete="username"
               required
               value={username} 
               onChange={(e) => updateUsername(e.target.value)}>
            </input>
        </label>
        <label>Password
            <input type="password" 
                   autoComplete="password"
                   required
                   value={password} 
                   onChange={(e) => updatePassword(e.target.value)}>
            </input>
        </label>
        <button type="submit" disabled={!username || !password}>login</button>
    </form>        
    )
}


export default Login