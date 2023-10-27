import { useState } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../Firebase';

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
            console.error('ユーザー情報が作成されませんでした', error);
        }  
    }

    return (
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
                <div class="password-input">
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
        </div>
    )
};

export default Signup;