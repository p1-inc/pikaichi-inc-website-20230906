import { Html, Head, Main, NextScript } from "next/document";
import { gtmId } from "../util/gtm";
export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />

                <link rel="stylesheet" href="" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                {/* <link href="https://fonts.googleapis.com/css2?family=Kiwi+Maru&family=Noto+Sans+JP&display=swap" rel="stylesheet" /> */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Kiwi+Maru&family=Noto+Sans+JP:wght@100;300;400&family=Roboto&family=Ubuntu&display=swap"
                    rel="stylesheet"
                />

                <script
                    // rome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                    dangerouslySetInnerHTML={{
                        __html: `
    (function(d) {
      var config = {
        kitId: 'oju3vtz',
        scriptTimeout: 3000,
        async: true
      },
      h=d.documentElement,t=setTimeout(function(){h.className=h.className.replace(/\bwf-loading\b/g,"")+" wf-inactive";},config.scriptTimeout),tk=d.createElement("script"),f=false,s=d.getElementsByTagName("script")[0],a;h.className+=" wf-loading";tk.src='https://use.typekit.net/'+config.kitId+'.js';tk.async=true;tk.onload=tk.onreadystatechange=function(){a=this.readyState;if(f||a&&a!="complete"&&a!="loaded")return;f=true;clearTimeout(t);try{Typekit.load(config)}catch(e){}};s.parentNode.insertBefore(tk,s)
    })(document);
  `,
                    }}
                />
            </Head>
            <body>
                <noscript
                    dangerouslySetInnerHTML={{
                        __html: `
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
                height="0"
                width="0"
                style="display:none;visibility:hidden"
              />`,
                    }}
                />

                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
