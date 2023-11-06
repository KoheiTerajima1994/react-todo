import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        }
        catch(error) {
            alert('メールアドレスまたはパスワードが間違っています。');
        }
    }

    const [user, setUser] = useState("");
    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    });

    // 登録がまだの場合、signupページへ飛ばすボタン
    const navigate = useNavigate();
    const handleSignupClick = () => {
        navigate('/signup/');
    }
    
    return (
        <>
        {user ? (
        <>
            <Navigate to={'/'} />
        </>
        ) : (
        <div className="login-wrapper">
            <h1>ログインする</h1>
            <form onSubmit={handleSubmit}>
                <div className="mail-address-input">
                    <label htmlFor="mail">メールアドレス</label>
                    <input
                    type="mail"
                    id="mail"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="メールアドレスを入力してください"
                    />
                </div>
                <div className="password-input">
                    <label htmlFor="password">パスワード</label>
                    <input
                    type="text"
                    id="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="パスワードを入力してください"
                    />
                </div>
                <button>ログインする</button>
            </form>
            <button onClick={handleSignupClick}>登録がまだの方</button>
        </div>
        )}
        </>
    )
}
export default Login;