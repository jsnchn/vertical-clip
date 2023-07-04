import { NextPage } from 'next'
import MainLayout from '../layouts/main'

type PageWithMainLayoutType = NextPage & { layout: typeof MainLayout }

type PageWithPostLayoutType = NextPage & { layout: typeof MainLayout }

type PageWithError = { ({ statusCode }: any): JSX.Element; getInitialProps({ res, err }: { res: any; err: any; }): { statusCode: any; }; } & { layout: typeof MainLayout }

type PageWithLayoutType = (PageWithMainLayoutType | PageWithPostLayoutType | PageWithError) & {theme: string}

export default PageWithLayoutType