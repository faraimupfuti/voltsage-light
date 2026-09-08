import './globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'VoltSage — Don’t buy solar blind. Size it first.',description:'Free solar sizing tools for homes, businesses and farms across Zimbabwe and Southern Africa.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
