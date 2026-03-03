import ring from '@/public/images/ring.png';

const Preview = () => {
    return (
        <div className="login">
            <div className="login__panel qr-panel">
                <div className='login__panel__top'>
                    <img src={ring.src} alt="" className="login__logo" />
                    <div className="login__title">
                        準備中
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Preview;