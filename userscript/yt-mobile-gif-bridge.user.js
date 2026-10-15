
 // ==UserScript==
 // @name         YT Mobile GIF Bridge
 // @namespace    https://github.com/yourname/YT-Mobile-GIF-Bridge
 // @version      0.1.0
 // @description  Mobile helper for detecting YouTube's official GIF picker
 // @match        https://m.youtube.com/*
 // @match        https://www.youtube.com/*
 // @run-at       document-idle
 // @grant        none
 // ==/UserScript==

 (() => {
   "use strict";

   const ID = "ytmgb-widget";
   const LABEL = /\bgif\b|insert gif|add gif|gif picker/i;

   function visible(el) {
     if (!el || !el.isConnected) return false;
     const s = getComputedStyle(el);
     const r = el.getBoundingClientRect();
     return s.display !== "none" &&
       s.visibility !== "hidden" &&
       r.width > 0 && r.height > 0;
   }

   function findGifButton() {
     const elements = document.querySelectorAll(
       "button,[role='button']"
     );

     for (const el of elements) {
       if (el.closest("#" + ID) || !visible(el)) continue;

       const text = [
         el.getAttribute("aria-label"),
         el.getAttribute("title"),
         el.getAttribute("data-tooltip-text"),
         el.innerText,
         el.textContent
       ].filter(Boolean).join(" ");

       if (LABEL.test(text)) return el;
     }

     return null;
   }

   function setStatus(text, kind = "warn") {
     const status = document.querySelector("#" + ID + " .status");
     if (!status) return;

     status.textContent = text;
     status.dataset.kind = kind;
   }

   function check() {
     const button = findGifButton();

     if (button) {
       setStatus(
         "Đã tìm thấy nút có vẻ là GIF của YouTube. Hãy thử mở và kiểm tra bộ chọn chính thức.",
         "ok"
       );
     } else {
       setStatus(
         "Chưa tìm thấy nút GIF đang hiển thị. Mở phần bình luận, mở ô nhập bình luận rồi kiểm tra lại. Tính năng có thể chưa được bật cho tài khoản hoặc giao diện này.",
         "warn"
       );
     }
   }

   function createUI() {
     if (!document.body || document.getElementById(ID)) return;

     const root = document.createElement("div");
     root.id = ID;

     root.innerHTML = `
       <section class="panel" hidden>
         <strong>YT Mobile GIF Bridge</strong>
         <p class="description">
           Công cụ kiểm tra GIF. Không thể tự cấp quyền GIF
           nếu YouTube chưa hỗ trợ tài khoản hoặc giao diện này.
         </p>
         <p class="status" role="status" aria-live="polite">
           Đang kiểm tra...
         </p>
         <div class="actions">
           <button class="check" type="button">Kiểm tra lại</button>
           <button class="open" type="button">Thử mở GIF</button>
         </div>
       </section>
       <button class="toggle" type="button" aria-expanded="false">
         GIF Bridge
       </button>
     `;

     const style = document.createElement("style");
     style.textContent = `
       #${ID}{
         position:fixed;
         right:12px;
         bottom:calc(18px + env(safe-area-inset-bottom));
         z-index:2147483646;
         font-family:system-ui,sans-serif;
         color:#fff
       }
       #${ID} .toggle{
         min-height:48px;
         padding:12px 17px;
         border:0;
         border-radius:999px;
         background:#1769ff;
         color:#fff;
         font-size:15px;
         font-weight:700;
         box-shadow:0 4px 18px #0006
       }
       #${ID} .panel{
         width:min(300px,calc(100vw - 24px));
         margin-bottom:8px;
         padding:14px;
         border-radius:16px;
         background:#202124;
         border:1px solid #555;
         box-shadow:0 6px 26px #0008
       }
       #${ID} .panel[hidden]{display:none}
       #${ID} .description,#${ID} .status{
         font-size:13px;
         line-height:1.5;
         overflow-wrap:anywhere
       }
       #${ID} .status{
         padding:10px;
         background:#303134;
         border-radius:10px
       }
       #${ID} .status[data-kind="ok"]{
         border-left:3px solid #34a853
       }
       #${ID} .status[data-kind="warn"]{
         border-left:3px solid #fbbc04
       }
       #${ID} .actions{display:flex;gap:8px}
       #${ID} .actions button{
         flex:1;
         min-height:44px;
         padding:8px;
         border:1px solid #777;
         border-radius:10px;
         background:#303134;
         color:#fff
       }
     `;

     document.documentElement.appendChild(style);
     document.body.appendChild(root);

     const panel = root.querySelector(".panel");
     const toggle = root.querySelector(".toggle");

     toggle.addEventListener("click", () => {
       panel.hidden = !panel.hidden;
       toggle.setAttribute("aria-expanded", String(!panel.hidden));
       if (!panel.hidden) check();
     });

     root.querySelector(".check").addEventListener("click", check);

     root.querySelector(".open").addEventListener("click", () => {
       const button = findGifButton();

       if (!button) {
         setStatus(
           "Không có nút GIF chính thức đang hiển thị. Công cụ không thể tạo quyền gửi GIF thay cho YouTube.",
           "warn"
         );
         return;
       }

       button.click();
       setStatus(
         "Đã thử nhấn nút GIF tìm thấy. Hãy xác nhận bộ chọn chính thức có mở hay không.",
         "ok"
       );
     });

     check();
   }

   function start() {
     if (!document.body) {
       setTimeout(start, 300);
       return;
     }
     createUI();
   }

   start();

   // YouTube thay đổi giao diện động; kiểm tra lại nếu điều hướng SPA.
   let lastUrl = location.href;

   new MutationObserver(() => {
     if (location.href !== lastUrl) {
       lastUrl = location.href;
       setTimeout(createUI, 500);
     }
   }).observe(document.documentElement, {
     childList: true,
     subtree: true
   });
 })();
