import{r as p,h as f,i as j,u as b,j as t,y as B,l as E,aj as C,B as o,D as N}from"./index-erQsObJq.js";import{c as y,V as O}from"./formSchemas-CD-5kOut.js";const v="_otpForm_ggi0n_11",F="_logo_ggi0n_27",S="_inputContainer_ggi0n_48",w="_fieldContainer_ggi0n_55",A="_label_ggi0n_62",I="_input_ggi0n_48",L="_otpButtons_ggi0n_77",P="_submitBtn_ggi0n_84",V="_cancelBtn_ggi0n_84",D="_fieldError_ggi0n_111",e={otpForm:v,logo:F,inputContainer:S,fieldContainer:w,label:A,input:I,otpButtons:L,submitBtn:P,cancelBtn:V,fieldError:D},T=({setOtpRequired:a,username:u,loadingBarRef:g})=>{const[r,m]=p.useState(""),{setIsLoggedIn:_}=f(),[i,l]=p.useState(""),d=j(),{t:h}=b(),x=async s=>{var c;s.preventDefault();try{await y(h).validate({otp:r})}catch(n){n instanceof O?l(n.message):l("Error otp, try again!");return}try{const n=await E.post(C,{otp:r,username:u});o.success(n.data.message),a(!1),_(!0),d("/")}catch(n){N.isAxiosError(n)?o.error((c=n==null?void 0:n.response)==null?void 0:c.data.error):o.error("Something went wrong!")}};return t.jsxs("form",{action:"",className:e.otpForm,onSubmit:x,children:[t.jsx("img",{src:B,alt:"",className:e.logo}),t.jsx("h1",{children:"2FA Required"}),t.jsx("p",{children:"Please enter the one-time-password in your application google authenticator, to login"}),t.jsxs("div",{className:e.inputContainer,children:[t.jsxs("div",{className:e.fieldContainer,children:[t.jsx("label",{htmlFor:"",className:e.label,children:"Enter the Otp"}),t.jsx("input",{type:"text",className:e.input,placeholder:"Enter otp",onChange:s=>m(s.target.value)}),i&&t.jsx("span",{className:e.fieldError,children:i})]}),t.jsxs("div",{className:e.otpButtons,children:[t.jsx("button",{type:"submit",className:e.submitBtn,children:"Submit"}),t.jsx("button",{type:"reset",className:e.cancelBtn,onClick:()=>{var s;(s=g.current)==null||s.complete(),a(!1)},children:"Cancel"})]})]})]})};export{T as O};
