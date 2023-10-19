import { AppProps } from "next/app";
import '@/common/global.css'
import { Layout } from "antd";
import LayoutHeader from "@/Components/LayoutHeader";
import LayoutFooter from "@/Components/LayoutFooter";
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { persistor,store } from '../redux/store';
function MyApp ({Component, pageProps}: AppProps): JSX.Element{
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <Layout className="layout">
                    <LayoutHeader/>
                    <Component {...pageProps} />
                    <LayoutFooter/>
                </Layout>
            </PersistGate>
        </Provider>
    )
}

export default MyApp