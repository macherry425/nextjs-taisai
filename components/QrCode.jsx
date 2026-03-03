import QRCode from "react-qr-code";
import ring from '@/public/images/ring.png';

const value = 'https://nextjs-daisai.vercel.app';
const QrCode = () => {
    return (

        <div className="login">
            <div className="login__panel qr-panel">
                <div className='login__panel__top'>
                    <img src={ring.src} alt="" className="login__logo" />
                    <div className="login__title">
                      Taisai
                    </div>
                </div>
                <div className="qr-code">
                    <QRCode
                        size={150}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        value={value}
                        viewBox={`0 0 256 256`}
                    />
                </div>
            </div>
        </div>

    )
}

export default QrCode;