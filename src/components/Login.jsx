const Login = () => {
    return (
        <div className="login-wrapper">
            <h1>会員登録する</h1>
            <form>
                <div className="mail-address-input">
                    <label htmlFor="mail">メールアドレス</label>
                    <input
                    type="mail"
                    id="mail"
                    placeholder="メールアドレスを入力してください"
                    />
                </div>
                <div className="password-input">
                    <label htmlFor="password">パスワード</label>
                    <input
                    type="text"
                    id="password"
                    placeholder="パスワードを入力してください"
                    />
                </div>
                <button>登録する</button>
            </form>
        </div>
    )
}
export default Login;