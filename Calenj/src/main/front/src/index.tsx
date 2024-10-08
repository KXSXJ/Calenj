import ReactDOM from 'react-dom/client';
import {App} from './app';
import reportWebVitals from './reportWebVitals';
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {Provider} from "react-redux";
import store from './app/hoc/store'
import {GlobalStyle} from './shared/ui/SharedStyled'


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: undefined, //만료시간 설정 : 1시간
            //retry: 1, //query 동작 실패 시, 자동으로 몇 번만큼 retry를 시도할 지 결정하는 옵션
            refetchIntervalInBackground: false, //백그라운드에서는 refetch를 막음
            retry: 3,
        },
        mutations: {
            //retry: 1,
        },
    },
});

declare global {
    interface Window {
        naver: any;
    }
}
const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <GlobalStyle/>
            <App/>
        </QueryClientProvider>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
