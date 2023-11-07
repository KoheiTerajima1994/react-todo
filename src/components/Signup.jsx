import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../Firebase';
import { Navigate, useNavigate } from 'react-router-dom';

const Signup = () => {

    // useStateを用い、メールアドレスとパスワードの状態管理
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            console.log('ユーザー情報が適切に作成されました。');
        }
        catch(error) {
            alert('ユーザー情報が作成されませんでした');
        }
    }

    // ログインしているかどうかの判定
    const [user, setUser] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    // すでに登録済みの場合には、loginページに飛ばすボタン
    const navigate = useNavigate();
    const handleLoginClick = () => {
        navigate('/login');
    }

    return (
        <>
        {/* ログインしていれば、マイページを表示 */}
        {user ? (
            <Navigate to={`/`} />
        ) : (
        <div className="signup-wrapper">
            <h1>ユーザー登録</h1>
            <form onSubmit={handleSubmit}>
                <div className="mail-address-input">
                    <label htmlFor="mail">メールアドレス</label>
                    <input
                    type="mail"
                    id="mail"
                    placeholder="メールアドレスを入力してください"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="password-input">
                    <label htmlFor="password">パスワード</label>
                    <input
                    type="text"
                    id="password"
                    placeholder="パスワードを入力してください"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button>ユーザー登録</button>
            </form>

            <button onClick={handleLoginClick}>既に登録済みの方はログインページへ</button>
        </div>
        )}
        </>
    )
};

export default Signup;