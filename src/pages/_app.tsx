import { AppProps } from "next/app";
import '@/common/global.css'
import { Layout } from "antd";
import LayoutHeader from "@/Components/LayoutHeader";
import LayoutFooter from "@/Components/LayoutFooter";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor,store } from '../redux/store';
import { GoogleOAuthProvider } from '@react-oauth/google';
function MyApp ({Component, pageProps}: AppProps): JSX.Element{
    return (
        <GoogleOAuthProvider clientId="652507312207-76ufv15phi7qbk4ks6bjd77gmrkij83r.apps.googleusercontent.com">
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <Layout className="layout">
                        <LayoutHeader/>
                        <Component {...pageProps} />
                        <LayoutFooter/>
                    </Layout>
                </PersistGate>
            </Provider>
        </GoogleOAuthProvider>
    )
}

export default MyApp